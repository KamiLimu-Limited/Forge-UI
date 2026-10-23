'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useShellNav, type RoleContext, type ShellNav } from '@/hooks/useShellNav'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Modal } from '@/components/ui/Modal'
import { cx } from '@/lib/cx'
import { Brand } from './Brand'

interface AppShellProps {
  children: ReactNode
}

// Cohort name when the API provides one, otherwise the role only
function contextTitle(context: RoleContext): string {
  return context.cohortName ?? context.roleLabel
}

// ---------------------------------------------------------------------------
// Cohort card (sidebar) and cohort pill (mobile top bar)
// ---------------------------------------------------------------------------

interface CohortControlProps {
  context: RoleContext
  canSwitch: boolean
  onOpenSwitcher: () => void
}

function CohortCard({ context, canSwitch, onOpenSwitcher }: CohortControlProps) {
  const content = (
    <>
      <span className="min-w-0 truncate font-sans text-small font-semibold text-text-primary">
        {contextTitle(context)}
      </span>
      {context.cohortName && (
        <span className="shrink-0 font-sans text-caption text-text-muted">{context.roleLabel}</span>
      )}
      {canSwitch && <Icon name="swap" className="size-4 shrink-0 text-text-secondary" />}
    </>
  )
  const classes =
    'flex min-h-control w-full items-center justify-between gap-2 rounded-control border border-border bg-background px-3 py-2 text-left'

  if (!canSwitch) return <div className={classes}>{content}</div>
  return (
    <button
      type="button"
      onClick={onOpenSwitcher}
      aria-label={`${contextTitle(context)}. Switch cohort`}
      className={cx(classes, 'hover:border-border-strong')}
    >
      {content}
    </button>
  )
}

function CohortPill({ context, canSwitch, onOpenSwitcher }: CohortControlProps) {
  const label = context.cohortName
    ? `${context.cohortName}, ${context.roleLabel}`
    : context.roleLabel
  const classes =
    'inline-flex h-control-sm min-w-0 max-w-full items-center gap-1 rounded-full border border-border bg-surface px-3 font-sans text-caption text-text-primary'

  if (!canSwitch) return <span className={cx(classes, 'truncate')}>{label}</span>
  return (
    <button
      type="button"
      onClick={onOpenSwitcher}
      aria-label={`${label}. Switch cohort`}
      className={cx(
        classes,
        "relative before:absolute before:inset-x-0 before:-inset-y-1 before:content-['']"
      )}
    >
      <span className="truncate">{label}</span>
      <Icon name="chevron-down" className="size-4" />
    </button>
  )
}

// ---------------------------------------------------------------------------
// Desktop sidebar
// ---------------------------------------------------------------------------

interface SidebarProps {
  nav: ShellNav
  fullName: string
  onOpenSwitcher: () => void
  onSignOut: () => void
}

function Sidebar({ nav, fullName, onOpenSwitcher, onSignOut }: SidebarProps) {
  const showHeadings = nav.groups.length > 1

  return (
    <aside className="sticky top-0 hidden h-screen w-sidebar shrink-0 flex-col gap-6 border-r border-border bg-surface px-4 py-6 md:flex">
      <div className="px-2">
        <Brand />
      </div>

      {nav.active && (
        <CohortCard
          context={nav.active}
          canSwitch={nav.canSwitch}
          onOpenSwitcher={onOpenSwitcher}
        />
      )}

      <nav aria-label="Main" className="flex flex-1 flex-col gap-4 overflow-y-auto">
        {nav.groups.length === 0 && (
          <p className="px-3 font-sans text-caption text-text-muted">
            Your pages will show up here.
          </p>
        )}
        {nav.groups.map((group) => (
          <div key={group.heading} className="flex flex-col gap-1">
            {showHeadings && (
              <p className="px-3 pb-1 font-sans text-caption text-text-muted">{group.heading}</p>
            )}
            {group.items.map((item) => {
              const isActive = nav.isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cx(
                    'flex h-10 items-center gap-3 rounded-md px-3 py-2 font-sans text-body no-underline transition-colors duration-fast hover:no-underline',
                    isActive
                      ? 'bg-accent-bg font-semibold text-accent-text'
                      : 'text-text-secondary hover:bg-background hover:text-text-primary'
                  )}
                >
                  <Icon name={item.icon} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-3 border-t border-border pt-4">
        <Avatar name={fullName} />
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-sans text-small font-semibold text-text-primary">
            {fullName}
          </span>
          {nav.active && (
            <span className="truncate font-sans text-caption text-text-muted">
              {nav.active.roleLabel}
            </span>
          )}
          <button
            type="button"
            onClick={onSignOut}
            className="self-start font-sans text-caption font-semibold text-link hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}

// ---------------------------------------------------------------------------
// Mobile top bar and bottom tab bar
// ---------------------------------------------------------------------------

interface MobileTopBarProps {
  nav: ShellNav
  onOpenSwitcher: () => void
}

function MobileTopBar({ nav, onOpenSwitcher }: MobileTopBarProps) {
  return (
    <header className="sticky top-0 z-sticky flex h-14 items-center justify-between gap-3 border-b border-border bg-surface px-4 md:hidden">
      <Brand />
      {nav.active && (
        <div className="flex min-w-0 justify-end">
          <CohortPill
            context={nav.active}
            canSwitch={nav.canSwitch}
            onOpenSwitcher={onOpenSwitcher}
          />
        </div>
      )}
    </header>
  )
}

interface BottomTabBarProps {
  nav: ShellNav
  isMeOpen: boolean
  onOpenMe: () => void
}

const tabClasses =
  'flex h-control-lg flex-1 flex-col items-center justify-center gap-0.5 font-sans text-tab no-underline hover:no-underline'

function BottomTabBar({ nav, isMeOpen, onOpenMe }: BottomTabBarProps) {
  return (
    <nav
      aria-label="Main"
      className="sticky bottom-0 z-sticky flex border-t border-border bg-surface md:hidden"
    >
      {nav.items.map((item) => {
        const isActive = nav.isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cx(
              tabClasses,
              isActive ? 'font-semibold text-link' : 'text-text-muted hover:text-text-primary'
            )}
          >
            <Icon name={item.icon} className="size-tab-icon" />
            {item.label}
          </Link>
        )
      })}
      <button
        type="button"
        onClick={onOpenMe}
        aria-haspopup="dialog"
        className={cx(
          tabClasses,
          isMeOpen ? 'font-semibold text-link' : 'text-text-muted hover:text-text-primary'
        )}
      >
        <Icon name="user" className="size-tab-icon" />
        Me
      </button>
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Dialogs
// ---------------------------------------------------------------------------

interface CohortSwitcherProps {
  nav: ShellNav
  isOpen: boolean
  onClose: () => void
}

function CohortSwitcher({ nav, isOpen, onClose }: CohortSwitcherProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Switch cohort" width="sm">
      <ul className="flex flex-col gap-2">
        {nav.contexts.map((context) => {
          const isCurrent = context.key === nav.active?.key
          return (
            <li key={context.key}>
              <button
                type="button"
                aria-current={isCurrent ? 'true' : undefined}
                onClick={() => {
                  nav.setActiveKey(context.key)
                  onClose()
                }}
                className={cx(
                  'flex min-h-control w-full items-center justify-between gap-3 rounded-control border px-3 py-2 text-left font-sans text-body',
                  isCurrent
                    ? 'border-teal-500 bg-accent-bg font-semibold text-accent-text'
                    : 'border-border text-text-primary hover:bg-background'
                )}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate">{contextTitle(context)}</span>
                  {context.cohortName && (
                    <span className="font-sans text-caption text-text-muted">
                      {context.roleLabel}
                    </span>
                  )}
                </span>
                {isCurrent && <Icon name="check" className="size-4" />}
              </button>
            </li>
          )
        })}
      </ul>
    </Modal>
  )
}

interface MeDialogProps {
  isOpen: boolean
  onClose: () => void
  fullName: string
  email: string
  roleLabel: string
  onSignOut: () => void
}

function MeDialog({ isOpen, onClose, fullName, email, roleLabel, onSignOut }: MeDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your account" width="sm">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <Avatar name={fullName} />
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-sans text-small font-semibold text-text-primary">
              {fullName}
            </span>
            <span className="truncate font-sans text-caption text-text-muted">{roleLabel}</span>
            <span className="truncate font-sans text-caption text-text-secondary">{email}</span>
          </div>
        </div>
        <Button variant="secondary" fullWidth onClick={onSignOut}>
          Sign out
        </Button>
      </div>
    </Modal>
  )
}

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

export function AppShell({ children }: AppShellProps) {
  const { user, logout } = useAuth()
  const nav = useShellNav(user)
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false)
  const [isMeOpen, setIsMeOpen] = useState(false)

  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : ''
  const signOut = () => {
    setIsMeOpen(false)
    void logout()
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        nav={nav}
        fullName={fullName}
        onOpenSwitcher={() => setIsSwitcherOpen(true)}
        onSignOut={signOut}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar nav={nav} onOpenSwitcher={() => setIsSwitcherOpen(true)} />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:px-10 md:pb-12 md:pt-8">
          {children}
        </main>
        <BottomTabBar nav={nav} isMeOpen={isMeOpen} onOpenMe={() => setIsMeOpen(true)} />
      </div>

      {nav.canSwitch && (
        <CohortSwitcher
          nav={nav}
          isOpen={isSwitcherOpen}
          onClose={() => setIsSwitcherOpen(false)}
        />
      )}
      <MeDialog
        isOpen={isMeOpen}
        onClose={() => setIsMeOpen(false)}
        fullName={fullName}
        email={user?.email ?? ''}
        roleLabel={nav.active?.roleLabel ?? ''}
        onSignOut={signOut}
      />
    </div>
  )
}
