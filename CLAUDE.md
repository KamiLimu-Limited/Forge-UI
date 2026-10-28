# Forge Frontend — Claude Code Instructions

You are working on the frontend repository for Forge, the mentorship management system for KamiLimu — a structured eight-month mentorship programme for undergraduate students in Kenya. Read README.md for full project context before generating anything.

Other AI agents working in this repo have their own config files — see AGENTS.md. Do not duplicate or conflict with work done by other agents. The rules in this file, CONVECTIONS.md, and CONTRIBUTING.md apply to all of them equally.

---

## The Stack

- Next.js 15 (App Router) with React 19 and TypeScript (strict mode)
- Tailwind CSS 3 for styling
- Storybook 8 with the `@storybook/nextjs` framework
- CSS custom properties in `src/styles/global.css` for all design tokens

---

## What Is Already Built

The following are complete and must not be rebuilt or duplicated.

### Foundation
- `src/app/layout.tsx` — Root layout. Imports `global.css`, sets metadata, loads the fonts from `src/app/fonts.ts` (next/font exposes `--font-mono` and `--font-sans`) and mounts `<Providers>` (`src/app/providers.tsx`, which mounts `<AuthProvider>`).
- `src/styles/global.css` — Design tokens and base styles. Body default font is Hind Guntur (`font-sans`) at 15px; headings use JetBrains Mono (`font-mono`).
- `src/lib/api.ts` — The only API client. Exports `api` (typed namespaces: `api.auth.*`, `api.users.*`) and `tokenStore` (JWT read/write/clear). Handles automatic token refresh on 401. Never add a `fetch()` call anywhere else.
- `src/types/auth.ts` — All type definitions for the auth and user domain: `UserRole`, `AccountState`, `UserProfileResponse`, `TokenResponse`, `ApiError`, and all request/response shapes. Add new API types to `src/types/` in their own file as new domains are built.

### Auth Infrastructure
- `src/hooks/useAuth.ts` — Auth context and hook. Exports `<AuthProvider>` (mounted in `src/app/providers.tsx`) and `useAuth()` which returns `{ user, isAuthenticated, isLoading, error, login, logout, clearError }`. Do not create another auth state mechanism.
- `src/components/layout/guards.tsx` — `<RequireAuth>`, `<RedirectIfAuthed>` and `<RequireAdmin>` client guards. Use them in route layouts and pages.
- `src/components/layout/AppShell.tsx` — Role-aware shell for signed-in routes. Nav links per role live in `src/components/layout/navConfig.ts`.
- `src/lib/roles.ts` — `ROLE_LABELS`, `roleLabel()` and `ALL_ROLES`. Use these wherever a role is shown.

### Auth Pages
All four auth screens are complete. Do not rebuild them. Their form logic lives in hooks in `src/hooks/`.
- `src/views/Login.tsx` — Single-step sign in (email and password). Logic in `useLoginForm`.
- `src/views/Activate.tsx` — Account activation. Reads `?token=` from the URL, sets a password, signs the user in. Logic in `useActivateAccount`.
- `src/views/ForgotPassword.tsx` — Requests a password reset email. Logic in `useRequestPasswordReset`.
- `src/views/ResetPassword.tsx` — Completes a reset. Reads `?token=` from the URL. Logic in `useResetPassword`.
- `src/views/admin/Users.tsx` — Admin user list, filters, suspend and reactivate, and the invite dialog.

### UI Components
Check `src/components/README.md` for the complete up-to-date list of every component in `src/components/ui/`, `src/components/forge/`, and `src/components/layout/`. Always check this file before building anything new.

---

## Before Generating Anything

Run through this checklist mentally before writing a single line:

1. Does the component already exist in `src/components/`? Check `src/components/README.md` first.
2. Is there a backend API endpoint for this feature? Check `http://localhost:8000/api/v1/docs`.
3. Are you using design tokens from `src/styles/global.css` and not hardcoding values?
4. Have you handled loading, empty, and error states — not just the happy path?

---

## Component Rules

### Where Things Live

```
src/components/ui/      Generic reusable components with no Forge domain knowledge
                        Examples: Button, Badge, Card, Input, Modal, Spinner, Avatar

src/components/forge/   Forge domain components built from ui/ components
                        Examples: SessionRow, AttendanceToggle, GraduationStatus, TrackBadge

src/components/layout/  Structural shell components
                        Examples: Sidebar, TopBar, PageWrapper

src/hooks/              All custom React hooks — business logic lives here, not in components

src/lib/api.ts          The only place API calls are made — never use fetch() elsewhere

src/types/              TypeScript type definitions for all API response shapes

src/app/                Next.js App Router: one folder per route (page.tsx, layout.tsx)

src/views/              The screen component each route renders
```

### Component Structure

Every component must follow this pattern:

```typescript
// 1. Props interface above the component
interface ComponentNameProps {
  // typed props
}

// 2. Named export (not default export; only page.tsx and layout.tsx use default exports)
export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // 3. Hooks called at the top
  // 4. Render logic — no fetch calls, no business logic
}
```

### Required for Every Component

- A TypeScript props interface
- Handling for loading, empty, error, and success states
- A `.stories.tsx` file alongside it in the same folder
- Mobile-first responsive design (375px before 1280px)
- Dark mode support using the tokens from global.css

---

## Styling Rules

**Never hardcode a hex value:**
```typescript
// WRONG
style={{ color: '#00b4c2' }}
className="text-[#00b4c2]"

// CORRECT
className="text-teal-500"
```

**Never hardcode a pixel spacing value:**
```typescript
// WRONG
style={{ gap: '16px' }}

// CORRECT
className="gap-4"
```

**Always mobile first:**
```typescript
// WRONG
className="flex-row md:flex-col"

// CORRECT
className="flex-col md:flex-row"
```

### KamiLimu Brand Colours

The brand uses two primary colours throughout the UI:

- Teal `#00b4c2` — the KamiLimu signature colour. All primary actions, buttons, links, active states.
- Black `#050505` — primary text and strong UI elements
- Ivory `#f8f9f0` — light mode page backgrounds and surfaces
- Auburn `#ac3931` — danger and at-risk states
- Gamboge `#eaa000` — warning states
- Cal Poly Green `#214e34` — success and on-track states
- Indigo `#1b4864` — informational and secondary states

All of these are defined as tokens in global.css. Use the token names, not the hex values.

### KamiLimu Brand Fonts

- JetBrains Mono — headings, page titles, card titles, the brand wordmark, buttons and numbers
- Hind Guntur — body text, labels, table cells, hints and descriptions

Both are loaded with `next/font/google` in `src/app/fonts.ts`. Use `font-mono` for JetBrains Mono and `font-sans` for Hind Guntur in Tailwind classes.

---

## Routing

- Routes live in `src/app/`. Each route folder has a `page.tsx` that only renders a screen from `src/views/`. Shared wrappers (guards, `AppShell`) go in that route's `layout.tsx`.
- Do not create `src/pages/`. Next.js treats it as the Pages Router.
- The auth screens sit in the `(auth)` route group. `/dashboard` uses `RequireAuth` plus `AppShell`; everything under `/admin` uses `RequireAdmin` plus `AppShell`.
- A screen that reads `useSearchParams()` must be wrapped in `<Suspense>` in its `page.tsx`, or the static build fails.
- Navigate with `useRouter`, `usePathname` and `useSearchParams` from `next/navigation`, and link with `next/link`. Never use a plain `<a href>` for an internal link.
- Auth tokens are in `localStorage`, so auth is client-side only. Do not move it to cookies or middleware.
- Add `'use client'` at the top of any file that uses hooks, state, effects, browser APIs or event handlers. Files without it are server components.
- Default exports are only allowed in `page.tsx`, `layout.tsx` and `not-found.tsx`, because Next.js requires them. Everything else uses named exports.
- The API base URL comes only from `process.env.NEXT_PUBLIC_API_BASE_URL`, read in one place: `src/lib/config.ts` exports `API_BASE_URL`. Never read the variable or write an API address anywhere else in `src/`. Only `NEXT_PUBLIC_` variables reach the browser, so never put database details or secrets in one. See "API environments" below.

---

## Design rules

**Copy**
- Sentence case everywhere. No uppercase labels and no letter-spaced captions. The FORGE wordmark is the only uppercase text.
- No "Step 01" counters, taglines, marketing lines, decorative grids or gradients.
- Plain language a student understands. No em dashes in UI copy. No trailing full stops in titles.
- No emoji or unicode symbols as icons. Use `<Icon>` (inline SVG, `aria-hidden`) next to visible text, or give the control an `aria-label`.

**Type**
- Body text is `font-sans` (Hind Guntur) at 15px (`text-body`).
- `font-mono` (JetBrains Mono) at weight 600 for headings, page titles, card titles, buttons and numbers.
- Sizes: `text-caption` 13px (hints, chips, badges), `text-small` 14px (labels, table text), `text-body` 15px, `text-card-title` 17px, `text-page-mobile` 22px and `text-page` 28px (page titles), `text-subtitle` 24px (auth card title), `text-stat` 32px. Nothing goes below 12px (`text-tab` is for the bottom tab bar only).

**Sizing and colour**
- Anything tappable is at least 44px (`h-control`). Small 36px controls stretch their hit area with a `::before` layer.
- Radius: `rounded-md` (8px) for nav items and small buttons, `rounded-control` (10px) for buttons and inputs, `rounded-lg` (12px) for cards, `rounded-xl` (16px) for the auth card and dialogs.
- Cards use `shadow-card`. Text on teal is black (`text-text-on-primary`); never white.
- Selected states use `bg-accent-bg text-accent-text`, links use `text-link`, disabled controls use `bg-disabled-bg text-disabled-text`. These tokens flip correctly in dark mode.
- Page backgrounds are always `bg-background`. Never use `var(--color-black)` as a background.

---

## API Rules

All API calls go through `src/lib/api.ts`. Never call `fetch()` directly anywhere else.

```typescript
// WRONG
const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/${id}`)

// CORRECT
import { api } from '@/lib/api'
const session = await api.sessions.getById(id)
```

## API environments

The same code runs against a local Forge API and against the deployed API. The only thing that changes is `NEXT_PUBLIC_API_BASE_URL`.

### How the address is chosen

- `src/lib/config.ts` is the only place that reads the variable. It exports `API_BASE_URL`, with any trailing slash trimmed, and `src/lib/api.ts` imports it from there. Nothing else in `src/` reads the variable or holds an API address.
- **Locally**, the value comes from `.env.local`, which git ignores. If the variable is missing while `next dev` is running, the app falls back to `http://localhost:8000` and logs one console warning.
- **On Vercel**, the value comes from the project settings, not from a file.
- Next.js bakes the value into the client bundle at build time. `next.config.ts` makes `next build` fail with a clear message when the variable is missing, so a build can never silently ship with no API address.
- The frontend never connects to the database, and no `NEXT_PUBLIC_` variable holds database details, because those values end up in the browser.

### Local setup

Start the backend from `~/forge-api`:

```bash
cd ~/forge-api
docker compose up -d db              # Postgres in forge-api-db-1 on localhost:5433
source .venv/bin/activate
alembic upgrade head
forge-cli create-admin               # first time only
uvicorn forge.main:app --reload      # API at http://localhost:8000
```

Then start the frontend:

```bash
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local   # once
npm run dev:api-check                # confirms the API answers on /health
npm run dev                          # http://localhost:3000
```

The dev server must run on port 3000. The local API only allows CORS from `http://localhost:3000`, and its email links point there. `npm run dev` pins the port, so it stops with an error if 3000 is already taken instead of moving to 3001.

With no `RESEND_API_KEY` set, the local API sends no emails. `npm run dev:links` reads the local database and prints the newest invitation link and the newest password reset link, ready to open:

```bash
npm run dev:links                    # newest invitation and newest reset link
npm run dev:links -- ada@example.com # newest invitation for one address
```

It reads `FORGE_DB_CONTAINER` (`forge-api-db-1`), `FORGE_DB_NAME` (`forge`), `FORGE_DB_USER` (`forge`) and `FRONTEND_URL` (`http://localhost:3000`). If the container is not running, it tells you to run `docker compose up -d db` in `~/forge-api`. Both helper scripts are for local use only, and the build does not depend on them.

### Deployed setup (Vercel)

- In the Vercel project, set `NEXT_PUBLIC_API_BASE_URL` under Settings > Environment Variables for **Production** and **Preview**. For now it is `https://dev.api.kamilimu.org`. Later it will be the production API.
- Redeploy after any change to the variable. The value is baked in at build time, so a running deployment keeps the old one.
- The deployed API must list the Vercel domain in its `CORS_ORIGINS`, or the browser blocks every request. The backend team manages this.
- Every preview deployment gets a new URL per branch, and those URLs are not in `CORS_ORIGINS`. Test login on the production alias, unless that preview URL has been added to CORS too.

### Testing the login flows

Run through this list locally with `npm run dev`, and again on the deployed alias after changing anything in auth:

- [ ] **Sign in** with the admin from `forge-cli create-admin`. You land on `/dashboard`.
- [ ] **Wrong password** shows an error, and you stay on `/login`.
- [ ] **Rate limit**: 11 failed sign-in attempts within a minute return a 429 (the API allows 10 per 60 seconds). The form shows the error from the API, and sign in works again after a minute.
- [ ] **Invite and activate**: invite a user from `/admin/users`. Open the link from `npm run dev:links -- <email>`, set a password, and you are signed in.
- [ ] **Reusing a used link**: open the same activation link again. It is rejected with a clear message.
- [ ] **Forgot and reset**: request a reset on `/forgot-password`. Open the link from `npm run dev:links`, set a new password, and sign in with it. The old password no longer works.
- [ ] **Staying signed in**: refresh `/dashboard`, and you are still signed in.
- [ ] **Sign out** returns you to `/login`, and `/dashboard` then redirects back to `/login`.

---

## TypeScript Rules

- Strict mode is on — no `any` types, ever
- Use `unknown` if you genuinely do not know the type, then narrow it
- All API response shapes are typed in `src/types/`
- Every hook has typed parameters and a typed return value

---

## State Rules

Business logic lives in hooks. Components only call hooks and render.

```typescript
// WRONG — logic in component
function SessionList() {
  const [data, setData] = useState([])
  useEffect(() => { fetch(...).then(setData) }, [])
}

// CORRECT — logic in hook
function useSessionList(cohortId: string) {
  // all fetch and state logic here
}
function SessionList() {
  const { sessions, isLoading, error } = useSessionList(cohortId)
}
```

---

## What Not to Do

- Do not build a component that already exists in `src/components/`
- Do not call `fetch()` outside `src/lib/api.ts`
- Do not put business logic inside a component
- Do not hardcode any colour, spacing, or font value
- Do not use `any` as a TypeScript type
- Do not build desktop-first and add mobile as an afterthought
- Do not generate a component without a `.stories.tsx` file
- Do not render data without handling loading, empty, and error states