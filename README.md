<p align="center">
  <h1 align="center">🚀 create-next-role-app</h1>
  <p align="center">
    <strong>The fastest way to scaffold a role-based Next.js application</strong>
  </p>
  <p align="center">
    Create production-ready Next.js projects with multiple user roles, Redux Toolkit, RTK Query, and RBAC utilities — all from a single CLI command.
  </p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/create-next-role-app">
    <img src="https://img.shields.io/npm/v/create-next-role-app.svg?style=flat-square&color=blue" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/create-next-role-app">
    <img src="https://img.shields.io/npm/dm/create-next-role-app.svg?style=flat-square&color=green" alt="npm downloads" />
  </a>
  <a href="https://github.com/your-username/create-next-role-app/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/create-next-role-app.svg?style=flat-square" alt="license" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square" alt="node version" />
  </a>
</p>

---

## 📖 Table of Contents

- [Why create-next-role-app?](#-why-create-next-role-app)
- [Quick Start](#-quick-start)
- [Demo Example (Step-by-Step)](#-demo-example-step-by-step)
- [CLI Options & Prompts](#-cli-options--prompts)
- [Generated Project Structure](#-generated-project-structure)
- [What Gets Generated?](#-what-gets-generated)
  - [Role-Based Routes](#1-role-based-routes)
  - [Redux Toolkit + RTK Query](#2-redux-toolkit--rtk-query)
  - [RBAC Utilities](#3-rbac-utilities)
  - [Middleware](#4-middleware)
  - [Auth Pages](#5-auth-pages)
  - [RoleGuard Component](#6-roleguard-component)
  - [useAuth Hook](#7-useauth-hook)
  - [Configuration File](#8-configuration-file)
- [Predefined Roles](#-predefined-roles)
- [Custom Roles](#-custom-roles)
- [How It Works (Architecture)](#-how-it-works-architecture)
- [Local Development & Testing](#-local-development--testing)
- [Publishing to npm](#-publishing-to-npm)
- [Tech Stack](#-tech-stack)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 💡 Why create-next-role-app?

Building a role-based application from scratch is repetitive and time-consuming. Every project needs:

- ❌ Folder structure for each role (admin, customer, worker...)
- ❌ Redux store, hooks, and provider boilerplate
- ❌ RTK Query base API configuration
- ❌ Permission utilities (hasRole, hasAnyRole, hasAllRoles)
- ❌ Middleware for route protection
- ❌ Login/Register page templates
- ❌ RoleGuard components
- ❌ TypeScript types for auth

**create-next-role-app** generates ALL of this in seconds:

```bash
npx create-next-role-app my-erp
# Answer a few questions → Done! 🎉
```

---

## ⚡ Quick Start

```bash
# Create a new role-based Next.js app
npx create-next-role-app my-app

# Navigate to the project
cd my-app

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you'll see your role-based application running!

---

## 🎬 Demo Example (Step-by-Step)

Here's a complete walkthrough of creating a project:

### Step 1: Run the CLI

```bash
npx create-next-role-app my-erp-system
```

### Step 2: You'll see the interactive prompts

```
╔══════════════════════════════════════════════╗
║                                              ║
║     🚀 Create Next Role App                 ║
║     Role-based Next.js Project Generator     ║
║                                              ║
╚══════════════════════════════════════════════╝

? 🎭 Which roles do you need? (Space to select, Enter to confirm)
 ◉ admin — Full system access with user management
 ◉ customer — Customer portal with order tracking
 ◉ worker — Worker portal with task management
 ◯ manager — Management portal with team oversight
 ◯ vendor — Vendor portal with product management
 ◯ editor — Content editor with publishing tools
 ◯ moderator — Moderation panel with review tools

? ➕ Do you want to add custom roles? Yes

? ✏️  Enter custom role names (comma separated): hr, accountant

? 📘 Use TypeScript? Yes

? 🔄 Use Redux Toolkit? Yes

? 🌐 Use RTK Query for API calls? Yes

? 🎨 Use Tailwind CSS? Yes
```

### Step 3: Watch the magic happen

```
🚀 Creating Next Role App: my-erp-system

✔ Next.js application created
✔ Folder structure created
✔ Role structure generated (5 roles: admin, customer, worker, hr, accountant)
✔ Redux Toolkit + RTK Query configured
✔ RBAC utilities created
✔ Middleware created
✔ Configuration files created
✔ Additional dependencies installed

🎉 Project created successfully!

  Project: my-erp-system
  Roles:   admin, customer, worker, hr, accountant
  Stack:   Next.js, TypeScript, Tailwind CSS, Redux Toolkit, RTK Query

  Get started:

    cd my-erp-system
    npm run dev

  Dashboard routes:

    /admin/dashboard
    /customer/dashboard
    /worker/dashboard
    /hr/dashboard
    /accountant/dashboard

  Edit role-app.config.ts to customize your role configuration.
```

### Step 4: Run the generated project

```bash
cd my-erp-system
npm run dev
```

### Step 5: Visit the routes

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Home page with role links |
| `http://localhost:3000/login` | Login page |
| `http://localhost:3000/register` | Registration page |
| `http://localhost:3000/admin/dashboard` | Admin dashboard |
| `http://localhost:3000/admin/users` | Admin user management |
| `http://localhost:3000/admin/settings` | Admin settings |
| `http://localhost:3000/customer/dashboard` | Customer dashboard |
| `http://localhost:3000/customer/orders` | Customer orders |
| `http://localhost:3000/worker/dashboard` | Worker dashboard |
| `http://localhost:3000/worker/tasks` | Worker tasks |
| `http://localhost:3000/hr/dashboard` | HR dashboard (custom role) |
| `http://localhost:3000/accountant/dashboard` | Accountant dashboard (custom role) |
| `http://localhost:3000/unauthorized` | Unauthorized access page |

---

## 🔧 CLI Options & Prompts

### Usage

```bash
# With project name argument
npx create-next-role-app <project-name>

# Without argument (will prompt for name)
npx create-next-role-app

# Show help
npx create-next-role-app --help

# Show version
npx create-next-role-app --version
```

### Interactive Prompts

| Prompt | Type | Default | Description |
|--------|------|---------|-------------|
| Project name | text input | `my-role-app` | Your project directory name |
| Roles | multi-select | `admin` checked | Choose from 7 predefined roles |
| Custom roles | confirm + text | `No` | Add your own role names |
| TypeScript | confirm | `Yes` | Enable TypeScript |
| Redux Toolkit | confirm | `Yes` | Add Redux state management |
| RTK Query | confirm | `Yes` | Add RTK Query API layer |
| Tailwind CSS | confirm | `Yes` | Add Tailwind CSS styling |

---

## 📁 Generated Project Structure

```
my-app/
│
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx              # Login page with form
│   │   └── register/
│   │       └── page.tsx              # Register page with form
│   │
│   ├── (dashboard)/                  # Dashboard route group
│   │   ├── layout.tsx                # Dashboard layout wrapper
│   │   │
│   │   ├── admin/                    # Admin role
│   │   │   ├── dashboard/page.tsx    # Admin dashboard (with stats & sidebar)
│   │   │   ├── users/page.tsx        # User management
│   │   │   ├── settings/page.tsx     # Admin settings
│   │   │   └── analytics/page.tsx    # Analytics page
│   │   │
│   │   ├── customer/                 # Customer role
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   └── support/page.tsx
│   │   │
│   │   └── worker/                   # Worker role
│   │       ├── dashboard/page.tsx
│   │       ├── tasks/page.tsx
│   │       ├── schedule/page.tsx
│   │       └── reports/page.tsx
│   │
│   ├── unauthorized/
│   │   └── page.tsx                  # 403 Unauthorized page
│   │
│   ├── globals.css                   # Global styles / Tailwind
│   ├── layout.tsx                    # Root layout (with ReduxProvider)
│   └── page.tsx                      # Home page
│
├── components/
│   └── RoleGuard.tsx                 # Role-based component wrapper
│
├── features/
│   ├── auth/
│   │   └── authSlice.ts              # Redux auth slice
│   └── user/                         # User feature (ready for expansion)
│
├── hooks/
│   └── useAuth.ts                    # Custom auth hook
│
├── lib/
│   ├── redux/
│   │   ├── store.ts                  # Redux store with RTK Query
│   │   ├── hooks.ts                  # Typed useAppDispatch & useAppSelector
│   │   ├── provider.tsx              # Client-side Redux Provider
│   │   └── api/
│   │       └── baseApi.ts            # RTK Query base API
│   │
│   └── auth/
│       └── permissions.ts            # hasRole, hasAnyRole, hasAllRoles
│
├── constants/
│   └── roles.ts                      # ROLES constant + Role type
│
├── types/
│   └── auth.ts                       # User, AuthResponse, LoginCredentials
│
├── middleware.ts                     # Next.js middleware (route protection)
├── role-app.config.ts                # Project configuration
├── .env.example                      # Environment variables template
├── .env.local                        # Local environment variables
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies
```

---

## 📋 What Gets Generated?

### 1. Role-Based Routes

Each selected role gets its own dashboard with sidebar navigation and sub-pages:

**Admin** gets: `/admin/dashboard`, `/admin/users`, `/admin/settings`, `/admin/analytics`

**Customer** gets: `/customer/dashboard`, `/customer/orders`, `/customer/profile`, `/customer/support`

Every dashboard page includes:
- ✅ Header with navigation
- ✅ Sidebar with route links
- ✅ Stats cards (4 cards with metrics)
- ✅ Quick action buttons
- ✅ Dark theme with glassmorphism styling

---

### 2. Redux Toolkit + RTK Query

**`lib/redux/store.ts`** — Configured store:

```typescript
import { configureStore } from "@reduxjs/toolkit";
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
```

**`lib/redux/hooks.ts`** — Typed hooks:

```typescript
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

**`lib/redux/provider.tsx`** — Client provider:

```tsx
"use client";

import { Provider } from "react-redux";
import { store } from "./store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
```

**`lib/redux/api/baseApi.ts`** — RTK Query base:

```typescript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    prepareHeaders: (headers) => {
      // Add your auth token here
      return headers;
    },
  }),
  tagTypes: ["User", "Auth"],
  endpoints: () => ({}),
});
```

**Adding a new API endpoint** (after project generation):

```typescript
// features/user/userApi.ts
import { baseApi } from "@/lib/redux/api/baseApi";
import type { User } from "@/types/auth";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["User"],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
    }),
    updateUser: builder.mutation<User, Partial<User> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useUpdateUserMutation } = userApi;
```

---

### 3. RBAC Utilities

**`constants/roles.ts`** — Auto-generated from your selections:

```typescript
export const ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  WORKER: "worker",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
export const ALL_ROLES: Role[] = Object.values(ROLES);
```

**`lib/auth/permissions.ts`** — Permission helpers:

```typescript
import type { Role } from "@/constants/roles";

// Check single role
hasRole(userRoles, "admin");                    // → true/false

// Check if user has ANY of the roles
hasAnyRole(userRoles, ["admin", "manager"]);    // → true if either

// Check if user has ALL roles
hasAllRoles(userRoles, ["admin", "manager"]);   // → true if both

// Get highest priority role
getHighestRole(userRoles, ["admin", "manager", "worker"]);

// Get redirect path for role
getRoleRedirectPath("admin");                   // → "/admin/dashboard"
```

**`types/auth.ts`** — TypeScript interfaces:

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  avatar?: string;
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
```

---

### 4. Middleware

**`middleware.ts`** — Route protection with role checks:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/admin", "/customer", "/worker"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // TODO: Add your auth check (JWT, cookie, etc.)
    // const token = request.cookies.get("token")?.value;
    // if (!token) {
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }

    if (pathname.startsWith("/admin")) {
      // Verify user has "admin" role
    }
  }

  return NextResponse.next();
}
```

---

### 5. Auth Pages

**Login Page** (`/login`) — Beautiful dark-themed form with:
- Email & password inputs
- Loading state
- Link to register
- Glassmorphism card design

**Register Page** (`/register`) — Full registration form with:
- Name, email, password, confirm password
- Form validation ready
- Link to login

**Unauthorized Page** (`/unauthorized`) — 403 page with:
- Clear "access denied" message
- Links to home and login

---

### 6. RoleGuard Component

Wrap any content that should only be visible to specific roles:

```tsx
import { RoleGuard } from "@/components/RoleGuard";
import { ROLES } from "@/constants/roles";

// Only admins can see this
<RoleGuard allowedRoles={[ROLES.ADMIN]}>
  <AdminPanel />
</RoleGuard>

// Admins OR managers can see this
<RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
  <ManagementContent />
</RoleGuard>

// With fallback content
<RoleGuard
  allowedRoles={[ROLES.ADMIN]}
  fallback={<p>You don't have permission</p>}
>
  <SecretContent />
</RoleGuard>

// With redirect
<RoleGuard
  allowedRoles={[ROLES.ADMIN]}
  redirectTo="/unauthorized"
>
  <AdminContent />
</RoleGuard>
```

---

### 7. useAuth Hook

Convenient hook for auth operations:

```tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/constants/roles";

export function Header() {
  const {
    user,
    isAuthenticated,
    login,
    logout,
    checkRole,
    checkAnyRole,
    getRedirectPath,
  } = useAuth();

  // Check user's role
  if (checkRole(ROLES.ADMIN)) {
    // User is admin
  }

  // Check multiple roles
  if (checkAnyRole([ROLES.ADMIN, ROLES.MANAGER])) {
    // User is admin or manager
  }

  // Login
  login({
    id: "1",
    name: "John",
    email: "john@example.com",
    roles: ["admin"],
  });

  // Logout
  logout();

  // Get redirect path based on role
  const path = getRedirectPath(); // → "/admin/dashboard"
}
```

---

### 8. Configuration File

**`role-app.config.ts`** — Central configuration:

```typescript
const roleAppConfig = {
  roles: ["admin", "customer", "worker"],
  defaultRole: "admin",
  auth: {
    enabled: true,
    loginPath: "/login",
    registerPath: "/register",
    unauthorizedPath: "/unauthorized",
  },
  redux: {
    enabled: true,
    rtkQuery: true,
  },
  tailwind: true,
};

export default roleAppConfig;
```

---

## 🎭 Predefined Roles

| Role | Routes Generated | Description |
|------|-----------------|-------------|
| **admin** | `dashboard`, `users`, `settings`, `analytics` | Full system access with user management |
| **customer** | `dashboard`, `orders`, `profile`, `support` | Customer portal with order tracking |
| **worker** | `dashboard`, `tasks`, `schedule`, `reports` | Worker portal with task management |
| **manager** | `dashboard`, `team`, `reports`, `approvals` | Management portal with team oversight |
| **vendor** | `dashboard`, `products`, `orders`, `inventory` | Vendor portal with product management |
| **editor** | `dashboard`, `content`, `media`, `drafts` | Content editor with publishing tools |
| **moderator** | `dashboard`, `reviews`, `reports`, `flags` | Moderation panel with review tools |

---

## ✏️ Custom Roles

You can add **any role name** you want. Custom roles are not limited to predefined ones.

```
? ➕ Do you want to add custom roles? Yes
? ✏️  Enter custom role names: hr, accountant, sales-executive, cto
```

**Custom roles generate:**

```
app/(dashboard)/
├── hr/
│   └── dashboard/page.tsx
├── accountant/
│   └── dashboard/page.tsx
├── sales-executive/
│   └── dashboard/page.tsx
└── cto/
    └── dashboard/page.tsx
```

Custom roles also get:
- ✅ Added to `constants/roles.ts` (ROLES.HR, ROLES.ACCOUNTANT, etc.)
- ✅ Added to `middleware.ts` route protection
- ✅ Added to `role-app.config.ts`
- ✅ Dashboard page with sidebar and stats

---

## ⚙️ How It Works (Architecture)

```
npx create-next-role-app my-app
         │
         ▼
┌─────────────────────┐
│   Commander (CLI)    │  ← Parses arguments
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Inquirer (Prompts)  │  ← Collects user preferences
│                      │
│  • Project name      │
│  • Roles selection   │
│  • Custom roles      │
│  • TypeScript?       │
│  • Redux?            │
│  • RTK Query?        │
│  • Tailwind?         │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   ProjectConfig      │  ← Configuration object
│   {                  │
│     projectName,     │
│     roles: [...],    │
│     typescript,      │
│     redux,           │
│     rtkQuery,        │
│     tailwind,        │
│     customRoles      │
│   }                  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────────────┐
│   ProjectGenerator          │
│                             │
│   Step 1: create-next-app   │  ← Runs npx create-next-app
│   Step 2: Folder structure  │  ← Creates directories
│   Step 3: Role routes       │  ← Generates role pages
│   Step 4: Redux setup       │  ← Store, hooks, provider
│   Step 5: Auth setup        │  ← RBAC utilities, types
│   Step 6: Middleware         │  ← Route protection
│   Step 7: Config files      │  ← role-app.config, .env
│   Step 8: Install deps      │  ← npm install redux, etc.
└─────────────────────────────┘
          │
          ▼
┌─────────────────────┐
│  Generated Project   │  ← Ready to develop!
│                      │
│  cd my-app           │
│  npm run dev         │
└─────────────────────┘
```

### Internal Package Structure

```
create-next-role-app/              # This npm package
├── bin/
│   └── cli.js                     # Entry point (#!/usr/bin/env node)
├── src/
│   ├── index.ts                   # CLI setup with Commander
│   ├── prompts.ts                 # Interactive prompts with Inquirer
│   ├── generator.ts               # ProjectGenerator class (orchestrator)
│   ├── templates.ts               # 20+ template generator functions
│   └── types.ts                   # TypeScript types + role configs
├── dist/
│   └── index.js                   # Built output (tsup)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧪 Local Development & Testing

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/create-next-role-app.git
cd create-next-role-app

# 2. Install dependencies
npm install

# 3. Build the package
npm run build

# 4. Link globally for local testing
npm link
```

### Testing

```bash
# Test the CLI (creates a test project)
cd /tmp
create-next-role-app test-project

# Follow the prompts, then verify:
cd test-project
npm run dev
# Open http://localhost:3000

# When done, clean up:
cd ..
rm -rf test-project
```

### Development Workflow

```bash
# Watch mode (auto-rebuilds on changes)
npm run dev

# In another terminal, test:
create-next-role-app test-app
```

### Unlinking

```bash
# Remove global link when done
npm unlink -g create-next-role-app
```

---

## 📤 Publishing to npm

### Step 1: Create an npm Account

Go to [https://www.npmjs.com/signup](https://www.npmjs.com/signup) and create an account.

### Step 2: Login from Terminal

```bash
npm login
# Enter your username, password, and email
# If 2FA is enabled, enter the OTP
```

### Step 3: Verify Package Name Availability

```bash
# Check if the name is taken
npm view create-next-role-app

# If it returns 404 → the name is available! ✅
# If it returns data → choose a different name
```

### Step 4: Update package.json

Make sure these fields are correct in your `package.json`:

```json
{
  "name": "create-next-role-app",
  "version": "1.0.0",
  "description": "CLI tool to scaffold Next.js projects with role-based folder structure",
  "author": "Your Name <your-email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/create-next-role-app.git"
  },
  "homepage": "https://github.com/your-username/create-next-role-app#readme",
  "bugs": {
    "url": "https://github.com/your-username/create-next-role-app/issues"
  }
}
```

### Step 5: Build & Publish

```bash
# Build the package
npm run build

# Dry run (see what would be published)
npm publish --dry-run

# Publish for real!
npm publish
```

### Step 6: Verify

```bash
# Test from npm (not your local link)
npm unlink -g create-next-role-app
npx create-next-role-app my-test-app
```

### Publishing Updates

```bash
# Bump version
npm version patch    # 1.0.0 → 1.0.1 (bug fixes)
npm version minor    # 1.0.0 → 1.1.0 (new features)
npm version major    # 1.0.0 → 2.0.0 (breaking changes)

# Build and publish
npm run build
npm publish
```

### Scoped Package (Alternative)

If `create-next-role-app` is taken, use a scoped name:

```json
{
  "name": "@your-username/create-next-role-app"
}
```

```bash
# Publish scoped package (public)
npm publish --access public

# Users would run:
npx @your-username/create-next-role-app my-app
```

---

## 🛠️ Tech Stack

### CLI Package Dependencies

| Package | Purpose |
|---------|---------|
| [commander](https://www.npmjs.com/package/commander) | CLI argument parsing |
| [@inquirer/prompts](https://www.npmjs.com/package/@inquirer/prompts) | Interactive terminal prompts |
| [chalk](https://www.npmjs.com/package/chalk) | Terminal string styling |
| [ora](https://www.npmjs.com/package/ora) | Elegant terminal spinners |
| [fs-extra](https://www.npmjs.com/package/fs-extra) | Enhanced file system operations |
| [tsup](https://www.npmjs.com/package/tsup) | TypeScript bundler |

### Generated Project Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org/) | React framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Redux Toolkit](https://redux-toolkit.js.org/) | State management |
| [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) | API data fetching & caching |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |

---

## 🗺️ Roadmap

### v1.0.0 (Current) ✅

- [x] Interactive CLI with Commander + Inquirer
- [x] 7 predefined roles with routes
- [x] Custom role support
- [x] Next.js App Router structure
- [x] Redux Toolkit + RTK Query
- [x] RBAC permission utilities
- [x] RoleGuard component
- [x] useAuth hook
- [x] Middleware template
- [x] Login/Register pages
- [x] TypeScript support
- [x] Tailwind CSS support

### v2.0.0 (Planned)

- [ ] `add-role` command — add roles to existing project
- [ ] `remove-role` command — remove roles from project
- [ ] Auth.js / NextAuth integration option
- [ ] JWT authentication template
- [ ] Cookie-based auth template
- [ ] API route templates for each role
- [ ] Database schema templates (Prisma)

### v3.0.0 (Future)

- [ ] Custom route configuration via YAML/JSON
- [ ] Plugin system for extensibility
- [ ] Dark/Light theme toggle
- [ ] i18n (internationalization) support
- [ ] Testing templates (Jest + React Testing Library)
- [ ] CI/CD templates (GitHub Actions)
- [ ] Docker configuration

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development

```bash
git clone https://github.com/your-username/create-next-role-app.git
cd create-next-role-app
npm install
npm run dev  # Watch mode
```

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ for the Next.js community
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/create-next-role-app">npm</a> ·
  <a href="https://github.com/your-username/create-next-role-app">GitHub</a> ·
  <a href="https://github.com/your-username/create-next-role-app/issues">Issues</a>
</p>
# next-role-based-npm-package
