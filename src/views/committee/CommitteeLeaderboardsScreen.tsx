import { LeaderboardBoards } from '@/components/forge/LeaderboardBoards'
import { PeerMentorBoard } from '@/components/forge/PeerMentorBoard'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { formatDateTime } from '@/lib/format'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { ExportKind, SnapshotRow } from '@/types/analytics'
import type {
  DimensionEntry,
  LeaderboardDimension,
  PeerMentorDimension,
  PeerMentorRow,
} from '@/types/leaderboard'
import { NoCohortCard, ReadOnlyTag } from './CommitteeStates'

export type CommitteeBoardTab = 'mentees' | 'peer-mentors'

interface CommitteeLeaderboardsScreenProps {
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
  peerRankedBy: PeerMentorDimension
  onPeerRankedByChange: (dimension: PeerMentorDimension) => void
  peerEntries: PeerMentorRow[] | null
  peerLoading?: boolean
  peerError?: string | null
  onPeerRetry?: () => void
  onExport: (kind: ExportKind) => void
  // The export being downloaded, if any
  downloading?: ExportKind | null
  // Newest first; null while loading
  snapshots: SnapshotRow[] | null
  snapshotsError?: string | null
  onDownloadSnapshot: (id: string) => void
  // Only for System Admins and the Program Lead
  onTakeSnapshot?: () => void
  isTakingSnapshot?: boolean
}

const TABS: { value: CommitteeBoardTab; label: string }[] = [
  { value: 'mentees', label: 'Mentees' },
  { value: 'peer-mentors', label: 'Peer mentors' },
]

const OTHER_EXPORTS: { kind: ExportKind; label: string }[] = [
  { kind: 'attendance', label: 'Export attendance' },
  { kind: 'full-report', label: 'Export full report' },
]

// Both leaderboards, CSV exports and snapshots. Read only.
export function CommitteeLeaderboardsScreen({
  hasCohort = true,
  tab,
  onTabChange,
  dimension,
  onDimensionChange,
  entries,
  isLoading = false,
  error = null,
  onRetry,
  peerRankedBy,
  onPeerRankedByChange,
  peerEntries,
  peerLoading = false,
  peerError = null,
  onPeerRetry,
  onExport,
  downloading = null,
  snapshots,
  snapshotsError = null,
  onDownloadSnapshot,
  onTakeSnapshot,
  isTakingSnapshot = false,
}: CommitteeLeaderboardsScreenProps) {
  const boardExport: ExportKind = tab === 'mentees' ? 'leaderboard' : 'peer-leaderboard'
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title="Leaderboards and exports"
        action={
          <div className="flex flex-wrap items-center gap-3">
            <ReadOnlyTag />
            <Button
              onClick={() => onExport(boardExport)}
              isLoading={downloading === boardExport}
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
                  <div className="flex flex-col gap-4">
                    <PeerMentorBoard
                      rankedBy={peerRankedBy}
                      onRankedByChange={onPeerRankedByChange}
                      entries={peerEntries}
                      isLoading={peerLoading}
                      error={peerError}
                      onRetry={onPeerRetry}
                    />
                  </div>
                </Card>
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-4 md:gap-5">
              <Card
                title="Snapshots"
                action={
                  onTakeSnapshot && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onTakeSnapshot}
                      isLoading={isTakingSnapshot}
                    >
                      Take snapshot
                    </Button>
                  )
                }
              >
                {snapshotsError ? (
                  <ErrorState message={snapshotsError} />
                ) : !snapshots ? (
                  <LoadingState label="Loading snapshots" />
                ) : snapshots.length === 0 ? (
                  <p className="font-sans text-small text-text-muted">No snapshots yet</p>
                ) : (
                  <ul className="flex flex-col divide-y divide-border">
                    {snapshots.map((snapshot) => (
                      <li
                        key={snapshot.id}
                        className="flex items-center justify-between gap-3 py-2 font-sans text-small"
                      >
                        <span className="min-w-0">
                          <span className="block text-text-primary">{snapshot.label}</span>
                          <span className="block text-caption text-text-muted">
                            {formatDateTime(snapshot.takenAt)}
                          </span>
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onDownloadSnapshot(snapshot.id)}
                          aria-label={`Download ${snapshot.label.toLowerCase()} from ${formatDateTime(snapshot.takenAt)}`}
                        >
                          Download
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
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
