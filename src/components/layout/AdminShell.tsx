'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { StatusChip } from '@/components/forge/StatusChip'
import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useActiveCohort, type ActiveCohortContextValue } from '@/hooks/useActiveCohort'
import { useAuth } from '@/hooks/useAuth'
import { cx } from '@/lib/cx'
import { Brand } from './Brand'
import { ADMIN_NAV, adminNavMatches } from './navConfig'

interface AdminShellProps {
  children: ReactNode
}

const ROLE_LABEL = 'System Admin'

// ---------------------------------------------------------------------------
// Cohort card (sidebar) and cohort pill (mobile top bar)
// ---------------------------------------------------------------------------

interface CohortControlProps {
  active: ActiveCohortContextValue
  onOpenPicker: () => void
}

function cohortTitle(active: ActiveCohortContextValue): string {
  if (active.isLoading) return 'Loading cohorts'
  if (active.error) return "Cohorts didn't load"
  return active.cohort?.name ?? 'No cohorts yet'
}

function CohortCard({ active, onOpenPicker }: CohortControlProps) {
  const canSwitch = active.cohorts.length > 1
  const content = (
    <>
      <span className="flex min-w-0 items-center gap-2 truncate font-sans text-small font-semibold text-text-primary">
        {active.isLoading && <Spinner size="sm" label="Loading cohorts" />}
        <span className="truncate">{cohortTitle(active)}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1 font-sans text-caption text-text-muted">
        {ROLE_LABEL}
        {canSwitch && <Icon name="swap" className="size-4 text-text-secondary" />}
      </span>
    </>
  )
  const classes =
    'flex min-h-control w-full items-center justify-between gap-2 rounded-control border border-border bg-background px-3 py-2 text-left'

  if (!canSwitch) return <div className={classes}>{content}</div>
  return (
    <button
      type="button"
      onClick={onOpenPicker}
      aria-label={`${cohortTitle(active)}. Switch cohort`}
      className={cx(classes, 'hover:border-border-strong')}
    >
      {content}
    </button>
  )
}

function CohortPill({ active, onOpenPicker }: CohortControlProps) {
  const canSwitch = active.cohorts.length > 1
  const classes =
    'inline-flex h-control-sm min-w-0 max-w-full items-center gap-1 rounded-full border border-border bg-surface px-3 font-sans text-caption text-text-primary'
  if (!canSwitch) return <span className={cx(classes, 'truncate')}>{cohortTitle(active)}</span>
  return (
    <button
      type="button"
      onClick={onOpenPicker}
      aria-label={`${cohortTitle(active)}. Switch cohort`}
      className={cx(
        classes,
        "relative before:absolute before:inset-x-0 before:-inset-y-1 before:content-['']"
      )}
    >
      <span className="truncate">{cohortTitle(active)}</span>
      <Icon name="chevron-down" className="size-4" />
    </button>
  )
}

// ---------------------------------------------------------------------------
// Navigation list, shared by the sidebar and the mobile menu
// ---------------------------------------------------------------------------

interface NavListProps {
  pathname: string
  onNavigate?: () => void
}

function NavList({ pathname, onNavigate }: NavListProps) {
  return (
    <ul className="flex flex-col gap-0.5">
      {ADMIN_NAV.map((item) => {
        const isActive = adminNavMatches(item.href, pathname)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? 'page' : undefined}
              className={cx(
                // 40px tall; the ::before layer reaches 44px without overlapping the next item
                "relative flex h-10 items-center rounded-md px-3 font-sans text-body no-underline transition-colors duration-fast before:absolute before:inset-x-0 before:-inset-y-0.5 before:content-[''] hover:no-underline",
                isActive
                  ? 'bg-accent-bg font-semibold text-accent-text'
                  : 'text-text-secondary hover:bg-background hover:text-text-primary'
              )}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

// ---------------------------------------------------------------------------
// Cohort picker and mobile menu dialogs
// ---------------------------------------------------------------------------

interface CohortPickerProps {
  active: ActiveCohortContextValue
  isOpen: boolean
  onClose: () => void
}

function CohortPicker({ active, isOpen, onClose }: CohortPickerProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Switch cohort" width="sm">
      <ul className="flex flex-col gap-2">
        {active.cohorts.map((cohort) => {
          const isCurrent = cohort.id === active.cohortId
          return (
            <li key={cohort.id}>
              <button
                type="button"
                aria-current={isCurrent ? 'true' : undefined}
                onClick={() => {
                  active.setCohortId(cohort.id)
                  onClose()
                }}
                className={cx(
                  'flex min-h-control w-full items-center justify-between gap-3 rounded-control border px-3 py-2 text-left font-sans text-body',
                  isCurrent
                    ? 'border-teal-500 bg-accent-bg font-semibold text-accent-text'
                    : 'border-border text-text-primary hover:bg-background'
                )}
              >
                <span className="truncate">{cohort.name}</span>
                <span className="flex shrink-0 items-center gap-2">
                  <StatusChip kind="cohort" status={cohort.status} />
                  {isCurrent && <Icon name="check" className="size-4" />}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </Modal>
  )
}

interface UserBlockProps {
  fullName: string
  cohortName: string | null
  onSignOut: () => void
}

function UserBlock({ fullName, cohortName, onSignOut }: UserBlockProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={fullName || ROLE_LABEL} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-sans text-small font-semibold text-text-primary">
          {fullName}
        </span>
        <span className="truncate font-sans text-caption text-text-muted">
          {cohortName ?? ROLE_LABEL}
        </span>
      </div>
      <button
        type="button"
        onClick={onSignOut}
        className="inline-flex min-h-control shrink-0 items-center font-sans text-caption font-semibold text-link underline hover:no-underline"
      >
        Sign out
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

export function AdminShell({ children }: AdminShellProps) {
  const { user, logout } = useAuth()
  const active = useActiveCohort()
  const pathname = usePathname()
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : ''
  const cohortName = active.cohort?.name ?? null
  const signOut = () => {
    setIsMenuOpen(false)
    void logout()
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-sidebar shrink-0 flex-col gap-6 border-r border-border bg-surface px-4 py-6 md:flex">
        <div className="px-2">
          <Brand href="/admin" />
        </div>
        <CohortCard active={active} onOpenPicker={() => setIsPickerOpen(true)} />
        <nav aria-label="Main" className="flex-1 overflow-y-auto">
          <NavList pathname={pathname} />
        </nav>
        <div className="flex flex-col gap-3 border-t border-border pt-4">
          <ThemeToggle className="self-start" />
          <UserBlock fullName={fullName} cohortName={cohortName} onSignOut={signOut} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-sticky flex h-14 items-center justify-between gap-2 border-b border-border bg-surface pl-4 pr-1 md:hidden">
          <Brand href="/admin" />
          <div className="flex min-w-0 items-center gap-1">
            <CohortPill active={active} onOpenPicker={() => setIsPickerOpen(true)} />
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-haspopup="dialog"
              aria-label="Open menu"
              className="flex size-control shrink-0 items-center justify-center rounded-md text-text-primary hover:bg-background"
            >
              <Icon name="menu" />
            </button>
          </div>
        </header>

        <main className="flex min-w-0 flex-1 flex-col gap-4 p-4 md:gap-6 md:px-10 md:pb-12 md:pt-8">
          {children}
        </main>
      </div>

      {active.cohorts.length > 1 && (
        <CohortPicker
          active={active}
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
        />
      )}

      <Modal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} title="Menu" width="sm">
        <div className="flex flex-col gap-5">
          <nav aria-label="Main">
            <NavList pathname={pathname} onNavigate={() => setIsMenuOpen(false)} />
          </nav>
          <div className="flex flex-col gap-4 border-t border-border pt-4">
            <ThemeToggle className="self-start" />
            <UserBlock fullName={fullName} cohortName={cohortName} onSignOut={signOut} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
