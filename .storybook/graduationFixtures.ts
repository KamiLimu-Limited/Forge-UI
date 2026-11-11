import type { ProgramLeadHomeData } from '../src/hooks/useGraduation'
import type { GraduateRow, GraduationPreviewView, SequenceView } from '../src/types/graduation'
import { sampleCommitteeOverview } from './committeeFixtures'

// Sample data for the Program Lead and graduation stories. Not real people. Nothing in
// src/ uses it.

const names = [
  'Diana Awino Achola',
  'Christine Wangui Mugo',
  'David Mungai Guchu',
  'Joy Mbugua',
  'Faith Mutheu Mutua',
  'Lewis Gitau Ndungu',
  'Amani Otieno',
  'Brian Kamau',
]

const graduates: GraduateRow[] = names.map((name, index) => ({
  id: `g-${index}`,
  name,
  university: null,
  coreRate: 97 - index * 2,
  totalPoints: 812 - index * 20,
}))

const nonGraduates: GraduateRow[] = ['Kevin Odhiambo', 'Lucy Wairimu'].map((name, index) => ({
  id: `n-${index}`,
  name,
  university: null,
  coreRate: 78 - index * 6,
  totalPoints: 604 - index * 40,
}))

export const samplePreview: GraduationPreviewView = {
  cohortId: 'c-11',
  cohortName: 'Cohort 11',
  endDate: '2026-10-31',
  hasEnded: true,
  isGraduated: false,
  isClosed: false,
  calculatedAt: '2026-11-09T09:40:00+03:00',
  confirmedAt: null,
  confirmedByName: null,
  threshold: 80,
  unavailableReasons: [],
  graduates,
  nonGraduates,
}

export const sampleProgramLeadHome: ProgramLeadHomeData = {
  overview: sampleCommitteeOverview,
  home: {
    graduation: {
      endDate: '2026-10-31',
      hasEnded: false,
      isGraduated: false,
      isAvailable: false,
      reasons: [],
    },
    pendingTotal: 3,
    pendingRequests: [
      { id: 'r-1', menteeName: 'Joy Mbugua', sessionLine: 'User Validation, Sat 22 Aug' },
      {
        id: 'r-2',
        menteeName: 'Brian Kamau',
        sessionLine: 'Cybersecurity: ICT Training 7, Thu 13 Aug',
      },
      { id: 'r-3', menteeName: 'Amani Otieno', sessionLine: 'Scholarship Principles 3, Thu 6 Aug' },
    ],
    upcoming: [
      {
        id: 's-1',
        title: 'Cybersecurity: ICT Training 8',
        startsAt: '2026-08-27T17:30:00+03:00',
        isVirtual: true,
      },
      {
        id: 's-2',
        title: 'General Interview Skills',
        startsAt: '2026-09-03T17:30:00+03:00',
        isVirtual: true,
      },
      {
        id: 's-3',
        title: 'KamiLimu In-Person Sessions',
        startsAt: '2026-09-05T08:00:00+03:00',
        isVirtual: false,
      },
    ],
  },
}

export const sampleSequence: SequenceView = {
  cohortName: 'Cohort 11',
  startDate: '2026-03-16',
  endDate: '2026-10-31',
  months: 8,
  numbers: [
    { label: 'months', value: 8 },
    { label: 'sessions held', value: 101 },
    { label: 'points earned', value: 26900 },
    { label: 'extra activities', value: 412 },
    { label: 'consultations', value: 96 },
  ],
  graduates: [...graduates].sort((a, b) => a.name.localeCompare(b.name)),
  mentors: [
    { name: 'Hansel Omondi', role: '1:1 Peer Mentor' },
    { name: 'Julia Migwi', role: 'ICT Peer Mentor, Cloud Engineering' },
    { name: 'Nyevu Karisa', role: 'Public Speaking trainer' },
    { name: 'Fidel Otieno', role: '1:1 Peer Mentor' },
    { name: 'Mavine Rakiro', role: 'ICT Peer Mentor, Software Engineering' },
    { name: 'Dorcas Litunya', role: 'Git and GitHub Foundations' },
  ],
  isRehearsal: true,
}
