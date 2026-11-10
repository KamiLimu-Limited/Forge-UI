import { MenteeSessionRow } from '@/components/forge/MenteeSessionRow'
import { SessionViewTabs } from '@/components/forge/SessionViewTabs'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import type { ReactNode } from 'react'
import type { MenteeSessionsData } from '@/types/menteeSessions'

interface SessionsScreenProps {
  // null until the data loads
  data: MenteeSessionsData | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  // Shown at the top while saving is switched off, for example for peer mentors
  saveBlockedNote?: string | null
}

interface SessionGroupProps {
  title: string
  children: ReactNode
}

// Separate cards under a heading on phones, one card holding every row from md up
function SessionGroup({ title, children }: SessionGroupProps) {
  return (
    <section className="flex flex-col gap-3 md:gap-0 md:rounded-lg md:border md:border-border md:bg-surface md:px-6 md:pt-5 md:shadow-card">
      <h2 className="font-mono text-card-title font-semibold text-text-primary">{title}</h2>
      {children}
    </section>
  )
}

export function SessionsScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  saveBlockedNote = null,
}: SessionsScreenProps) {
  const isEmpty = data !== null && data.open.length === 0 && data.upcoming.length === 0

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title="Sessions"
        subtitle={
          data?.monthLine ? <span className="hidden md:inline">{data.monthLine}</span> : undefined
        }
      />
      <SessionViewTabs />
      {saveBlockedNote && <Notice>{saveBlockedNote}</Notice>}
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading your sessions" />
      ) : isEmpty ? (
        <Card>
          <EmptyState icon="calendar" title="No sessions right now" />
        </Card>
      ) : (
        <>
          {data.open.length > 0 && (
            <SessionGroup title="Open now">
              {data.open.map((session) => (
                <MenteeSessionRow key={session.id} kind="open" session={session} />
              ))}
            </SessionGroup>
          )}
          {data.upcoming.length > 0 && (
            <SessionGroup title="Coming up">
              {data.upcoming.map((session) => (
                <MenteeSessionRow key={session.id} kind="upcoming" session={session} />
              ))}
            </SessionGroup>
          )}
        </>
      )}
    </div>
  )
}
