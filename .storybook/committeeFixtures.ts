import type {
  CohortNumbers,
  CommitteeOverviewView,
  CommitteeTrendsView,
  CrossCohortView,
} from '../src/types/committee'
import type { DimensionEntry } from '../src/types/leaderboard'

// Sample data for the committee and oversight stories. Not real people. Nothing in src/
// uses it.

export const sampleCohortNumbers: CohortNumbers = {
  menteesEnrolled: 40,
  coreRate: 84,
  overallRate: 78,
  pointsDistributed: 12400,
  sessionsCompleted: 46,
  sessionsTotal: 101,
  threshold: 80,
}

const rates = [92, 88, 85, 81, 79]

export const sampleCommitteeOverview: CommitteeOverviewView = {
  cohortName: 'Cohort 11',
  subtitle: 'Month 5 of 8',
  numbers: sampleCohortNumbers,
  monthRates: [1, 2, 3, 4, 5, 6, 7, 8].map((month) => ({
    label: `M${month}`,
    value: rates[month - 1] ?? null,
    display: rates[month - 1] ? `${rates[month - 1]}%` : '',
  })),
  trackRates: [
    { label: 'Core sessions', value: 84, display: '84%' },
    { label: 'Cloud Engineering', value: 88, display: '88%' },
    { label: 'Software Engineering', value: 86, display: '86%' },
    { label: 'Data Science', value: 80, display: '80%' },
    { label: 'Cybersecurity', value: 79, display: '79%' },
  ],
  activities: [
    { label: 'External event', value: 96, display: '96' },
    { label: 'Consultation', value: 59, display: '59' },
    { label: 'Application', value: 73, display: '73' },
    { label: 'KamiLimu to Academia', value: 38, display: '38' },
  ],
  activitiesMax: 96,
}

export const sampleCommitteeTrends: CommitteeTrendsView = {
  cohortName: 'Cohort 11',
  monthRates: rates.map((rate, index) => ({
    label: `Month ${index + 1}`,
    value: rate,
    display: `${rate}%`,
  })),
  trackRates: sampleCommitteeOverview.trackRates,
  ratingByMonth: [4.3, 4.4, 4.2, 4.5, 4.4].map((rating, index) => ({
    label: `Month ${index + 1}`,
    value: rating,
    display: rating.toFixed(1),
  })),
  activities: sampleCommitteeOverview.activities,
  activitiesMax: 96,
}

export const sampleCrossCohort: CrossCohortView = {
  current: { id: 'c-11', name: 'Cohort 11' },
  other: { id: 'c-10', name: 'Cohort 10' },
  options: [
    { id: 'c-10', name: 'Cohort 10' },
    { id: 'c-9', name: 'Cohort 9' },
  ],
  measures: [
    { label: 'Core attendance rate', current: 84, other: 81, max: 100, format: 'percent' },
    { label: 'Overall attendance rate', current: 78, other: 74, max: 100, format: 'percent' },
    { label: 'Average session rating', current: 4.4, other: 4.2, max: 5, format: 'rating' },
  ],
  counts: [
    { label: 'Mentees enrolled', current: 40, other: 36 },
    { label: 'Sessions completed', current: 46, other: 44 },
    { label: 'Extra activities logged', current: 266, other: 231 },
    { label: 'Consultations', current: 59, other: 47 },
  ],
}

export const sampleCohortBoard: DimensionEntry[] = [
  'Diana Achola',
  'Christine Mugo',
  'David Guchu',
  'Joy Mbugua',
  'Lewis Ndungu',
  'Faith Mutua',
  'Brian Kamau',
  'Amani Otieno',
].map((name, index) => ({
  rank: index + 1,
  mentee_id: `m-${index}`,
  display_name: name,
  is_me: false,
  value: 98 - index,
}))
