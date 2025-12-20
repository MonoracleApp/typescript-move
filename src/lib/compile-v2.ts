import * as yup from "yup";
import chalk from "chalk";
import { filePathSchema } from "../schemas/file-path.schema";
import { getSourceFile } from "../utils";

export async function compileV2(filePath: string): Promise<void> {
  try {
    await filePathSchema.validate(filePath);
    const { classesJSON, constants } = getSourceFile(filePath);

    const moduleName = classesJSON[0].decorators[0].arguments[0].replace(
      /'/g,
      ""
    );
    console.log(moduleName);
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
