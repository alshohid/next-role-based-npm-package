import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import ora from "ora";
import chalk from "chalk";
import {
  ProjectConfig,
  PREDEFINED_ROLES,
  DEFAULT_CUSTOM_ROLE_ROUTES,
} from "./types";
import {
  generateRootLayout,
  generateHomePage,
  generateLoginPage,
  generateRegisterPage,
  generateForgotPasswordPage,
  generateVerifyOtpPage,
  generateRoleLayout,
  generateRoleDashboardPage,
  generateRoleSubPage,
  generateDashboardLayout,
  generateAuthLayout,
  generateUnauthorizedPage,
  generateReduxStore,
  generateReduxHooks,
  generateReduxProvider,
  generateBaseApi,
  generateAuthSlice,
  generateAuthApi,
  generateRolesConstants,
  generateAuthTypes,
  generateCommonTypes,
  generateNavTypes,
  generatePermissions,
  generateMiddleware,
  generateRoleAppConfig,
  generateEnvExample,
  generateGlobalsCss,
  generateRoleGuardComponent,
  generateUseAuthHook,
  generateUtils,
  generateUiButton,
  generateUiCard,
  generateUiInput,
  generateUiDataTable,
  generateLoadingSpinner,
  generateEmptyState,
  generateHeaderComponent,
  generateSidebarComponent,
  generateNavConfig,
  generateSiteConfig,
  generateSocketClient,
  generateSocketEvents,
  generateUseSocketHook,
  generateUseDebounceHook,
} from "./templates";

export class ProjectGenerator {
  private config: ProjectConfig;
  private projectPath: string;

  constructor(config: ProjectConfig) {
    this.config = config;
    this.projectPath = path.resolve(process.cwd(), config.projectName);
  }

  // ─── Main Generate Method ───
  async generate(): Promise<void> {
    console.log("");
    console.log(
      chalk.bold.cyan("🚀 Creating Next Role-Based App: ") +
        chalk.white(this.config.projectName)
    );
    console.log("");

    await this.createNextApp();
    await this.createFolderStructure();
    await this.generateSharedComponentsAndUi();
    await this.generateConfigAndNavSetup();
    await this.generateRealtimeSetup();
    await this.generateRoleStructure();

    if (this.config.redux) {
      await this.generateReduxSetup();
    }

    await this.generateAuthSetup();
    await this.generateMiddlewareFile();
    await this.generateConfigFiles();
    await this.installAdditionalDeps();

    this.printSuccessMessage();
  }

  // ─── Step 1: Create Next.js App ───
  private async createNextApp(): Promise<void> {
    const spinner = ora("Creating Next.js application...").start();

    try {
      // Check if directory exists
      if (await fs.pathExists(this.projectPath)) {
        spinner.fail(`Directory "${this.config.projectName}" already exists!`);
        process.exit(1);
      }

      // Build create-next-app command
      const flags = [
        "--app",
        "--src-dir=false",
        "--import-alias=@/*",
        "--eslint",
        "--no-turbopack",
      ];

      if (this.config.typescript) {
        flags.push("--typescript");
      } else {
        flags.push("--no-typescript");
      }

      if (this.config.tailwind) {
        flags.push("--tailwind");
      } else {
        flags.push("--no-tailwind");
      }

      const cmd = `npx -y create-next-app@latest ${this.config.projectName} ${flags.join(" ")}`;

      execSync(cmd, {
        stdio: "pipe",
        cwd: process.cwd(),
      });

      spinner.succeed("Next.js application created");
    } catch (error: any) {
      spinner.fail("Failed to create Next.js application");
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  }

  // ─── Step 2: Create Base Folder Structure ───
  private async createFolderStructure(): Promise<void> {
    const spinner = ora("Creating scalable feature-based folder structure...").start();

    const dirs = [
      "config",
      "components/ui",
      "components/shared",
      "components/feedback",
      "features/auth/components",
      "features/auth/api",
      "features/auth/slice",
      "features/auth/types",
      "features/user",
      "lib/auth",
      "lib/socket",
      "constants",
      "types",
      "hooks",
      "app/(marketing)",
      "app/(auth)/login",
      "app/(auth)/register",
      "app/(auth)/forgot-password",
      "app/(auth)/verify-otp",
      "app/(dashboard)",
      "app/unauthorized",
    ];

    if (this.config.redux) {
      dirs.push("lib/redux");
      if (this.config.rtkQuery) {
        dirs.push("lib/redux/api");
      }
    }

    for (const dir of dirs) {
      await fs.ensureDir(path.join(this.projectPath, dir));
    }

    spinner.succeed("Scalable folder skeleton created");
  }

  // ─── Step 3: Shared UI & Components ───
  private async generateSharedComponentsAndUi(): Promise<void> {
    const spinner = ora("Creating atomic UI primitives & shared layouts...").start();

    const ext = this.config.typescript ? "ts" : "js";
    const extx = this.config.typescript ? "tsx" : "jsx";

    // lib/utils.ts
    await fs.writeFile(
      path.join(this.projectPath, "lib", `utils.${ext}`),
      generateUtils()
    );

    // UI primitives
    await fs.writeFile(
      path.join(this.projectPath, "components", "ui", `Button.${extx}`),
      generateUiButton()
    );
    await fs.writeFile(
      path.join(this.projectPath, "components", "ui", `Card.${extx}`),
      generateUiCard()
    );
    await fs.writeFile(
      path.join(this.projectPath, "components", "ui", `Input.${extx}`),
      generateUiInput()
    );
    await fs.writeFile(
      path.join(this.projectPath, "components", "ui", `DataTable.${extx}`),
      generateUiDataTable()
    );

    // Feedback components
    await fs.writeFile(
      path.join(this.projectPath, "components", "feedback", `LoadingSpinner.${extx}`),
      generateLoadingSpinner()
    );
    await fs.writeFile(
      path.join(this.projectPath, "components", "feedback", `EmptyState.${extx}`),
      generateEmptyState()
    );

    // Shared Header & Sidebar
    await fs.writeFile(
      path.join(this.projectPath, "components", "shared", `Header.${extx}`),
      generateHeaderComponent(this.config)
    );
    await fs.writeFile(
      path.join(this.projectPath, "components", "shared", `Sidebar.${extx}`),
      generateSidebarComponent(this.config)
    );

    spinner.succeed("Atomic UI primitives & shared layouts created");
  }

  // ─── Step 4: Config & Navigation ───
  private async generateConfigAndNavSetup(): Promise<void> {
    const spinner = ora("Generating central configuration & role navigation...").start();

    const ext = this.config.typescript ? "ts" : "js";

    await fs.writeFile(
      path.join(this.projectPath, "config", `site.${ext}`),
      generateSiteConfig(this.config)
    );
    await fs.writeFile(
      path.join(this.projectPath, "config", `navigation.${ext}`),
      generateNavConfig(this.config)
    );

    if (this.config.typescript) {
      await fs.writeFile(
        path.join(this.projectPath, "types", `common.types.${ext}`),
        generateCommonTypes()
      );
      await fs.writeFile(
        path.join(this.projectPath, "types", `nav.types.${ext}`),
        generateNavTypes()
      );
    }

    spinner.succeed("Central configuration & navigation configured");
  }

  // ─── Step 5: Real-time Socket Setup ───
  private async generateRealtimeSetup(): Promise<void> {
    const spinner = ora("Wiring real-time socket layer & ergonomic hooks...").start();

    const ext = this.config.typescript ? "ts" : "js";

    await fs.writeFile(
      path.join(this.projectPath, "lib", "socket", `socketClient.${ext}`),
      generateSocketClient()
    );
    await fs.writeFile(
      path.join(this.projectPath, "lib", "socket", `socketEvents.${ext}`),
      generateSocketEvents()
    );

    await fs.writeFile(
      path.join(this.projectPath, "hooks", `useSocket.${ext}`),
      generateUseSocketHook()
    );
    await fs.writeFile(
      path.join(this.projectPath, "hooks", `useDebounce.${ext}`),
      generateUseDebounceHook()
    );

    spinner.succeed("Real-time socket layer & hooks ready");
  }

  // ─── Step 6: Generate Role Structure ───
  private async generateRoleStructure(): Promise<void> {
    const spinner = ora("Generating role-based nested layouts & sub-routes...").start();

    const allRoles = [...this.config.roles, ...this.config.customRoles];
    const ext = this.config.typescript ? "tsx" : "jsx";

    for (const role of allRoles) {
      const routes = this.getRoutesForRole(role);

      // Create role directory under (dashboard)
      const roleDashboardPath = path.join(
        this.projectPath,
        "app",
        "(dashboard)",
        role
      );
      await fs.ensureDir(roleDashboardPath);

      // Nested Role Layout with persistent Sidebar & Header
      await fs.writeFile(
        path.join(roleDashboardPath, `layout.${ext}`),
        generateRoleLayout(role, this.config)
      );

      // Create dashboard page for this role
      const dashboardDir = path.join(roleDashboardPath, "dashboard");
      await fs.ensureDir(dashboardDir);
      await fs.writeFile(
        path.join(dashboardDir, `page.${ext}`),
        generateRoleDashboardPage(role, routes)
      );

      // Create sub-pages for each route
      for (const route of routes) {
        if (route === "dashboard") continue;

        const routeDir = path.join(roleDashboardPath, route);
        await fs.ensureDir(routeDir);
        await fs.writeFile(
          path.join(routeDir, `page.${ext}`),
          generateRoleSubPage(role, route)
        );
      }
    }

    // Dashboard group layout
    await fs.writeFile(
      path.join(this.projectPath, "app", "(dashboard)", `layout.${ext}`),
      generateDashboardLayout()
    );

    // Auth group layout
    await fs.writeFile(
      path.join(this.projectPath, "app", "(auth)", `layout.${ext}`),
      generateAuthLayout()
    );

    // Login page
    await fs.writeFile(
      path.join(this.projectPath, "app", "(auth)", "login", `page.${ext}`),
      generateLoginPage(this.config)
    );

    // Register page
    await fs.writeFile(
      path.join(this.projectPath, "app", "(auth)", "register", `page.${ext}`),
      generateRegisterPage(this.config)
    );

    // Forgot password page
    await fs.writeFile(
      path.join(this.projectPath, "app", "(auth)", "forgot-password", `page.${ext}`),
      generateForgotPasswordPage(this.config)
    );

    // Verify OTP page
    await fs.writeFile(
      path.join(this.projectPath, "app", "(auth)", "verify-otp", `page.${ext}`),
      generateVerifyOtpPage(this.config)
    );

    // Unauthorized page
    await fs.writeFile(
      path.join(this.projectPath, "app", "unauthorized", `page.${ext}`),
      generateUnauthorizedPage()
    );

    // Root layout (overwrite)
    await fs.writeFile(
      path.join(this.projectPath, "app", `layout.${ext}`),
      generateRootLayout(this.config)
    );

    // Home page (overwrite)
    await fs.writeFile(
      path.join(this.projectPath, "app", `page.${ext}`),
      generateHomePage(this.config)
    );

    // Globals CSS (overwrite)
    await fs.writeFile(
      path.join(this.projectPath, "app", "globals.css"),
      generateGlobalsCss(this.config)
    );

    spinner.succeed(
      `Role structure generated (${allRoles.length} roles: ${allRoles.join(", ")})`
    );
  }

  // ─── Step 7: Generate Redux Setup ───
  private async generateReduxSetup(): Promise<void> {
    const spinner = ora("Setting up Redux Toolkit & Feature API slicing...").start();

    const ext = this.config.typescript ? "ts" : "js";
    const extx = this.config.typescript ? "tsx" : "jsx";

    // Store
    await fs.writeFile(
      path.join(this.projectPath, "lib", "redux", `store.${ext}`),
      generateReduxStore(this.config)
    );

    // Hooks
    await fs.writeFile(
      path.join(this.projectPath, "lib", "redux", `hooks.${ext}`),
      generateReduxHooks()
    );

    // Provider
    await fs.writeFile(
      path.join(this.projectPath, "lib", "redux", `provider.${extx}`),
      generateReduxProvider()
    );

    // RTK Query Base API
    if (this.config.rtkQuery) {
      await fs.writeFile(
        path.join(this.projectPath, "lib", "redux", "api", `baseApi.${ext}`),
        generateBaseApi()
      );

      // Feature Auth API injection
      await fs.writeFile(
        path.join(this.projectPath, "features", "auth", "api", `authApi.${ext}`),
        generateAuthApi(this.config)
      );
    }

    // Auth Slice
    await fs.writeFile(
      path.join(this.projectPath, "features", "auth", "slice", `authSlice.${ext}`),
      generateAuthSlice(this.config)
    );

    spinner.succeed(
      `Redux Toolkit${this.config.rtkQuery ? " + RTK Query feature injection" : ""} configured`
    );
  }

  // ─── Step 8: Generate Auth Setup ───
  private async generateAuthSetup(): Promise<void> {
    const spinner = ora("Creating RBAC utilities & RoleGuard...").start();

    const ext = this.config.typescript ? "ts" : "js";
    const extx = this.config.typescript ? "tsx" : "jsx";

    // Roles constants
    await fs.writeFile(
      path.join(this.projectPath, "constants", `roles.${ext}`),
      generateRolesConstants(this.config)
    );

    // Auth types
    if (this.config.typescript) {
      const authTypesContent = generateAuthTypes(this.config);
      await fs.writeFile(
        path.join(this.projectPath, "types", `auth.${ext}`),
        authTypesContent
      );
      await fs.writeFile(
        path.join(this.projectPath, "features", "auth", "types", `auth.types.${ext}`),
        `export * from "@/types/auth";\n`
      );
    }

    // Permissions helper
    await fs.writeFile(
      path.join(this.projectPath, "lib", "auth", `permissions.${ext}`),
      generatePermissions()
    );

    // RoleGuard component
    if (this.config.redux) {
      const roleGuardCode = generateRoleGuardComponent();
      await fs.writeFile(
        path.join(this.projectPath, "components", "shared", `RoleGuard.${extx}`),
        roleGuardCode
      );
      // Backwards-compatible import support: '@/components/RoleGuard'
      await fs.writeFile(
        path.join(this.projectPath, "components", `RoleGuard.${extx}`),
        `export * from "./shared/RoleGuard";\n`
      );

      // useAuth hook
      await fs.writeFile(
        path.join(this.projectPath, "hooks", `useAuth.${ext}`),
        generateUseAuthHook()
      );
    }

    spinner.succeed("RBAC utilities & security guards created");
  }

  // ─── Step 9: Generate Middleware ───
  private async generateMiddlewareFile(): Promise<void> {
    const spinner = ora("Creating edge middleware...").start();

    const ext = this.config.typescript ? "ts" : "js";

    await fs.writeFile(
      path.join(this.projectPath, `middleware.${ext}`),
      generateMiddleware(this.config)
    );

    spinner.succeed("Edge middleware created");
  }

  // ─── Step 10: Generate Config Files ───
  private async generateConfigFiles(): Promise<void> {
    const spinner = ora("Creating project configuration files...").start();

    const ext = this.config.typescript ? "ts" : "js";

    // Role app config
    await fs.writeFile(
      path.join(this.projectPath, `role-app.config.${ext}`),
      generateRoleAppConfig(this.config)
    );

    // Environment example
    await fs.writeFile(
      path.join(this.projectPath, ".env.example"),
      generateEnvExample()
    );

    // .env.local
    await fs.writeFile(
      path.join(this.projectPath, ".env.local"),
      generateEnvExample()
    );

    spinner.succeed("Configuration files created");
  }

  // ─── Step 11: Install Additional Dependencies ───
  private async installAdditionalDeps(): Promise<void> {
    const spinner = ora("Installing additional dependencies...").start();

    try {
      const deps: string[] = [];

      if (this.config.redux) {
        deps.push("@reduxjs/toolkit", "react-redux");
      }

      if (deps.length > 0) {
        execSync(`npm install ${deps.join(" ")}`, {
          stdio: "pipe",
          cwd: this.projectPath,
        });
      }

      spinner.succeed("Additional dependencies installed");
    } catch (error: any) {
      spinner.warn("Failed to install some dependencies. Run npm install manually.");
    }
  }

  // ─── Helper: Get Routes for a Role ───
  private getRoutesForRole(role: string): string[] {
    if (PREDEFINED_ROLES[role]) {
      return PREDEFINED_ROLES[role].routes;
    }
    return DEFAULT_CUSTOM_ROLE_ROUTES;
  }

  // ─── Print Success Message ───
  private printSuccessMessage(): void {
    const allRoles = [...this.config.roles, ...this.config.customRoles];

    console.log("");
    console.log(chalk.green.bold("🎉 Enterprise Next.js Role-Based App created successfully!"));
    console.log("");
    console.log(chalk.white("  Project:      ") + chalk.cyan(this.config.projectName));
    console.log(
      chalk.white("  Roles:        ") + chalk.yellow(allRoles.join(", "))
    );
    console.log(
      chalk.white("  Architecture: ") + chalk.magenta("Feature-Driven Modular Hybrid Structure")
    );
    console.log(
      chalk.white("  Stack:        ") +
        [
          "Next.js 16",
          this.config.typescript ? "TypeScript" : "JavaScript",
          this.config.tailwind ? "Tailwind CSS" : null,
          this.config.redux ? "Redux Toolkit" : null,
          this.config.rtkQuery ? "RTK Query" : null,
          "Socket.io Ready",
        ]
          .filter(Boolean)
          .join(", ")
    );
    console.log("");
    console.log(chalk.white("  Get started:"));
    console.log("");
    console.log(chalk.cyan(`    cd ${this.config.projectName}`));
    console.log(chalk.cyan("    npm run dev"));
    console.log("");
    console.log(chalk.white("  Role Dashboards (Isolated Nested Layouts):"));
    console.log("");

    for (const role of allRoles) {
      console.log(chalk.gray(`    /${role}/dashboard`));
    }

    console.log("");
    console.log(
      chalk.gray(
        "  Customize navigation in config/navigation.ts and roles in constants/roles.ts"
      )
    );
    console.log("");
  }
}
