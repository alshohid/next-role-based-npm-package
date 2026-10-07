import {
  ProjectConfig,
  PREDEFINED_ROLES,
  DEFAULT_CUSTOM_ROLE_ROUTES,
} from "./types";

// ─────────────────────────────────────────────
//  Utility helpers
// ─────────────────────────────────────────────
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function pascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((s) => capitalize(s))
    .join("");
}

// ─────────────────────────────────────────────
//  Root Layout
// ─────────────────────────────────────────────
export function generateRootLayout(config: ProjectConfig): string {
  const reduxImport = config.redux
    ? `import { ReduxProvider } from "@/lib/redux/provider";\n`
    : "";

  const bodyContent = config.redux
    ? `        <ReduxProvider>\n          {children}\n        </ReduxProvider>`
    : `        {children}`;

  return `${reduxImport}import type { Metadata } from "next";
${config.tailwind ? `import "./globals.css";\n` : ""}
export const metadata: Metadata = {
  title: "${config.projectName}",
  description: "Enterprise Role-based Next.js application powered by create-next-role-based-app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased selection:bg-blue-600 selection:text-white">
${bodyContent}
      </body>
    </html>
  );
}
`;
}

// ─────────────────────────────────────────────
//  Home Page
// ─────────────────────────────────────────────
export function generateHomePage(config: ProjectConfig): string {
  const allRoles = [...config.roles, ...config.customRoles];

  return `import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  const roles = siteConfig.roles;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/40 via-gray-950 to-gray-950 text-white px-4">
      <div className="text-center space-y-6 max-w-3xl mx-auto p-8 rounded-3xl border border-gray-800/80 bg-gray-900/40 backdrop-blur-2xl shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
          🚀 Next.js 16 Enterprise RBAC Architecture
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
          ${config.projectName}
        </h1>
        
        <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          Production-grade Next.js application scaffolded with role-isolated dashboards, Redux Toolkit state, and RBAC security.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-600/25 transition-all duration-200"
          >
            Sign In Portal
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 bg-gray-800/80 hover:bg-gray-800 text-gray-300 rounded-xl font-medium border border-gray-700/80 transition-all duration-200"
          >
            Create Account
          </Link>
        </div>

        <div className="pt-8 border-t border-gray-800/80">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">
            Available Role Dashboards ({roles?.length || 0})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {roles.map((role) => (
              <Link
                key={role}
                href={\`/\${role}/dashboard\`}
                className="group flex items-center justify-between px-3.5 py-2.5 bg-gray-950/60 hover:bg-blue-600/10 hover:border-blue-500/40 border border-gray-800/80 rounded-xl text-xs font-medium text-gray-300 hover:text-white transition-all duration-200"
              >
                <span className="capitalize">{role}</span>
                <span className="text-gray-600 group-hover:text-blue-400 transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
`;
}

// ─────────────────────────────────────────────
//  Login Page
// ─────────────────────────────────────────────
export function generateLoginPage(config: ProjectConfig): string {
  const allRoles = [...config.roles, ...config.customRoles];
  const defaultRole = allRoles[0] || "admin";

  return `"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
${config.redux ? `import { useAppDispatch } from "@/lib/redux/hooks";
import { setCredentials } from "@/features/auth/slice/authSlice";` : ""}
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
${config.redux ? "  const dispatch = useAppDispatch();" : ""}
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("${defaultRole}");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
${config.redux ? `      dispatch(
        setCredentials({
          user: {
            id: "user-" + Date.now(),
            name: email.split("@")[0] || "Test User",
            email,
            roles: [role as any],
          },
          token: "mock-jwt-token-" + Date.now(),
        })
      );` : ""}
      router.push(\`/\${role}/dashboard\`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-gray-800 bg-gray-900/60 backdrop-blur-2xl">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-lg">
          🔐
        </div>
        <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
        <p className="text-xs text-gray-400">Sign in to access your role-based dashboard</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-400">Demo Role Selection</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              ${allRoles
      .map((r) => `<option value="${r}">${capitalize(r)}</option>`)
      .join("\n              ")}
            </select>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <Link href="/forgot-password" className="text-blue-400 hover:underline">
              Forgot password?
            </Link>
            <Link href="/verify-otp" className="text-gray-400 hover:text-white">
              OTP Login
            </Link>
          </div>

          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Sign In to Dashboard
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:underline font-medium">
            Create account
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
`;
}

// ─────────────────────────────────────────────
//  Register Page
// ─────────────────────────────────────────────
export function generateRegisterPage(config: ProjectConfig): string {
  const allRoles = [...config.roles, ...config.customRoles];
  const defaultRole = allRoles[0] || "admin";

  return `"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
${config.redux ? `import { useAppDispatch } from "@/lib/redux/hooks";
import { setCredentials } from "@/features/auth/slice/authSlice";` : ""}
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
${config.redux ? "  const dispatch = useAppDispatch();" : ""}
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("${defaultRole}");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
${config.redux ? `      dispatch(
        setCredentials({
          user: {
            id: "user-" + Date.now(),
            name,
            email,
            roles: [role as any],
          },
          token: "mock-jwt-token-" + Date.now(),
        })
      );` : ""}
      router.push(\`/\${role}/dashboard\`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-gray-800 bg-gray-900/60 backdrop-blur-2xl">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-lg">
          📝
        </div>
        <CardTitle className="text-2xl font-bold text-white">Create an Account</CardTitle>
        <p className="text-xs text-gray-400">Join and select your account role</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-400">Assign Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              ${allRoles
      .map((r) => `<option value="${r}">${capitalize(r)}</option>`)
      .join("\n              ")}
            </select>
          </div>

          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Register & Continue
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
`;
}

// ─────────────────────────────────────────────
//  Forgot Password Page
// ─────────────────────────────────────────────
export function generateForgotPasswordPage(config: ProjectConfig): string {
  return `"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card className="w-full max-w-md border-gray-800 bg-gray-900/60 backdrop-blur-2xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
        <p className="text-xs text-gray-400">Enter your email to receive recovery instructions</p>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-green-400">Password reset link sent if account exists.</p>
            <Link href="/login" className="text-xs text-blue-400 hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
            <div className="text-center pt-2">
              <Link href="/login" className="text-xs text-gray-400 hover:text-white">
                Cancel
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
`;
}

// ─────────────────────────────────────────────
//  Verify OTP Page
// ─────────────────────────────────────────────
export function generateVerifyOtpPage(config: ProjectConfig): string {
  return `"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/${config.roles[0] || 'admin'}/dashboard");
  };

  return (
    <Card className="w-full max-w-md border-gray-800 bg-gray-900/60 backdrop-blur-2xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold text-white">Two-Factor / OTP Verification</CardTitle>
        <p className="text-xs text-gray-400">Enter the 6-digit verification code</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <Input
            label="Verification Code"
            type="text"
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="text-center tracking-widest text-lg font-mono font-bold"
            required
          />
          <Button type="submit" className="w-full">
            Verify & Authenticate
          </Button>
          <div className="text-center pt-2">
            <Link href="/login" className="text-xs text-gray-400 hover:text-white">
              Back to Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
`;
}

// ─────────────────────────────────────────────
//  Layouts: Auth, Dashboard, Role
// ─────────────────────────────────────────────
export function generateAuthLayout(): string {
  return `export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/30 via-gray-950 to-gray-950">
      {children}
    </div>
  );
}
`;
}

export function generateDashboardLayout(): string {
  return `export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
`;
}

export function generateRoleLayout(roleName: string, config: ProjectConfig): string {
  const displayName = pascalCase(roleName);

  return `import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { RoleGuard } from "@/components/shared/RoleGuard";
import { ROLES } from "@/constants/roles";

export default function ${displayName}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={[ROLES.${roleName.toUpperCase().replace(/[^A-Z0-9]/g, "_")}]}>
      <div className="min-h-screen flex bg-gray-950 text-white">
        <Sidebar role="${roleName}" />
        <div className="flex-1 flex flex-col min-w-0">
          <Header role="${roleName}" />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
`;
}

// ─────────────────────────────────────────────
//  Role Dashboard Page
// ─────────────────────────────────────────────
export function generateRoleDashboardPage(
  roleName: string,
  routes: string[]
): string {
  const displayName = pascalCase(roleName);

  return `import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";

export default function ${displayName}DashboardPage() {
  const stats = [
    { label: "Active Operations", value: "1,284", change: "+14.2%" },
    { label: "Real-time Sessions", value: "342", change: "+8.1%" },
    { label: "Pending Approvals", value: "19", change: "-4.5%" },
    { label: "System Health", value: "99.9%", change: "Optimal" },
  ];

  const recentActivity = [
    { id: "ACT-101", title: "Resource allocation updated", status: "Completed", time: "5 mins ago" },
    { id: "ACT-102", title: "Security token re-authenticated", status: "Verified", time: "18 mins ago" },
    { id: "ACT-103", title: "New telemetry event received", status: "Logged", time: "32 mins ago" },
    { id: "ACT-104", title: "Policy threshold verified", status: "Passed", time: "1 hour ago" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          ${displayName} Console
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Role-isolated portal and metrics overview.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold text-white mt-1.5">{s.value}</p>
            <p className="text-xs text-emerald-400 font-medium mt-1">{s.change}</p>
          </Card>
        ))}
      </div>

      {/* Quick Navigation Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Sub-module Navigation</CardTitle>
          <p className="text-xs text-gray-400">Direct shortcuts to ${roleName} module paths</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            ${routes
      .map(
        (route) => `<Link
              href="/${roleName}/${route}"
              className="flex items-center justify-between p-3.5 bg-gray-800/40 hover:bg-gray-800 border border-gray-800 rounded-xl text-xs font-semibold text-gray-200 hover:text-white transition-all"
            >
              <span className="capitalize">${route}</span>
              <span>→</span>
            </Link>`
      )
      .join("\n            ")}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Audit Log</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { header: "Activity ID", accessorKey: "id", className: "w-32 font-mono text-xs text-gray-400" },
              { header: "Description", accessorKey: "title", className: "font-medium text-white" },
              { header: "Status", cell: (item) => (
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {item.status}
                </span>
              )},
              { header: "Timestamp", accessorKey: "time", className: "text-right text-xs text-gray-400" },
            ]}
            data={recentActivity}
          />
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

// ─────────────────────────────────────────────
//  Role Sub-page (e.g. /admin/users)
// ─────────────────────────────────────────────
export function generateRoleSubPage(
  roleName: string,
  routeName: string
): string {
  const displayRole = pascalCase(roleName);
  const displayRoute = pascalCase(routeName);

  return `import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ${displayRole}${displayRoute}Page() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white capitalize">
            ${displayRoute} Management
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Dedicated ${roleName} sub-module for handling ${routeName}.
          </p>
        </div>
        <Button size="sm">Add New ${displayRoute.slice(0, -1) || displayRoute}</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="capitalize">${displayRoute} Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 border border-dashed border-gray-800 rounded-xl text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <p className="text-sm font-medium text-gray-300">
              Module Ready for Data Integration
            </p>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Inject your RTK Query endpoints from <code>features/</code> or connect to your database API here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

// ─────────────────────────────────────────────
//  Unauthorized Page (403)
// ─────────────────────────────────────────────
export function generateUnauthorizedPage(): string {
  return `import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white">
      <div className="text-center max-w-md space-y-6 p-8 rounded-3xl border border-red-500/20 bg-gray-900/50 backdrop-blur-xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center text-2xl font-bold">
          ⛔
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Access Denied (403)</h1>
          <p className="text-gray-400 text-sm mt-2">
            You do not possess the required role permissions to view this resource.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link href="/">
            <Button variant="secondary" size="sm">Home</Button>
          </Link>
          <Link href="/login">
            <Button size="sm">Switch Account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
`;
}

// ─────────────────────────────────────────────
//  Redux Setup: Store, Hooks, Provider, API
// ─────────────────────────────────────────────
export function generateReduxStore(config: ProjectConfig): string {
  const rtkQueryImports = config.rtkQuery
    ? `import { baseApi } from "./api/baseApi";\n`
    : "";

  const reducerEntries = [
    `    auth: authReducer,`,
    config.rtkQuery ? `    [baseApi.reducerPath]: baseApi.reducer,` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const middlewareConfig = config.rtkQuery
    ? `\n  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),`
    : "";

  return `import { configureStore } from "@reduxjs/toolkit";
${rtkQueryImports}import authReducer from "@/features/auth/slice/authSlice";

export const store = configureStore({
  reducer: {
${reducerEntries}
  },${middlewareConfig}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`;
}

export function generateReduxHooks(): string {
  return `import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
`;
}

export function generateReduxProvider(): string {
  return `"use client";

import { Provider } from "react-redux";
import { store } from "./store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
`;
}

export function generateBaseApi(): string {
  return `import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    prepareHeaders: (headers, { getState }) => {
      // In production: extract token from Redux state or cookie
      const token = (getState() as any)?.auth?.token;
      if (token) {
        headers.set("authorization", \`Bearer \${token}\`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Auth", "Role"],
  endpoints: () => ({}),
});
`;
}

export function generateAuthSlice(config: ProjectConfig): string {
  return `import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
`;
}

export function generateAuthApi(config: ProjectConfig): string {
  return `import { baseApi } from "@/lib/redux/api/baseApi";
import type { AuthResponse, LoginCredentials, User } from "@/types/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation<AuthResponse, Partial<User> & { password: string }>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    getMe: builder.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
`;
}

// ─────────────────────────────────────────────
//  RBAC Utilities & Constants
// ─────────────────────────────────────────────
export function generateRolesConstants(config: ProjectConfig): string {
  const allRoles = [...config.roles, ...config.customRoles];
  const roleEntries = allRoles.map(
    (role) => `  ${role.toUpperCase().replace(/[^A-Z0-9]/g, "_")}: "${role}",`
  );

  return `export const ROLES = {
${roleEntries.join("\n")}
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
export const ALL_ROLES: Role[] = Object.values(ROLES);
`;
}

export function generateAuthTypes(config: ProjectConfig): string {
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
`;
}

export function generateCommonTypes(): string {
  return `export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type SortOrder = "asc" | "desc";
`;
}

export function generateNavTypes(): string {
  return `export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface SidebarSection {
  title?: string;
  items: NavItem[];
}
`;
}

export function generatePermissions(): string {
  return `import type { Role } from "@/constants/roles";

export function hasRole(userRoles: Role[], requiredRole: Role): boolean {
  if (!userRoles || !Array.isArray(userRoles)) return false;
  return userRoles.includes(requiredRole);
}

export function hasAnyRole(userRoles: Role[], requiredRoles: Role[]): boolean {
  if (!userRoles || !Array.isArray(userRoles)) return false;
  return requiredRoles.some((role) => userRoles.includes(role));
}

export function hasAllRoles(userRoles: Role[], requiredRoles: Role[]): boolean {
  if (!userRoles || !Array.isArray(userRoles)) return false;
  return requiredRoles.every((role) => userRoles.includes(role));
}

export function getHighestRole(
  userRoles: Role[],
  hierarchy: Role[]
): Role | null {
  for (const role of hierarchy) {
    if (userRoles.includes(role)) {
      return role;
    }
  }
  return null;
}

export function getRoleRedirectPath(role: Role): string {
  return \`/\${role}/dashboard\`;
}
`;
}

// ─────────────────────────────────────────────
//  RoleGuard Component & useAuth Hook
// ─────────────────────────────────────────────
export function generateRoleGuardComponent(): string {
  return `"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/constants/roles";

interface RoleGuardProps {
  allowedRoles: Role[];
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
  redirectTo,
}: RoleGuardProps) {
  const { user, isAuthenticated, checkAnyRole } = useAuth();
  const router = useRouter();

  // In real applications, allow initial load check
  if (!isAuthenticated || !user) {
    if (redirectTo) {
      router.push(redirectTo);
      return null;
    }
    return <>{fallback}</>;
  }

  const hasAccess = checkAnyRole(allowedRoles);

  if (!hasAccess) {
    if (redirectTo) {
      router.push(redirectTo);
      return null;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
`;
}

export function generateUseAuthHook(): string {
  return `"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  logout as logoutAction,
  setCredentials,
} from "@/features/auth/slice/authSlice";
import {
  hasRole,
  hasAnyRole,
  getRoleRedirectPath,
} from "@/lib/auth/permissions";
import type { Role } from "@/constants/roles";
import type { User } from "@/types/auth";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const checkRole = (role: Role): boolean => {
    if (!user) return false;
    return hasRole(user.roles, role);
  };

  const checkAnyRole = (roles: Role[]): boolean => {
    if (!user) return false;
    return hasAnyRole(user.roles, roles);
  };

  const login = (userData: User, authToken: string) => {
    dispatch(setCredentials({ user: userData, token: authToken }));
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const getRedirectPath = (): string => {
    if (!user || user.roles.length === 0) return "/login";
    return getRoleRedirectPath(user.roles[0]);
  };

  return {
    user,
    token,
    isAuthenticated,
    checkRole,
    checkAnyRole,
    login,
    logout,
    getRedirectPath,
  };
}
`;
}

// ─────────────────────────────────────────────
//  Configuration & Navigation
// ─────────────────────────────────────────────
export function generateNavConfig(config: ProjectConfig): string {
  const allRoles = [...config.roles, ...config.customRoles];
  const entries: string[] = [];

  for (const role of allRoles) {
    const roleRoutes = PREDEFINED_ROLES[role]?.routes || DEFAULT_CUSTOM_ROLE_ROUTES;
    const items = roleRoutes.map((r) => {
      const title = capitalize(r);
      const icon = r === "dashboard" ? "LayoutDashboard" : r === "users" ? "Users" : r === "settings" ? "Settings" : "Layers";
      return `      { title: "${title}", href: "/${role}/${r}", icon: "${icon}" }`;
    });
    entries.push(`  ${role}: [\n${items.join(",\n")}\n  ]`);
  }

  return `import type { NavItem } from "@/types/nav.types";

export const SIDEBAR_NAV: Record<string, NavItem[]> = {
${entries.join(",\n")}
};
`;
}

export function generateSiteConfig(config: ProjectConfig): string {
  const allRoles = [...config.roles, ...config.customRoles];

  return `export const siteConfig = {
  name: "${config.projectName}",
  description: "Enterprise Role-Based Next.js Application",
  roles: ${JSON.stringify(allRoles)},
  defaultRole: "${allRoles[0] || 'admin'}",
};
`;
}

export function generateRoleAppConfig(config: ProjectConfig): string {
  const allRoles = [...config.roles, ...config.customRoles];

  return `const roleAppConfig = {
  roles: ${JSON.stringify(allRoles)},
  defaultRole: "${allRoles[0] || 'admin'}",
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

export function generateEnvExample(): string {
  return `NEXT_PUBLIC_APP_NAME="Next Role App"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
NEXT_PUBLIC_SOCKET_URL="http://localhost:4000"
JWT_SECRET="your-super-secret-jwt-key"
`;
}

// ─────────────────────────────────────────────
//  UI Primitives & Shared Components
// ─────────────────────────────────────────────
export function generateUtils(): string {
  return `export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}
`;
}

export function generateUiButton(): string {
  return `import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus:ring-blue-500",
    secondary: "bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700 focus:ring-gray-600",
    outline: "border border-gray-700 hover:bg-gray-800 text-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    ghost: "hover:bg-gray-800/60 text-gray-400 hover:text-white focus:ring-gray-600",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
`;
}

export function generateUiCard(): string {
  return `import React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-2xl border border-gray-800/80 bg-gray-900/50 p-6 backdrop-blur-xl shadow-lg", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1 pb-4", className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold text-white tracking-tight", className)} {...props}>{children}</h3>;
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-gray-300 text-sm", className)} {...props}>{children}</div>;
}
`;
}

export function generateUiInput(): string {
  return `import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, id, ...props }: InputProps) {
  const inputId = id || props.name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-gray-400">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-xl border border-gray-700/80 bg-gray-900/80 px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors",
          error && "border-red-500 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
`;
}

export function generateUiDataTable(): string {
  return `import React from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  emptyMessage = "No records found",
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-gray-800 bg-gray-950/40", className)}>
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="border-b border-gray-800 bg-gray-900/40 text-xs uppercase text-gray-400">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className={cn("px-4 py-3 font-semibold", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/80">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="hover:bg-gray-800/30 transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={cn("px-4 py-3", col.className)}>
                    {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? "") : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
`;
}

export function generateLoadingSpinner(): string {
  return `export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };
  return (
    <div className="flex items-center justify-center p-4">
      <div className={\`animate-spin rounded-full border-2 border-gray-700 border-t-blue-500 \${sizes[size]}\`} />
    </div>
  );
}
`;
}

export function generateEmptyState(): string {
  return `export function EmptyState({ title = "No data found", description = "No entries to display." }: { title?: string; description?: string }) {
  return (
    <div className="p-8 text-center border border-dashed border-gray-800 rounded-2xl bg-gray-900/20">
      <p className="text-sm font-semibold text-gray-300">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}
`;
}

export function generateHeaderComponent(config: ProjectConfig): string {
  return `"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
${config.redux ? `import { useAuth } from "@/hooks/useAuth";` : ""}

export function Header({ role }: { role: string }) {
  const router = useRouter();
${config.redux ? `  const { user, logout } = useAuth();` : ""}

  const handleLogout = () => {
${config.redux ? `    logout();` : ""}
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
          {role} Workspace
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
          Home
        </Link>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition-all cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
`;
}

export function generateSidebarComponent(config: ProjectConfig): string {
  return `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_NAV } from "@/config/navigation";

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const navItems = SIDEBAR_NAV[role] || [{ title: "Dashboard", href: \`/\${role}/dashboard\` }];

  return (
    <aside className="w-64 border-r border-gray-800/80 bg-gray-950 flex flex-col shrink-0">
      <div className="h-16 px-6 border-b border-gray-800/80 flex items-center">
        <Link href="/" className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          ${config.projectName}
        </Link>
      </div>

      <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
          {role} Navigation
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={\`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all \${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                  : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
              }\`}
            >
              <span>{item.title}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800/80">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs uppercase">
            {role[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate capitalize">{role} User</p>
            <p className="text-[10px] text-gray-500 truncate">Authenticated session</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
`;
}

// ─────────────────────────────────────────────
//  Socket & Real-time Integration
// ─────────────────────────────────────────────
export function generateSocketClient(): string {
  return `/**
 * Real-time WebSocket / Socket.io Client
 * Modular connection service for live notifications, logistics tracking, or match bidding.
 */

type ListenerCallback = (data: any) => void;

class SocketService {
  private listeners: Map<string, Set<ListenerCallback>> = new Map();
  private isConnected: boolean = false;

  connect(url: string = process.env.NEXT_PUBLIC_SOCKET_URL || "") {
    if (this.isConnected) return;
    this.isConnected = true;
    console.log("[SocketService] Connected to", url || "default socket endpoint");
  }

  disconnect() {
    this.isConnected = false;
    this.listeners.clear();
    console.log("[SocketService] Disconnected");
  }

  on(event: string, callback: ListenerCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  off(event: string, callback: ListenerCallback) {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event: string, payload: any) {
    console.log("[SocketService Emit]", event, payload);
  }
}

export const socketService = new SocketService();
`;
}

export function generateSocketEvents(): string {
  return `export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  NOTIFICATION: "notification",
  STATUS_UPDATE: "status_update",
  MATCH_UPDATE: "match_update",
  TRACKING_UPDATE: "tracking_update",
} as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
`;
}

export function generateUseSocketHook(): string {
  return `"use client";

import { useEffect, useState } from "react";
import { socketService } from "@/lib/socket/socketClient";

export function useSocket<T = any>(event: string, onMessage?: (data: T) => void) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    socketService.connect();

    const unsubscribe = socketService.on(event, (incoming) => {
      setData(incoming);
      onMessage?.(incoming);
    });

    return () => {
      unsubscribe();
    };
  }, [event, onMessage]);

  return {
    data,
    emit: (payload: any) => socketService.emit(event, payload),
  };
}
`;
}

export function generateUseDebounceHook(): string {
  return `"use client";

import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
`;
}

// ─────────────────────────────────────────────
//  Next.js Edge Middleware
// ─────────────────────────────────────────────
export function generateMiddleware(config: ProjectConfig): string {
  const allRoles = [...config.roles, ...config.customRoles];
  const roleRoutesList = allRoles.map((r) => `"/${r}"`).join(", ");

  return `import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoleRoutes = [${roleRoutesList}];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoleRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // In production: Inspect cookie or Authorization token
    // Example:
    // const token = request.cookies.get("token")?.value;
    // if (!token) {
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
`;
}

// ─────────────────────────────────────────────
//  Globals CSS (Dark theme glassmorphism)
// ─────────────────────────────────────────────
export function generateGlobalsCss(config: ProjectConfig): string {
  if (config.tailwind) {
    return `@import "tailwindcss";

@layer base {
  :root {
    --background: 224 71% 4%;
    --foreground: 213 31% 91%;
  }

  body {
    background-color: #030712;
    color: #f3f4f6;
  }
}
`;
  }

  return `/* Base styling */
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #030712;
  color: #f3f4f6;
}
`;
}
