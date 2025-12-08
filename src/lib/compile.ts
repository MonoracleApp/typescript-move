import * as yup from "yup";
import chalk from "chalk";
import { filePathSchema } from "../schemas/file-path.schema";
import { formatMoveCode, getSourceFile } from "../utils";
import { handleStructs } from "../utils/structs";
import { handleWriteMethods } from "../utils/write-methods";
import { handleExecMethods } from "../utils/exec-methods";
import { handleVectorMethods } from "../utils/vector-methods";
import { handleContractBalance } from "../utils/contract-balance";
import { handleNftMethods } from "../utils/nft-methods";
import { handleErrorCodes } from "../utils/error-codes";

export async function compile(filePath: string): Promise<void> {
  try {
    await filePathSchema.validate(filePath);
    const { classesJSON, constants } = getSourceFile(filePath);

    const moduleName = classesJSON[0].decorators[0].arguments[0].replace(
      /'/g,
      ""
    );
    const packageName = classesJSON[0].name?.toLowerCase();
    
    const {BALANCE_METHODS, USE: BALANCE_USES} = handleContractBalance(classesJSON[0].properties)
    const ERROR_CODES = handleErrorCodes(classesJSON[0].methods, classesJSON[0].properties)
    const { 
      STRUCTS, 
      USE: STRUCT_USES,
      vectorValues,
      writeValues,
    } = handleStructs(classesJSON[0].properties);
    return
    const {WRITE_METHODS} = handleWriteMethods(
      classesJSON[0].methods,
      writeValues,
      constants
    );
    const VECTOR_METHODS = handleVectorMethods(classesJSON[0].properties)
    const {NFT_METHODS, USE: NFT_USES, INIT: NFT_INITS} = handleNftMethods(classesJSON[0].methods, writeValues, constants)
    const EXEC_METHODS = handleExecMethods(classesJSON[0].methods, constants)
    const INITS = NFT_INITS ? `
      fun init(otw: ${packageName?.toUpperCase()}, ctx: &mut TxContext) {
         let publisher = package::claim(otw, ctx);
        ${NFT_INITS}
      }
    ` : ''
    // Build the complete Move module
    const moveModule = `module ${moduleName}::${packageName} {
  
  // === Imports ===
  ${STRUCT_USES}
  // One-Time Witness for the module
  public struct ${packageName?.toUpperCase()} has drop {}
  ${NFT_USES}
  ${BALANCE_USES}
  // === Errors ===
  ${ERROR_CODES}
  // === Structs ===
  ${STRUCTS}
  // === Init ===
  ${INITS}
  // === Public Functions ===
  ${WRITE_METHODS}
  ${VECTOR_METHODS}
  ${EXEC_METHODS}
  // === NFT Functions ===
  ${NFT_METHODS}
  // === Balance Functions ===
  ${BALANCE_METHODS}
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
