'use client'

import { useCallback, useState } from 'react'
import { api } from '@/lib/api'
import { loadCommitteeOverview, loadCommitteeTrends, loadCrossCohort } from '@/lib/committee'
import { toCsv } from '@/lib/csv'
import { saveTextFile } from '@/lib/download'
import { errorMessage } from '@/lib/errors'
import { ADMIN_ROLES, hasRole } from '@/lib/roles'
import type { ExportKind, SnapshotRow } from '@/types/analytics'
import type { CommitteeOverviewView, CommitteeTrendsView, CrossCohortView } from '@/types/committee'
import type { DimensionEntry, LeaderboardDimension, LeaderboardKind } from '@/types/leaderboard'
import { useApiQuery, type ApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'
import { useAuth } from './useAuth'
import { useOversightCohort } from './useOversightCohort'
import { useToast } from './useToast'

const NO_COHORT = 'No cohort'

function requireCohort(cohortId: string | null): string {
  if (!cohortId) throw new Error(NO_COHORT)
  return cohortId
}

export interface CohortQuery<T> extends ApiQuery<T> {
  // False when there is no cohort to show yet
  hasCohort: boolean
}

export function useCommitteeOverview(): CohortQuery<CommitteeOverviewView> {
  const { cohortId, isLoading } = useOversightCohort()
  const query = useApiQuery(() => loadCommitteeOverview(requireCohort(cohortId)), [cohortId], {
    enabled: cohortId !== null,
    fallbackError: "We couldn't load the cohort overview. Try again.",
  })
  return { ...query, isLoading: isLoading || query.isLoading, hasCohort: cohortId !== null }
}

export function useCommitteeTrends(): CohortQuery<CommitteeTrendsView> {
  const { cohortId, isLoading } = useOversightCohort()
  const query = useApiQuery(() => loadCommitteeTrends(requireCohort(cohortId)), [cohortId], {
    enabled: cohortId !== null,
    fallbackError: "We couldn't load the trends. Try again.",
  })
  return { ...query, isLoading: isLoading || query.isLoading, hasCohort: cohortId !== null }
}

export interface UseCrossCohortReturn extends CohortQuery<CrossCohortView> {
  setOtherId: (id: string) => void
}

export function useCrossCohort(): UseCrossCohortReturn {
  const { cohortId, isLoading } = useOversightCohort()
  const [otherId, setOtherId] = useState<string | null>(null)
  const query = useApiQuery(
    () => loadCrossCohort(requireCohort(cohortId), otherId),
    [cohortId, otherId],
    {
      enabled: cohortId !== null,
      fallbackError: "We couldn't load the comparison. Try again.",
    }
  )
  return {
    ...query,
    isLoading: isLoading || query.isLoading,
    hasCohort: cohortId !== null,
    setOtherId,
  }
}

const EXPORTS: Record<ExportKind, { file: string; load: (cohortId: string) => Promise<string> }> = {
  leaderboard: { file: 'leaderboard', load: (id) => api.leaderboard.exportCsv(id) },
  'peer-leaderboard': {
    file: 'peer-mentor-leaderboard',
    load: (id) => api.exports.leaderboard(id, 'peer_mentor'),
  },
  attendance: { file: 'attendance', load: (id) => api.exports.attendance(id) },
  'full-report': { file: 'full-report', load: (id) => api.exports.fullReport(id) },
}

export interface UseCohortLeaderboardReturn {
  hasCohort: boolean
  dimension: LeaderboardDimension
  setDimension: (dimension: LeaderboardDimension) => void
  entries: DimensionEntry[] | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  download: (kind: ExportKind) => void
  downloading: ExportKind | null
  cohortId: string | null
  snapshots: SnapshotRow[] | null
  snapshotsError: string | null
  // System Admins and the Program Lead can take one; the committee only reads
  canTakeSnapshot: boolean
  takeSnapshot: () => void
  isTakingSnapshot: boolean
  downloadSnapshot: (id: string) => void
}

const SNAPSHOT_LABELS: Record<LeaderboardKind, string> = {
  mentee: 'Mentee leaderboard',
  peer_mentor: 'Peer mentor leaderboard',
}

// The snapshot's rows as CSV, with the columns of its first row
function snapshotCsv(rows: Record<string, unknown>[]): string {
  const headers = Object.keys(rows[0] ?? {})
  return toCsv([headers, ...rows.map((row) => headers.map((key) => String(row[key] ?? '')))])
}

// The mentee leaderboards for the committee's cohort, and its CSV exports
export function useCohortLeaderboard(): UseCohortLeaderboardReturn {
  const { cohortId, isLoading } = useOversightCohort()
  const { showToast } = useToast()
  const { user } = useAuth()
  const canTakeSnapshot = hasRole(user, ADMIN_ROLES)
  const [dimension, setDimension] = useState<LeaderboardDimension>('core_attendance')
  const [downloading, setDownloading] = useState<ExportKind | null>(null)
  const snapshots = useApiQuery(
    () => api.leaderboard.snapshots(requireCohort(cohortId)),
    [cohortId],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the snapshots." }
  )
  const takeAction = useAsyncAction(
    useCallback(() => api.leaderboard.takeSnapshot(requireCohort(cohortId)), [cohortId]),
    "The snapshot wasn't saved. Try again."
  )
  const board = useApiQuery(
    () =>
      api.leaderboard
        .dimension(requireCohort(cohortId), dimension)
        .then((response) => response.entries),
    [cohortId, dimension],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the leaderboard. Try again." }
  )
  const download = useCallback(
    async (kind: ExportKind) => {
      setDownloading(kind)
      try {
        const text = await EXPORTS[kind].load(requireCohort(cohortId))
        saveTextFile(`${EXPORTS[kind].file}-${new Date().toISOString().slice(0, 10)}.csv`, text)
        showToast('Export downloaded', 'success')
      } catch (err: unknown) {
        showToast(errorMessage(err, "We couldn't export that file. Try again."), 'error')
      } finally {
        setDownloading(null)
      }
    },
    [cohortId, showToast]
  )

  return {
    hasCohort: cohortId !== null,
    dimension,
    setDimension,
    entries: board.data,
    isLoading: isLoading || board.isLoading,
    error: board.error,
    refetch: board.refetch,
    downloading,
    download: (kind) => {
      void download(kind)
    },
    cohortId,
    snapshots: snapshots.data
      ? snapshots.data.map((snapshot) => ({
          id: snapshot.id,
          label: SNAPSHOT_LABELS[snapshot.kind],
          takenAt: snapshot.taken_at,
        }))
      : null,
    snapshotsError: snapshots.error,
    canTakeSnapshot,
    takeSnapshot: () => {
      void takeAction.run().then((taken) => {
        if (!taken) {
          showToast("The snapshot wasn't saved. Try again.", 'error')
          return
        }
        showToast('Snapshot saved', 'success')
        snapshots.refetch()
      })
    },
    isTakingSnapshot: takeAction.isLoading,
    downloadSnapshot: (id) => {
      const snapshot = snapshots.data?.find((item) => item.id === id)
      if (!snapshot) return
      saveTextFile(
        `${snapshot.kind === 'mentee' ? 'leaderboard' : 'peer-mentor-leaderboard'}-${snapshot.taken_at.slice(0, 10)}.csv`,
        snapshotCsv(snapshot.rows)
      )
    },
  }
}
