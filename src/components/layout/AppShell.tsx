'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useShellNav, type RoleContext, type ShellNav } from '@/hooks/useShellNav'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Modal } from '@/components/ui/Modal'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cx } from '@/lib/cx'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import { NotificationBell } from '@/components/forge/NotificationBell'
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
      aria-label={`${contextTitle(context)}. Switch view`}
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

  if (!canSwitch) {
    return (
      <span className={classes}>
        <span className="min-w-0 truncate">{label}</span>
      </span>
    )
  }
  return (
    <button
      type="button"
      onClick={onOpenSwitcher}
      aria-label={`${label}. Switch view`}
      className={cx(
        classes,
        "relative before:absolute before:inset-x-0 before:-inset-y-1 before:content-['']"
      )}
    >
      <span className="min-w-0 truncate">{label}</span>
      <Icon name="chevron-down" className="size-4 shrink-0" />
    </button>
  )
}

// ---------------------------------------------------------------------------
// Grouped links, shared by the desktop sidebar and the phone menu
// ---------------------------------------------------------------------------

interface NavLinksProps {
  nav: ShellNav
  // Lets the phone menu close once a link is chosen
  onNavigate?: () => void
  // The sidebar scrolls its own links; the phone menu's panel already scrolls
  scrolls?: boolean
}

function NavLinks({ nav, onNavigate, scrolls = false }: NavLinksProps) {
  const showHeadings = nav.groups.length > 1

  return (
    <nav
      aria-label="Main"
      className={cx('flex flex-col gap-4', scrolls && 'flex-1 overflow-y-auto')}
    >
      {nav.groups.length === 0 && (
        <p className="px-3 font-sans text-caption text-text-muted">Your pages will show up here.</p>
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
                onClick={onNavigate}
                aria-current={isActive ? 'page' : undefined}
                className={cx(
                  // 40px tall; the ::before layer reaches 44px without overlapping the next item
                  "relative flex h-10 items-center gap-3 rounded-md px-3 py-2 font-sans text-body no-underline transition-colors duration-fast before:absolute before:inset-x-0 before:-inset-y-0.5 before:content-[''] hover:no-underline",
                  isActive
                    ? 'bg-accent-bg font-semibold text-accent-text'
                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                )}
              >
                <Icon name={item.icon} />
                {/* Hind Guntur's letters sit high in their line box, so nudge them level */}
                <span className="translate-y-0.5">{item.label}</span>
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Desktop sidebar
// ---------------------------------------------------------------------------

interface SidebarProps {
  nav: ShellNav
  fullName: string
  hasProfile: boolean
  onOpenSwitcher: () => void
  onSignOut: () => void
}

function Sidebar({ nav, fullName, hasProfile, onOpenSwitcher, onSignOut }: SidebarProps) {
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

      <NavLinks nav={nav} scrolls />

      <ThemeToggle className="self-start" />
      <div className="flex items-center gap-3 border-t border-border pt-4">
        <Avatar name={fullName} />
        <div className="flex min-w-0 flex-col">
          {hasProfile ? (
            <Link
              href={MENTEE_ROUTES.profile}
              className="truncate font-sans text-small font-semibold text-text-primary no-underline hover:underline"
            >
              {fullName}
            </Link>
          ) : (
            <span className="truncate font-sans text-small font-semibold text-text-primary">
              {fullName}
            </span>
          )}
          {nav.active && (
            <span className="truncate font-sans text-caption text-text-muted">
              {nav.active.roleLabel}
            </span>
          )}
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex min-h-control items-center self-start font-sans text-caption font-semibold text-link hover:underline"
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

// More links than this and the phone tab bar gets cramped, so they move to a side menu
const MAX_PHONE_TABS = 5

function usesPhoneMenu(nav: ShellNav): boolean {
  return nav.items.length > MAX_PHONE_TABS
}

interface MobileTopBarProps {
  nav: ShellNav
  fullName: string
  accountLabel: string
  onOpenSwitcher: () => void
  onOpenAccount: () => void
  onOpenMenu: () => void
}

function MobileTopBar({
  nav,
  fullName,
  accountLabel,
  onOpenSwitcher,
  onOpenAccount,
  onOpenMenu,
}: MobileTopBarProps) {
  return (
    <header className="sticky top-0 z-sticky flex h-14 items-center justify-between gap-3 border-b border-border bg-surface px-4 md:hidden">
      <Brand />
      <div className="flex min-w-0 items-center justify-end gap-2">
        <NotificationBell />
        {/* With the phone menu, the cohort moves into the menu so the header isn't crowded */}
        {nav.active && !usesPhoneMenu(nav) && (
          <CohortPill
            context={nav.active}
            canSwitch={nav.canSwitch}
            onOpenSwitcher={onOpenSwitcher}
          />
        )}
        <button
          type="button"
          onClick={onOpenAccount}
          aria-label={accountLabel}
          className="relative shrink-0 rounded-full before:absolute before:-inset-1 before:content-['']"
        >
          <Avatar name={fullName} />
        </button>
        {/* The same menu button and dialog as the admin shell */}
        {usesPhoneMenu(nav) && (
          <button
            type="button"
            onClick={onOpenMenu}
            aria-haspopup="dialog"
            aria-label="Open menu"
            className="-mr-2 flex size-control shrink-0 items-center justify-center rounded-md text-text-primary hover:bg-background"
          >
            <Icon name="menu" />
          </button>
        )}
      </div>
    </header>
  )
}

interface BottomTabBarProps {
  nav: ShellNav
}

const tabClasses =
  'flex h-control-lg flex-1 flex-col items-center justify-center gap-0.5 font-sans text-tab no-underline hover:no-underline'

function BottomTabBar({ nav }: BottomTabBarProps) {
  if (nav.items.length === 0 || usesPhoneMenu(nav)) return null
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
  // Opens the chosen cohort's first page
  onSwitched: (href: string) => void
}

function CohortSwitcher({ nav, isOpen, onClose, onSwitched }: CohortSwitcherProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Switch view" width="sm">
      <p className="mb-4 font-sans text-small text-text-secondary">
        You have roles in more than one cohort. Pick which one to see.
      </p>
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
                  const href = nav.firstPageFor(context.key)
                  if (href) onSwitched(href)
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

interface PhoneMenuProps {
  nav: ShellNav
  isOpen: boolean
  onClose: () => void
  onOpenSwitcher: () => void
  onSignOut: () => void
}

// The phone menu, used in place of the tab bar when there are too many links. It is the
// same dialog as the admin shell's menu, and also carries the cohort, which the crowded
// header leaves out.
function PhoneMenu({ nav, isOpen, onClose, onOpenSwitcher, onSignOut }: PhoneMenuProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Menu" width="sm">
      <div className="flex flex-col gap-5">
        {nav.active && (
          <CohortCard
            context={nav.active}
            canSwitch={nav.canSwitch}
            onOpenSwitcher={() => {
              onClose()
              onOpenSwitcher()
            }}
          />
        )}
        <NavLinks nav={nav} onNavigate={onClose} />
        <div className="flex flex-col gap-4 border-t border-border pt-4">
          <ThemeToggle className="self-start" />
          <Button variant="secondary" fullWidth onClick={onSignOut}>
            Sign out
          </Button>
        </div>
      </div>
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

// The phone account menu, for roles without a profile screen yet
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
        <ThemeToggle className="self-start" />
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
  const router = useRouter()
  const nav = useShellNav()
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false)
  const [isMeOpen, setIsMeOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : ''
  // Only mentees have a profile screen so far
  const hasProfile = user?.roles.some((item) => item.role === 'mentee') ?? false
  const openAccount = () => {
    if (hasProfile) router.push(MENTEE_ROUTES.profile)
    else setIsMeOpen(true)
  }
  const signOut = () => {
    setIsMeOpen(false)
    setIsMenuOpen(false)
    void logout()
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        nav={nav}
        fullName={fullName}
        hasProfile={hasProfile}
        onOpenSwitcher={() => setIsSwitcherOpen(true)}
        onSignOut={signOut}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar
          nav={nav}
          fullName={fullName}
          accountLabel={hasProfile ? 'Your profile' : 'Your account'}
          onOpenSwitcher={() => setIsSwitcherOpen(true)}
          onOpenAccount={openAccount}
          onOpenMenu={() => setIsMenuOpen(true)}
        />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:px-10 md:pb-12 md:pt-8">
          {children}
        </main>
        <BottomTabBar nav={nav} />
      </div>

      {nav.canSwitch && (
        <CohortSwitcher
          nav={nav}
          isOpen={isSwitcherOpen}
          onClose={() => setIsSwitcherOpen(false)}
          onSwitched={(href) => router.push(href)}
        />
      )}
      {usesPhoneMenu(nav) && (
        <PhoneMenu
          nav={nav}
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onOpenSwitcher={() => setIsSwitcherOpen(true)}
          onSignOut={signOut}
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
