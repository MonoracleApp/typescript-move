export interface DocSection {
  id: string;
  title: string;
  content: string;
}

export interface DocCategory {
  title: string;
  slug: string;
  sections: DocSection[];
}

export const docsV2: DocCategory[] = [
  {
    title: "Getting Started",
    slug: "getting-started",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: `# typescript-move - V2 API

typescript-move is a TypeScript to Sui Move transpiler that converts TypeScript-like syntax into production-ready Sui Move smart contracts. It provides intelligent type mapping, automatic code generation, and follows Sui Move best practices.

## Key Features

- **TypeScript-Like Development**: Write smart contracts using familiar TypeScript syntax
- **Intelligent Struct Generation**: Automatically converts interfaces to Move structs
- **Advanced Method Transpilation**: Handles entry functions and view functions with automatic type conversion
- **Optimized Import Management**: Generates minimal, warning-free imports
- **Move Compliance**: Validates abilities and generates production-ready code`
      },
      {
        id: "installation",
        title: "Installation",
        content: `# Installation

## Prerequisites

- Node.js 16+
- npm or yarn

## Install

\`\`\`bash
npm install -g typescript-move
\`\`\`

## Verify Installation

\`\`\`bash
typescript-move --version
\`\`\`

## Quick Start

\`\`\`bash
# Create a new contract file
touch contract.sui.ts

# Compile to Move
typescript-move --compileV2 contract.sui.ts
\`\`\``
      }
    ]
  },
  {
    title: "Struct Definitions",
    slug: "structs",
    sections: [
      {
        id: "basic-struct",
        title: "Basic Struct",
        content: `# Struct Definitions

Structs are defined as TypeScript interfaces with the \`Has<>\` ability annotation.

## Syntax

\`\`\`typescript
import { Has } from "typescript-move/lib/v2/abilities";
import { String, u64, UID } from "typescript-move/lib/v2/types";

export interface StructName extends Has<"ability1" | "ability2"> {
  id: UID;
  field1: Type1;
  field2: Type2;
}
\`\`\`

## Example: Person Struct

**TypeScript:**
\`\`\`typescript
import { Has } from "typescript-move/lib/v2/abilities";
import { u64, String, UID } from "typescript-move/lib/v2/types";

export interface Person extends Has<"key" | "store"> {
  id: UID;
  name: String;
  lastname: String;
  age: u64;
}
\`\`\`

**Transpiled Move:**
\`\`\`move
public struct Person has key, store {
  id: sui::object::UID,
  name: String,
  lastname: String,
  age: u64
}
\`\`\``
      },
      {
        id: "abilities",
        title: "Abilities",
        content: `# Abilities

## Available Abilities

- **\`key\`** - Object can be used as a key in global storage
- **\`store\`** - Object can be stored inside other objects
- **\`copy\`** - Object can be copied
- **\`drop\`** - Object can be dropped/discarded

## Important Rules

⚠️ **\`key\`** and **\`copy\`** cannot be combined (Move compiler restriction)

## Common Patterns

### Transferable Objects
\`\`\`typescript
interface Person extends Has<"key" | "store"> { /* ... */ }
\`\`\`

### Events
\`\`\`typescript
interface PersonCreatedEvent extends Has<"copy" | "drop"> { /* ... */ }
\`\`\``
      }
    ]
  },
  {
    title: "Functions",
    slug: "functions",
    sections: [
      {
        id: "entry-functions",
        title: "Entry Functions",
        content: `# Entry Functions

Functions that create or modify objects without return values.

## Example: Creating an Owned Object

**TypeScript:**
\`\`\`typescript
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
\`\`\`

**Transpiled Move:**
\`\`\`move
#[allow(lint(self_transfer))]
public fun createPerson(name: String, lastname: String, age: u64, ctx: &mut sui::tx_context::TxContext) {
  let person_id = sui::object::new(ctx);
  let sender = sui::tx_context::sender(ctx);
  event::emit(PersonCreatedEvent {
    person_id: sui::object::uid_to_inner(&person_id),
    name,
    lastname,
    age,
    owner: sender
  });
  let newPerson = Person { id: person_id, name, lastname, age };
  sui::transfer::transfer(newPerson, sender);
}
\`\`\``
      },
      {
        id: "view-functions",
        title: "View Functions (Getters)",
        content: `# View Functions (Getters)

Functions that return data using tuple syntax with reference parameters.

## Example

**TypeScript:**
\`\`\`typescript
@Public()
getUser(person: Person) {
  const name = person.name;
  const lastname = person.lastname;
  return {
    name,
    lastname,
  };
}
\`\`\`

**Transpiled Move:**
\`\`\`move
public fun getUser(p: &Person): (String, String) {
  (p.name, p.lastname)
}
\`\`\`

## Key Features

- **Reference Parameters**: Uses \`&Type\` instead of owned types
- **Short Parameter Names**: Optimized for clarity (\`p\` instead of \`person\`)
- **Tuple Returns**: Object literals become tuples
- **Automatic Type Inference**: Return types are inferred from the code
- **No Intermediate Variables**: Direct field access in return statement`
      }
    ]
  },
  {
    title: "Helper Classes",
    slug: "helpers",
    sections: [
      {
        id: "sui-object",
        title: "SuiObject",
        content: `# SuiObject

Utility methods for working with Sui objects.

## Methods

| TypeScript Method | Move Equivalent | Description |
|------------------|-----------------|-------------|
| \`SuiObject.createObjectId(ctx)\` | \`sui::object::new(ctx)\` | Create new object ID |
| \`SuiObject.uidToInner(uid)\` | \`sui::object::uid_to_inner(&uid)\` | Convert UID to ID |

## Example

\`\`\`typescript
let person_id: UID = SuiObject.createObjectId(ctx);
let id: ID = SuiObject.uidToInner(person_id);
\`\`\``
      },
      {
        id: "transfer",
        title: "Transfer",
        content: `# Transfer

Methods for object transfer and sharing.

## Methods

| TypeScript Method | Move Equivalent | Description |
|------------------|-----------------|-------------|
| \`Transfer.transfer<T>(obj, recipient)\` | \`sui::transfer::transfer(obj, recipient)\` | Transfer owned object |
| \`Transfer.shareObject<T>(obj)\` | \`sui::transfer::public_share_object(obj)\` | Share object publicly |
| \`Transfer.freezeObject<T>(obj)\` | \`sui::transfer::public_freeze_object(obj)\` | Freeze object (immutable) |

## Examples

### Transfer Owned Object
\`\`\`typescript
Transfer.transfer<Person>(newPerson, sender);
\`\`\`

### Share Object
\`\`\`typescript
Transfer.shareObject<Counter>(newCounter);
\`\`\`

### Freeze Object
\`\`\`typescript
Transfer.freezeObject<Winner>(newWinner);
\`\`\``
      },
      {
        id: "txcontext",
        title: "TxContext",
        content: `# TxContext

Transaction context utilities.

## Methods

| TypeScript Method | Move Equivalent | Description |
|------------------|-----------------|-------------|
| \`TxContext.sender(ctx)\` | \`sui::tx_context::sender(ctx)\` | Get transaction sender |

## Example

\`\`\`typescript
let sender: string = TxContext.sender(ctx);
\`\`\``
      },
      {
        id: "sui-event",
        title: "SuiEvent",
        content: `# SuiEvent

Event emission utilities.

## Methods

| TypeScript Method | Move Equivalent | Description |
|------------------|-----------------|-------------|
| \`SuiEvent.emit<EventType>({...})\` | \`event::emit(EventType {...})\` | Emit an event |

## Example

\`\`\`typescript
SuiEvent.emit<PersonCreatedEvent>({
  person_id: SuiObject.uidToInner(person_id),
  name,
  lastname,
  age,
  owner: sender,
});
\`\`\``
      }
    ]
  },
  {
    title: "Type System",
    slug: "types",
    sections: [
      {
        id: "type-mapping",
        title: "Type Mapping",
        content: `# Type Mapping

## TypeScript to Move Type Conversion

| TypeScript Type | Move Type |
|----------------|-----------|
| \`String\` | \`String\` |
| \`u8\` | \`u8\` |
| \`u16\` | \`u16\` |
| \`u32\` | \`u32\` |
| \`u64\` | \`u64\` |
| \`u128\` | \`u128\` |
| \`u256\` | \`u256\` |
| \`bool\` | \`bool\` |
| \`address\` | \`address\` |
| \`UID\` | \`sui::object::UID\` |
| \`ID\` | \`sui::object::ID\` |
| \`TxContext\` | \`&mut sui::tx_context::TxContext\` |
| Custom Struct (getter) | \`&CustomStruct\` |
| Custom Struct (entry) | \`CustomStruct\` |

## Usage

\`\`\`typescript
import { String, u64, UID } from "typescript-move/lib/v2/types";

interface Person {
  id: UID;
  name: String;
  age: u64;
}
\`\`\``
      }
    ]
  },
  {
    title: "Complete Examples",
    slug: "examples",
    sections: [
      {
        id: "owned-object",
        title: "Creating Owned Objects",
        content: `# Creating Owned Objects

Objects that are transferred to a specific address.

## Full Example

\`\`\`typescript
@Module("version2")
export class Writei {
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
}
\`\`\`

## Transpiled Move

\`\`\`move
module version2::writei {
  use std::string::String;
  use sui::event;

  #[allow(lint(self_transfer))]
  public fun createPerson(name: String, lastname: String, age: u64, ctx: &mut sui::tx_context::TxContext) {
    let person_id = sui::object::new(ctx);
    let sender = sui::tx_context::sender(ctx);
    event::emit(PersonCreatedEvent {
      person_id: sui::object::uid_to_inner(&person_id),
      name,
      lastname,
      age,
      owner: sender
    });
    let newPerson = Person { id: person_id, name, lastname, age };
    sui::transfer::transfer(newPerson, sender);
  }
}
\`\`\``
      },
      {
        id: "shared-object",
        title: "Creating Shared Objects",
        content: `# Creating Shared Objects

Objects that can be accessed by anyone.

## Example

\`\`\`typescript
@Public()
createCounter(value: u64, ctx: TxContext) {
  let newCounter: Counter = {
    id: SuiObject.createObjectId(ctx),
    value
  };
  Transfer.shareObject<Counter>(newCounter);
}
\`\`\`

## Transpiled Move

\`\`\`move
public fun createCounter(value: u64, ctx: &mut sui::tx_context::TxContext) {
  let newCounter = Counter {
    id: sui::object::new(ctx),
    value
  };
  sui::transfer::public_share_object(newCounter);
}
\`\`\``
      },
      {
        id: "frozen-object",
        title: "Creating Frozen Objects",
        content: `# Creating Frozen Objects

Immutable objects that cannot be modified.

## Example

\`\`\`typescript
@Public()
createWinner(username: String, ctx: TxContext) {
  let newWinner: Winner = {
    id: SuiObject.createObjectId(ctx),
    username,
  };
  Transfer.freezeObject<Winner>(newWinner);
}
\`\`\`

## Transpiled Move

\`\`\`move
public fun createWinner(username: String, ctx: &mut sui::tx_context::TxContext) {
  let newWinner = Winner {
    id: sui::object::new(ctx),
    username
  };
  sui::transfer::public_freeze_object(newWinner);
}
\`\`\``
      }
    ]
  }
];
