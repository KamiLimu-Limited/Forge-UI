import type { MenteeCardView, MenteeDetailView } from '../src/types/peerMentor'

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
      state: 'attended',
    },
    {
      sessionId: 's-2',
      title: 'Scholarship Principles in Practice 3',
      startsAt: '2026-08-06T17:30:00+03:00',
      state: 'attended',
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
      state: 'attended',
    },
    {
      sessionId: 's-6',
      title: 'Innovation Workshop',
      startsAt: '2026-07-02T17:30:00+03:00',
      state: 'attended',
    },
  ],
  objectives: [
    { skill: 'communication', label: 'Communication', summary: 'Start 2' },
    { skill: 'technical', label: 'Technical', summary: 'Start 1, Mid 3' },
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
