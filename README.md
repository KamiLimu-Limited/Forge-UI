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
- The forge-backend running locally at `http://localhost:8000`
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
# Open .env.local and fill in the values

# 4. Start the development server
npm run dev
# App runs at http://localhost:3000

# 5. View the component library
npm run storybook
# Storybook runs at http://localhost:6006
```

### Available Scripts

```bash
npm run dev              # Start the Next.js development server
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
| `NEXT_PUBLIC_API_BASE_URL` | Backend base URL, no trailing slash. Only `NEXT_PUBLIC_` variables reach the browser. |

---

## API Contract

All backend endpoints are documented at `http://localhost:8000/api/v1/docs` when the backend is running locally. Read this before building any component that fetches data. The API client lives at `src/lib/api.ts` — all API calls go through this file.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide on how to pick up issues, branch naming, code standards, and the PR checklist.

---

## Frontend Maintainer

Peter Kioko — [@p3terkioko](https://github.com/p3terkioko)