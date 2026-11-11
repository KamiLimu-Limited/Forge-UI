// Peer mentorship tasks: sessions with category peer_mentorship, opening at starts_at and
// due at their end time. The Program Delivery Lead creates and edits them.

import type { Pillar } from '@/lib/labels'

export type TaskState = 'draft' | 'published' | 'open' | 'completed'

export interface PeerTaskRow {
  id: string
  title: string
  // ISO date-times
  opensAt: string
  dueAt: string
  points: number
  state: TaskState
}

export interface PeerTasksView {
  cohortName: string | null
  tasks: PeerTaskRow[]
}

export interface PeerTaskDraft {
  title: string
  description: string
  // "1" to "8", or "" for none chosen
  month: string
  // YYYY-MM-DDTHH:MM
  opensAt: string
  dueAt: string
  points: string
  pillar: Pillar | ''
  resourceLink: string
}

export interface PeerTaskFormView {
  // null for a new task
  sessionId: string | null
  statusLabel: string | null
  months: { value: string; label: string }[]
  initial: PeerTaskDraft
}
