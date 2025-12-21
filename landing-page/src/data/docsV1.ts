import type { DocCategory } from './docsV2';

export const docsV1: DocCategory[] = [
  {
    title: "Introduction",
    slug: "introduction",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: `# SuiJS Decorator API

Complete guide to SuiJS decorators and types. This is the decorator-based API for writing Sui Move contracts.

## What is the Decorator API?

The Decorator API uses TypeScript decorators like \`@Module\`, \`@Write\`, \`@Has\` to define smart contract behavior. This approach is ideal for developers who prefer a declarative, annotation-based style.

## When to Use

- You prefer decorator-based programming
- You want concise, declarative contract definitions
- You're building standard CRUD operations
- You need quick prototyping with common patterns`
      }
    ]
  },
  {
    title: "Decorators",
    slug: "decorators",
    sections: [
      {
        id: "module",
        title: "@Module",
        content: `# @Module

Defines the Move module name.

## Syntax

\`\`\`typescript
@Module('module_name')
class MyContract {
    // ...
}
\`\`\`

## Example

\`\`\`typescript
@Module('hello_world')
class MyContract {
    // ...
}
\`\`\`

**Transpiles to:**

\`\`\`move
module hello_world::mycontract {
    // ...
}
\`\`\``
      },
      {
        id: "has",
        title: "@Has",
        content: `# @Has

Defines struct abilities for Move structs.

## Available Abilities

- **\`key\`** - Can be stored as a top-level object
- **\`store\`** - Can be stored inside other objects
- **\`drop\`** - Can be discarded
- **\`copy\`** - Can be copied

## Example

\`\`\`typescript
@Has(['key', 'store'])
User = {
    name: sui.string,
    status: sui.bool,
    age: sui.u8
}
\`\`\`

**Transpiles to:**

\`\`\`move
public struct User has key, store {
    id: UID,
    name: string::String,
    status: bool,
    age: u8
}
\`\`\``
      },
      {
        id: "write",
        title: "@Write",
        content: `# @Write

Creates a constructor function that creates and shares an object.

## Syntax

\`\`\`typescript
@Write('StructName')
function_name(){}
\`\`\`

## Example

\`\`\`typescript
@Has(['key', 'store'])
User = {
    name: sui.string,
    age: sui.u8
}

@Write('User')
create_user(){}
\`\`\`

**Transpiles to:**

\`\`\`move
public fun create_user(name: string::String, age: u8, ctx: &mut TxContext) {
    let user = User {id: object::new(ctx), name, age};
    transfer::share_object(user);
}
\`\`\``
      },
      {
        id: "move",
        title: "@Move",
        content: `# @Move

Creates a function that modifies existing objects.

## Helper Types

- **\`Mut<T>\`** - Mutable reference to object
- **\`Primitive<T>\`** - Move primitive type

## Example

\`\`\`typescript
@Move()
changeName(userObj: Mut<'User'>, nameUser: Primitive<'string::String'>){
    exec\\\`
        userObj.name = nameUser;
    \\\`
}
\`\`\`

**Transpiles to:**

\`\`\`move
public fun changeName(userObj: &mut User, nameUser: string::String, ctx: &mut TxContext) {
    userObj.name = nameUser;
}
\`\`\`

## Multiple Object Mutation

\`\`\`typescript
@Move()
incrementCounter(counterItem: Mut<'Counter'>, otherCounterItem: Mut<'Counter'>){
    exec\\\`
        counterItem.value = counterItem.value + 1;
        otherCounterItem.value = otherCounterItem.value + 1;
    \\\`
}
\`\`\``
      },
      {
        id: "assert",
        title: "@Assert",
        content: `# @Assert

Adds validation rules to functions. Assertions are checked before function execution.

## Basic Example

\`\`\`typescript
@Write('User')
@Assert([{must: 'age > 10', code: Assertion.ERR_UNDERAGE}])
create_user(){}
\`\`\`

**Transpiles to:**

\`\`\`move
public fun create_user(name: string::String, age: u8, ctx: &mut TxContext) {
    assert!(age > 10, ERR_UNDERAGE);
    let user = User {id: object::new(ctx), name, age};
    transfer::share_object(user);
}
\`\`\`

## Multiple Assertions

\`\`\`typescript
const MY_ADDRESS = '0xbed1a0d1bb2b8e281d81b838f6c35d7864936f0de3233eb161181ab765e0ea40'

@Move()
@Assert([
    {must: Assertion.min('message', 10), code: Assertion.ERR_MESSAGE_TOO_SHORT},
    {must: Assertion.onlyFor(MY_ADDRESS), code: Assertion.ERR_ONLY_OWNER},
])
changeName(annObj: Mut<'Announcement'>, message: Primitive<'string::String'>){
    exec\\\`
        annObj.message = message;
    \\\`
}
\`\`\``
      },
      {
        id: "balance",
        title: "@Balance",
        content: `# @Balance

Creates a SUI balance management system with deposit, withdraw, and query functions.

## Basic Example

\`\`\`typescript
@Balance()
Funding: BalanceFor = ['deposit', 'withdraw', 'get_balance']
\`\`\`

**Generates:**

\`\`\`move
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
\`\`\`

## With Assertions

\`\`\`typescript
@Balance()
@Assert([
    {must: Assertion.minDeposit(5), code: Assertion.ERR_MIN_AMOUNT},
    {must: Assertion.maxDeposit(20), code: Assertion.ERR_MAX_AMOUNT_REACHED},
    {must: Assertion.maxWithdraw(2), code: Assertion.ERR_MAX_AMOUNT_REACHED}
])
Budget: BalanceFor = ['deposit', 'withdraw', 'get_balance']
\`\`\`

> Values are automatically converted from SUI to MIST (1 SUI = 1,000,000,000 MIST)`
      },
      {
        id: "mint",
        title: "@Mint",
        content: `# @Mint

Creates an NFT minting function.

## Syntax

\`\`\`typescript
@Mint('StructName', options)
@Transfer(['target1', 'target2'])
function_name(){}
\`\`\`

## Options

- **\`display: true\`** - Generates Display metadata for NFT (shows in wallets/explorers)
- **\`display: false\`** - No Display metadata

## Example

\`\`\`typescript
@Has(['key', 'store'])
Hero = {
    name: sui.string,
    description: sui.string,
    image_url: sui.string
}

@Mint('Hero', {display: false})
@Transfer(['me', 'receiver'])
mint_hero(){}
\`\`\``
      },
      {
        id: "transfer",
        title: "@Transfer",
        content: `# @Transfer

Specifies transfer targets for minted objects.

## Syntax

\`\`\`typescript
@Transfer(['target1', 'target2'])
function_name(){}
\`\`\`

## Options

- **\`'me'\`** - Transfer to the transaction sender
- **\`'receiver'\`** - Transfer to a specified receiver address (adds \`receiver: address\` parameter)

## Example

\`\`\`typescript
@Mint('Hero', {display: false})
@Transfer(['me', 'receiver'])
mint_hero(){}
\`\`\``
      },
      {
        id: "vector",
        title: "@Vector",
        content: `# @Vector

Creates a vector (list) container for storing multiple objects.

## Syntax

\`\`\`typescript
@Vector('StructName')
ListName: SuiVector = {
    maxLength: number
}
\`\`\`

## Example

\`\`\`typescript
@Vector('User')
PersonList: SuiVector = {
    maxLength: 100
}
\`\`\``
      }
    ]
  },
  {
    title: "Types",
    slug: "types",
    sections: [
      {
        id: "primitives",
        title: "Primitive Types",
        content: `# Primitive Types

## Type Mapping

| TypeScript | Move |
|------------|------|
| \`sui.string\` | \`string::String\` |
| \`sui.bool\` | \`bool\` |
| \`sui.u8\` | \`u8\` |
| \`sui.u32\` | \`u32\` |
| \`sui.u64\` | \`u64\` |

## Usage

\`\`\`typescript
import { sui } from "./types";

@Has(['key', 'store'])
User = {
    name: sui.string,
    age: sui.u8,
    active: sui.bool
}
\`\`\``
      },
      {
        id: "helpers",
        title: "Helper Types",
        content: `# Helper Types

## Available Types

| Type | Description | Example |
|------|-------------|---------|
| \`Mut<T>\` | Mutable reference to object | \`userObj: Mut<'User'>\` |
| \`Primitive<T>\` | Move primitive type | \`name: Primitive<'string::String'>\` |
| \`BalanceFor\` | Balance operation tuple | \`['deposit', 'withdraw', 'get_balance']\` |
| \`SuiVector\` | Vector configuration | \`{ maxLength: 100 }\` |

## Examples

### Mut<T>
\`\`\`typescript
@Move()
updateUser(userObj: Mut<'User'>) {
    // ...
}
\`\`\`

### Primitive<T>
\`\`\`typescript
@Move()
changeName(user: Mut<'User'>, newName: Primitive<'string::String'>) {
    // ...
}
\`\`\``
      }
    ]
  },
  {
    title: "Assertion Helpers",
    slug: "assertions",
    sections: [
      {
        id: "helpers",
        title: "Available Helpers",
        content: `# Assertion Helpers

## String Validation

| Helper | Description | Example |
|--------|-------------|---------|
| \`Assertion.min(field, n)\` | String length >= n | \`Assertion.min('name', 3)\` |
| \`Assertion.max(field, n)\` | String length <= n | \`Assertion.max('name', 100)\` |

## Access Control

| Helper | Description | Example |
|--------|-------------|---------|
| \`Assertion.onlyFor(addr)\` | Restrict to address | \`Assertion.onlyFor(MY_ADDRESS)\` |

## Balance Validation

| Helper | Description | Example |
|--------|-------------|---------|
| \`Assertion.minDeposit(sui)\` | Minimum deposit in SUI | \`Assertion.minDeposit(5)\` |
| \`Assertion.maxDeposit(sui)\` | Maximum deposit in SUI | \`Assertion.maxDeposit(20)\` |
| \`Assertion.maxWithdraw(sui)\` | Maximum withdraw in SUI | \`Assertion.maxWithdraw(2)\` |`
      },
      {
        id: "error-codes",
        title: "Error Codes",
        content: `# Error Codes

## Available Codes

| Code | Description |
|------|-------------|
| \`Assertion.ERR_UNDERAGE\` | Age validation failed |
| \`Assertion.ERR_MESSAGE_TOO_SHORT\` | String too short |
| \`Assertion.ERR_NAME_TOO_SHORT\` | Name too short |
| \`Assertion.ERR_ONLY_OWNER\` | Not the owner |
| \`Assertion.ERR_MIN_AMOUNT\` | Below minimum amount |
| \`Assertion.ERR_MAX_AMOUNT_REACHED\` | Above maximum amount |

## Example

\`\`\`typescript
@Assert([
    {must: 'age > 18', code: Assertion.ERR_UNDERAGE},
    {must: Assertion.min('name', 3), code: Assertion.ERR_NAME_TOO_SHORT}
])
\`\`\``
      }
    ]
  },
  {
    title: "Complete Examples",
    slug: "examples",
    sections: [
      {
        id: "simple-object",
        title: "Simple Object Creation",
        content: `# Simple Object Creation

\`\`\`typescript
import { Has, Module, Write } from "./decorators";
import { sui } from "./types";

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
\`\`\``
      },
      {
        id: "balance-management",
        title: "Balance Management",
        content: `# Balance Management with Assertions

\`\`\`typescript
import { Assert, Balance, Module } from "./decorators";
import { Assertion } from "./lib/assertion";
import { BalanceFor } from "./types";

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
\`\`\``
      },
      {
        id: "nft-minting",
        title: "NFT Minting",
        content: `# NFT Minting

\`\`\`typescript
import { Has, Mint, Module, Transfer } from "./decorators";
import { sui } from "./types";

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
\`\`\``
      }
    ]
  }
];
