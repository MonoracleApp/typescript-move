interface MethodParameter {
  name: string;
  type: string;
}

interface MethodDecorator {
  name: string;
  arguments: string[];
}

interface MethodInfo {
  name: string | undefined;
  returnType: string;
  parameters: MethodParameter[];
  body: string | null;
  decorators: MethodDecorator[];
}

/**
 * Maps TypeScript types to Move types for parameters
 */
function mapParameterType(tsType: string): string {
  const typeMap: Record<string, string> = {
    String: "String",
    u64: "u64",
    u32: "u32",
    u8: "u8",
    u16: "u16",
    u128: "u128",
    u256: "u256",
    bool: "bool",
    address: "address",
    string: "address",
    UID: "sui::object::UID",
    ID: "sui::object::ID",
    TxContext: "&mut sui::tx_context::TxContext",
  };

  // Remove import() wrapper
  const cleanType = tsType.replace(/import\([^)]+\)\./g, "").trim();

  return typeMap[cleanType] || cleanType;
}

/**
 * Transforms method body from TypeScript to Move syntax
 */
function transformMethodBody(body: string): string {
  let transformed = body;

  // Remove curly braces wrapper
  transformed = transformed.replace(/^\{\s*/, "").replace(/\s*\}$/, "");

  // Transform SuiObject.createObjectId(ctx) -> sui::object::new(ctx)
  transformed = transformed.replace(
    /SuiObject\.createObjectId\(([^)]+)\)/g,
    "sui::object::new($1)"
  );

  // Transform SuiObject.uidToInner(uid) -> sui::object::uid_to_inner(&uid)
  transformed = transformed.replace(
    /SuiObject\.uidToInner\(([^)]+)\)/g,
    "sui::object::uid_to_inner(&$1)"
  );

  // Transform Transfer.shareObject<Type>(obj) -> sui::transfer::public_share_object(obj)
  transformed = transformed.replace(
    /Transfer\.shareObject<[^>]+>\(([^)]+)\)/g,
    "sui::transfer::public_share_object($1)"
  );

  // Transform Transfer.transfer<Type>(obj, recipient) -> sui::transfer::transfer(obj, recipient)
  transformed = transformed.replace(
    /Transfer\.transfer<[^>]+>\(([^)]+)\)/g,
    "sui::transfer::transfer($1)"
  );

  // Transform Transfer.freezeObject<Type>(obj) -> sui::transfer::public_freeze_object(obj)
  transformed = transformed.replace(
    /Transfer\.freezeObject<[^>]+>\(([^)]+)\)/g,
    "sui::transfer::public_freeze_object($1)"
  );

  // Transform TxContext.sender(ctx) -> sui::tx_context::sender(ctx)
  transformed = transformed.replace(
    /TxContext\.sender\(([^)]+)\)/g,
    "sui::tx_context::sender($1)"
  );

  // Transform SuiEvent.emit<Type>(event) -> event::emit(Type event)
  transformed = transformed.replace(
    /SuiEvent\.emit<([^>]+)>\(\{/g,
    "event::emit($1 {"
  );

  // Transform let declarations with type annotation
  // Example: let newPerson: Person = { ... } -> let newPerson = Person { ... }
  transformed = transformed.replace(
    /let\s+(\w+):\s*(\w+)\s*=\s*\{/g,
    "let $1 = $2 {"
  );

  // Remove type annotations from simple let declarations
  // Example: let person_id: UID = ... -> let person_id = ...
  transformed = transformed.replace(
    /let\s+(\w+):\s*\w+\s*=/g,
    "let $1 ="
  );

  // Remove trailing commas in struct initialization
  transformed = transformed.replace(/,\s*\}/g, " }");

  // Add semicolons and newlines for better formatting
  transformed = transformed.replace(/;\s*/g, ";\n    ");

  return transformed.trim();
}

/**
 * Generates Move function definitions from method information
 */
export function generateMoveFunctions(methods: MethodInfo[]): string {
  if (!methods || methods.length === 0) {
    return "";
  }

  const moveFunctions = methods
    .map((method) => {
      if (!method.name || !method.body) return "";

      // Generate parameters
      const params = method.parameters
        .map((p) => `${p.name}: ${mapParameterType(p.type)}`)
        .join(", ");

      // Transform method body
      const body = transformMethodBody(method.body);

      // Check if method has @Public decorator
      const hasPublicDecorator = method.decorators?.some(d => d.name === 'Public') || false;
      const visibility = hasPublicDecorator ? 'public ' : '';

      // Check if method uses Transfer.transfer (owned object)
      const usesTransfer = method.body.includes("Transfer.transfer");
      const attribute = usesTransfer ? "#[allow(lint(self_transfer))]\n  " : "";

      return `${attribute}${visibility}fun ${method.name}(${params}) {
    ${body}
  }`;
    })
    .filter((f) => f !== "");

  return moveFunctions.length > 0 ? moveFunctions.join("\n\n") + "\n" : "";
}
