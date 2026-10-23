# GitHub Copilot — Forge Frontend Instructions

You are working on the Forge frontend: the mentorship management system for the KamiLimu programme in Kenya. Read `README.md` for full project context. Read `CONVECTIONS.md` for the complete code and design standards. These instructions are a concise reference — the full rules live in those files.

---

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript (strict mode, no `any`)
- Tailwind CSS
- All design tokens in `src/styles/global.css` — never hardcode a hex value or pixel value
- Body text defaults to Hind Guntur (`font-sans`) at 15px. Headings, titles, buttons and numbers use JetBrains Mono (`font-mono`).

---

## What Is Already Built — Do Not Rebuild

- **API client** → `src/lib/api.ts` — all API calls go here, never use `fetch()` elsewhere. Exports `api` (`api.auth.*`, `api.users.*`) and `tokenStore`.
- **Auth types** → `src/types/auth.ts` — `UserRole`, `AccountState`, `UserProfileResponse`, `TokenResponse`, `ApiError`, all request/response shapes.
- **Auth hook** → `src/hooks/useAuth.ts` — exports `<AuthProvider>` and `useAuth()`. Do not create another auth state mechanism.
- **Auth screens** → `Login`, `Activate`, `ForgotPassword`, `ResetPassword` in `src/views/`, routed from `src/app/(auth)/`.
- **Shell and guards** → `src/components/layout/AppShell.tsx` and `guards.tsx`.
- **UI components** → Check `src/components/README.md` before building anything. `Button`, `Input`, and `Spinner` exist. Do not duplicate them.

---

## Non-negotiable Rules

**Components**
- Props interface defined above every component
- Named exports only — no default exports, except `page.tsx`, `layout.tsx` and `not-found.tsx` in `src/app/` (Next.js requires them)
- `'use client'` at the top of any file that uses hooks, state, effects, browser APIs or event handlers
- Business logic in hooks (`src/hooks/`), not in components
- Every component handles loading, empty, error, and success states
- Every new component ships with a `.stories.tsx` file in the same folder

**Styling**
- No hardcoded hex values — use Tailwind classes mapped to tokens (e.g. `text-teal-500`, `bg-surface`)
- No hardcoded pixel values — use Tailwind spacing classes (e.g. `gap-4`, `px-6`)
- Mobile-first: write base styles for 375px, then add `md:` and `lg:` breakpoints

**API**
- `api.{namespace}.{method}()` only — never `fetch()` in a component or hook
- All new API response shapes go in `src/types/` in their own file

**TypeScript**
- Strict mode is on — `no any`, ever. Use `unknown` and narrow if the type is genuinely uncertain.

---

## File Locations

```
src/components/ui/      Generic reusable — Button, Input, Spinner, Badge, Card…
src/components/forge/   Forge domain — SessionRow, GraduationStatus, TrackBadge…
src/components/layout/  Shell — Sidebar, TopBar, PageWrapper
src/hooks/              All custom hooks — business logic lives here
src/lib/api.ts          The only API client — never call fetch() elsewhere
src/types/              TypeScript types for all API response shapes
src/app/                App Router: one folder per route (page.tsx, layout.tsx)
src/views/              The screen component each route renders
```

API documentation: `http://localhost:8000/api/v1/docs`
