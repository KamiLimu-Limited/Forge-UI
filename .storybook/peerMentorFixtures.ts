import type {
  GroupMeetingView,
  FacilitatorView,
  MentoredSessionRatings,
  GroupFeedbackView,
  PeerSessionView,
  MenteeCardView,
  MenteeDetailView,
} from '../src/types/peerMentor'

// Sample data for the peer mentor screens' stories. Not real people. Nothing in src/ uses it.

export const sampleGroup: MenteeCardView[] = [
  { id: 'm-1', name: 'Brian Kamau', coreRate: 86, overallRate: 79, points: 320 },
  { id: 'm-2', name: 'Akinyi Odhiambo', coreRate: 85, overallRate: 77, points: 305 },
  { id: 'm-3', name: 'Zawadi Mwende', coreRate: 91, overallRate: 84, points: 350 },
]

export const sampleMenteeDetail: MenteeDetailView = {
  card: sampleGroup[0],
  attendance: [
    {
      sessionId: 's-1',
      title: 'Cybersecurity: ICT Training 7',
      startsAt: '2026-08-13T17:30:00+03:00',
      state: 'present',
    },
    {
      sessionId: 's-2',
      title: 'Scholarship Principles in Practice 3',
      startsAt: '2026-08-06T17:30:00+03:00',
      state: 'present',
    },
    {
      sessionId: 's-3',
      title: 'Cyber Security: ICT Training 6',
      startsAt: '2026-07-16T17:30:00+03:00',
      state: 'missed',
    },
    {
      sessionId: 's-4',
      title: 'Responsible AI in Code Development',
      startsAt: '2026-07-11T09:00:00+03:00',
      state: 'excused',
    },
    {
      sessionId: 's-5',
      title: 'Peer Mentorship 3',
      startsAt: '2026-07-10T19:00:00+03:00',
      state: 'present',
    },
    {
      sessionId: 's-6',
      title: 'Innovation Workshop',
      startsAt: '2026-07-02T17:30:00+03:00',
      state: 'present',
    },
  ],
  objectives: [
    { id: 'communication', label: 'Communication', summary: 'Start 2' },
    { id: 'technical', label: 'Technical', summary: 'Start 1, Mid 3' },
  ],
  activities: [
    { label: 'Consultations', count: 3 },
    { label: 'External events', count: 4 },
    { label: 'Applications', count: 2 },
    { label: 'KamiLimu to Academia', count: 2 },
  ],
  feedback: [
    {
      sessionId: 's-5',
      title: 'Peer Mentorship 3',
      ratings: [
        { label: 'Quality', value: 5 },
        { label: 'Usefulness', value: 4 },
      ],
      feedback: 'The group discussion helped me plan my month.',
    },
  ],
}

export const samplePeerSession: PeerSessionView = {
  id: 'pm-4',
  title: 'Peer Mentorship 4',
  startsAt: '2026-08-26T19:00:00+03:00',
  endsAt: '2026-08-26T22:00:00+03:00',
  windowLabel: 'Closes in 2h',
  isOpen: true,
  submitted: 2,
  groupSize: 3,
}

export const sampleGroupFeedback: GroupFeedbackView = {
  id: 'pm-4',
  title: 'Peer Mentorship 4',
  startsAt: '2026-08-26T19:00:00+03:00',
  endsAt: '2026-08-26T22:00:00+03:00',
  windowLine: 'Window closes Thu 27 Aug, 12:00 PM',
  submitted: 2,
  groupSize: 3,
  average: 4.6,
  groups: [
    {
      label: 'Reaction',
      questions: [
        { label: 'Quality of the session', average: 5 },
        { label: 'How useful it was', average: 4.5 },
      ],
    },
    { label: 'Learning', questions: [{ label: 'How well they understood it', average: 4.5 }] },
    {
      label: 'Intended behaviour',
      questions: [
        { label: 'Will apply it in their studies', average: 4.5 },
        { label: 'Will apply it in their career', average: 4.5 },
      ],
    },
  ],
  feedback: [
    'The talk on handling pressure in exams was exactly what I needed this month.',
    'More time for questions at the end would help.',
  ],
}

// Sessions the peer mentor led or co-led, rated by everyone who attended
export const sampleFacilitator: FacilitatorView = {
  completed: 4,
  inProgress: 1,
  average: 4.3,
  peerAverage: 4.1,
  best: {
    id: 's-3',
    title: 'Writing a CV that gets read',
    startsAt: '2026-07-09T17:30:00+03:00',
    isInProgress: false,
    rating: 4.5,
    responses: 38,
  },
  sessions: [
    {
      id: 's-5',
      title: 'Pitching your project',
      startsAt: '2026-08-27T17:30:00+03:00',
      isInProgress: true,
      rating: 4.6,
      responses: 12,
    },
    {
      id: 's-3',
      title: 'Writing a CV that gets read',
      startsAt: '2026-07-09T17:30:00+03:00',
      isInProgress: false,
      rating: 4.5,
      responses: 38,
    },
    {
      id: 's-2',
      title: 'Version control with Git',
      startsAt: '2026-06-11T17:30:00+03:00',
      isInProgress: false,
      rating: 4.2,
      responses: 41,
    },
    {
      id: 's-1b',
      title: 'Study habits that last',
      startsAt: '2026-05-14T17:30:00+03:00',
      isInProgress: false,
      rating: 4.3,
      responses: 36,
    },
    {
      id: 's-1',
      title: 'Onboarding',
      startsAt: '2026-05-07T17:30:00+03:00',
      isInProgress: false,
      rating: 4.1,
      responses: 44,
    },
  ],
  trend: [
    { label: 'Onboarding', title: 'Onboarding', rating: 4.1 },
    { label: 'Study hab…', title: 'Study habits that last', rating: 4.3 },
    { label: 'Version c…', title: 'Version control with Git', rating: 4.2 },
    { label: 'Writing a…', title: 'Writing a CV that gets read', rating: 4.5 },
  ],
}

export const sampleMentoredSession: MentoredSessionRatings = {
  id: 's-3',
  title: 'Writing a CV that gets read',
  startsAt: '2026-07-09T17:30:00+03:00',
  pillar: null,
  responses: 38,
  average: 4.5,
  groups: [
    {
      label: 'Reaction',
      questions: [
        { label: 'Quality of the session', average: 4.6 },
        { label: 'How useful it was', average: 4.5 },
      ],
    },
    { label: 'Learning', questions: [{ label: 'How well they understood it', average: 4.4 }] },
  ],
  feedback: [
    'The before and after examples made it click.',
    'Could we get the template in the materials folder?',
  ],
}

export const sampleGroupMeeting: GroupMeetingView = {
  sessionId: 'pm-4',
  title: 'Peer Mentorship 4',
  windowLine: 'Open Mon 17 Aug to Thu 27 Aug, 12:00 PM',
  firstDay: '2026-08-17',
  lastDay: '2026-08-27',
  group: sampleGroup.map(({ id, name }) => ({ id, name })),
}
