export interface ProjectConfig {
  projectName: string;
  roles: string[];
  typescript: boolean;
  redux: boolean;
  rtkQuery: boolean;
  tailwind: boolean;
  customRoles: string[];
}

export interface RoleRouteConfig {
  [roleName: string]: {
    routes: string[];
    description?: string;
  };
}

export const PREDEFINED_ROLES: RoleRouteConfig = {
  admin: {
    routes: ["dashboard", "users", "settings", "analytics"],
    description: "Full system access with user management",
  },
  customer: {
    routes: ["dashboard", "orders", "profile", "support"],
    description: "Customer portal with order tracking",
  },
  worker: {
    routes: ["dashboard", "tasks", "schedule", "reports"],
    description: "Worker portal with task management",
  },
  manager: {
    routes: ["dashboard", "team", "reports", "approvals"],
    description: "Management portal with team oversight",
  },
  vendor: {
    routes: ["dashboard", "products", "orders", "inventory"],
    description: "Vendor portal with product management",
  },
  editor: {
    routes: ["dashboard", "content", "media", "drafts"],
    description: "Content editor with publishing tools",
  },
  moderator: {
    routes: ["dashboard", "reviews", "reports", "flags"],
    description: "Moderation panel with review tools",
  },
};

export const DEFAULT_CUSTOM_ROLE_ROUTES = ["dashboard"];
