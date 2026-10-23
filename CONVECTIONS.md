# Forge Frontend — Code and Design Conventions

These conventions apply to every line of code in this repository, whether written by a human or an AI tool. A PR that violates these conventions will not be merged.

---

## Component Conventions

### Folder Structure

```
src/components/
├── ui/       Generic, reusable, no Forge-specific logic
├── forge/    Forge domain components built from ui/ components
└── layout/   Sidebar, TopBar, PageWrapper
```

Before building a new component, check `src/components/README.md` for the full list of what already exists. If it exists, use it. Never build a duplicate.

**ui/ components** are things like Button, Badge, Card, Input, Modal, Spinner, Avatar, Toast. They have no knowledge of sessions, attendance, mentees, or any Forge concept. They accept generic props and render UI.

**forge/ components** are things like SessionRow, AttendanceToggle, GraduationStatus, TrackBadge, PointsCard, LeaderboardRow. They are built by composing ui/ components and they understand Forge's domain — they accept typed Forge data as props.

**layout/ components** are things like Sidebar, TopBar, PageWrapper. They define the structural shell of each view.

### Component Rules

- Components are functions, never classes
- Named exports only. The one exception is Next.js route files in `src/app/` (`page.tsx`, `layout.tsx`, `not-found.tsx`), which must use a default export because the framework requires it. Keep them thin: they render a screen from `src/views/` and nothing else.
- Add `'use client'` at the top of any file that uses hooks, state, effects, browser APIs or event handlers
- Every component has a TypeScript props interface defined above it
- Components do not contain business logic — they call hooks and render
- Every component handles four states: loading, empty, error, and success
- Every new component has a `.stories.tsx` file alongside it in the same folder
- Component files and their story files are named with PascalCase matching the component name

### Example Component Structure

```typescript
interface SessionRowProps {
  session: Session
  windowState: 'open' | 'closed' | 'upcoming'
  onAttendanceSubmit: (status: 'attended' | 'not_attended') => void
}

export function SessionRow({ session, windowState, onAttendanceSubmit }: SessionRowProps) {
  // render only — no fetch calls, no business logic
}
```

---

## Styling Conventions

### Tokens First, Always

All colours, font sizes, spacing, border radii, shadows, and transitions come from CSS custom properties defined in `src/styles/global.css`. The Tailwind config maps these to utility classes.

**Never hardcode a hex value:**
```typescript
// WRONG
style={{ color: '#00b4c2' }}
className="text-[#00b4c2]"

// CORRECT
className="text-teal-500"
style={{ color: 'var(--color-primary)' }}
```

**Never hardcode a pixel value for spacing:**
```typescript
// WRONG
style={{ marginTop: '16px' }}

// CORRECT
className="mt-4"
style={{ marginTop: 'var(--space-4)' }}
```

### Mobile First

Build for 375px before building for 1280px. Every component must be usable on a phone — mentees submit attendance from their phones during or immediately after sessions.

```typescript
// WRONG — desktop first
className="flex-row md:flex-col"

// CORRECT — mobile first
className="flex-col md:flex-row"
```

### Dark Mode

The KamiLimu brand supports both light and dark modes. Dark mode tokens are defined in global.css under `prefers-color-scheme: dark`. Always test components in both modes before opening a PR. Never hardcode a colour that only works in one mode.

### Tailwind

Use Tailwind utility classes for all styling. Do not create custom CSS files for component styles. If you find yourself writing CSS that cannot be expressed in Tailwind utilities, check if there is a CSS variable that should be used instead.

---

## TypeScript Conventions

- Strict mode is on. No exceptions.
- No `any` types, ever. If you do not know the type, look it up in the backend `/docs` and define it in `src/types/`.
- Every component has a typed props interface
- Every API response has a type defined in `src/types/`
- Every custom hook has typed parameters and a typed return value
- Use `unknown` over `any` when the type genuinely cannot be determined

### Types Location

All types that correspond to API response shapes live in `src/types/`. Name them after the resource they represent:

```
src/types/
├── session.ts
├── attendance.ts
├── mentee.ts
├── cohort.ts
└── leaderboard.ts
```

---

## API Conventions

All API calls go through `src/lib/api.ts`. No exceptions.

**Never call fetch() directly in a component or hook:**
```typescript
// WRONG
const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions`)

// CORRECT
import { api } from '@/lib/api'
const sessions = await api.sessions.list(cohortId)
```

The API client handles the Authorization header, base URL, and error parsing in one place. If the backend changes its base URL or auth mechanism, only one file needs to change.

---

## State and Data Conventions

### Hooks Own Logic

Business logic lives in hooks, not in components. A component calls a hook and renders the result.

```typescript
// WRONG — logic in component
function SessionList() {
  const [sessions, setSessions] = useState([])
  useEffect(() => {
    fetch('/sessions').then(r => r.json()).then(setSessions)
  }, [])
  return <div>{sessions.map(...)}</div>
}

// CORRECT — logic in hook
function useSessions(cohortId: string) {
  // fetch, loading, error handling all here
}

function SessionList() {
  const { sessions, isLoading, error } = useSessions(cohortId)
  return <div>{sessions.map(...)}</div>
}
```

### All Four States

Every component that displays async data must handle all four states:

```typescript
if (isLoading) return <Spinner />
if (error) return <ErrorMessage message={error.message} />
if (!data || data.length === 0) return <EmptyState />
return <ActualContent data={data} />
```

A component that renders nothing while loading, crashes on error, or shows a blank screen when empty is not finished.

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `SessionRow.tsx` |
| Hooks | camelCase starting with use | `useSessionList.ts` |
| Screens (`src/views/`) | PascalCase | `Dashboard.tsx` |
| Route files (`src/app/`) | Next.js names | `page.tsx`, `layout.tsx` |
| Types | PascalCase | `Session`, `AttendanceRecord` |
| CSS variables | kebab-case with prefix | `--color-primary` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_SKILL_RATING` |
| Everything else | camelCase | `cohortId`, `windowState` |

---

## Git Conventions

- Branch names follow the format in CONTRIBUTING.md
- Commit messages are written in the imperative: "Add SessionRow component" not "Added SessionRow component"
- One logical change per commit — do not bundle unrelated changes
- Never commit `.env.local` or any file containing real credentials

---

## What Gets Rejected in PR Review

A PR will be rejected if any of the following are true:

- A hardcoded hex value or pixel value exists anywhere in the diff
- A `fetch()` call exists outside `src/lib/api.ts`
- Business logic exists inside a component rather than a hook
- A component does not handle loading, empty, or error states
- TypeScript has `any` anywhere in the diff
- A new component does not have a `.stories.tsx` file
- The component has not been tested at 375px
- The component has not been tested in dark mode
- `npm run lint` or `npm run typecheck` fails