import type { MyTrackView, TrackSessionsView } from '../src/types/ictPeerMentor'

// Sample data for the ICT peer mentor screens' stories. Not real people. Nothing in src/ uses it.

export const sampleTrack: MyTrackView = {
  track: 'Cybersecurity',
  menteeCount: 14,
  attendanceRate: 88,
  sessionsSoFar: 7,
  nextSession: {
    title: 'Cybersecurity: ICT Training 8',
    startsAt: '2026-08-27T17:30:00+03:00',
    endsAt: '2026-08-27T20:00:00+03:00',
  },
  mentees: [
    { id: 'm-1', name: 'Faith Mutheu Mutua', attendedLabel: '7 of 7', points: 70 },
    { id: 'm-2', name: 'David Mungai Guchu', attendedLabel: '7 of 7', points: 70 },
    { id: 'm-3', name: 'Diana Awino Njeri Achola', attendedLabel: '6 of 7', points: 60 },
    { id: 'm-4', name: 'Brian Kamau', attendedLabel: '5 of 7', points: 50 },
  ],
}

export const sampleTrackSessions: TrackSessionsView = {
  track: 'Cybersecurity',
  menteeCount: 14,
  sessions: [
    {
      id: 's-8',
      title: 'Cybersecurity: ICT Training 8',
      startsAt: '2026-08-27T17:30:00+03:00',
      endsAt: '2026-08-27T20:00:00+03:00',
      isToday: true,
      attendedLabel: null,
      materialsUrl: 'https://example.com/materials',
    },
    {
      id: 's-7',
      title: 'Cybersecurity: ICT Training 7',
      startsAt: '2026-08-13T17:30:00+03:00',
      endsAt: '2026-08-13T20:00:00+03:00',
      isToday: false,
      attendedLabel: '13 of 14',
      materialsUrl: 'https://example.com/materials',
    },
    {
      id: 's-6',
      title: 'Cybersecurity: ICT Training 6',
      startsAt: '2026-07-16T17:30:00+03:00',
      endsAt: '2026-07-16T20:00:00+03:00',
      isToday: false,
      attendedLabel: '12 of 14',
      materialsUrl: null,
    },
  ],
  next: {
    title: 'Cybersecurity: ICT Session 9',
    startsAt: '2026-09-24T17:30:00+03:00',
    endsAt: '2026-09-24T20:00:00+03:00',
  },
}
