# Contributing to Forge Frontend

This is the frontend repository for Forge, the mentorship management system for KamiLimu. Read this document fully before picking up your first issue.

---

## Before You Start

This repo is the frontend only. The backend lives in a separate repository. You do not need to understand the backend codebase to contribute here, but you do need the backend running locally so you can test your work end to end.

Make sure you have:
- Node.js 20 or higher
- The forge-backend running locally at `http://localhost:8000`
- Read README.md so you understand what Forge is and who uses it

---

## Picking Up Work

1. Go to the [Issues tab](../../issues)
2. Filter by the `frontend` label
3. Look for issues also tagged `good first issue` if you are new to the codebase
4. Read the issue fully before commenting — make sure you understand what needs to be built and which API endpoint it consumes
5. Comment on the issue to say you are picking it up
6. Wait for the maintainer to assign it to you before starting

Do not start work on an issue tagged `blocked` — it depends on something that has not shipped yet.

---

## Branch Naming

Every branch must follow this format:

```
feature/FORGE-{issue-number}-short-description
```

Examples:
```
feature/FORGE-010-session-row-component
feature/FORGE-014-impostor-syndrome-test
feature/FORGE-018-attendance-toggle
```

Bug fixes use:
```
fix/FORGE-{issue-number}-short-description
```

---

## The API Contract

Before building any component that fetches data, open the backend API docs at:

```
http://localhost:8000/api/v1/docs
```

This is the single source of truth for every endpoint — what it expects, what it returns, and what errors it produces. All API calls in this repo go through `src/lib/api.ts`. Never call `fetch()` directly inside a component or hook.

If the backend endpoint for your feature does not exist yet, your issue will be tagged `blocked`. Pick up a different issue and come back when the endpoint is ready.

---

## Issue Template

Every frontend issue must include:

```
**What needs to be built**
A clear description of the component, page, or behaviour.

**API endpoint it consumes**
GET /sessions/{cohort_id}
Response shape: [link to /docs or paste the schema]

**Relevant PRD section**
e.g. Section 8.1 — Mentee Dashboard

**Acceptance criteria**
- [ ] Component renders correctly for all expected states
- [ ] Loading state is handled
- [ ] Empty state is handled
- [ ] Error state is handled
- [ ] Responsive at 375px and 1280px
- [ ] Dark mode works correctly
```

---

## Code Standards

Read CONVENTIONS.md for the full standards. The short version:

- Never hardcode a hex value or pixel value — use tokens from `src/styles/global.css`
- Never call `fetch()` directly — use `src/lib/api.ts`
- Never put business logic in a component — put it in a hook in `src/hooks/`
- Always handle loading, empty, and error states
- Always build mobile first (375px before 1280px)
- No `any` types in TypeScript
- Every new component needs a `.stories.tsx` file

---

## Before Opening a PR

You must have tested the full end to end flow locally before opening a PR. This means:

- The backend is running at `http://localhost:8000`
- You have performed the user action your feature implements, from the UI through to the database and back
- You have tested at both 375px and 1280px viewport widths
- You have tested in both light mode and dark mode
- `npm run lint` passes with no errors
- `npm run typecheck` passes with no errors
- `npm run format:check` passes

If any of these are not true, do not open the PR yet.

---

## PR Checklist

Your PR description must include the issue number it closes and confirmation of the following:

```
Closes #[issue number]

- [ ] Lint passes (npm run lint)
- [ ] Type check passes (npm run typecheck)
- [ ] Full e2e flow tested locally with backend running
- [ ] Tested at 375px (mobile)
- [ ] Tested at 1280px (desktop)
- [ ] Light mode tested
- [ ] Dark mode tested
- [ ] All states handled: loading, empty, error, success
- [ ] No hardcoded hex values or pixel values
- [ ] All API calls go through src/lib/api.ts
- [ ] New component has a .stories.tsx file
- [ ] Types added to src/types/ if new API response shapes were introduced
```

---

## AI Tools

AI coding agents are welcome and encouraged. AI-generated code is held to the same standard as human-written code — same PR review, same lint and typecheck requirements. The contributor is responsible for the quality of whatever they submit regardless of how it was generated.

Read **`AGENTS.md`** for the full guide on which configuration file each tool reads and how to invoke it correctly for this project. The supported agents are:

| Tool | Config file | Loaded |
|---|---|---|
| Claude Code | `CLAUDE.md` | Automatically |
| GitHub Copilot | `.github/copilot-instructions.md` | Automatically |
| Cursor | `.cursor/rules/forge.mdc` | Automatically |
| Windsurf | `.windsurfrules` | Automatically |
| Aider | `CONVENTIONS.md` | Automatically |

None of these require manual briefing — each tool picks up its config file automatically when you open this repository.

---

## Storybook

Every new component must have a `.stories.tsx` file alongside it. Before building anything new, open Storybook and check if a similar component already exists:

```bash
npm run storybook
```

If it exists, use it. Do not build a duplicate.

---

## Frontend Maintainer

Peter Kioko — [@p3terkioko](https://github.com/p3terkioko)

If you are unsure about anything, open a GitHub Discussion rather than guessing. Raise it before writing code, not after.