#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_commander = require("commander");
var import_chalk2 = __toESM(require("chalk"));

// src/prompts.ts
var import_prompts = require("@inquirer/prompts");

// src/types.ts
var PREDEFINED_ROLES = {
  admin: {
    routes: ["dashboard", "users", "settings", "analytics"],
    description: "Full system access with user management"
  },
  customer: {
    routes: ["dashboard", "orders", "profile", "support"],
    description: "Customer portal with order tracking"
  },
  worker: {
    routes: ["dashboard", "tasks", "schedule", "reports"],
    description: "Worker portal with task management"
  },
  manager: {
    routes: ["dashboard", "team", "reports", "approvals"],
    description: "Management portal with team oversight"
  },
  vendor: {
    routes: ["dashboard", "products", "orders", "inventory"],
    description: "Vendor portal with product management"
  },
  editor: {
    routes: ["dashboard", "content", "media", "drafts"],
    description: "Content editor with publishing tools"
  },
  moderator: {
    routes: ["dashboard", "reviews", "reports", "flags"],
    description: "Moderation panel with review tools"
  }
};
var DEFAULT_CUSTOM_ROLE_ROUTES = ["dashboard"];

// src/prompts.ts
async function collectUserInput(projectNameArg) {
  const projectName = projectNameArg || await (0, import_prompts.input)({
    message: "\u{1F4C1} What is your project name?",
    default: "my-role-app",
    validate: (value) => {
      if (!value.trim()) return "Project name is required";
      if (!/^[a-zA-Z0-9_-]+$/.test(value))
        return "Project name can only contain letters, numbers, hyphens, and underscores";
      return true;
    }
  });
  const predefinedRoleNames = Object.keys(PREDEFINED_ROLES);
  const selectedRoles = await (0, import_prompts.checkbox)({
    message: "\u{1F3AD} Which roles do you need? (Space to select, Enter to confirm)",
    choices: predefinedRoleNames.map((role) => ({
      name: `${role} \u2014 ${PREDEFINED_ROLES[role].description}`,
      value: role,
      checked: role === "admin"
    }))
  });
  let customRoles = [];
  const wantCustomRoles = await (0, import_prompts.confirm)({
    message: "\u2795 Do you want to add custom roles?",
    default: false
  });
  if (wantCustomRoles) {
    const customRolesInput = await (0, import_prompts.input)({
      message: '\u270F\uFE0F  Enter custom role names (comma separated, e.g. "hr, accountant, sales"):',
      validate: (value) => {
        if (!value.trim()) return "Please enter at least one role name";
        return true;
      }
    });
    customRoles = customRolesInput.split(",").map((r) => r.trim().toLowerCase().replace(/\s+/g, "-")).filter((r) => r.length > 0);
  }
  const typescript = await (0, import_prompts.confirm)({
    message: "\u{1F4D8} Use TypeScript?",
    default: true
  });
  const redux = await (0, import_prompts.confirm)({
    message: "\u{1F504} Use Redux Toolkit?",
    default: true
  });
  let rtkQuery = false;
  if (redux) {
    rtkQuery = await (0, import_prompts.confirm)({
      message: "\u{1F310} Use RTK Query for API calls?",
      default: true
    });
  }
  const tailwind = await (0, import_prompts.confirm)({
    message: "\u{1F3A8} Use Tailwind CSS?",
    default: true
  });
  return {
    projectName,
    roles: selectedRoles,
    typescript,
    redux,
    rtkQuery,
    tailwind,
    customRoles
  };
}

// src/generator.ts
var import_fs_extra = __toESM(require("fs-extra"));
var import_path = __toESM(require("path"));
var import_child_process = require("child_process");
var import_ora = __toESM(require("ora"));
var import_chalk = __toESM(require("chalk"));

// src/templates.ts
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function pascalCase(str) {
  return str.split(/[-_]/).map((s) => capitalize(s)).join("");
}
function generateRootLayout(config) {
  const ext = config.typescript ? "tsx" : "jsx";
  const reduxImport = config.redux ? `import { ReduxProvider } from "@/lib/redux/provider";
` : "";
  const bodyContent = config.redux ? `        <ReduxProvider>
          {children}
        </ReduxProvider>` : `        {children}`;
  return `${reduxImport}import type { Metadata } from "next";
${config.tailwind ? `import "./globals.css";
` : ""}
export const metadata: Metadata = {
  title: "${config.projectName}",
  description: "Role-based Next.js application powered by create-next-role-app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
${bodyContent}
      </body>
    </html>
  );
}
`;
}
function generateHomePage(config) {
  const allRoles = [...config.roles, ...config.customRoles];
  return `import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          ${config.projectName}
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Role-based Next.js application with ${allRoles.length} roles configured.
          Built with create-next-role-app.
        </p>

        <div className="flex flex-col gap-4 mt-8">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-3">
          {${JSON.stringify(allRoles)}.map((role) => (
            <Link
              key={role}
              href={\`/\${role}/dashboard\`}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm capitalize transition-colors duration-200 border border-gray-700"
            >
              {role} Dashboard
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
`;
}
function generateLoginPage(config) {
  return `"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement your authentication logic here
    // Example: call your auth API, verify credentials, get user roles
    // Then redirect based on role:
    // router.push("/admin/dashboard");

    console.log("Login attempt:", { email, password });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
`;
}
function generateRegisterPage(config) {
  return `"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement your registration logic here
    console.log("Register attempt:", formData);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">Get started with your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
`;
}
function generateRoleDashboardPage(roleName, routes) {
  const displayName = pascalCase(roleName);
  return `import Link from "next/link";

export default function ${displayName}Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">
            <span className="text-blue-400">${displayName}</span> Dashboard
          </h1>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
              Home
            </Link>
            <button className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg text-sm transition-colors">
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-65px)] bg-gray-800/30 border-r border-gray-700 p-4">
          <nav className="space-y-1">
            ${routes.map(
    (route) => `<Link
              href="/${roleName}/${route}"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
            >
              <span className="capitalize">${route}</span>
            </Link>`
  ).join("\n            ")}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">
              Welcome to ${displayName} Dashboard
            </h2>
            <p className="text-gray-400 mb-8">
              Manage your ${roleName} activities and resources from here.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Users", value: "1,234", change: "+12%" },
                { label: "Active Sessions", value: "56", change: "+5%" },
                { label: "Tasks Pending", value: "23", change: "-3%" },
                { label: "Completion Rate", value: "89%", change: "+7%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6"
                >
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-green-400 text-sm mt-1">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-${Math.min(routes.length, 4)} gap-3">
                ${routes.map(
    (route) => `<Link
                  href="/${roleName}/${route}"
                  className="px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-center capitalize transition-colors"
                >
                  ${route}
                </Link>`
  ).join("\n                ")}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
`;
}
function generateRoleSubPage(roleName, routeName) {
  const displayRole = pascalCase(roleName);
  const displayRoute = pascalCase(routeName);
  return `import Link from "next/link";

export default function ${displayRole}${displayRoute}Page() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/${roleName}/dashboard" className="text-gray-400 hover:text-white transition-colors">
              \u2190 Back
            </Link>
            <h1 className="text-xl font-bold">
              <span className="text-blue-400">${displayRole}</span> / ${displayRoute}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-2">${displayRoute}</h2>
        <p className="text-gray-400 mb-8">
          Manage ${routeName} for the ${roleName} role.
        </p>

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-8 text-center">
          <p className="text-gray-500 text-lg">
            \u{1F6A7} This page is ready for your implementation.
          </p>
          <p className="text-gray-600 mt-2">
            Start building the ${routeName} feature for ${roleName} role here.
          </p>
        </div>
      </main>
    </div>
  );
}
`;
}
function generateDashboardLayout() {
  return `export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
`;
}
function generateAuthLayout() {
  return `export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
`;
}
function generateUnauthorizedPage() {
  return `import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="text-center space-y-6 p-8">
        <div className="text-6xl">\u{1F6AB}</div>
        <h1 className="text-4xl font-bold text-red-400">Unauthorized</h1>
        <p className="text-gray-400 max-w-md">
          You don&apos;t have permission to access this page.
          Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
`;
}
function generateReduxStore(config) {
  if (!config.rtkQuery) {
    return `import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`;
  }
  return `import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authReducer from "@/features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`;
}
function generateReduxHooks() {
  return `import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
`;
}
function generateReduxProvider() {
  return `"use client";

import { Provider } from "react-redux";
import { store } from "./store";

export function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
`;
}
function generateBaseApi() {
  return `import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    prepareHeaders: (headers) => {
      // TODO: Add your auth token here
      // const token = getToken();
      // if (token) {
      //   headers.set("authorization", \`Bearer \${token}\`);
      // }
      return headers;
    },
  }),
  tagTypes: ["User", "Auth"],
  endpoints: () => ({}),
});
`;
}
function generateAuthSlice(config) {
  const allRoles = [...config.roles, ...config.customRoles];
  return `import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
`;
}
function generateRolesConstants(config) {
  const allRoles = [...config.roles, ...config.customRoles];
  const rolesObject = allRoles.map((role) => {
    const key = role.toUpperCase().replace(/-/g, "_");
    return `  ${key}: "${role}"`;
  }).join(",\n");
  return `export const ROLES = {
${rolesObject},
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES: Role[] = Object.values(ROLES);
`;
}
function generateAuthTypes(config) {
  return `import type { Role } from "@/constants/roles";

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
`;
}
function generatePermissions() {
  return `import type { Role } from "@/constants/roles";

/**
 * Check if user has a specific role
 */
export function hasRole(userRoles: Role[], requiredRole: Role): boolean {
  return userRoles.includes(requiredRole);
}

/**
 * Check if user has ANY of the required roles
 */
export function hasAnyRole(userRoles: Role[], requiredRoles: Role[]): boolean {
  return requiredRoles.some((role) => userRoles.includes(role));
}

/**
 * Check if user has ALL of the required roles
 */
export function hasAllRoles(userRoles: Role[], requiredRoles: Role[]): boolean {
  return requiredRoles.every((role) => userRoles.includes(role));
}

/**
 * Get the highest priority role from user's roles
 * Priority is based on the order in the roles array (first = highest)
 */
export function getHighestRole(
  userRoles: Role[],
  rolePriority: Role[]
): Role | null {
  for (const role of rolePriority) {
    if (userRoles.includes(role)) {
      return role;
    }
  }
  return null;
}

/**
 * Get the default redirect path based on user's role
 */
export function getRoleRedirectPath(role: Role): string {
  return \`/\${role}/dashboard\`;
}
`;
}
function generateMiddleware(config) {
  const allRoles = [...config.roles, ...config.customRoles];
  const roleMatchers = allRoles.map(
    (role) => `  if (pathname.startsWith("/${role}")) {
    // TODO: Verify user has "${role}" role from your auth system
    // const userRoles = getUserRolesFromToken(request);
    // if (!userRoles.includes("${role}")) {
    //   return NextResponse.redirect(new URL("/unauthorized", request.url));
    // }
  }`
  ).join("\n\n");
  return `import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const protectedRoutes = [${allRoles.map((r) => `"/${r}"`).join(", ")}];

// Public routes that don't require authentication
const publicRoutes = ["/", "/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // TODO: Implement your authentication check here
    // Example with JWT cookie:
    // const token = request.cookies.get("token")?.value;
    // if (!token) {
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }

    // Role-based route protection
${roleMatchers}
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\\\..*$).*)",
  ],
};
`;
}
function generateRoleAppConfig(config) {
  const allRoles = [...config.roles, ...config.customRoles];
  return `const roleAppConfig = {
  roles: ${JSON.stringify(allRoles, null, 4)},

  defaultRole: "${allRoles[0] || "admin"}",

  auth: {
    enabled: true,
    loginPath: "/login",
    registerPath: "/register",
    unauthorizedPath: "/unauthorized",
  },

  redux: {
    enabled: ${config.redux},
    rtkQuery: ${config.rtkQuery},
  },

  tailwind: ${config.tailwind},
};

export default roleAppConfig;
`;
}
function generateEnvExample() {
  return `# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Authentication
JWT_SECRET=your-jwt-secret-key-here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Database (optional)
DATABASE_URL=your-database-url-here
`;
}
function generateGlobalsCss(config) {
  if (config.tailwind) {
    return `@import "tailwindcss";
`;
  }
  return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
  --accent: #3b82f6;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
`;
}
function generateRoleGuardComponent() {
  return `"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { hasAnyRole } from "@/lib/auth/permissions";
import type { Role } from "@/constants/roles";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * RoleGuard component \u2014 wraps content that should only be visible
 * to users with specific roles.
 *
 * Usage:
 * <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
 *   <AdminContent />
 * </RoleGuard>
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
  redirectTo,
}: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirectTo) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  if (!hasAnyRole(user.roles, allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
`;
}
function generateUseAuthHook() {
  return `"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setUser, clearUser, setLoading } from "@/features/auth/authSlice";
import { hasRole, hasAnyRole, getRoleRedirectPath } from "@/lib/auth/permissions";
import type { User } from "@/types/auth";
import type { Role } from "@/constants/roles";

/**
 * Custom hook for authentication and role management.
 * Provides utilities for login, logout, and role checking.
 *
 * Usage:
 * const { user, isAdmin, login, logout, checkRole } = useAuth();
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );

  const login = useCallback(
    (userData: User) => {
      dispatch(setUser(userData));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(clearUser());
    // TODO: Add your logout logic (clear cookies, tokens, etc.)
  }, [dispatch]);

  const checkRole = useCallback(
    (role: Role): boolean => {
      if (!user) return false;
      return hasRole(user.roles, role);
    },
    [user]
  );

  const checkAnyRole = useCallback(
    (roles: Role[]): boolean => {
      if (!user) return false;
      return hasAnyRole(user.roles, roles);
    },
    [user]
  );

  const getRedirectPath = useCallback((): string => {
    if (!user || user.roles.length === 0) return "/login";
    return getRoleRedirectPath(user.roles[0]);
  }, [user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkRole,
    checkAnyRole,
    getRedirectPath,
  };
}
`;
}

// src/generator.ts
var ProjectGenerator = class {
  constructor(config) {
    this.config = config;
    this.projectPath = import_path.default.resolve(process.cwd(), config.projectName);
  }
  // ─── Main Generate Method ───
  async generate() {
    console.log("");
    console.log(
      import_chalk.default.bold.cyan("\u{1F680} Creating Next Role App: ") + import_chalk.default.white(this.config.projectName)
    );
    console.log("");
    await this.createNextApp();
    await this.createFolderStructure();
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
  async createNextApp() {
    const spinner = (0, import_ora.default)("Creating Next.js application...").start();
    try {
      if (await import_fs_extra.default.pathExists(this.projectPath)) {
        spinner.fail(`Directory "${this.config.projectName}" already exists!`);
        process.exit(1);
      }
      const flags = [
        "--app",
        "--src-dir=false",
        "--import-alias=@/*",
        "--eslint",
        "--no-turbopack"
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
      (0, import_child_process.execSync)(cmd, {
        stdio: "pipe",
        cwd: process.cwd()
      });
      spinner.succeed("Next.js application created");
    } catch (error) {
      spinner.fail("Failed to create Next.js application");
      console.error(import_chalk.default.red(error.message));
      process.exit(1);
    }
  }
  // ─── Step 2: Create Base Folder Structure ───
  async createFolderStructure() {
    const spinner = (0, import_ora.default)("Creating folder structure...").start();
    const dirs = [
      "components",
      "features/auth",
      "features/user",
      "lib/auth",
      "constants",
      "types",
      "app/(auth)/login",
      "app/(auth)/register",
      "app/(dashboard)",
      "app/unauthorized"
    ];
    if (this.config.redux) {
      dirs.push("lib/redux");
      if (this.config.rtkQuery) {
        dirs.push("lib/redux/api");
      }
    }
    dirs.push("hooks");
    for (const dir of dirs) {
      await import_fs_extra.default.ensureDir(import_path.default.join(this.projectPath, dir));
    }
    spinner.succeed("Folder structure created");
  }
  // ─── Step 3: Generate Role Structure ───
  async generateRoleStructure() {
    const spinner = (0, import_ora.default)("Generating role-based routes...").start();
    const allRoles = [...this.config.roles, ...this.config.customRoles];
    const ext = this.config.typescript ? "tsx" : "jsx";
    for (const role of allRoles) {
      const routes = this.getRoutesForRole(role);
      const roleDashboardPath = import_path.default.join(
        this.projectPath,
        "app",
        "(dashboard)",
        role
      );
      await import_fs_extra.default.ensureDir(roleDashboardPath);
      const dashboardDir = import_path.default.join(roleDashboardPath, "dashboard");
      await import_fs_extra.default.ensureDir(dashboardDir);
      await import_fs_extra.default.writeFile(
        import_path.default.join(dashboardDir, `page.${ext}`),
        generateRoleDashboardPage(role, routes)
      );
      for (const route of routes) {
        if (route === "dashboard") continue;
        const routeDir = import_path.default.join(roleDashboardPath, route);
        await import_fs_extra.default.ensureDir(routeDir);
        await import_fs_extra.default.writeFile(
          import_path.default.join(routeDir, `page.${ext}`),
          generateRoleSubPage(role, route)
        );
      }
    }
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, "app", "(dashboard)", `layout.${ext}`),
      generateDashboardLayout()
    );
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, "app", "(auth)", `layout.${ext}`),
      generateAuthLayout()
    );
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, "app", "(auth)", "login", `page.${ext}`),
      generateLoginPage(this.config)
    );
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, "app", "(auth)", "register", `page.${ext}`),
      generateRegisterPage(this.config)
    );
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, "app", "unauthorized", `page.${ext}`),
      generateUnauthorizedPage()
    );
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, "app", `layout.${ext}`),
      generateRootLayout(this.config)
    );
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, "app", `page.${ext}`),
      generateHomePage(this.config)
    );
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, "app", "globals.css"),
      generateGlobalsCss(this.config)
    );
    spinner.succeed(
      `Role structure generated (${allRoles.length} roles: ${allRoles.join(", ")})`
    );
  }
  // ─── Step 4: Generate Redux Setup ───
  async generateReduxSetup() {
    const spinner = (0, import_ora.default)("Setting up Redux Toolkit...").start();
    const ext = this.config.typescript ? "ts" : "js";
    const extx = this.config.typescript ? "tsx" : "jsx";
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, "lib", "redux", `store.${ext}`),
      generateReduxStore(this.config)
    );
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, "lib", "redux", `hooks.${ext}`),
      generateReduxHooks()
    );
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, "lib", "redux", `provider.${extx}`),
      generateReduxProvider()
    );
    if (this.config.rtkQuery) {
      await import_fs_extra.default.writeFile(
        import_path.default.join(this.projectPath, "lib", "redux", "api", `baseApi.${ext}`),
        generateBaseApi()
      );
    }
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, "features", "auth", `authSlice.${ext}`),
      generateAuthSlice(this.config)
    );
    spinner.succeed(
      `Redux Toolkit${this.config.rtkQuery ? " + RTK Query" : ""} configured`
    );
  }
  // ─── Step 5: Generate Auth Setup ───
  async generateAuthSetup() {
    const spinner = (0, import_ora.default)("Creating RBAC utilities...").start();
    const ext = this.config.typescript ? "ts" : "js";
    const extx = this.config.typescript ? "tsx" : "jsx";
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, "constants", `roles.${ext}`),
      generateRolesConstants(this.config)
    );
    if (this.config.typescript) {
      await import_fs_extra.default.writeFile(
        import_path.default.join(this.projectPath, "types", `auth.${ext}`),
        generateAuthTypes(this.config)
      );
    }
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, "lib", "auth", `permissions.${ext}`),
      generatePermissions()
    );
    if (this.config.redux) {
      await import_fs_extra.default.writeFile(
        import_path.default.join(this.projectPath, "components", `RoleGuard.${extx}`),
        generateRoleGuardComponent()
      );
      await import_fs_extra.default.writeFile(
        import_path.default.join(this.projectPath, "hooks", `useAuth.${ext}`),
        generateUseAuthHook()
      );
    }
    spinner.succeed("RBAC utilities created");
  }
  // ─── Step 6: Generate Middleware ───
  async generateMiddlewareFile() {
    const spinner = (0, import_ora.default)("Creating middleware...").start();
    const ext = this.config.typescript ? "ts" : "js";
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, `middleware.${ext}`),
      generateMiddleware(this.config)
    );
    spinner.succeed("Middleware created");
  }
  // ─── Step 7: Generate Config Files ───
  async generateConfigFiles() {
    const spinner = (0, import_ora.default)("Creating configuration files...").start();
    const ext = this.config.typescript ? "ts" : "js";
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, `role-app.config.${ext}`),
      generateRoleAppConfig(this.config)
    );
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, ".env.example"),
      generateEnvExample()
    );
    await import_fs_extra.default.writeFile(
      import_path.default.join(this.projectPath, ".env.local"),
      generateEnvExample()
    );
    spinner.succeed("Configuration files created");
  }
  // ─── Step 8: Install Additional Dependencies ───
  async installAdditionalDeps() {
    const spinner = (0, import_ora.default)("Installing additional dependencies...").start();
    try {
      const deps = [];
      if (this.config.redux) {
        deps.push("@reduxjs/toolkit", "react-redux");
      }
      if (deps.length > 0) {
        (0, import_child_process.execSync)(`npm install ${deps.join(" ")}`, {
          stdio: "pipe",
          cwd: this.projectPath
        });
      }
      spinner.succeed("Additional dependencies installed");
    } catch (error) {
      spinner.warn("Failed to install some dependencies. Run npm install manually.");
    }
  }
  // ─── Helper: Get Routes for a Role ───
  getRoutesForRole(role) {
    if (PREDEFINED_ROLES[role]) {
      return PREDEFINED_ROLES[role].routes;
    }
    return DEFAULT_CUSTOM_ROLE_ROUTES;
  }
  // ─── Print Success Message ───
  printSuccessMessage() {
    const allRoles = [...this.config.roles, ...this.config.customRoles];
    console.log("");
    console.log(import_chalk.default.green.bold("\u{1F389} Project created successfully!"));
    console.log("");
    console.log(import_chalk.default.white("  Project: ") + import_chalk.default.cyan(this.config.projectName));
    console.log(
      import_chalk.default.white("  Roles:   ") + import_chalk.default.yellow(allRoles.join(", "))
    );
    console.log(
      import_chalk.default.white("  Stack:   ") + [
        "Next.js",
        this.config.typescript ? "TypeScript" : "JavaScript",
        this.config.tailwind ? "Tailwind CSS" : null,
        this.config.redux ? "Redux Toolkit" : null,
        this.config.rtkQuery ? "RTK Query" : null
      ].filter(Boolean).join(", ")
    );
    console.log("");
    console.log(import_chalk.default.white("  Get started:"));
    console.log("");
    console.log(import_chalk.default.cyan(`    cd ${this.config.projectName}`));
    console.log(import_chalk.default.cyan("    npm run dev"));
    console.log("");
    console.log(import_chalk.default.white("  Dashboard routes:"));
    console.log("");
    for (const role of allRoles) {
      console.log(import_chalk.default.gray(`    /${role}/dashboard`));
    }
    console.log("");
    console.log(
      import_chalk.default.gray(
        "  Edit role-app.config.ts to customize your role configuration."
      )
    );
    console.log("");
  }
};

// src/index.ts
var program = new import_commander.Command();
function printBanner() {
  console.log("");
  console.log(
    import_chalk2.default.cyan.bold(
      "\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557"
    )
  );
  console.log(
    import_chalk2.default.cyan.bold(
      "\u2551                                              \u2551"
    )
  );
  console.log(
    import_chalk2.default.cyan.bold("\u2551") + import_chalk2.default.white.bold("     \u{1F680} Create Next Role App                ") + import_chalk2.default.cyan.bold("\u2551")
  );
  console.log(
    import_chalk2.default.cyan.bold("\u2551") + import_chalk2.default.gray("     Role-based Next.js Project Generator    ") + import_chalk2.default.cyan.bold("\u2551")
  );
  console.log(
    import_chalk2.default.cyan.bold(
      "\u2551                                              \u2551"
    )
  );
  console.log(
    import_chalk2.default.cyan.bold(
      "\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D"
    )
  );
  console.log("");
}
program.name("create-next-role-app").description(
  "Create a Next.js project with role-based folder structure, Redux Toolkit, and RBAC utilities"
).version("1.0.0").argument("[project-name]", "Name of the project to create").action(async (projectName) => {
  try {
    printBanner();
    const config = await collectUserInput(projectName);
    const generator = new ProjectGenerator(config);
    await generator.generate();
  } catch (error) {
    if (error.message?.includes("User force closed")) {
      console.log("");
      console.log(import_chalk2.default.yellow("\u{1F44B} Cancelled. See you next time!"));
      process.exit(0);
    }
    console.error(import_chalk2.default.red("\n\u274C Error: ") + error.message);
    process.exit(1);
  }
});
program.parse();
