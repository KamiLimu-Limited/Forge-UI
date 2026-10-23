# Forge Frontend — Conventions (Aider entry point)

> This file exists so Aider picks up project conventions automatically.
> The full conventions live in `CONVECTIONS.md` — read that file for the complete rules.
> This file contains the condensed version Aider needs at the start of every session.

---

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript strict mode + Tailwind CSS
- Design tokens in `src/styles/global.css` — never hardcode a hex value or pixel value
- `font-mono` = JetBrains Mono (headings, titles, buttons, numbers)
- `font-sans` = Hind Guntur (body text, labels, table cells, hints). Body default is 15px `font-sans`.
- API docs at `http://localhost:8000/api/v1/docs`

## What Is Already Built — Do Not Rebuild

- `src/lib/api.ts` — API client. `api.auth.*`, `api.users.*`. Never call `fetch()` anywhere else.
- `src/types/auth.ts` — Auth and user types.
- `src/hooks/useAuth.ts` — Auth context. `useAuth()` returns `{ user, isAuthenticated, isLoading, error, login, logout }`.
- Auth screens complete: `Login`, `Activate`, `ForgotPassword`, `ResetPassword` in `src/views/`, routed from `src/app/(auth)/`.
- `src/components/layout/AppShell.tsx` and `guards.tsx` — signed-in shell and route guards.
- UI components: `Button`, `Input`, `Spinner` in `src/components/ui/`. Check `src/components/README.md` before building.

## Hard Rules

- No `any` types — ever
- No `fetch()` outside `src/lib/api.ts`
- No business logic in components — hooks only
- No hardcoded hex or pixel values — tokens only
- No default exports — named exports only. Exception: `page.tsx`, `layout.tsx` and `not-found.tsx` in `src/app/`, which Next.js requires.
- `'use client'` at the top of any file that uses hooks, state, effects, browser APIs or event handlers
- Sentence case UI copy, no uppercase labels, no emoji or unicode symbols as icons
- Every component handles loading, empty, error, and success states
- Every new component ships with a `.stories.tsx` file
- Mobile-first: 375px base, then `md:` and `lg:` breakpoints
- Wrap async `onSubmit` handlers: `onSubmit={(e) => { void handleSubmit(e) }}`

## File Locations

```
src/components/ui/      Generic reusable components
src/components/forge/   Forge domain components
src/components/layout/  Sidebar, TopBar, PageWrapper
src/hooks/              All custom hooks — business logic lives here
src/lib/api.ts          The only API client
src/types/              TypeScript types per domain (auth.ts, session.ts…)
src/app/                App Router: one folder per route (page.tsx, layout.tsx)
src/views/              The screen component each route renders
```
