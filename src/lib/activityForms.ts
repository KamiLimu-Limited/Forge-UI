// =============================================================================
// The five extra activity forms as settings, and how each saves to the API.
// A field marked `unavailable` is one the API can't store yet. See docs/api-gaps.md.
// =============================================================================

import { api } from '@/lib/api'
import type {
  EventMode,
  EventRole,
  ExtraActivityResponse,
  OpportunityOutcome,
} from '@/types/activity'
import type {
  ActivityField,
  ActivityFormConfig,
  ActivityFormValues,
  ActivityKind,
  FieldOption,
} from '@/types/menteeActivities'

function toOptions(values: string[]): FieldOption[] {
  return values.map((value) => ({ value, label: value }))
}

const PILLARS = toOptions([
  'Personal Development',
  'Professional Development',
  'Scholarship',
  'Responsible Innovation',
  'Industry-Relevant ICT Skills',
  'Community Engagement',
])

const CONSULTATION_TYPES = toOptions([
  'About KamiLimu',
  'AI, ML, and Data Science',
  'Communication and Public Speaking',
  'Cybersecurity',
  'Career and Employability',
  'Innovation and Entrepreneurship',
  'Software Engineering',
  'Personal Growth, Wellbeing, and Life Skills',
  'Personal Interest and Hobbies',
  'Postgrad, Scholarship and Academia',
])

const EVENT_ROLES: { value: EventRole; label: string }[] = [
  { value: 'attendee', label: 'Participant' },
  { value: 'speaker', label: 'Speaker' },
  { value: 'organizer', label: 'Organizer' },
]

const EVENT_MODES: { value: EventMode; label: string }[] = [
  { value: 'physical', label: 'In person' },
  { value: 'virtual', label: 'Virtual' },
  { value: 'hybrid', label: 'Hybrid' },
]

// The API's four stages, in plain words
export const APPLICATION_STAGES: { value: OpportunityOutcome; label: string }[] = [
  { value: 'applied', label: 'Applied' },
  { value: 'shortlisted', label: 'Interview stage' },
  { value: 'accepted', label: 'Offer made' },
  { value: 'rejected', label: 'Did not proceed' },
]

const SUPPORT_OPTIONS = toOptions([
  'One-to-one peer mentor',
  'Fellow mentee',
  'ICT peer mentor',
  'Committee member',
  'Professional mentor',
  'Alumni',
  'Fellow peer mentor',
  'None',
])

const NOTES: ActivityField = {
  name: 'notes',
  label: 'Personal notes',
  kind: 'textarea',
  placeholder: 'Only you can see these',
  unavailable: true,
}

const APPLICATION_EXTRAS: ActivityField[] = [
  {
    name: 'preparation',
    label: 'KamiLimu preparation source',
    kind: 'select',
    half: true,
    unavailable: true,
  },
  { name: 'confidence', label: 'Confidence level', kind: 'select', half: true, unavailable: true },
  {
    name: 'support',
    label: 'Support received',
    kind: 'chips',
    options: SUPPORT_OPTIONS,
  },
  { name: 'supportMode', label: 'Mode of support', kind: 'select', half: true, unavailable: true },
  { name: 'finalOutcome', label: 'Final outcome', kind: 'select', half: true, unavailable: true },
  NOTES,
]

export const ACTIVITY_FORMS: Record<ActivityKind, ActivityFormConfig> = {
  consultation: {
    kind: 'consultation',
    title: 'Log a consultation',
    subtitle: 'A one-on-one consultation with someone on the KamiLimu consultant list.',
    saveLabel: 'Save consultation',
    fields: [
      { name: 'date', label: 'Consultation date', kind: 'date', half: true },
      {
        name: 'consultant',
        label: 'Consultant',
        kind: 'text',
        placeholder: "Consultant's name",
        half: true,
      },
      {
        name: 'consultationType',
        label: 'Consultation type',
        kind: 'select',
        options: CONSULTATION_TYPES,
        placeholder: 'Choose a type',
      },
      {
        name: 'summary',
        label: 'Summary of discussions',
        kind: 'textarea',
        placeholder: 'What did you talk about?',
      },
      {
        name: 'support',
        label: 'Support received',
        kind: 'textarea',
        placeholder: 'What help did you get?',
      },
      { name: 'status', label: 'Status', kind: 'select', unavailable: true },
      NOTES,
    ],
  },
  event: {
    kind: 'event',
    title: 'Log an external event',
    subtitle: 'An event outside KamiLimu that you attended, spoke at or organised.',
    saveLabel: 'Save event',
    fields: [
      { name: 'name', label: 'Event name', kind: 'text', placeholder: 'Event name', half: true },
      {
        name: 'organizer',
        label: 'Event organizer',
        kind: 'text',
        placeholder: 'Who ran it',
        half: true,
      },
      { name: 'date', label: 'Event date', kind: 'date' },
      {
        name: 'role',
        label: 'Type of attendance',
        kind: 'segmented',
        options: EVENT_ROLES,
        initial: 'attendee',
      },
      {
        name: 'mode',
        label: 'How it ran',
        kind: 'segmented',
        options: EVENT_MODES,
        initial: 'physical',
      },
      {
        name: 'about',
        label: 'What the event was about',
        kind: 'textarea',
        placeholder: 'A sentence or two',
      },
      {
        name: 'reflection',
        label: 'Reflection',
        kind: 'textarea',
        placeholder: 'What did you take away?',
      },
      { name: 'pillar', label: 'KamiLimu pillar', kind: 'select', half: true, unavailable: true },
      {
        name: 'attendanceStatus',
        label: 'Attendance status',
        kind: 'select',
        half: true,
        unavailable: true,
      },
      {
        name: 'proof',
        label: 'Proof of attendance',
        kind: 'text',
        placeholder: 'Google Drive link',
        unavailable: true,
      },
      NOTES,
    ],
  },
  job: {
    kind: 'job',
    title: 'Log a job application',
    subtitle: 'Update the stage as results arrive.',
    saveLabel: 'Save application',
    fields: [
      {
        name: 'jobType',
        label: 'Type of job',
        kind: 'segmented',
        options: toOptions(['Internship', 'Full Time', 'Part Time']),
        initial: 'Internship',
      },
      {
        name: 'organization',
        label: 'Organization',
        kind: 'text',
        placeholder: 'Organization name',
        half: true,
      },
      { name: 'role', label: 'Role name', kind: 'text', placeholder: 'Role name', half: true },
      { name: 'date', label: 'Application date', kind: 'date', half: true },
      {
        name: 'stage',
        label: 'Application stage',
        kind: 'select',
        options: APPLICATION_STAGES,
        initial: 'applied',
        half: true,
      },
      ...APPLICATION_EXTRAS,
    ],
  },
  scholarship: {
    kind: 'scholarship',
    title: 'Log a scholarship application',
    subtitle: 'A scholarship or fellowship application. Update the stage as results arrive.',
    saveLabel: 'Save application',
    fields: [
      {
        name: 'name',
        label: 'Scholarship name',
        kind: 'text',
        placeholder: 'Scholarship or fellowship name',
        half: true,
      },
      {
        name: 'purpose',
        label: 'Scholarship purpose',
        kind: 'text',
        placeholder: "For example, a master's degree",
        half: true,
      },
      { name: 'date', label: 'Application date', kind: 'date', half: true },
      {
        name: 'stage',
        label: 'Application stage',
        kind: 'select',
        options: APPLICATION_STAGES,
        initial: 'applied',
        half: true,
      },
      ...APPLICATION_EXTRAS,
    ],
  },
  academic: {
    kind: 'academic',
    title: 'Log KamiLimu to Academia',
    subtitle: 'Coursework where you used something you learnt at KamiLimu.',
    saveLabel: 'Save log',
    fields: [
      {
        name: 'workType',
        label: 'Type of academic work',
        kind: 'text',
        placeholder: 'For example, a course project',
        half: true,
      },
      { name: 'date', label: 'When', kind: 'date', half: true },
      {
        name: 'lesson',
        label: 'Lesson or experience used',
        kind: 'textarea',
        placeholder: 'Which session or experience?',
      },
      {
        name: 'how',
        label: 'How you applied it',
        kind: 'textarea',
        placeholder: 'What did you do with it?',
      },
      {
        name: 'outcome',
        label: 'Outcome',
        kind: 'textarea',
        placeholder: 'What happened as a result?',
      },
      {
        name: 'pillar',
        label: 'KamiLimu pillar',
        kind: 'select',
        options: PILLARS,
        placeholder: 'Choose a pillar',
        half: true,
      },
      {
        name: 'proof',
        label: 'Proof of application',
        kind: 'text',
        placeholder: 'Google Drive link',
        half: true,
        unavailable: true,
      },
      NOTES,
    ],
  },
}

// Chips can hold several answers, kept as one comma-separated value. "None" stands alone.
const NONE = 'None'
const CHIP_SEPARATOR = ', '

export function chipValues(value: string): string[] {
  return value ? value.split(CHIP_SEPARATOR) : []
}

export function toggleChip(value: string, option: string): string {
  const selected = chipValues(value)
  if (selected.includes(option)) {
    return selected.filter((item) => item !== option).join(CHIP_SEPARATOR)
  }
  if (option === NONE) return NONE
  return [...selected.filter((item) => item !== NONE), option].join(CHIP_SEPARATOR)
}

export function isActivityKind(value: string): value is ActivityKind {
  return value in ACTIVITY_FORMS
}

// Every field the mentee can fill in is required; segmented and stage fields start filled
export function initialValues(config: ActivityFormConfig): ActivityFormValues {
  return Object.fromEntries(
    config.fields
      .filter((field) => !field.unavailable)
      .map((field) => [field.name, field.initial ?? ''])
  )
}

// The field names still empty
export function missingFields(config: ActivityFormConfig, values: ActivityFormValues): string[] {
  return config.fields
    .filter((field) => !field.unavailable && !(values[field.name] ?? '').trim())
    .map((field) => field.name)
}

// The API has no separate job and scholarship types, so the first line says which
export const JOB_MARKER = 'Job application'
export const SCHOLARSHIP_MARKER = 'Scholarship application'

// The API has one description, so these three answers share it under headings
function academicDescription(values: ActivityFormValues): string {
  return [
    `Lesson or experience used: ${values.lesson.trim()}`,
    `How I applied it: ${values.how.trim()}`,
    `Outcome: ${values.outcome.trim()}`,
  ].join('\n\n')
}

export function saveActivity(
  kind: ActivityKind,
  values: ActivityFormValues,
  cohortId: string
): Promise<ExtraActivityResponse> {
  const v = Object.fromEntries(Object.entries(values).map(([name, value]) => [name, value.trim()]))
  const base = { cohort_id: cohortId, date: v.date }
  switch (kind) {
    case 'consultation':
      return api.extraActivities.logConsultation({
        ...base,
        title: v.consultationType,
        description: v.support,
        details: { mentor_name: v.consultant, consultation_date: v.date, outcome: v.summary },
      })
    case 'event':
      return api.extraActivities.logEvent({
        ...base,
        title: v.name,
        description: v.about,
        details: {
          event_role: v.role as EventRole,
          mode: v.mode as EventMode,
          organizer: v.organizer,
          learnings: v.reflection,
        },
      })
    case 'job':
      return api.extraActivities.logOpportunity({
        ...base,
        title: v.role,
        description: `${JOB_MARKER}\n\nType of job: ${v.jobType}\n\nSupport received: ${v.support}`,
        details: {
          organization: v.organization,
          application_date: v.date,
          outcome_status: v.stage as OpportunityOutcome,
        },
      })
    case 'scholarship':
      return api.extraActivities.logOpportunity({
        ...base,
        title: v.name,
        description: `${SCHOLARSHIP_MARKER}\n\nPurpose: ${v.purpose}\n\nSupport received: ${v.support}`,
        details: {
          organization: v.name,
          application_date: v.date,
          outcome_status: v.stage as OpportunityOutcome,
        },
      })
    case 'academic':
      return api.extraActivities.logAcademic({
        ...base,
        title: v.workType,
        description: academicDescription(values),
        details: { course_name: v.workType, kami_limu_pillar: v.pillar },
      })
  }
}
