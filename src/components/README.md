# Component Registry

**This is the single source of truth for every component in this repository.**

Before building any component, check this list. If it exists here, use it. Do not build a duplicate. When you add a new component, add it to this file in the same PR.

Every component below has a `.stories.tsx` file next to it. Run `npm run storybook` to see each one in every state.

---

## ui/: generic, reusable, no Forge domain knowledge

These components have no knowledge of sessions, mentees, attendance, or any Forge concept. They accept generic props and render UI. They must work in any context.

| Component          | File                      | Description                                                                                                                                                                                                                                                                                                                                               |
| ------------------ | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`           | `ui/Button.tsx`           | Variants: `primary` (teal, black text, hover teal-300), `secondary` (white, strong border, black text, hover ivory), `danger` (white, auburn border and text). `ghost` is a deprecated alias of `secondary`. Sizes: `sm` (36px, hit area stretched to 44px), `md` (44px), `lg` (52px). Supports `isLoading` and `fullWidth`. Defaults to `type="button"`. |
| `Input`            | `ui/Input.tsx`            | Text input inside a `Field`. Label above, optional `labelAside`, `hint` and `error`. Wires `aria-invalid` and `aria-describedby`.                                                                                                                                                                                                                         |
| `PasswordInput`    | `ui/PasswordInput.tsx`    | Controlled password input with a show or hide toggle. Pass `rules` (for example `PASSWORD_RULES` from `@/lib/password`) to render a live checklist.                                                                                                                                                                                                       |
| `Select`           | `ui/Select.tsx`           | Native select styled like `Input`. Takes `options` and an optional `placeholder`.                                                                                                                                                                                                                                                                         |
| `Textarea`         | `ui/Textarea.tsx`         | Multi-line input styled like `Input`, 110px minimum height.                                                                                                                                                                                                                                                                                               |
| `Field`            | `ui/Field.tsx`            | Label, control, hint and error wrapper used by the inputs above. Also exports `controlClasses()` and `fieldDescribedBy()`.                                                                                                                                                                                                                                |
| `Badge`            | `ui/Badge.tsx`            | 13px status pill. Variants: success, warning, danger, info, neutral.                                                                                                                                                                                                                                                                                      |
| `Chip`             | `ui/Chip.tsx`             | 13px pill with a border. Variants: default, on, warn, ok, err, info, draft. Pass `onClick` and `pressed` to make it a toggle button (used for filters and role pickers).                                                                                                                                                                                  |
| `Card`             | `ui/Card.tsx`             | White surface with border, radius-lg and shadow-card. Optional `title` and `action` header row. `flush` removes body padding for tables.                                                                                                                                                                                                                  |
| `StatTile`         | `ui/StatTile.tsx`         | Label, big mono number and optional note, built on `Card`. Handles `isLoading`, `error` and an empty (`null`) value.                                                                                                                                                                                                                                      |
| `SegmentedControl` | `ui/SegmentedControl.tsx` | Equal-width options in one bordered group. `role="tablist"`, arrow keys move between options.                                                                                                                                                                                                                                                             |
| `Table`            | `ui/Table.tsx`            | `Table`, `TableHead`, `TableBody`, `TableRow` (`highlight`), `TableHeaderCell` and `TableCell` (`num` for right-aligned mono numbers). Scrolls sideways on narrow screens.                                                                                                                                                                                |
| `EmptyState`       | `ui/EmptyState.tsx`       | Centred icon in a teal circle, title, description and optional action.                                                                                                                                                                                                                                                                                    |
| `Avatar`           | `ui/Avatar.tsx`           | 36px circle with initials from a `name`.                                                                                                                                                                                                                                                                                                                  |
| `Modal`            | `ui/Modal.tsx`            | Dialog. Props: isOpen, onClose, title, children, footer, width (sm/md/lg). Traps focus while open, returns focus on close, closes on Escape or backdrop click.                                                                                                                                                                                            |
| `Spinner`          | `ui/Spinner.tsx`          | Loading indicator. Sizes: sm, md, lg. Optional `label` for screen readers.                                                                                                                                                                                                                                                                                |
| `Icon`             | `ui/Icon.tsx`             | Inline SVG icons (`alert`, `check`, `chevron-down`, `close`, `eye`, `eye-off`, `home`, `inbox`, `plus`, `swap`, `user`, `users`). Always `aria-hidden`; pair with text or an `aria-label`. Never use emoji or unicode symbols as icons.                                                                                                                   |
| `TextLink`         | `ui/TextLink.tsx`         | teal-700 `next/link` text link. `layout="block"` gives a 44px tall target; `layout="inline"` stretches its hit area for use in a label row.                                                                                                                                                                                                               |

**Not yet built** (build these when first needed, following CONVECTIONS.md):
Toast, Checkbox

---

## forge/: Forge domain components

These are built by composing `ui/` components. They understand Forge concepts and accept typed Forge data as props (sessions, mentees, attendance records, etc.).

| Component    | File | Description |
| ------------ | ---- | ----------- |
| _(none yet)_ |      |             |

**Candidates** (build when the relevant page is being built):
SessionRow, AttendanceToggle, GraduationStatus, TrackBadge, PointsCard, LeaderboardRow, MenteeCard, SessionCard

---

## layout/: structural shell components

These define the structural skeleton of each view.

| Component                                         | File                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppShell`                                        | `layout/AppShell.tsx`     | Role-aware shell for signed-in routes (used by `src/app/dashboard/layout.tsx` and `src/app/admin/layout.tsx`). Desktop: 248px sidebar with brand, cohort card, nav and user block. Mobile: top bar with a cohort pill, sticky bottom tab bar and a "Me" dialog with sign out. Nav comes from `layout/navConfig.ts`; cohort and nav logic lives in `hooks/useShellNav.ts`. The cohort switcher only appears when the user has roles in more than one cohort. |
| `PageHeader`                                      | `layout/PageHeader.tsx`   | Page title (22px mobile, 28px desktop), optional `subtitle` and right-side `action`.                                                                                                                                                                                                                                                                                                                                                                        |
| `TopBar`                                          | `layout/TopBar.tsx`       | Deprecated alias of `PageHeader`. Use `PageHeader` in new code.                                                                                                                                                                                                                                                                                                                                                                                             |
| `AuthLayout`                                      | `layout/AuthLayout.tsx`   | Centred 440px card on the ivory background for the sign in, activate and password screens. Shows the KamiLimu logo, a `title` and an optional `description`.                                                                                                                                                                                                                                                                                                |
| `Brand`                                           | `layout/Brand.tsx`        | Teal mark with a black "F" and the FORGE wordmark. Used in the `AppShell`.                                                                                                                                                                                                                                                                                                                                                                                  |
| `KamiLimuLogo`                                    | `layout/KamiLimuLogo.tsx` | The full KamiLimu wordmark from `public/logos/`. Swaps to an ivory-lettered file in dark mode. Optional `className` sets the width (default `w-48 md:w-56`).                                                                                                                                                                                                                                                                                                |
| `RequireAuth`, `RedirectIfAuthed`, `RequireAdmin` | `layout/guards.tsx`       | Client-side route guards. Show a full-screen spinner while auth loads or while redirecting with `router.replace`. `RequireAuth` sends signed-out users to `/login`, `RedirectIfAuthed` sends signed-in users to `/dashboard`, and `RequireAdmin` also sends non-admins to `/dashboard`.                                                                                                                                                                     |

Supporting files: `layout/navConfig.ts` (`NAV_BY_ROLE`, the nav links per `UserRole`).

**Candidates:**
PageWrapper

---

## Rules for adding to this registry

1. Add the entry to this table in the same PR as the component itself.
2. Include a one-line description that explains what the component does and any important props or variants.
3. Move candidates from "Not yet built" to the table when implemented.
4. Never remove a component from this list without also deleting the file. The two must stay in sync.
