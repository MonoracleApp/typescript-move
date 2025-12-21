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
    moveImports.push("use std::string::String;");
  }

  // Check if SuiEvent is imported (need sui::event)
  const hasSuiEventImport = imports.some((imp) =>
    imp.namedImports.includes("SuiEvent")
  );

  if (hasSuiEventImport) {
    moveImports.push("use sui::event;");
  }

  return moveImports.length > 0 ? moveImports.join("\n") + "\n" : "";
}
