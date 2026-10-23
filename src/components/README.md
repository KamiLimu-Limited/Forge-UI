# Component Registry

**This is the single source of truth for every component in this repository.**

Before building any component, check this list. If it exists here, use it — do not build a duplicate. When you add a new component, add it to this file in the same PR.

---

## ui/ — Generic, reusable, no Forge domain knowledge

These components have no knowledge of sessions, mentees, attendance, or any Forge concept. They accept generic props and render UI. They must work in any context.

| Component | File             | Description                                                                                                                      |
| --------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `Button`  | `ui/Button.tsx`  | Primary, ghost, and danger variants. Sizes: sm, md, lg. Supports `isLoading` and `fullWidth`.                                    |
| `Input`   | `ui/Input.tsx`   | Text input with optional label, error message, and hint. Accessible — wires `aria-invalid` and `aria-describedby` automatically. |
| `Spinner` | `ui/Spinner.tsx` | Loading indicator. Sizes: sm, md, lg.                                                                                            |
| `Badge`   | `ui/Badge.tsx`   | Inline status pill. Variants: success, warning, danger, info, neutral.                                                           |
| `Modal`   | `ui/Modal.tsx`   | Dialog overlay. Props: isOpen, onClose, title, children, footer, width (sm/md/lg). Closes on Escape.                             |

**Not yet built** (build these when first needed, following CONVECTIONS.md):
Avatar, Card, Toast, Select, Checkbox, Textarea

---

## forge/ — Forge domain components

These are built by composing `ui/` components. They understand Forge concepts — they accept typed Forge data as props (sessions, mentees, attendance records, etc.).

| Component    | File | Description |
| ------------ | ---- | ----------- |
| _(none yet)_ | —    | —           |

**Candidates** (build when the relevant page is being built):
SessionRow, AttendanceToggle, GraduationStatus, TrackBadge, PointsCard, LeaderboardRow, MenteeCard, SessionCard

---

## layout/ — Structural shell components

These define the structural skeleton of authenticated views.

| Component     | File                     | Description                                                                                  |
| ------------- | ------------------------ | -------------------------------------------------------------------------------------------- |
| `Sidebar`     | `layout/Sidebar.tsx`     | Fixed left nav for admin. Shows brand, nav items with active state, user name, and sign-out. |
| `TopBar`      | `layout/TopBar.tsx`      | Page header bar. Accepts a `title` string.                                                   |
| `AdminLayout` | `layout/AdminLayout.tsx` | Full admin shell. Renders `<Sidebar>` + `<Outlet>`. Used as a layout route in App.tsx.       |

**Candidates** (build when the dashboard shell is being built):
PageWrapper

---

## Rules for adding to this registry

1. Add the entry to this table in the same PR as the component itself.
2. Include a one-line description that explains what the component does and any important props or variants.
3. Move candidates from "Not yet built" to the table when implemented.
4. Never remove a component from this list without also deleting the file — the two must stay in sync.
