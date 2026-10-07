#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { collectUserInput } from "./prompts";
import { ProjectGenerator } from "./generator";

const program = new Command();

// ─── ASCII Banner ───
function printBanner(): void {
  console.log("");
  console.log(
    chalk.cyan.bold(
      "╔══════════════════════════════════════════════╗"
    )
  );
  console.log(
    chalk.cyan.bold(
      "║                                              ║"
    )
  );
  console.log(
    chalk.cyan.bold("║") +
      chalk.white.bold("     🚀 Create Next Role App                ") +
      chalk.cyan.bold("║")
  );
  console.log(
    chalk.cyan.bold("║") +
      chalk.gray("     Role-based Next.js Project Generator    ") +
      chalk.cyan.bold("║")
  );
  console.log(
    chalk.cyan.bold(
      "║                                              ║"
    )
  );
  console.log(
    chalk.cyan.bold(
      "╚══════════════════════════════════════════════╝"
    )
  );
  console.log("");
}

// ─── Main Command ───
program
  .name("create-next-role-app")
  .description(
    "Create a Next.js project with role-based folder structure, Redux Toolkit, and RBAC utilities"
  )
  .version("1.0.0")
  .argument("[project-name]", "Name of the project to create")
  .action(async (projectName?: string) => {
    try {
      printBanner();

      // Collect user configuration through interactive prompts
      const config = await collectUserInput(projectName);

      // Generate the project
      const generator = new ProjectGenerator(config);
      await generator.generate();
    } catch (error: any) {
      if (error.message?.includes("User force closed")) {
        console.log("");
        console.log(chalk.yellow("👋 Cancelled. See you next time!"));
        process.exit(0);
      }

      console.error(chalk.red("\n❌ Error: ") + error.message);
      process.exit(1);
    }
  });

program.parse();
