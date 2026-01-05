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
function mapParameterType(tsType: string, isPublicFunction: boolean = false): string {
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
    UID: "UID",
    ID: "ID",
    TxContext: "&mut tx_context::TxContext",
  };

  // Remove import() wrapper
  const cleanType = tsType.replace(/import\([^)]+\)\./g, "").trim();

  const mappedType = typeMap[cleanType] || cleanType;

  // For @Public() functions, add reference for struct types (non-primitives, non-TxContext)
  if (isPublicFunction && !typeMap[cleanType] && cleanType !== "TxContext") {
    return `&${mappedType}`;
  }

  return mappedType;
}

/**
 * Extracts return information from method body
 */
function extractReturnInfo(body: string, parameters: MethodParameter[]): {
  returnFields: string[];
  returnType: string;
} | null {
  // Match: return { field1, field2, ... }
  const returnMatch = body.match(/return\s*\{([^}]+)\}/);
  if (!returnMatch) return null;

  const fieldsText = returnMatch[1];
  const fields = fieldsText
    .split(',')
    .map(f => f.trim())
    .filter(f => f.length > 0);

  return {
    returnFields: fields,
    returnType: '', // Will be inferred later
  };
}

/**
 * Infers Move types for return fields based on parameter access patterns
 */
function inferReturnFieldTypes(
  body: string,
  returnFields: string[],
  parameters: MethodParameter[]
): string[] {
  const fieldTypes: string[] = [];

  for (const field of returnFields) {
    // Look for: const field = param.field;
    const assignmentPattern = new RegExp(`const\\s+${field}\\s*=\\s*(\\w+)\\.(\\w+)`);
    const match = body.match(assignmentPattern);

    if (match) {
      const paramName = match[1];
      const fieldName = match[2];

      // Find the parameter type
      const param = parameters.find(p => p.name === paramName);
      if (param) {
        // Get the field type from the struct (simplified - use String as default for now)
        // In a full implementation, you'd look up the struct definition
        const cleanParamType = param.type.replace(/import\([^)]+\)\./g, "").trim();

        // Map common field names to types
        if (fieldName === 'id') {
          fieldTypes.push('ID');
        } else if (fieldName === 'name' || fieldName === 'lastname' || fieldName === 'username') {
          fieldTypes.push('String');
        } else if (fieldName === 'age' || fieldName === 'value') {
          fieldTypes.push('u64');
        } else {
          fieldTypes.push('String'); // Default fallback
        }
      } else {
        fieldTypes.push('String');
      }
    } else {
      fieldTypes.push('String');
    }
  }

  return fieldTypes;
}

/**
 * Transforms method body from TypeScript to Move syntax
 */
function transformMethodBody(body: string, hasPublicDecorator: boolean = false, parameters: MethodParameter[] = []): string {
  let transformed = body;

  // Remove curly braces wrapper
  transformed = transformed.replace(/^\{\s*/, "").replace(/\s*\}$/, "");

  // Special handling for @Public() functions with tuple returns
  if (hasPublicDecorator) {
    const returnInfo = extractReturnInfo(body, parameters);
    if (returnInfo) {
      // Transform object literal return to tuple return
      // return { name, lastname } -> (p.name, p.lastname)
      const tupleFields = returnInfo.returnFields.map(field => {
        // Find which parameter this field comes from
        const assignmentPattern = new RegExp(`const\\s+${field}\\s*=\\s*(\\w+)\\.(\\w+)`);
        const match = body.match(assignmentPattern);

        if (match) {
          const paramName = match[1];
          const fieldName = match[2];
          // Find the parameter to get a shorter name if needed
          const param = parameters.find(p => p.name === paramName);
          if (param) {
            // Use first letter of parameter name for cleaner code
            const shortParamName = paramName.charAt(0);
            return `${shortParamName}.${fieldName}`;
          }
          return `${paramName}.${fieldName}`;
        }
        return field;
      });

      // Replace return statement with tuple
      transformed = `(${tupleFields.join(', ')})`;
    }
  }

  // Transform SuiObject.createObjectId(ctx) -> object::new(ctx)
  transformed = transformed.replace(
    /SuiObject\.createObjectId\(([^)]+)\)/g,
    "object::new($1)"
  );

  // Transform SuiObject.uidToInner(uid) -> object::uid_to_inner(&uid)
  transformed = transformed.replace(
    /SuiObject\.uidToInner\(([^)]+)\)/g,
    "object::uid_to_inner(&$1)"
  );

  // Transform Transfer.shareObject<Type>(obj) -> transfer::public_share_object(obj)
  transformed = transformed.replace(
    /Transfer\.shareObject<[^>]+>\(([^)]+)\)/g,
    "transfer::public_share_object($1)"
  );

  // Transform Transfer.transfer<Type>(obj, recipient) -> transfer::transfer(obj, recipient)
  transformed = transformed.replace(
    /Transfer\.transfer<[^>]+>\(([^)]+)\)/g,
    "transfer::transfer($1)"
  );

  // Transform Transfer.freezeObject<Type>(obj) -> transfer::public_freeze_object(obj)
  transformed = transformed.replace(
    /Transfer\.freezeObject<[^>]+>\(([^)]+)\)/g,
    "transfer::public_freeze_object($1)"
  );

  // Transform TxContext.sender(ctx) -> tx_context::sender(ctx)
  transformed = transformed.replace(
    /TxContext\.sender\(([^)]+)\)/g,
    "tx_context::sender($1)"
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

      // Check if method has @Public decorator
      const hasPublicDecorator = method.decorators?.some(d => d.name === 'Public') || false;

      // Check if function has a return statement (getter/view function)
      const isGetter = method.body.includes('return {');

      // Generate parameters with proper type mapping
      const params = method.parameters
        .map((p) => {
          const mappedType = mapParameterType(p.type, hasPublicDecorator && isGetter);
          // Use shorter parameter names for getter functions only
          // Check if it's TxContext by looking at the mapped type
          const isTxContext = mappedType.includes('TxContext');
          if (hasPublicDecorator && isGetter && !isTxContext) {
            const shortName = p.name.charAt(0);
            return `${shortName}: ${mappedType}`;
          }
          return `${p.name}: ${mappedType}`;
        })
        .join(", ");

      // Transform method body
      const body = transformMethodBody(method.body, hasPublicDecorator && isGetter, method.parameters);

      // Infer return type for getter functions with tuple returns
      let returnTypeSignature = '';
      if (hasPublicDecorator && isGetter) {
        const returnInfo = extractReturnInfo(method.body, method.parameters);
        if (returnInfo) {
          const fieldTypes = inferReturnFieldTypes(method.body, returnInfo.returnFields, method.parameters);
          returnTypeSignature = `: (${fieldTypes.join(', ')})`;
        }
      }

      const visibility = hasPublicDecorator ? 'public ' : '';

      // Check if method uses Transfer.transfer (owned object)
      const usesTransfer = method.body.includes("Transfer.transfer");
      const attribute = usesTransfer ? "#[allow(lint(self_transfer))]\n  " : "";

      return `${attribute}${visibility}fun ${method.name}(${params})${returnTypeSignature} {
    ${body}
  }`;
    })
    .filter((f) => f !== "");

  return moveFunctions.length > 0 ? moveFunctions.join("\n\n") + "\n" : "";
}
