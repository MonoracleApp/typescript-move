import chalk from "chalk";
import fs from "node:fs";
import { Project } from "ts-morph";

export function parseObjectString(
  objectString: string
): Record<string, string> {
  const parsedObject: Record<string, string> = {};

  try {
    const cleanedString = objectString
      .replace(/\s+/g, " ") 
      .trim();

    const keyValuePattern = /(\w+):\s*([^,}]+)/g;
    let match;

    while ((match = keyValuePattern.exec(cleanedString)) !== null) {
      const key = match[1].trim();
      const value = match[2].trim();
      parsedObject[key] = value;
    }
  } catch (e) {
    console.log(chalk.red.bold("Parse error:"), e);
  }

  return parsedObject;
}

export function getSourceFile(filePath: string) {
  const project = new Project();

  const sourceFile = project.createSourceFile(
    "Contract.ts",
    fs.readFileSync(filePath, "utf-8")
  );

  const constants: Record<string, string> = {};
  sourceFile.getVariableDeclarations().forEach((v) => {
    const value = v.getInitializer()?.getText();
    if (value) {
      constants[v.getName()] = value;
    }
  });

  const classesJSON = sourceFile.getClasses().map((cls) => ({
    name: cls.getName(),
    decorators: cls.getDecorators().map((d) => ({
      name: d.getName(),
      arguments: d.getArguments().map((arg) => arg.getText()),
    })),
    properties: cls.getProperties().map((p) => {
      const type = p.getType();
      const typeText = type.getText();

      let typeDetails = null;
      if (type.isObject() && typeText.startsWith("{")) {
        const properties = type.getProperties();
        typeDetails = properties.map((prop) => ({
          name: prop.getName(),
          type: prop.getValueDeclaration()?.getType().getText() || "unknown",
        }));
      }

      return {
        name: p.getName(),
        type: typeText,
        typeDetails: typeDetails,
        defaultValue: p.getInitializer()?.getText() || null,
        decorators: p.getDecorators().map((d) => ({
          name: d.getName(),
          arguments: d.getArguments().map((arg) => arg.getText()),
        })),
      };
    }),
    constructors: cls.getConstructors().map((c) => ({
      parameters: c.getParameters().map((p) => ({
        name: p.getName(),
        type: p.getType().getText(),
      })),
    })),

    methods: cls.getMethods().map((m) => ({
      name: m.getName(),
      returnType: m.getReturnType().getText(),
      parameters: m.getParameters().map((p) => ({
        name: p.getName(),
        type: p.getType().getText(),
      })),
      decorators: m.getDecorators().map((d) => ({
        name: d.getName(),
        arguments: d.getArguments().map((arg) => arg.getText()),
      })),
      body: m.getBody()?.getText().replace(/\n\s*/g, " ").trim() || null,
    })),
  }));

  return { classesJSON, constants };
}

export function formatMoveCode(code: string): string {
  const lines = code.split('\n');
  let indentLevel = 0;
  const formattedLines: string[] = [];

  for (let line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue; // Skip empty lines

    // Decrease indent for closing braces
    if (trimmedLine === '}' || trimmedLine.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add proper indentation
    const indentedLine = '  '.repeat(indentLevel) + trimmedLine;
    formattedLines.push(indentedLine);

    // Increase indent after opening braces
    if (trimmedLine.endsWith('{')) {
      indentLevel++;
    }
  }

  return formattedLines.join('\n');
}

export function parseStringArray(arrayString: string): string[] {
  // Check if the input is already an array
  if (Array.isArray(arrayString)) {
    return arrayString;
  }

  // If it's not a string, return empty array
  if (typeof arrayString !== 'string') {
    return [];
  }

  // Remove leading/trailing whitespace
  const trimmed = arrayString.trim();

  // Check if it looks like an array
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
    return [];
  }

  try {
    // Remove the brackets
    const content = trimmed.slice(1, -1);

    // If empty array
    if (!content.trim()) {
      return [];
    }

    // Split by comma and clean each element
    const parsedArray = content.split(',').map(item => {
      // Trim whitespace
      const cleaned = item.trim();
      // Remove surrounding quotes (single or double)
      return cleaned.replace(/^['"]|['"]$/g, '');
    });

    return parsedArray;
  } catch (error) {
    console.error('Error parsing string array:', error);
    return [];
  }
}

export function exec(strings: TemplateStringsArray, ...values: any[]) {}

export interface ParsedAssertion {
  must: string
  code: string
}

export const parseAssertions = (argumentString: string): ParsedAssertion[] => {
  const assertions: ParsedAssertion[] = []

  // {must: ..., code: ...} pattern'lerini bul
  // Parantez içindeki virgülleri de yakala (örn: Assertion.min('message', 5))
  const regex = /\{must:\s*((?:[^,{}]+|\([^)]*\))+),\s*code:\s*([^}]+)\}/g
  let match

  while ((match = regex.exec(argumentString)) !== null) {
    assertions.push({
      must: match[1].trim(),
      code: match[2].trim()
    })
  }

  return assertions
}

export function getSourceFileV2(filePath: string) {
  const project = new Project();

  const sourceFile = project.createSourceFile(
    "Contract.ts",
    fs.readFileSync(filePath, "utf-8")
  );

  const constants: Record<string, string> = {};
  sourceFile.getVariableDeclarations().forEach((v) => {
    const value = v.getInitializer()?.getText();
    if (value) {
      constants[v.getName()] = value;
    }
  });

  // Parse imports
  const imports = sourceFile.getImportDeclarations().map((imp) => {
    const moduleSpecifier = imp.getModuleSpecifierValue();
    const namedImports = imp.getNamedImports().map((ni) => ni.getName());
    const defaultImport = imp.getDefaultImport()?.getText();

    return {
      moduleSpecifier,
      namedImports,
      defaultImport
    };
  });

  const classesJSON = sourceFile.getClasses().map((cls) => ({
    name: cls.getName(),
    decorators: cls.getDecorators().map((d) => ({
      name: d.getName(),
      arguments: d.getArguments().map((arg) => arg.getText()),
    })),
    properties: cls.getProperties().map((p) => {
      const type = p.getType();
      const typeText = type.getText();

      let typeDetails = null;
      if (type.isObject() && typeText.startsWith("{")) {
        const properties = type.getProperties();
        typeDetails = properties.map((prop) => ({
          name: prop.getName(),
          type: prop.getValueDeclaration()?.getType().getText() || "unknown",
        }));
      }

      return {
        name: p.getName(),
        type: typeText,
        typeDetails: typeDetails,
        defaultValue: p.getInitializer()?.getText() || null,
        decorators: p.getDecorators().map((d) => ({
          name: d.getName(),
          arguments: d.getArguments().map((arg) => arg.getText()),
        })),
      };
    }),
    constructors: cls.getConstructors().map((c) => ({
      parameters: c.getParameters().map((p) => ({
        name: p.getName(),
        type: p.getType().getText(),
      })),
    })),

    methods: cls.getMethods().map((m) => ({
      name: m.getName(),
      returnType: m.getReturnType().getText(),
      parameters: m.getParameters().map((p) => ({
        name: p.getName(),
        type: p.getType().getText(),
      })),
      decorators: m.getDecorators().map((d) => ({
        name: d.getName(),
        arguments: d.getArguments().map((arg) => arg.getText()),
      })),
      body: m.getBody()?.getText().replace(/\n\s*/g, " ").trim() || null,
    })),
  }));

  return { classesJSON, constants, imports };
}