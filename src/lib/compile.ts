import * as yup from "yup";
import chalk from "chalk";
import { filePathSchema } from "../schemas/file-path.schema";
import { formatMoveCode, getSourceFile, parseObjectString } from "../utils";
import { handleStructs } from "../utils/structs";
import { handleWriteMethods } from "../utils/write-methods";
import { handleExecMethods } from "../utils/exec-methods";
import { handleVectorMethods } from "../utils/vector-methods";

export async function compile(filePath: string): Promise<void> {
  try {
    await filePathSchema.validate(filePath);
    const classesJSON = getSourceFile(filePath);

    const moduleName = classesJSON[0].decorators[0].arguments[0].replace(
      /'/g,
      ""
    );
    const packageName = classesJSON[0].name?.toLowerCase();
    
    

    const { 
      STRUCTS, 
      USE,
      vectorValues,
      writeValues,
    } = handleStructs(classesJSON[0].properties);

    
    const WRITE_METHODS = handleWriteMethods(
      classesJSON[0].methods,
      writeValues
    );
    const VECTOR_METHODS = handleVectorMethods(classesJSON[0].methods, vectorValues)
    const EXEC_METHODS = handleExecMethods(classesJSON[0].methods.filter(x => x.decorators.length === 0))

    // Build the complete Move module
    const moveModule = `module ${moduleName}::${packageName} {
  
  // USE
  ${USE}

  // STRUCTS
  ${STRUCTS}

  // WRITE METHODS
  ${WRITE_METHODS}

  // VECTOR METHODS
  ${VECTOR_METHODS}

  // CUSTOM METHODS
  ${EXEC_METHODS}
}`;
    const formattedCode = formatMoveCode(moveModule);

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
