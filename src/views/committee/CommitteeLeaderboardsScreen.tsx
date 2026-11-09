import { LeaderboardBoards } from '@/components/forge/LeaderboardBoards'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { ExportKind } from '@/types/analytics'
import type { DimensionEntry, LeaderboardDimension } from '@/types/leaderboard'
import { NoCohortCard, ReadOnlyTag } from './CommitteeStates'

export type CommitteeBoardTab = 'mentees' | 'peer-mentors'

interface CommitteeLeaderboardsScreenProps {
  cohortName: string | null
  hasCohort?: boolean
  tab: CommitteeBoardTab
  onTabChange: (tab: CommitteeBoardTab) => void
  dimension: LeaderboardDimension
  onDimensionChange: (dimension: LeaderboardDimension) => void
  // null until the board loads
  entries: DimensionEntry[] | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  onExport: (kind: ExportKind) => void
  // The export being downloaded, if any
  downloading?: ExportKind | null
}

const TABS: { value: CommitteeBoardTab; label: string }[] = [
  { value: 'mentees', label: 'Mentees' },
  { value: 'peer-mentors', label: 'Peer mentors' },
]

const OTHER_EXPORTS: { kind: ExportKind; label: string }[] = [
  { kind: 'attendance', label: 'Export attendance' },
  { kind: 'full-report', label: 'Export full report' },
]

// Both leaderboards, CSV exports and snapshots. Read only. This only draws the screen.
export function CommitteeLeaderboardsScreen({
  cohortName,
  hasCohort = true,
  tab,
  onTabChange,
  dimension,
  onDimensionChange,
  entries,
  isLoading = false,
  error = null,
  onRetry,
  onExport,
  downloading = null,
}: CommitteeLeaderboardsScreenProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title="Leaderboards and exports"
        subtitle={cohortName ? `Live rankings for ${cohortName}.` : undefined}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <ReadOnlyTag />
            <Button
              onClick={() => onExport('leaderboard')}
              isLoading={downloading === 'leaderboard'}
              disabled={!hasCohort}
            >
              Export CSV
            </Button>
          </div>
        }
      />
      {!hasCohort ? (
        <NoCohortCard />
      ) : (
        <>
          <SegmentedControl label="Leaderboard" options={TABS} value={tab} onChange={onTabChange} />
          <div className="grid items-start gap-4 md:gap-5 lg:grid-cols-3">
            <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
              {tab === 'mentees' ? (
                <Card>
                  <div className="flex flex-col gap-4">
                    <LeaderboardBoards
                      dimension={dimension}
                      onDimensionChange={onDimensionChange}
                      entries={entries}
                      isLoading={isLoading}
                      error={error}
                      onRetry={onRetry}
                    />
                  </div>
                </Card>
              ) : (
                <Card>
                  <EmptyState
                    icon="users"
                    title="Peer mentor leaderboard"
                    description="Not available yet"
                  />
                </Card>
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-4 md:gap-5">
              <Card title="Snapshots">
                <p className="font-sans text-small text-text-muted">Not available yet</p>
              </Card>
              <Card title="Other exports">
                <div className="flex flex-col gap-3">
                  {OTHER_EXPORTS.map((item) => (
                    <Button
                      key={item.kind}
                      variant="secondary"
                      fullWidth
                      onClick={() => onExport(item.kind)}
                      isLoading={downloading === item.kind}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
