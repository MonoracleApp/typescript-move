# move-ts Documentation

Complete guide to move-ts decorators and types.

## Table of Contents

- [Decorators](#decorators)
  - [@Module](#module)
  - [@Has](#has)
  - [@Write](#write)
  - [@Move](#move)
  - [@Assert](#assert)
  - [@Balance](#balance)
  - [@Mint](#mint)
  - [@Transfer](#transfer)
  - [@Vector](#vector)
- [Types](#types)
  - [Primitive Types](#primitive-types)
  - [Helper Types](#helper-types)
- [Assertion Helpers](#assertion-helpers)

---

## Decorators

### @Module

Defines the Move module name.

```typescript
@Module('hello_world')
class MyContract {
    // ...
}
```

**Output:**
```move
module hello_world::mycontract {
    // ...
}
```

---

### @Has

Defines struct abilities. Sui Move structs can have four abilities:
- `key` - Can be stored as a top-level object
- `store` - Can be stored inside other objects
- `drop` - Can be discarded
- `copy` - Can be copied

```typescript
@Has(['key', 'store'])
User = {
    name: sui.string,
    status: sui.bool,
    age: sui.u8
}
```

**Output:**
```move
public struct User has key, store {
    id: UID,
    name: string::String,
    status: bool,
    age: u8
}
```

---

### @Write

Creates a constructor function that creates and shares an object.

```typescript
@Has(['key', 'store'])
User = {
    name: sui.string,
    age: sui.u8
}

@Write('User')
create_user(){}
```

**Output:**
```move
public fun create_user(name: string::String, age: u8, ctx: &mut TxContext) {
    let user = User {id: object::new(ctx), name, age};
    transfer::share_object(user);
}
```

---

### @Move

Creates a function that modifies existing objects. Use `Mut<T>` for mutable references and `Primitive<T>` for Move primitive types.

```typescript
@Move()
changeName(userObj: Mut<'User'>, nameUser: Primitive<'string::String'>){
    exec`
        userObj.name = nameUser;
    `
}
```

**Output:**
```move
public fun changeName(userObj: &mut User, nameUser: string::String, ctx: &mut TxContext) {
    userObj.name = nameUser;
}
```

**Multiple object mutation:**

```typescript
@Move()
incrementCounter(counterItem: Mut<'Counter'>, otherCounterItem: Mut<'Counter'>){
    exec`
        counterItem.value = counterItem.value + 1;
        otherCounterItem.value = otherCounterItem.value + 1;
    `
}
```

---

### @Assert

Adds validation rules to functions. Assertions are checked before the function body executes.

**Basic assertion:**

```typescript
@Write('User')
@Assert([{must: 'age > 10', code: Assertion.ERR_UNDERAGE}])
create_user(){}
```

**Output:**
```move
public fun create_user(name: string::String, age: u8, ctx: &mut TxContext) {
    assert!(age > 10, ERR_UNDERAGE);
    let user = User {id: object::new(ctx), name, age};
    transfer::share_object(user);
}
```

**Multiple assertions:**

```typescript
const MY_ADDRESS = '0xbed1a0d1bb2b8e281d81b838f6c35d7864936f0de3233eb161181ab765e0ea40'

@Move()
@Assert([
    {must: Assertion.min('message', 10), code: Assertion.ERR_MESSAGE_TOO_SHORT},
    {must: Assertion.onlyFor(MY_ADDRESS), code: Assertion.ERR_ONLY_OWNER},
])
changeName(annObj: Mut<'Announcement'>, message: Primitive<'string::String'>){
    exec`
        annObj.message = message;
    `
}
```

---

### @Balance

Creates a SUI balance management system with deposit, withdraw, and query functions.

```typescript
@Balance()
Funding: BalanceFor = ['deposit', 'withdraw', 'get_balance']
```

**Output:**
```move
public struct FundingBalance has key, store {
    id: object::UID,
    total: balance::Balance<SUI>,
    owner: address,
}

public fun init_FundingBalance(ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    let obj = FundingBalance {
        id: object::new(ctx),
        total: balance::zero<SUI>(),
        owner: sender,
    };
    transfer::public_share_object(obj);
}

public fun deposit_FundingBalance(balance_obj: &mut FundingBalance, coins: Coin<SUI>) {
    let incoming = coin::into_balance(coins);
    balance::join(&mut balance_obj.total, incoming);
}

public fun get_balance(balance_obj: &FundingBalance): u64 {
    balance::value(&balance_obj.total)
}

public fun withdraw_FundingBalance(balance_obj: &mut FundingBalance, amount: u64, ctx: &mut TxContext): Coin<SUI> {
    let sender = tx_context::sender(ctx);
    assert!(sender == balance_obj.owner, 0);
    let split = balance::split(&mut balance_obj.total, amount);
    let coin_out = coin::from_balance(split, ctx);
    coin_out
}
```

**With assertions:**

```typescript
@Balance()
@Assert([
    {must: Assertion.minDeposit(5), code: Assertion.ERR_MIN_AMOUNT},
    {must: Assertion.maxDeposit(20), code: Assertion.ERR_MAX_AMOUNT_REACHED},
    {must: Assertion.maxWithdraw(2), code: Assertion.ERR_MAX_AMOUNT_REACHED}
])
Budget: BalanceFor = ['deposit', 'withdraw', 'get_balance']
```

Values are automatically converted from SUI to MIST (1 SUI = 1,000,000,000 MIST).

---

### @Mint

Creates an NFT minting function.

```typescript
@Has(['key', 'store'])
Hero = {
    name: sui.string,
    description: sui.string,
    image_url: sui.string
}

@Mint('Hero', {display: false})
@Transfer(['me', 'receiver'])
mint_hero(){}
```

**Options:**
- `display: true` - Generates Display metadata for the NFT (shows in wallets/explorers)
- `display: false` - No Display metadata

---

### @Transfer

Specifies transfer targets for minted objects.

```typescript
@Transfer(['me', 'receiver'])
mint_hero(){}
```

**Options:**
- `'me'` - Transfer to the transaction sender
- `'receiver'` - Transfer to a specified receiver address (adds `receiver: address` parameter)

---

### @Vector

Creates a vector (list) container for storing multiple objects.

```typescript
@Vector('User')
PersonList: SuiVector = {
    maxLength: 100
}
```

---

## Types

### Primitive Types

| TypeScript | Move |
|------------|------|
| `sui.string` | `string::String` |
| `sui.bool` | `bool` |
| `sui.u8` | `u8` |
| `sui.u32` | `u32` |
| `sui.u64` | `u64` |

### Helper Types

| Type | Description | Example |
|------|-------------|---------|
| `Mut<T>` | Mutable reference to object | `userObj: Mut<'User'>` |
| `Primitive<T>` | Move primitive type | `name: Primitive<'string::String'>` |
| `BalanceFor` | Balance operation tuple | `['deposit', 'withdraw', 'get_balance']` |

---

## Assertion Helpers

| Helper | Description | Example |
|--------|-------------|---------|
| `Assertion.min(field, n)` | String length >= n | `Assertion.min('name', 3)` |
| `Assertion.max(field, n)` | String length <= n | `Assertion.max('name', 100)` |
| `Assertion.onlyFor(addr)` | Restrict to address | `Assertion.onlyFor(MY_ADDRESS)` |
| `Assertion.minDeposit(sui)` | Minimum deposit in SUI | `Assertion.minDeposit(5)` |
| `Assertion.maxDeposit(sui)` | Maximum deposit in SUI | `Assertion.maxDeposit(20)` |
| `Assertion.maxWithdraw(sui)` | Maximum withdraw in SUI | `Assertion.maxWithdraw(2)` |

### Error Codes

| Code | Description |
|------|-------------|
| `Assertion.ERR_UNDERAGE` | Age validation failed |
| `Assertion.ERR_MESSAGE_TOO_SHORT` | String too short |
| `Assertion.ERR_NAME_TOO_SHORT` | Name too short |
| `Assertion.ERR_ONLY_OWNER` | Not the owner |
| `Assertion.ERR_MIN_AMOUNT` | Below minimum amount |
| `Assertion.ERR_MAX_AMOUNT_REACHED` | Above maximum amount |

---

## Complete Examples

### Simple Object Creation

```typescript
import { Has, Module, Write } from "move-ts/decorators";
import { sui } from "move-ts/types";

@Module('hello_world')
class Writing {
    @Has(['key', 'store'])
    User = {
        name: sui.string,
        status: sui.bool,
        age: sui.u8
    }

    @Write('User')
    create_user(){}
}

export default Writing
```

### Balance Management with Assertions

```typescript
import { Assert, Balance, Module } from "move-ts/decorators";
import { Assertion } from "move-ts/lib/assertion";
import { BalanceFor } from "move-ts/types";

@Module('hello_world')
class Balancing {
    @Balance()
    @Assert([
        {must: Assertion.minDeposit(5), code: Assertion.ERR_MIN_AMOUNT},
        {must: Assertion.maxDeposit(20), code: Assertion.ERR_MAX_AMOUNT_REACHED}
    ])
    Budget: BalanceFor = ['deposit', 'withdraw', 'get_balance']
}

export default Balancing
```

### NFT Minting

```typescript
import { Has, Mint, Module, Transfer } from "move-ts/decorators";
import { sui } from "move-ts/types";

@Module('hello_world')
class Nfting {
    @Has(['key', 'store'])
    Hero = {
        name: sui.string,
        description: sui.string,
        image_url: sui.string
    }

    @Mint('Hero', {display: false})
    @Transfer(['me', 'receiver'])
    mint_hero(){}
}

export default Nfting
```
