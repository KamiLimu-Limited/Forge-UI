// =============================================================================
// Shapes the professional mentor's session summaries, feedback and materials for the
// screens. The summary route has no mentor role or status, so each session's detail is
// read too (see docs/api-gaps.md).
// =============================================================================

import { api } from '@/lib/api'
import { SESSION_STATUS_LABELS } from '@/lib/labels'
import { feedbackGroups, overallAverage } from '@/lib/sessionFeedback'
import { sessionPillar } from '@/lib/sessions'
import type { ProFeedbackView, ProSessionRow, ProSessionsView } from '@/types/proMentor'
import type { ResourceIn, SessionDetailResponse } from '@/types/session'

function settled<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === 'fulfilled' ? result.value : null
}

// The Google Drive folder, or else the first link the session has
export function materialsLink(detail: SessionDetailResponse | null): string | null {
  if (!detail) return null
  const folder = detail.resources.find((resource) => resource.resource_type === 'drive_folder')
  return (folder ?? detail.resources[0])?.url ?? null
}

export async function loadProRows(
  userId: string
): Promise<{ rows: ProSessionRow[]; cohortName: string | null }> {
  const summaries = await api.proMentor.sessions()
  const details = await Promise.allSettled(
    summaries.map((summary) => api.sessions.getById(summary.session.id))
  )
  const cohortId = summaries[0]?.session.cohort_id
  const cohort = cohortId ? await api.cohorts.getById(cohortId).catch(() => null) : null
  const rows = summaries.map((summary, index): ProSessionRow => {
    const detail = settled(details[index])
    const mine = detail?.mentors.find((mentor) => mentor.user.id === userId)
    return {
      id: summary.session.id,
      title: summary.session.title,
      startsAt: summary.session.starts_at,
      endsAt: detail?.ends_at ?? null,
      pillar: sessionPillar(summary.session),
      role: mine?.mentor_role ?? null,
      statusLabel: detail ? SESSION_STATUS_LABELS[detail.status] : null,
      attended: summary.attended,
      eligible: summary.eligible,
      rating: summary.responses > 0 ? summary.average_quality : null,
      materialsUrl: materialsLink(detail),
    }
  })
  return { rows, cohortName: cohort?.name ?? null }
}

export function splitSessions(
  rows: ProSessionRow[],
  cohortName: string | null,
  now: Date = new Date()
): ProSessionsView {
  const upcoming = rows
    .filter((row) => new Date(row.startsAt) > now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  const past = rows
    .filter((row) => new Date(row.startsAt) <= now)
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt))
  return { cohortName, upcoming, past }
}

export async function loadProSessions(userId: string): Promise<ProSessionsView> {
  const { rows, cohortName } = await loadProRows(userId)
  return splitSessions(rows, cohortName)
}

export async function loadProFeedback(row: ProSessionRow): Promise<ProFeedbackView> {
  const response = await api.sessions.feedback(row.id)
  const written = response.entries.flatMap((entry) => {
    const text = entry.feedback?.trim()
    return text ? [text] : []
  })
  return {
    session: row,
    responses: response.responses,
    average: overallAverage(response),
    groups: feedbackGroups(response),
    feedback: written.map((text, index) => ({
      label: `Participant ${String(index + 1).padStart(2, '0')}`,
      text,
    })),
  }
}

// The session's links with the Drive folder set to `url`; other links stay as they are
export function resourcesWithFolder(detail: SessionDetailResponse, url: string): ResourceIn[] {
  const others = detail.resources
    .filter((resource) => resource.resource_type !== 'drive_folder')
    .map((resource) => ({
      resource_type: resource.resource_type,
      url: resource.url,
      description: resource.description,
    }))
  const trimmed = url.trim()
  return trimmed
    ? [{ resource_type: 'drive_folder', url: trimmed, description: 'Session materials' }, ...others]
    : others
}

export function isWebLink(value: string): boolean {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}
