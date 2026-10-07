import { checkbox, confirm, input } from "@inquirer/prompts";
import { PREDEFINED_ROLES, ProjectConfig } from "./types";

export async function collectUserInput(
  projectNameArg?: string
): Promise<ProjectConfig> {
  // ─── Project Name ───
  const projectName =
    projectNameArg ||
    (await input({
      message: "📁 What is your project name?",
      default: "my-role-app",
      validate: (value: string) => {
        if (!value.trim()) return "Project name is required";
        if (!/^[a-zA-Z0-9_-]+$/.test(value))
          return "Project name can only contain letters, numbers, hyphens, and underscores";
        return true;
      },
    }));

  // ─── Select Predefined Roles ───
  const predefinedRoleNames = Object.keys(PREDEFINED_ROLES);
  const selectedRoles = await checkbox({
    message: "🎭 Which roles do you need? (Space to select, Enter to confirm)",
    choices: predefinedRoleNames.map((role) => ({
      name: `${role} — ${PREDEFINED_ROLES[role].description}`,
      value: role,
      checked: role === "admin",
    })),
  });

  // ─── Custom Roles ───
  let customRoles: string[] = [];
  const wantCustomRoles = await confirm({
    message: "➕ Do you want to add custom roles?",
    default: false,
  });

  if (wantCustomRoles) {
    const customRolesInput = await input({
      message:
        '✏️  Enter custom role names (comma separated, e.g. "hr, accountant, sales"):',
      validate: (value: string) => {
        if (!value.trim()) return "Please enter at least one role name";
        return true;
      },
    });

    customRoles = customRolesInput
      .split(",")
      .map((r) => r.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter((r) => r.length > 0);
  }

  // ─── TypeScript ───
  const typescript = await confirm({
    message: "📘 Use TypeScript?",
    default: true,
  });

  // ─── Redux Toolkit ───
  const redux = await confirm({
    message: "🔄 Use Redux Toolkit?",
    default: true,
  });

  // ─── RTK Query ───
  let rtkQuery = false;
  if (redux) {
    rtkQuery = await confirm({
      message: "🌐 Use RTK Query for API calls?",
      default: true,
    });
  }

  // ─── Tailwind CSS ───
  const tailwind = await confirm({
    message: "🎨 Use Tailwind CSS?",
    default: true,
  });

  return {
    projectName,
    roles: selectedRoles,
    typescript,
    redux,
    rtkQuery,
    tailwind,
    customRoles,
  };
}
