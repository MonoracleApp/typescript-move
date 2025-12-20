#!/usr/bin/env node
import { showHelp } from "./lib/show-help";
import { showVersion } from "./lib/show-version";
import { compile } from "./lib/compile";
import { create } from "./lib/create";
import { compileV2 } from "./lib/compile-v2";

/**
 * Main CLI entry point
 */
export class CLI {
  private args: string[];

  constructor(args: string[] = process.argv.slice(2)) {
    this.args = args;
  }

  /**
   * Run the CLI application
   */
  public async run(): Promise<void> {
    if (this.args.length === 0) {
      showHelp();
      return;
    }

    const command = this.args[0];

    switch (command) {
      case "--help":
      case "-h":
        showHelp();
        break;
      case "--version":
      case "-v":
        showVersion();
        break;
      case "--compileV2":
      case "-cV2":
        await compileV2(this.args[1]);
        break;
      case "--compile":
      case "-c":
        const filePath = this.args[1];
        await compile(filePath);
        break;
      case "--create":
      case "-cr":
        await create();
        break;
      default:
        console.log(`Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  const cli = new CLI();
  cli.run().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
