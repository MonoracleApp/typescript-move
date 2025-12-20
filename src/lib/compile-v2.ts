import * as yup from "yup";
import chalk from "chalk";
import { filePathSchema } from "../schemas/file-path.schema";
import { formatMoveCode, getSourceFileV2 } from "../utils";
import { generateMoveImports } from "./v2/imports";

export async function compileV2(filePath: string): Promise<void> {
  try {
    await filePathSchema.validate(filePath);
    const { classesJSON, constants, imports } = getSourceFileV2(filePath);

    const moduleName = classesJSON[0].decorators[0].arguments[0]
      .replace(/'/g, "")
      .replace(/"/g, "");
    const packageName = classesJSON[0].name?.toLowerCase();
    const moveImports = generateMoveImports(imports);

    const contract = `
      module ${moduleName}::${packageName} {
        ${moveImports}
      }
    `;

    const formattedCode = formatMoveCode(contract);

    console.log(chalk.cyan("\n" + "=".repeat(60)));
    console.log(chalk.cyan.bold("Generated Move Code:"));
    console.log(chalk.cyan("=".repeat(60) + "\n"));

    const highlightedCode = formattedCode
      .split("\n")
      .map((line) => {
        // Highlight keywords
        return line
          .replace(
            /\b(module|use|public|struct|fun|let|has|key|store)\b/g,
            chalk.blue("$1")
          )
          .replace(/\b(Self|String|UID)\b/g, chalk.yellow("$1"))
          .replace(/(::|->)/g, chalk.gray("$1"))
          .replace(/(\/\/.*$)/gm, chalk.green("$1")); // Comments
      })
      .join("\n");

    console.log(highlightedCode);
    console.log(chalk.cyan("\n" + "=".repeat(60) + "\n"));

    // console.log(moduleName);
    // console.log(classesJSON);
    // TODO: Implement compilation logic
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.log(chalk.red.bold(`Error: ${error.message}`));
      console.log("Usage: demo-app --compile <file-path>");
      console.log("Example: demo-app --compile ./path/to/file.sui.ts");
    } else {
      console.log(chalk.red.bold("An unexpected error occurred:"), error);
    }
    process.exit(1);
  }
}
