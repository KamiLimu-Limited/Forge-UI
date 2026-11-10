// What the Email delivery, Google sync, Meet participants and Group meetings screens draw

export interface FailedEmailRow {
  id: string
  userId: string
  // null until the person is looked up, or if they can't be
  name: string | null
  email: string | null
  // A NotificationType, kept as text so a type the screen doesn't know yet still shows
  type: string
  error: string | null
  attempts: number
  // When the email was queued; the API has no time of the last try
  queuedAt: string
}

export interface FailedEmailsView {
  rows: FailedEmailRow[]
  total: number
  page: number
  pageSize: number
}

export interface MeetSessionView {
  id: string
  title: string
  startsAt: string
}

export interface GroupMeetingRow {
  peerMentorId: string
  peerMentorName: string
  // Mentee names in the group
  mentees: string[]
}

export interface PeerTaskOption {
  id: string
  title: string
  // ISO date-time the task is due
  dueAt: string
}

export interface GroupMeetingsView {
  tasks: PeerTaskOption[]
  selectedTaskId: string | null
  groups: GroupMeetingRow[]
}
