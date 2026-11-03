import type { AlumniHomeView, AlumniRecordView } from '../src/types/alumni'

// Sample data for the alumni screens' stories. Not real people. Nothing in src/ uses it.

export const sampleAlumniHome: AlumniHomeView = {
  firstName: 'Wanjiru',
  cohortName: 'Cohort 10',
  graduated: true,
  graduatedOn: '2026-04-30',
  coreRate: 92,
  overallRate: 85,
  totalPoints: 781,
  sessionsAttended: 90,
}

export const sampleAlumniRecord: AlumniRecordView = {
  cohortName: 'Cohort 10',
  sessions: [
    {
      sessionId: 's-5',
      title: 'Pitch practice 3',
      startsAt: '2026-04-09T17:30:00+03:00',
      pillar: 'innovation',
      state: 'attended',
    },
    {
      sessionId: 's-4',
      title: 'Scholarship essays',
      startsAt: '2026-04-02T17:30:00+03:00',
      pillar: 'scholarship',
      state: 'attended',
    },
    {
      sessionId: 's-3',
      title: 'Cybersecurity: ICT Training 7',
      startsAt: '2026-03-26T17:30:00+03:00',
      pillar: 'ict',
      state: 'attended',
    },
    {
      sessionId: 's-2',
      title: 'Personal finance',
      startsAt: '2026-03-19T17:30:00+03:00',
      pillar: null,
      state: 'missed',
    },
  ],
  activities: [
    { label: 'Consultations', count: 6 },
    { label: 'External events', count: 9 },
    { label: 'Applications', count: 7 },
    { label: 'KamiLimu to Academia', count: 4 },
  ],
  objectives: [
    { skill: 'communication', label: 'Communication', summary: 'Start 2, Mid 3, End 4' },
    { skill: 'leadership', label: 'Leadership', summary: 'Start 3, Mid 4, End 4' },
    { skill: 'technical', label: 'Technical', summary: 'Start 2, Mid 3, End 5' },
  ],
}
