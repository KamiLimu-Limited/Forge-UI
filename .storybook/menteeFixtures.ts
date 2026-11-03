import { PILLAR_LABELS } from '../src/lib/labels'
import type { MenteeHomeData } from '../src/types/home'
import type { DimensionEntry } from '../src/types/leaderboard'
import type { NotificationResponse } from '../src/types/notification'
import type { MenteeObjectivesData } from '../src/types/menteeObjectives'
import type { ApplicationView, MenteeActivitiesData } from '../src/types/menteeActivities'
import type {
  HistoryRow,
  MenteeSessionsData,
  ExtensionView,
  SessionDetailView,
  SessionRecordView,
  UpcomingSession,
} from '../src/types/menteeSessions'
import type { MonthProgressRow, ProgressSummary, TrackProgressRow } from '../src/types/progress'

// Sample data for the mentee screens' stories. Not real people. Nothing in src/ uses it.

// ---- Progress screen. The month and track rows each add up to the summary. ----

export const sampleProgressSummary: ProgressSummary = { attended: 38, scheduled: 44, points: 320 }

export const sampleMonthProgress: MonthProgressRow[] = [
  { label: 'Month 1', attended: 10, scheduled: 10, rate: 100 },
  { label: 'Month 2', attended: 10, scheduled: 11, rate: 91 },
  { label: 'Month 3', attended: 8, scheduled: 10, rate: 80 },
  { label: 'Month 4', attended: 7, scheduled: 9, rate: 78 },
  { label: 'Month 5 (so far)', attended: 3, scheduled: 4, rate: 75 },
]

export const sampleTrackProgress: TrackProgressRow[] = [
  { label: PILLAR_LABELS['ict'], pillar: 'ict', attended: 7, scheduled: 7, points: 70, rate: 100 },
  {
    label: PILLAR_LABELS['innovation'],
    pillar: 'innovation',
    attended: 8,
    scheduled: 9,
    points: 70,
    rate: 89,
  },
  {
    label: PILLAR_LABELS['personal-dev'],
    pillar: 'personal-dev',
    attended: 6,
    scheduled: 8,
    points: 50,
    rate: 75,
  },
  {
    label: PILLAR_LABELS['professional-dev'],
    pillar: 'professional-dev',
    attended: 8,
    scheduled: 9,
    points: 60,
    rate: 89,
  },
  {
    label: PILLAR_LABELS['scholarship'],
    pillar: 'scholarship',
    attended: 6,
    scheduled: 7,
    points: 45,
    rate: 86,
  },
  {
    label: PILLAR_LABELS['community'],
    pillar: 'community',
    attended: 3,
    scheduled: 4,
    points: 25,
    rate: 75,
  },
]

// ---- Home screen. Numbers match the progress samples above. ----

export const sampleHome: MenteeHomeData = {
  firstName: 'Brian',
  programmeMonth: 5,
  totalMonths: 8,
  peerMentorName: 'Wanjiru Mwangi',
  hasPeerMentor: true,
  trackPrompt: null,
  standing: { coreRate: 86, overallRate: 79, pointsEarned: 320, pointsPossible: 410 },
  buckets: { attended: 38, inProgress: 2, missed: 6, remaining: 55 },
  nextSession: {
    id: 's-next',
    title: 'Cybersecurity: ICT Training 8',
    startsAt: '2026-08-27T17:30:00+03:00',
    endsAt: '2026-08-27T20:00:00+03:00',
    pillar: 'ict',
    materialsUrl: 'https://example.com/materials',
  },
  openSessions: [
    {
      id: 's-open-1',
      title: 'Peer Mentorship 4',
      startsAt: '2026-08-26T19:00:00+03:00',
      endsAt: '2026-08-26T22:00:00+03:00',
      pillar: null,
      leaderName: 'Wanjiru Mwangi',
      points: 10,
      closesInLabel: 'Closes in 2h',
    },
  ],
  months: sampleMonthProgress,
  ranks: [
    { label: 'Core attendance', rank: 12, isTied: false },
    { label: 'Academic', rank: 5, isTied: false },
    { label: 'Events', rank: 18, isTied: false },
    { label: 'Applications', rank: 9, isTied: false },
    { label: 'Consultations', rank: 14, isTied: false },
  ],
}

export const sampleHomeFirstMonth: MenteeHomeData = {
  ...sampleHome,
  programmeMonth: 1,
  peerMentorName: null,
  hasPeerMentor: false,
  trackPrompt: { closesOn: '2026-03-20' },
  standing: { coreRate: 100, overallRate: 100, pointsEarned: 40, pointsPossible: 40 },
  buckets: { attended: 4, inProgress: 1, missed: 0, remaining: 96 },
  nextSession: {
    id: 's-next',
    title: 'Getting started with your mentorship',
    startsAt: '2026-03-12T17:30:00+03:00',
    endsAt: '2026-03-12T19:00:00+03:00',
    pillar: null,
    materialsUrl: null,
  },
  openSessions: [],
  months: [],
  ranks: [
    { label: 'Core attendance', rank: 1, isTied: true },
    { label: 'Academic', rank: null, isTied: false },
    { label: 'Events', rank: null, isTied: false },
    { label: 'Applications', rank: null, isTied: false },
    { label: 'Consultations', rank: null, isTied: false },
  ],
}

// ---- Sessions and history screens ----

const sampleUpcoming: UpcomingSession[] = [
  {
    id: 's-up-1',
    title: 'Cybersecurity: ICT Training 8',
    startsAt: '2026-08-27T17:30:00+03:00',
    endsAt: '2026-08-27T20:00:00+03:00',
    pillar: 'ict',
    dayLabel: 'Today',
    opensLabel: 'Opens at 5:30 PM',
  },
  {
    id: 's-up-2',
    title: 'General Interview Skills and Career Development',
    startsAt: '2026-09-03T17:30:00+03:00',
    endsAt: '2026-09-03T20:00:00+03:00',
    pillar: null,
    dayLabel: 'Thu 3 Sep',
    opensLabel: 'Opens Thu 3 Sep, 5:30 PM',
  },
]

export const sampleSessions: MenteeSessionsData = {
  monthLine: 'Month 5 of 8',
  open: sampleHome.openSessions,
  upcoming: sampleUpcoming,
}

const sampleRatings = [
  { label: 'Quality', value: 5 },
  { label: 'Usefulness', value: 4 },
  { label: 'Understanding', value: 4 },
  { label: 'Academic application', value: 5 },
  { label: 'Career application', value: 4 },
]

export const sampleHistory: HistoryRow[] = [
  {
    sessionId: 's-h-1',
    title: 'Cybersecurity: ICT Training 7',
    startsAt: '2026-08-13T17:30:00+03:00',
    endsAt: '2026-08-13T20:00:00+03:00',
    month: 5,
    pillar: 'ict',
    track: 'Cybersecurity',
    sessionType: 'ict',
    state: 'attended',
    pointsEarned: 10,
    ratings: sampleRatings,
    feedback: 'The practical exercises were the most useful part.',
    notes: 'Revisit the threat modelling worksheet.',
    materialsUrl: 'https://example.com/materials',
  },
  {
    sessionId: 's-h-2',
    title: 'Scholarship Principles in Practice 3',
    startsAt: '2026-08-06T17:30:00+03:00',
    endsAt: '2026-08-06T20:00:00+03:00',
    month: 5,
    pillar: null,
    track: null,
    sessionType: 'core',
    state: 'not_attended',
    pointsEarned: 0,
    ratings: [],
    feedback: null,
    notes: null,
    materialsUrl: null,
  },
  {
    sessionId: 's-h-3',
    title: 'Cyber Security: ICT Training 6',
    startsAt: '2026-07-16T17:30:00+03:00',
    endsAt: '2026-07-16T20:00:00+03:00',
    month: 4,
    pillar: 'ict',
    track: 'Cybersecurity',
    sessionType: 'ict',
    state: 'missed',
    pointsEarned: 0,
    ratings: [],
    feedback: null,
    notes: null,
    materialsUrl: null,
  },
  {
    sessionId: 's-h-4',
    title: 'Responsible AI in Code Development',
    startsAt: '2026-07-11T09:00:00+03:00',
    endsAt: null,
    month: 4,
    pillar: null,
    track: null,
    sessionType: 'core',
    state: 'excused',
    pointsEarned: 0,
    ratings: [],
    feedback: null,
    notes: null,
    materialsUrl: null,
  },
]

// ---- Attendance and notes screens ----

export const sampleSessionRecord: SessionRecordView = {
  id: 's-open-1',
  title: 'Peer Mentorship 4',
  startsAt: '2026-08-26T19:00:00+03:00',
  endsAt: '2026-08-26T22:00:00+03:00',
  pillar: 'ict',
  leaderName: 'Wanjiru Mwangi',
  points: 10,
  materialsUrl: 'https://example.com/materials',
  windowState: 'open',
  windowClosesLabel: 'Thu 27 Aug, 12:00 PM',
  closesInLabel: 'Closes in 2h',
  opensLabel: 'Opens at 7:00 PM',
  recordId: null,
  recordState: null,
  notes: null,
  savedAt: null,
}

export const sampleSubmittedRecord: SessionRecordView = {
  ...sampleSessionRecord,
  recordId: 'r-1',
  recordState: 'attended',
  notes: 'Revisit the threat modelling worksheet.',
  savedAt: '2026-08-26T22:30:00+03:00',
}

// ---- Extension request screen ----

const closedSession: SessionRecordView = {
  ...sampleSessionRecord,
  windowState: 'closed',
  closesInLabel: null,
}

export const sampleExtensionNoRequest: ExtensionView = { session: closedSession, request: null }

export const sampleExtensionPending: ExtensionView = {
  session: closedSession,
  request: {
    status: 'pending',
    sentAt: '2026-08-28T09:10:00+03:00',
    reviewReason: null,
  },
}

export const sampleExtensionApproved: ExtensionView = {
  session: { ...sampleSessionRecord, windowClosesLabel: 'Sun 30 Aug, 11:59 PM' },
  request: {
    status: 'approved',
    sentAt: '2026-08-28T09:10:00+03:00',
    reviewReason: null,
  },
}

export const sampleExtensionDenied: ExtensionView = {
  session: closedSession,
  request: {
    status: 'denied',
    sentAt: '2026-08-28T09:10:00+03:00',
    reviewReason: 'The session did not take place at the listed time.',
  },
}

// ---- Activities screens ----

export const sampleActivities: MenteeActivitiesData = {
  totalPoints: 24,
  loggedCount: 11,
  tiles: [
    { kind: 'consultation', label: 'Consultations', count: 3, points: 9 },
    { kind: 'event', label: 'External events', count: 4, points: 6 },
    { kind: 'job', label: 'Job applications', count: 2, points: 5 },
    { kind: 'scholarship', label: 'Scholarship applications', count: 0, points: 0 },
    { kind: 'academic', label: 'KamiLimu to Academia', count: 2, points: 4 },
  ],
  recent: [
    {
      id: 'a-1',
      kind: 'job',
      typeLabel: 'Job application',
      details: 'Safari Tech, Software Intern',
      date: '2026-08-24',
      points: 3,
      status: 'pending',
      canUpdate: true,
    },
    {
      id: 'a-2',
      kind: 'event',
      typeLabel: 'External event',
      details: 'UoN Career Fair, as participant',
      date: '2026-08-15',
      points: 1,
      status: 'approved',
      canUpdate: false,
    },
    {
      id: 'a-3',
      kind: 'consultation',
      typeLabel: 'Consultation',
      details: 'Career and Employability',
      date: '2026-08-11',
      points: 0,
      status: 'rejected',
      canUpdate: false,
    },
  ],
}

export const sampleApplication: ApplicationView = {
  id: 'a-1',
  kind: 'job',
  title: 'Software Intern',
  organization: 'Safari Tech',
  stage: 'shortlisted',
  points: 3,
  canUpdate: true,
}

// ---- Objectives screen ----

const midWindow = {
  point: 'mid' as const,
  label: 'Mid',
  isOpen: true,
  opensLabel: '24 Aug',
  closesLabel: 'Sun 7 Sep',
}

export const sampleObjectives: MenteeObjectivesData = {
  cohortId: 'c-2026',
  objectives: [
    {
      skill: 'communication',
      label: 'Communication',
      group: 'Human',
      scores: { early: 2, mid: null, late: null },
    },
    {
      skill: 'leadership',
      label: 'Leadership',
      group: 'Human',
      scores: { early: 3, mid: 4, late: null },
    },
    {
      skill: 'technical',
      label: 'Technical',
      group: 'Technical',
      scores: { early: 1, mid: null, late: null },
    },
  ],
  windows: [
    { point: 'early', label: 'Start', isOpen: false, opensLabel: null, closesLabel: null },
    midWindow,
    { point: 'late', label: 'End', isOpen: false, opensLabel: '2 Nov', closesLabel: null },
  ],
  openWindow: midWindow,
}

// ---- Leaderboard screen. The mentee sits 12th of 20. ----

export const sampleBoard: DimensionEntry[] = Array.from({ length: 20 }, (_, index) => ({
  rank: index + 1,
  mentee_id: `m-${index + 1}`,
  display_name: index === 11 ? 'Brian Kamau' : `Sample Mentee ${index + 1}`,
  is_me: index === 11,
  value: 98 - index,
}))

// ---- Session detail and notifications ----

export const sampleSessionDetail: SessionDetailView = {
  ...sampleSessionRecord,
  id: 's-up-1',
  title: 'Cybersecurity: ICT Training 8',
  startsAt: '2026-08-27T17:30:00+03:00',
  endsAt: '2026-08-27T20:00:00+03:00',
  pillar: 'ict',
  windowState: 'upcoming',
  closesInLabel: null,
  windowClosesLabel: 'Fri 28 Aug, 10:00 AM',
  opensLabel: 'Opens at 5:30 PM',
  isVirtual: true,
  whereLabel: 'Virtual',
  typeLabel: 'ICT',
  month: 5,
  startsSoonLabel: 'Today, starts in 2 hours',
  movedNote:
    'Moved from Thu 20 Aug, 5:30 PM. Reason from the System Admin: The venue was unavailable.',
  mentors: [
    { name: 'Sample Professional Mentor', roleLabel: 'Lead mentor' },
    { name: 'Wanjiru Mwangi', roleLabel: 'Co-mentor' },
  ],
  materials: [
    {
      url: 'https://example.com/materials',
      title: 'Session materials',
      kindLabel: 'Google Drive folder',
    },
  ],
}

export const sampleNotifications: NotificationResponse[] = [
  {
    id: 'n-1',
    notification_type: 'attendance_window_opening',
    title: 'Attendance is open: Cybersecurity: ICT Training 8',
    message: 'Record your attendance by Fri 28 Aug, 10:00 AM.',
    meta_data: null,
    related_resource_type: 'session',
    related_resource_id: 's-up-1',
    read_at: null,
    created_at: '2026-08-27T17:35:00+03:00',
  },
  {
    id: 'n-2',
    notification_type: 'override_request_approved',
    title: 'Your extension was approved',
    message: 'User Validation and the Competitions Ahead.',
    meta_data: null,
    related_resource_type: null,
    related_resource_id: null,
    read_at: null,
    created_at: '2026-08-27T15:40:00+03:00',
  },
  {
    id: 'n-3',
    notification_type: 'session_cancelled',
    title: 'Session cancelled: Career Development',
    message: "It won't count towards your attendance rate.",
    meta_data: null,
    related_resource_type: 'session',
    related_resource_id: 's-2',
    read_at: '2026-08-25T10:00:00+03:00',
    created_at: '2026-08-24T09:00:00+03:00',
  },
]
