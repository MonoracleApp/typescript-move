interface ImportInfo {
  moduleSpecifier: string;
  namedImports: string[];
  defaultImport?: string;
}

interface StructInfo {
  name: string | undefined;
  properties: any[];
  abilities: string[];
}

export function generateMoveImports(
  imports: ImportInfo[],
  structs?: StructInfo[]
): string {
  const moveImports: string[] = [];

  // Check if String type is imported
  const hasStringImport = imports.some((imp) =>
    imp.namedImports.includes("String")
  );

  if (hasStringImport) {
    moveImports.push("use std::string::{Self};");
  }

  // Check if any struct has "key" ability (needs UID)
  const hasKeyAbility = structs?.some((struct) =>
    struct.abilities.includes("key")
  );

  return moveImports.length > 0 ? moveImports.join("\n") + "\n" : "";
}
