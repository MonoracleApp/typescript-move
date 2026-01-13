# typescript-move - V2 Documentation

## Overview

typescript-move is a TypeScript to Sui Move transpiler that converts TypeScript-like syntax into production-ready Sui Move smart contracts. It provides intelligent type mapping, automatic code generation, and follows Sui Move best practices.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Struct Definitions](#struct-definitions)
3. [Event Definitions](#event-definitions)
4. [Module Definition](#module-definition)
5. [Function Types](#function-types)
6. [Helper Classes](#helper-classes)
7. [Complete Examples](#complete-examples)
8. [Compilation](#compilation)

---

## Project Structure

```
app/
├── writei.sui.ts           # Main contract file
├── structs/                # Struct definitions
│   ├── person.struct.ts
│   ├── counter.struct.ts
│   └── winner.struct.ts
└── events/                 # Event definitions
    └── person-created.event.ts
```

---

## Struct Definitions

Structs are defined as TypeScript interfaces with the `Has<>` ability annotation.

### Syntax

```typescript
import { Has } from "typescript-move/lib/v2/abilities";
import { String, u64, UID } from "typescript-move/lib/v2/types";

export interface StructName extends Has<"ability1" | "ability2"> {
  id: UID;
  field1: Type1;
  field2: Type2;
}
```

### Available Abilities

- `"key"` - Object can be used as a key in global storage
- `"store"` - Object can be stored inside other objects
- `"copy"` - Object can be copied
- `"drop"` - Object can be dropped/discarded

**Note:** `key` and `copy` cannot be combined (Move compiler restriction)

### Example: Person Struct

**TypeScript:**
```typescript
import { Has } from "typescript-move/lib/v2/abilities";
import { u64, String, UID } from "typescript-move/lib/v2/types";

export interface Person extends Has<"key" | "store"> {
  id: UID;
  name: String;
  lastname: String;
  age: u64;
}
```

**Transpiled Move:**
```move
public struct Person has key, store {
  id: sui::object::UID,
  name: String,
  lastname: String,
  age: u64
}
```

### Example: Counter Struct (Shared Object)

**TypeScript:**
```typescript
export interface Counter extends Has<"key" | "store"> {
  id: UID;
  value: u64;
}
```

**Transpiled Move:**
```move
public struct Counter has key, store {
  id: sui::object::UID,
  value: u64
}
```

---

## Event Definitions

Events use `copy` and `drop` abilities and are emitted using `SuiEvent.emit<>()`.

### Syntax

```typescript
import { Has } from "typescript-move/lib/v2/abilities";
import { String, u64, ID } from "typescript-move/lib/v2/types";

export interface EventName extends Has<"copy" | "drop"> {
  field1: Type1;
  field2: Type2;
}
```

### Example: PersonCreatedEvent

**TypeScript:**
```typescript
import { Has } from "typescript-move/lib/v2/abilities";
import { String, u64, ID } from "typescript-move/lib/v2/types";

export interface PersonCreatedEvent extends Has<"copy" | "drop"> {
  person_id: ID;
  name: String;
  lastname: String;
  age: u64;
  owner: any;
}
```

**Transpiled Move:**
```move
public struct PersonCreatedEvent has copy, drop {
  person_id: sui::object::ID,
  name: String,
  lastname: String,
  age: u64,
  owner: address
}
```

---

## Module Definition

Use the `@Module()` decorator to define your contract module.

### Syntax

```typescript
import { Module } from "typescript-move/decorators";

@Module("module_name")
export class ContractClassName {
  // Contract implementation
}
```

### Example

```typescript
@Module("version2")
export class Writei {
  // ... methods
}
```

**Transpiles to:**
```move
module version2::writei {
  // ... content
}
```

---

## Function Types

The `@Public()` decorator creates two types of functions based on usage:

### 1. Entry Functions (State-Changing)

Functions that create or modify objects without return values.

**TypeScript:**
```typescript
@Public()
createPerson(name: String, lastname: String, age: u64, ctx: TxContext) {
  let person_id: UID = SuiObject.createObjectId(ctx);
  let sender: string = TxContext.sender(ctx);

  SuiEvent.emit<PersonCreatedEvent>({
    person_id: SuiObject.uidToInner(person_id),
    name,
    lastname,
    age,
    owner: sender,
  });

  let newPerson: Person = {
    id: person_id,
    name,
    lastname,
    age,
  };

  Transfer.transfer<Person>(newPerson, sender);
}
```

**Transpiled Move:**
```move
#[allow(lint(self_transfer))]
public fun createPerson(name: String, lastname: String, age: u64, ctx: &mut sui::tx_context::TxContext) {
  let person_id = sui::object::new(ctx);
  let sender = sui::tx_context::sender(ctx);
  event::emit(PersonCreatedEvent { person_id: sui::object::uid_to_inner(&person_id), name, lastname, age, owner: sender });
  let newPerson = Person { id: person_id, name, lastname, age };
  sui::transfer::transfer(newPerson, sender);
}
```

### 2. Getter/View Functions (Read-Only)

Functions that return data using tuple syntax with reference parameters.

**TypeScript:**
```typescript
@Public()
getUser(person: Person) {
  const name = person.name;
  const lastname = person.lastname;
  return {
    name,
    lastname,
  };
}
```

**Transpiled Move:**
```move
public fun getUser(p: &Person): (String, String) {
  (p.name, p.lastname)
}
```

**Key Features:**
- Parameters use references (`&Type`)
- Short parameter names (`p` instead of `person`)
- Object literal returns become tuples
- Automatic return type inference
- No intermediate variables

---

## Helper Classes

### SuiObject

Utility methods for working with Sui objects.

| TypeScript Method | Move Equivalent | Description |
|------------------|-----------------|-------------|
| `SuiObject.createObjectId(ctx)` | `sui::object::new(ctx)` | Create new object ID |
| `SuiObject.uidToInner(uid)` | `sui::object::uid_to_inner(&uid)` | Convert UID to ID |

### Transfer

Methods for object transfer and sharing.

| TypeScript Method | Move Equivalent | Description |
|------------------|-----------------|-------------|
| `Transfer.transfer<T>(obj, recipient)` | `sui::transfer::transfer(obj, recipient)` | Transfer owned object |
| `Transfer.shareObject<T>(obj)` | `sui::transfer::public_share_object(obj)` | Share object publicly |
| `Transfer.freezeObject<T>(obj)` | `sui::transfer::public_freeze_object(obj)` | Freeze object (immutable) |

### TxContext

Transaction context utilities.

| TypeScript Method | Move Equivalent | Description |
|------------------|-----------------|-------------|
| `TxContext.sender(ctx)` | `sui::tx_context::sender(ctx)` | Get transaction sender |

### SuiEvent

Event emission utilities.

| TypeScript Method | Move Equivalent | Description |
|------------------|-----------------|-------------|
| `SuiEvent.emit<EventType>({...})` | `event::emit(EventType {...})` | Emit an event |

---

## Complete Examples

### Example 1: Creating an Owned Object

**TypeScript:**
```typescript
@Public()
createPerson(name: String, lastname: String, age: u64, ctx: TxContext) {
  let person_id: UID = SuiObject.createObjectId(ctx);
  let sender: string = TxContext.sender(ctx);

  SuiEvent.emit<PersonCreatedEvent>({
    person_id: SuiObject.uidToInner(person_id),
    name,
    lastname,
    age,
    owner: sender,
  });

  let newPerson: Person = {
    id: person_id,
    name,
    lastname,
    age,
  };

  Transfer.transfer<Person>(newPerson, sender);
}
```

### Example 2: Creating a Shared Object

**TypeScript:**
```typescript
@Public()
createCounter(value: u64, ctx: TxContext) {
  let newCounter: Counter = {
    id: SuiObject.createObjectId(ctx),
    value
  };
  Transfer.shareObject<Counter>(newCounter);
}
```

### Example 3: Creating a Frozen Object

**TypeScript:**
```typescript
@Public()
createWinner(username: String, ctx: TxContext) {
  let newWinner: Winner = {
    id: SuiObject.createObjectId(ctx),
    username,
  };
  Transfer.freezeObject<Winner>(newWinner);
}
```

### Example 4: Getter Function

**TypeScript:**
```typescript
@Public()
getUser(person: Person) {
  const name = person.name;
  const lastname = person.lastname;
  return {
    name,
    lastname,
  };
}
```

---

## Type Mapping

| TypeScript Type | Move Type |
|----------------|-----------|
| `String` | `String` |
| `u8` | `u8` |
| `u16` | `u16` |
| `u32` | `u32` |
| `u64` | `u64` |
| `u128` | `u128` |
| `u256` | `u256` |
| `bool` | `bool` |
| `address` | `address` |
| `UID` | `sui::object::UID` |
| `ID` | `sui::object::ID` |
| `TxContext` | `&mut sui::tx_context::TxContext` |
| Custom Struct (getter) | `&CustomStruct` |
| Custom Struct (entry) | `CustomStruct` |

---

## Compilation

### Install typescript-move

```bash
npm install -g typescript-move
```

### Compile a Contract

```bash
typescript-move --compileV2 app/writei.sui.ts
```

Or using npx:

```bash
npx typescript-move --compileV2 app/writei.sui.ts
```

### Output

The transpiler generates clean, warning-free Move code:

```move
module version2::writei {
  use std::string::String;
  use sui::event;

  public struct Person has key, store {
    id: sui::object::UID,
    name: String,
    lastname: String,
    age: u64
  }

  public struct Counter has key, store {
    id: sui::object::UID,
    value: u64
  }

  public struct Winner has key, store {
    id: sui::object::UID,
    username: String
  }

  public struct PersonCreatedEvent has copy, drop {
    person_id: sui::object::ID,
    name: String,
    lastname: String,
    age: u64,
    owner: address
  }

  #[allow(lint(self_transfer))]
  public fun createPerson(name: String, lastname: String, age: u64, ctx: &mut sui::tx_context::TxContext) {
    let person_id = sui::object::new(ctx);
    let sender = sui::tx_context::sender(ctx);
    event::emit(PersonCreatedEvent { person_id: sui::object::uid_to_inner(&person_id), name, lastname, age, owner: sender });
    let newPerson = Person { id: person_id, name, lastname, age };
    sui::transfer::transfer(newPerson, sender);
  }

  public fun createCounter(value: u64, ctx: &mut sui::tx_context::TxContext) {
    let newCounter = Counter { id: sui::object::new(ctx), value };
    sui::transfer::public_share_object(newCounter);
  }

  public fun createWinner(username: String, ctx: &mut sui::tx_context::TxContext) {
    let newWinner = Winner { id: sui::object::new(ctx), username };
    sui::transfer::public_freeze_object(newWinner);
  }

  public fun getUser(p: &Person): (String, String) {
    (p.name, p.lastname)
  }
}
```

---

## Best Practices

1. **Struct Organization**: Keep struct definitions in separate files under `app/structs/`
2. **Event Organization**: Keep event definitions in separate files under `app/events/`
3. **Ability Selection**:
   - Use `key, store` for transferable objects
   - Use `copy, drop` for events
   - Never combine `key` and `copy`
4. **Function Naming**:
   - Use `create*` prefix for object creation functions
   - Use `get*` prefix for getter/view functions
5. **Parameter Naming**: Use descriptive names in TypeScript, transpiler handles optimization
6. **Return Values**: Use object literal syntax for tuple returns in getters

---

## Advanced Features

### Automatic Optimizations

- **Import Minimization**: Only imports what's actually used
- **Full Path Usage**: Uses full paths to avoid compiler warnings
- **Attribute Generation**: Automatically adds `#[allow(lint(self_transfer))]` when needed
- **Type Inference**: Infers return types from object literal structure
- **Code Simplification**: Removes unnecessary variable declarations in getters

### Validation

- **Ability Validation**: Prevents invalid ability combinations at compile time
- **Type Safety**: Validates type mappings and conversions
- **Error Messages**: Clear, actionable error messages for debugging

---

## Troubleshooting

### Common Issues

1. **"Cannot combine key and copy abilities"**
   - Solution: Use either `key` or `copy`, not both

2. **"Module name not found"**
   - Solution: Ensure `@Module()` decorator is present on the class

3. **"Import path not resolved"**
   - Solution: Check that struct/event files are in the correct directories

### Getting Help

For issues and feature requests, please visit the GitHub repository.

---

## Future Roadmap

- Support for generic types
- Advanced struct field validation
- Integration with Sui CLI for direct deployment
- VSCode extension with syntax highlighting
- Real-time type checking and validation
