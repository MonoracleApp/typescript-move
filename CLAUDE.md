# TypeScript to Sui Move Transpiler

  This is a CLI tool that transpiles TypeScript-like syntax into production-ready Sui Move smart contracts. It enables TypeScript developers to write Sui blockchain smart contracts using familiar syntax and patterns.

  ## About the Project

  A powerful transpiler that converts `.sui.ts` files into optimized Sui Move code. The tool provides intelligent code generation, automatic type mapping, Move-compliant validation, and follows Sui Move best practices to ensure clean, warning-free output.

  ## Key Features

  ### 1. TypeScript-Like Contract Development
  - Write smart contracts using TypeScript syntax
  - Define structs as interfaces with `Has<>` ability annotations
  - Use decorators (`@Module`) for module configuration
  - Leverage TypeScript's type system during development

  ### 2. Intelligent Struct Generation
  - **Interface to Struct**: Automatically converts TypeScript interfaces to Move structs
  - **Ability Management**: `Has<"key" | "store">` becomes `has key, store`
  - **Type Safety**: Validates ability combinations (prevents `copy + key` conflicts)
  - **Smart Fields**: UID fields properly mapped to `sui::object::UID`

  ### 3. Advanced Method Transpilation
  - **Entry Functions**: Methods automatically become `public entry fun`
  - **Parameter Mapping**:
    - `TxContext` → `&mut sui::tx_context::TxContext`
    - `String` → `String`
    - Type-safe parameter conversion
  - **Body Transformation**:
    - `SuiObject.createObjectId(ctx)` → `sui::object::new(ctx)`
    - `Transfer.shareObject<T>(obj)` → `sui::transfer::public_share_object(obj)`
    - `let var: Type = { ... }` → `let var = Type { ... }`

  ### 4. Optimized Import Management
  - Minimal imports (no duplicate aliases)
  - Full path usage to avoid Move compiler warnings
  - Only imports what's actually used
  - Follows Sui Move style guidelines

  ### 5. Move Compliance & Validation
  - **Ability Validation**: Prevents invalid ability combinations
  - **Compile-time Errors**: Clear error messages with compilation halt
  - **Warning-free Output**: Generates code that passes `sui move build` cleanly
  - **Best Practices**: Follows official Sui Move conventions

  ## Project Structure

  ts-sui-transpiler/
  ├── src/
  │   ├── lib/
  │   │   ├── compile-v2.ts           # Main V2 compilation orchestration
  │   │   └── v2/
  │   │       ├── structs.ts          # Struct generation & validation
  │   │       ├── methods.ts          # Method/function generation
  │   │       ├── imports.ts          # Import optimization
  │   │       ├── types.ts            # Type definitions (String, u64, UID)
  │   │       ├── abilities.ts        # Has<> type helper
  │   │       ├── sui-object.ts       # SuiObject helper class
  │   │       ├── tx-context.ts       # TxContext type
  │   │       └── transfer.ts         # Transfer helper class
  │   ├── utils/
  │   │   └── index.ts               # AST parsing with ts-morph
  │   ├── schemas/
  │   │   └── file-path.schema.ts    # File validation
  │   └── index.ts                   # CLI entry point
  ├── app/
  │   ├── *.sui.ts                   # Example contracts
  │   └── structs/                   # Struct definitions (interfaces)
  │       ├── person.struct.ts
  │       └── counter.struct.ts
  └── bin/
      └── cli.js                     # CLI executable