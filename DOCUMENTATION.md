# 📖 Technical Architecture & Working Procedure Guide

> **Package:** `create-next-role-app`  
> **Type:** CLI Scaffolding Tool for Role-Based Next.js Applications  
> **Last Updated:** 2026-10-07

---

## 📑 Table of Contents

1. [Introduction & Purpose](#1-introduction--purpose)
2. [High-Level Architecture Overview](#2-high-level-architecture-overview)
3. [CLI Lifecycle & Execution Pipeline](#3-cli-lifecycle--execution-pipeline)
   - [Phase 1: CLI Entry & Flag Parsing](#phase-1-cli-entry--flag-parsing)
   - [Phase 2: Interactive Prompt Collection](#phase-2-interactive-prompt-collection)
   - [Phase 3: Configuration Normalization](#phase-3-configuration-normalization)
   - [Phase 4: The 11-Step Generation Engine](#phase-4-the-11-step-generation-engine)
4. [Deep Dive: The 11 Generation Steps](#4-deep-dive-the-11-generation-steps)
   - [Step 1: Next.js Foundation Scaffolding](#step-1-nextjs-foundation-scaffolding)
   - [Step 2: Scalable Feature-Based Skeleton Preparation](#step-2-scalable-feature-based-skeleton-preparation)
   - [Step 3: Atomic UI Primitives & Shared Layouts](#step-3-atomic-ui-primitives--shared-layouts)
   - [Step 4: Central Configuration & Role Navigation](#step-4-central-configuration--role-navigation)
   - [Step 5: Real-time Socket Layer & Ergonomic Hooks](#step-5-real-time-socket-layer--ergonomic-hooks)
   - [Step 6: Role-Based Nested Layouts & Sub-routes](#step-6-role-based-nested-layouts--sub-routes)
   - [Step 7: Redux Toolkit & Feature API Injection](#step-7-redux-toolkit--feature-api-injection)
   - [Step 8: RBAC Engine, Types & Guard Components](#step-8-rbac-engine-types--guard-components)
   - [Step 9: Edge Middleware Route Protection](#step-9-edge-middleware-route-protection)
   - [Step 10: Configuration & Environment Files](#step-10-configuration--environment-files)
   - [Step 11: Dependency Resolution & Finalization](#step-11-dependency-resolution--finalization)
5. [Generated Application Runtime Architecture](#5-generated-application-runtime-architecture)
   - [Authentication & Role Resolution Flow](#authentication--role-resolution-flow)
   - [Client-Side Protection with RoleGuard & useAuth](#client-side-protection-with-roleguard--useauth)
   - [API Data Layer Architecture with RTK Query](#api-data-layer-architecture-with-rtk-query)
6. [Practical Working Procedures for Developers](#6-practical-working-procedures-for-developers)
   - [Procedure A: Scaffolding a New Application](#procedure-a-scaffolding-a-new-application)
   - [Procedure B: Connecting Real Backend Authentication](#procedure-b-connecting-real-backend-authentication)
   - [Procedure C: Adding New Roles & Protected Routes](#procedure-c-adding-new-roles--protected-routes)
   - [Procedure D: Creating New RTK Query Endpoints](#procedure-d-creating-new-rtk-query-endpoints)
7. [CLI Package Development & Maintenance Workflow](#7-cli-package-development--maintenance-workflow)
   - [Local Environment Setup](#local-environment-setup)
   - [Build Pipeline with tsup](#build-pipeline-with-tsup)
   - [Local Testing & Linking](#local-testing--linking)
   - [NPM Publishing Procedure](#npm-publishing-procedure)

---

## 1. Introduction & Purpose

`create-next-role-app` is an enterprise-grade CLI generator designed to solve the repetitive, boilerplate-heavy setup of Role-Based Access Control (RBAC) in modern Next.js applications (App Router).

### Key Problems Solved:
- **Scattered Route Hierarchies:** Manually structuring folder groups `(dashboard)/admin`, `(dashboard)/customer`, etc.
- **Boilerplate Fatigue:** Setting up Redux store, typed hooks, client providers, and RTK Query base APIs across multiple files.
- **Inconsistent RBAC Logic:** Inconsistent checks like `user.role === 'admin'` spread across components without type safety or centralized permission helpers.
- **Incomplete Middleware Protection:** Complex Next.js Edge Middleware route guards written from scratch without predefined role mappings.

---

## 2. High-Level Architecture Overview

The following diagram illustrates how the CLI operates from terminal execution to a fully ready Next.js project:

```mermaid
flowchart TD
    User([User Terminal]) -->|npx create-next-role-app my-app| Bin[bin/cli.js]
    Bin --> Entry[src/index.ts - Commander.js]
    Entry --> Prompts[src/prompts.ts - Inquirer]
    
    subgraph User Configuration
        Prompts --> Config[ProjectConfig Object]
        Config --> Roles[Predefined & Custom Roles]
        Config --> Stack[TypeScript, Redux, RTK Query, Tailwind]
    end

    Config --> Gen[src/generator.ts - ProjectGenerator]

    subgraph Generation Pipeline
        Gen --> Step1[Step 1: create-next-app execution]
        Gen --> Step2[Step 2: Directory structure creation]
        Gen --> Step3[Step 3: Role routes & Dashboard pages]
        Gen --> Step4[Step 4: Redux Toolkit + RTK Query setup]
        Gen --> Step5[Step 5: RBAC utilities & RoleGuard]
        Gen --> Step6[Step 6: Next.js Middleware route guard]
        Gen --> Step7[Step 7: Config & .env files]
        Gen --> Step8[Step 8: Dependency installation]
    end

    Templates[src/templates.ts] -.->|Inject code strings| Step3
    Templates -.->|Inject code strings| Step4
    Templates -.->|Inject code strings| Step5
    Templates -.->|Inject code strings| Step6
    Templates -.->|Inject code strings| Step7

    Step8 --> Ready([Production-Ready Next.js Project])
```

---

## 3. CLI Lifecycle & Execution Pipeline

### Phase 1: CLI Entry & Flag Parsing
1. **Entrypoint (`bin/cli.js`):**
   - Has shebang `#!/usr/bin/env node`.
   - Requires `../dist/index.js` (built CommonJS bundle produced by `tsup`).
2. **Commander (`src/index.ts`):**
   - Configures CLI version, descriptions, and positional argument `[project-name]`.
   - If an argument is provided (e.g. `npx create-next-role-app erp-portal`), it is captured into `options.projectName`.

### Phase 2: Interactive Prompt Collection
If arguments are omitted or require confirmation, `src/prompts.ts` kicks off using `@inquirer/prompts`:
- **Project Name:** Validates non-empty input and folder name conventions.
- **Predefined Roles Selection:** Checkbox prompt offering `admin`, `customer`, `worker`, `manager`, `vendor`, `editor`, `moderator`.
- **Custom Roles:** Allows typing arbitrary comma-separated role names (e.g. `doctor, nurse, receptionist`).
- **Feature Toggles:**
  - `typescript` (default: `true`)
  - `redux` (default: `true`)
  - `rtkQuery` (default: `true` if Redux is enabled)
  - `tailwind` (default: `true`)

### Phase 3: Configuration Normalization
All inputs are consolidated into a strongly typed `ProjectConfig` object:

```typescript
interface ProjectConfig {
  projectName: string;
  roles: string[];           // Selected predefined roles
  customRoles: string[];     // User-entered custom roles
  typescript: boolean;
  redux: boolean;
  rtkQuery: boolean;
  tailwind: boolean;
}
```

### Phase 4: The 11-Step Generation Engine
An instance of `ProjectGenerator` is instantiated and `generator.generate()` executes sequential asynchronous steps with visual spinners powered by `ora` and colored terminal feedback powered by `chalk`.

---

## 4. Deep Dive: The 11 Generation Steps

### Step 1: Next.js Foundation Scaffolding
- **Target:** Root directory `${process.cwd()}/${projectName}`.
- **Safety Check:** Verifies if the target folder exists. If already present, execution halts immediately with a descriptive error.
- **Execution:** Spawns `npx -y create-next-app@latest` with automated flags:
  ```bash
  npx -y create-next-app@latest <projectName> \
    --app \
    --src-dir=false \
    --import-alias=@/* \
    --eslint \
    --no-turbopack \
    --typescript (or --no-typescript) \
    --tailwind (or --no-tailwind)
  ```

### Step 2: Scalable Feature-Based Skeleton Preparation
Ensures a feature-driven hybrid directory structure using `fs-extra`:
- `config/` (Central site metadata & dynamic role-based navigation configs)
- `components/ui/` (Atomic UI primitives: `Button`, `Card`, `Input`, `DataTable`)
- `components/shared/` (Layout shells: `Header`, `Sidebar`, `RoleGuard`)
- `components/feedback/` (`LoadingSpinner`, `EmptyState`)
- `features/auth/` (Isolated auth domain: `components`, `api`, `slice`, `types`)
- `features/user/` (Domain feature space ready for business logic)
- `lib/auth/` (RBAC permissions engine)
- `lib/socket/` (Real-time WebSocket & Socket.io client layer)
- `lib/redux/` & `lib/redux/api/` (Store, typed hooks, provider, base API)
- `constants/` (Role constants)
- `types/` (TypeScript contracts: common, auth, navigation)
- `hooks/` (Custom React hooks: `useAuth`, `useSocket`, `useDebounce`)
- `app/(auth)/` (`login`, `register`, `forgot-password`, `verify-otp`)
- `app/(dashboard)/` (Role-isolated protected route groups)
- `app/unauthorized/` (HTTP 403 Access Denied page)

### Step 3: Atomic UI Primitives & Shared Layouts
Generates reusable components:
- **`lib/utils.ts`:** Utility helper function `cn(...)` combining classes cleanly.
- **`components/ui/Button.tsx`:** Multi-variant (`primary`, `secondary`, `outline`, `danger`, `ghost`) accessible button.
- **`components/ui/Card.tsx`:** Glassmorphic dark card (`Card`, `CardHeader`, `CardTitle`, `CardContent`).
- **`components/ui/Input.tsx`:** Styled input with built-in label and error messaging.
- **`components/ui/DataTable.tsx`:** Enterprise data table with column accessors, custom cells, and empty state support.
- **`components/feedback/`:** `LoadingSpinner.tsx` and `EmptyState.tsx`.
- **`components/shared/Header.tsx`:** Dynamic workspace header displaying active role and user actions.
- **`components/shared/Sidebar.tsx`:** Dynamic role-aware sidebar driven by `config/navigation.ts`.

### Step 4: Central Configuration & Role Navigation
- **`config/site.ts`:** Central site configuration, default role, and metadata.
- **`config/navigation.ts`:** Single-source-of-truth sidebar menu definitions mapped per role (`SIDEBAR_NAV`).
- **`types/common.types.ts`:** Common API and pagination interfaces (`ApiResponse<T>`, `PaginatedResponse<T>`).
- **`types/nav.types.ts`:** Navigation contracts (`NavItem`, `SidebarSection`).

### Step 5: Real-time Socket Layer & Ergonomic Hooks
- **`lib/socket/socketClient.ts`:** Singleton real-time client ready for Socket.io / WebSocket connections.
- **`lib/socket/socketEvents.ts`:** Type-safe socket event dictionary (`NOTIFICATION`, `STATUS_UPDATE`, etc.).
- **`hooks/useSocket.ts`:** Clean declarative React hook for real-time subscription.
- **`hooks/useDebounce.ts`:** Performance optimization hook for search and filter inputs.

### Step 6: Role-Based Nested Layouts & Sub-routes
For every active role (predefined + custom):
1. **Nested Role Layout (`app/(dashboard)/<role>/layout.tsx`):**
   - Renders persistent `<Sidebar role="<role>" />` and `<Header role="<role>" />`.
   - Protects the entire subtree using `<RoleGuard>`.
   - **Crucial Performance Advantage:** Sub-page navigation between routes (e.g. `/admin/dashboard` to `/admin/users`) does NOT re-render the sidebar or header.
2. **Dashboard Console (`app/(dashboard)/<role>/dashboard/page.tsx`):**
   - KPI metrics cards, quick navigation links, and real-time activity table.
3. **Sub-Route Pages (`app/(dashboard)/<role>/<route>/page.tsx`):**
   - Dedicated management screens for each role-specific resource.
4. **App Router Auth Group & Root Overwrite:**
   - `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`
   - `app/(auth)/forgot-password/page.tsx`, `app/(auth)/verify-otp/page.tsx`
   - `app/unauthorized/page.tsx` (403 page)
   - `app/layout.tsx` (wrapped with `ReduxProvider`)
   - `app/page.tsx` (portal landing page)
   - `app/globals.css` (Tailwind dark glassmorphism system)

### Step 7: Redux Toolkit & Feature API Injection
- **`lib/redux/store.ts`:** Central store configured with `authReducer` and RTK Query middleware.
- **`lib/redux/hooks.ts`:** Typed hooks `useAppDispatch` and `useAppSelector`.
- **`lib/redux/provider.tsx`:** Client-side Redux provider component.
- **`lib/redux/api/baseApi.ts`:** Central RTK Query service with automatic authorization token injection.
- **`features/auth/api/authApi.ts`:** Injected authentication endpoints (`login`, `register`, `getMe`).
- **`features/auth/slice/authSlice.ts`:** Dedicated auth state slice.

### Step 8: RBAC Engine, Types & Guard Components
- **`constants/roles.ts`:** Immutable dictionary `ROLES` and union type `Role`.
- **`types/auth.ts`:** User, credentials, and auth response contracts.
- **`lib/auth/permissions.ts`:** Pure helper functions (`hasRole`, `hasAnyRole`, `hasAllRoles`, `getHighestRole`, `getRoleRedirectPath`).
- **`components/shared/RoleGuard.tsx`:** Declarative access guard component.
- **`hooks/useAuth.ts`:** Ergonomic hook exposing current user, role checks, login, and logout.

### Step 9: Edge Middleware Route Protection
- **`middleware.ts`:** Next.js Edge Middleware intercepting route requests and enforcing role paths.

### Step 10: Configuration & Environment Files
- **`role-app.config.ts`:** Centralized project settings.
- **`.env.example` & `.env.local`:** Pre-configured environment variables (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`, `JWT_SECRET`).

### Step 11: Dependency Resolution & Finalization
- Dynamically executes `npm install @reduxjs/toolkit react-redux` in the new project.
- Prints a clear summary with direct links to all isolated role dashboards.

---

## 5. Generated Application Runtime Architecture

### Authentication & Role Resolution Flow

```mermaid
sequenceDiagram
    autonumber
    actor Client as User Browser
    participant Middleware as Next.js Middleware (Edge)
    participant Page as Route Handler / Page.tsx
    participant Guard as RoleGuard Component
    participant Redux as Redux Auth Store

    Client->>Middleware: GET /admin/dashboard
    alt Unauthenticated / No Token
        Middleware-->>Client: 302 Redirect to /login
    else Authenticated
        Middleware->>Page: Forward Request
        Page->>Guard: Render with allowedRoles=['admin']
        Guard->>Redux: Read currentUser from store
        alt Role matches 'admin'
            Guard-->>Client: Render Dashboard & Sidebar
        else Role does not match
            Guard-->>Client: Render fallback or redirect to /unauthorized
        end
    end
```

### Client-Side Protection with RoleGuard & useAuth

```tsx
// Example from generated project:
import { RoleGuard } from "@/components/RoleGuard";
import { ROLES } from "@/constants/roles";
import { useAuth } from "@/hooks/useAuth";

export default function SensitiveManagementPage() {
  const { user, checkRole } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>

      {/* Declarative guard */}
      <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
        <button>Approve Budget</button>
      </RoleGuard>

      {/* Programmatic check */}
      {checkRole(ROLES.ADMIN) && <button>Delete Organization</button>}
    </div>
  );
}
```

### API Data Layer Architecture with RTK Query

The generated project organizes RTK Query using an API injection pattern:

```
lib/redux/api/baseApi.ts  (Base service with baseUrl & auth headers)
          │
          ├──> features/auth/authApi.ts    (injectEndpoints: login, register, me)
          ├──> features/user/userApi.ts    (injectEndpoints: getUsers, updateUser)
          └──> features/order/orderApi.ts  (injectEndpoints: getOrders, createOrder)
```

This ensures zero bundle bloating and allows features to keep their API logic colocated.

---

## 6. Practical Working Procedures for Developers

### Procedure A: Scaffolding a New Application

```bash
# 1. Run the CLI tool
npx create-next-role-app my-saas-platform

# 2. Answer prompt selections:
# - Select roles: admin, customer, vendor
# - Custom roles: manager
# - TypeScript: Yes
# - Redux Toolkit: Yes
# - RTK Query: Yes
# - Tailwind CSS: Yes

# 3. Enter project and run
cd my-saas-platform
npm run dev
```

### Procedure B: Connecting Real Backend Authentication

1. **Configure Environment:**
   In `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/v1
   ```

2. **Connect Middleware Token Checking:**
   In `middleware.ts`, inspect cookies or authorization headers:
   ```typescript
   export function middleware(request: NextRequest) {
     const token = request.cookies.get("auth_token")?.value;
     const { pathname } = request.nextUrl;

     if (pathname.startsWith("/admin") && !token) {
       return NextResponse.redirect(new URL("/login", request.url));
     }

     return NextResponse.next();
   }
   ```

3. **Dispatch Credentials on Login:**
   In `app/(auth)/login/page.tsx`:
   ```typescript
   const dispatch = useAppDispatch();
   
   const handleLogin = async (e: React.FormEvent) => {
     e.preventDefault();
     const res = await apiLogin({ email, password }).unwrap();
     
     // Updates Redux store & localStorage
     dispatch(setCredentials({
       user: res.user,
       token: res.token
     }));
     
     router.push(`/${res.user.roles[0]}/dashboard`);
   };
   ```

### Procedure C: Adding New Roles & Protected Routes

1. **Update Constants (`constants/roles.ts`):**
   ```typescript
   export const ROLES = {
     ADMIN: "admin",
     CUSTOMER: "customer",
     AUDITOR: "auditor", // New role
   } as const;
   ```
2. **Add Route Folder:**
   Create `app/(dashboard)/auditor/dashboard/page.tsx`.
3. **Register Route in Middleware (`middleware.ts`):**
   ```typescript
   const protectedRoutes = ["/admin", "/customer", "/auditor"];
   ```

### Procedure D: Creating New RTK Query Endpoints

Create a feature API file e.g. `features/user/userApi.ts`:

```typescript
import { baseApi } from "@/lib/redux/api/baseApi";
import type { User } from "@/types/auth";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUsersQuery, useDeleteUserMutation } = userApi;
```

---

## 7. CLI Package Development & Maintenance Workflow

### Local Environment Setup
Clone the repository and install dev dependencies:
```bash
git clone https://github.com/your-username/create-next-role-app.git
cd create-next-role-app
npm install
```

### Build Pipeline with tsup
The project compiles TypeScript source files in `src/` to a single production-optimized CommonJS bundle in `dist/index.js` using `tsup`:

```bash
# Production bundle
npm run build

# Watch mode during development
npm run dev
```

### Local Testing & Linking
To test the CLI locally as if it was installed from npm:

```bash
# Symlink CLI package globally
npm link

# Test from any folder
create-next-role-app test-app

# Unlink when finished testing
npm unlink -g create-next-role-app
```

### NPM Publishing Procedure
1. Ensure tests and typechecks pass:
   ```bash
   npm run build
   node bin/cli.js --help
   ```
2. Update version in `package.json`:
   ```bash
   npm version patch  # or minor / major
   ```
3. Publish to npm:
   ```bash
   npm publish --access public
   ```

---

*This document serves as the canonical technical reference for `create-next-role-app` developers, contributors, and maintainers.*
