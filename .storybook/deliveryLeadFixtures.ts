import type { GroupMeetingsView } from '../src/types/adminIntegrations'
import type { PeerTaskDraft, PeerTaskFormView, PeerTasksView } from '../src/types/peerTasks'

// Sample data for the Program Delivery Lead stories. Not real people. Nothing in src/ uses it.

export const samplePeerTasks: PeerTasksView = {
  cohortName: 'Cohort 11',
  tasks: [
    ['Peer Mentorship 1', '2026-03-23', '2026-04-03', 'completed'],
    ['Peer Mentorship 2', '2026-04-27', '2026-05-08', 'completed'],
    ['Peer Mentorship 3', '2026-06-15', '2026-06-26', 'completed'],
    ['Peer Mentorship 4', '2026-08-17', '2026-08-27', 'open'],
    ['Peer Mentorship 5', '2026-09-14', '2026-09-25', 'published'],
    ['Peer Mentorship 6', '2026-10-12', '2026-10-23', 'draft'],
  ].map(([title, opens, due, state], index) => ({
    id: `pm-${index + 1}`,
    title,
    opensAt: `${opens}T09:00:00+03:00`,
    dueAt: `${due}T23:59:00+03:00`,
    points: 10,
    state: state as PeerTasksView['tasks'][number]['state'],
  })),
}

const draft: PeerTaskDraft = {
  title: 'Peer Mentorship 5',
  description: 'Each group sets one goal for the next month and shares it.',
  month: '6',
  opensAt: '2026-09-14T09:00',
  dueAt: '2026-09-25T23:59',
  points: '10',
  pillar: 'personal-dev',
  resourceLink: '',
}

export const samplePeerTaskForm: PeerTaskFormView = {
  sessionId: 'pm-5',
  statusLabel: 'Published',
  months: [1, 2, 3, 4, 5, 6, 7, 8].map((month) => ({
    value: String(month),
    label: `Month ${month}`,
  })),
  initial: draft,
}

export const sampleGroupMeetings: GroupMeetingsView = {
  tasks: [
    { id: 'pm-4', title: 'Peer Mentorship 4', dueAt: '2026-08-27T12:00:00+03:00' },
    { id: 'pm-3', title: 'Peer Mentorship 3', dueAt: '2026-06-26T23:59:00+03:00' },
  ],
  selectedTaskId: 'pm-4',
  groups: [
    {
      peerMentorId: 'p-1',
      peerMentorName: 'Hansel Omondi',
      mentees: ['Faith Mutua', 'Brian Kamau', 'Amani Otieno'],
    },
    {
      peerMentorId: 'p-2',
      peerMentorName: 'Wanjiru Mwangi',
      mentees: ['Joy Mbugua', 'David Guchu'],
    },
    { peerMentorId: 'p-3', peerMentorName: 'Fidel Otieno', mentees: [] },
  ],
}
