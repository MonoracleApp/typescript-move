interface ImportInfo {
  moduleSpecifier: string;
  namedImports: string[];
  defaultImport?: string;
}

export function generateMoveImports(imports: ImportInfo[]): string[] {
  const moveImports: string[] = [];

  // Check if String type is imported
  const hasStringImport = imports.some(imp =>
    imp.namedImports.includes('String')
  );

  if (hasStringImport) {
    moveImports.push("use std::string::{Self};");
  }

  return moveImports;
}
