# Forge — Frontend

**The mentorship management system for the KamiLimu Programme.**

Forge is the operational backbone of KamiLimu, a structured eight-month mentorship programme for undergraduate students in Kenya. This repository contains the frontend application. The backend lives in a separate repository maintained by Mark Tanui.

---

## What Forge Does

KamiLimu has historically run its operations across Google Sheets, Google Forms, and email and slack communication. Forge replaces and enhances this with a purpose-built web platform that manages cohort sessions, attendance, points, graduation eligibility, leaderboards, skill tracking, competitions, and extra activities across six distinct user roles.

---

## User Roles

| Role | What they do in Forge |
|---|---|
| Mentee | Track attendance, points, skill progress, graduation status, log extra activities |
| 1:1 Peer Mentor | Monitor assigned mentee group, manage peer mentorship tasks, keep private notes |
| ICT Peer Mentor | Track ICT track mentees, contribute resources, log technical progress notes |
| Professional Mentor | View assigned sessions, read aggregated feedback, manage session resources |
| Committee | Read-only access across everything in the cohort |
| System Admin | Full access, user management, cohort configuration, system settings |

---

## Architecture

```
[Browser]
    |
    | HTTP REST + JWT
    v
[forge-frontend: Next.js on Vercel]
    |
    | HTTP REST + JWT
    v
[forge-backend: FastAPI on Railway]
    |
    | queries + RLS
    v
[Supabase: PostgreSQL + Auth]
    |
    | DMs + channel notifications
    v
[Slack API]
```

This repo is the frontend only. It consumes the backend REST API. It does not connect to Supabase or Slack directly.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) with React 19 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + CSS custom properties |
| Component explorer | Storybook |
| Linting | ESLint |
| Formatting | Prettier |
| Deployment | Vercel |

---

## Directory Structure

```
forge-frontend/
├── public/
│   └── logos/                  # KamiLimu logo assets and favicon
├── .storybook/                 # Storybook config (@storybook/nextjs)
├── src/
│   ├── app/                    # Next.js App Router: one folder per route
│   ├── components/
│   │   ├── ui/                 # Generic reusable components (Button, Badge, Card)
│   │   ├── forge/              # Forge domain components (SessionRow, GraduationStatus)
│   │   └── layout/             # Sidebar, TopBar, PageWrapper
│   ├── hooks/                  # All custom React hooks
│   ├── lib/
│   │   └── api.ts              # Centralised API client — all API calls go here
│   ├── views/                  # The screen component each route renders
│   ├── styles/
│   │   └── global.css         # All design tokens — single source of truth
│   └── types/                  # TypeScript type definitions for all API responses
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   └── frontend.md         # Issue template for frontend tickets
│   ├── workflows/
│   │   └── ci.yml              # CI checks on every PR
│   └── PULL_REQUEST_TEMPLATE.md
├── .env.example                # All required environment variables documented
├── CLAUDE.md                   # Instructions for Claude Code
├── CONTRIBUTING.md             # How to contribute to this repo
├── CONVECTIONS.md              # Code and design standards
└── README.md
```

---

## Local Setup

### Prerequisites

- Node.js 20 or higher
- The Forge API (`~/forge-api`) running locally at `http://localhost:8000`. See [API environments](#api-environments).
- Git

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/kamilimu/forge-frontend.git
cd forge-frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# The default points at the local API, http://localhost:8000

# 4. Start the development server
npm run dev
# App runs at http://localhost:3000

# 5. View the component library
npm run storybook
# Storybook runs at http://localhost:6006
```

### Available Scripts

```bash
npm run dev              # Start the Next.js development server on port 3000
npm run dev:api-check    # Check that the API in NEXT_PUBLIC_API_BASE_URL is up
npm run dev:links        # Print the newest invitation and reset links from the local database
npm run build            # Build for production
npm run start            # Serve the production build locally
npm run lint             # Run ESLint (zero warnings allowed)
npm run typecheck        # Run TypeScript type checker
npm run format           # Run Prettier
npm run format:check     # Check formatting (CI runs this)
npm run storybook        # Start Storybook component explorer
npm run build-storybook  # Build a static Storybook
```

---

## Environment Variables

See `.env.example` for all required variables and instructions on where to get each value.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend base URL, no trailing slash. Only `NEXT_PUBLIC_` variables reach the browser. Required for `next build`. |

---

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

To fill the local API with something to look at, add the admin from `forge-cli create-admin` to `.env.local` (git ignores it) and run the seed:

```bash
FORGE_ADMIN_EMAIL=you@example.com          # in .env.local
FORGE_ADMIN_PASSWORD=your-local-password   # in .env.local
npm run dev:seed
```

It signs in through the API and makes sure there is one active cohort ("Local seed cohort") with 8 KamiLimu months and 4 ICT tracks, 6 sessions across the three categories (one in the past, one a draft), and invitations for 3 mentees, a 1:1 peer mentor and an ICT peer mentor at `+seed-...` aliases of the admin's address. Running it again creates nothing new. It refuses to run against anything but a localhost API. Open the invitation links from `npm run dev:links -- <email>` to activate them; invited people only appear on the assignment screens once they have.

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

## API Contract

All backend endpoints are documented at `http://localhost:8000/api/v1/docs` when the backend is running locally. Read this before building any component that fetches data. The API client lives at `src/lib/api.ts` — all API calls go through this file.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide on how to pick up issues, branch naming, code standards, and the PR checklist.

---

## Frontend Maintainer

Peter Kioko — [@p3terkioko](https://github.com/p3terkioko)