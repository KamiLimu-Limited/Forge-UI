// The five extra activity forms as settings, and how each saves to the API.
// A field marked `unavailable` is one the API can't store yet. See docs/api-gaps.md.

import { FINAL_OUTCOME_LABELS, OPPORTUNITY_STAGE_LABELS } from '@/lib/labels'
import { api } from '@/lib/api'
import type {
  ConsultationStatus,
  EventMode,
  EventRole,
  ExtraActivityResponse,
  FinalOutcome,
  OpportunityStage,
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
  { value: 'participant', label: 'Participant' },
  { value: 'speaker', label: 'Speaker' },
  { value: 'organizer', label: 'Organizer' },
]

const EVENT_MODES: { value: EventMode; label: string }[] = [
  { value: 'in_person', label: 'In person' },
  { value: 'virtual', label: 'Virtual' },
]

export const APPLICATION_STAGES: { value: OpportunityStage; label: string }[] = (
  Object.keys(OPPORTUNITY_STAGE_LABELS) as OpportunityStage[]
).map((value) => ({ value, label: OPPORTUNITY_STAGE_LABELS[value] }))

export const FINAL_OUTCOMES: { value: FinalOutcome; label: string }[] = (
  Object.keys(FINAL_OUTCOME_LABELS) as FinalOutcome[]
).map((value) => ({ value, label: FINAL_OUTCOME_LABELS[value] }))

const CONSULTATION_STATUSES: { value: ConsultationStatus; label: string }[] = [
  { value: 'completed', label: 'Completed' },
  { value: 'scheduled', label: 'Scheduled' },
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
    kind: 'textarea',
    placeholder: 'Which KamiLimu lessons helped, and how?',
  },
  { name: 'confidence', label: 'Confidence level', kind: 'select', half: true, unavailable: true },
  {
    name: 'support',
    label: 'Support received',
    kind: 'chips',
    options: SUPPORT_OPTIONS,
  },
  { name: 'supportMode', label: 'Mode of support', kind: 'select', half: true, unavailable: true },
  {
    name: 'finalOutcome',
    label: 'Final outcome',
    kind: 'select',
    options: FINAL_OUTCOMES,
    initial: 'waiting_for_response',
    half: true,
  },
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
        kind: 'select',
        optionsFrom: 'consultants',
        placeholder: 'Choose a consultant',
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
        optional: true,
      },
      {
        name: 'status',
        label: 'Status',
        kind: 'segmented',
        options: CONSULTATION_STATUSES,
        initial: 'completed',
      },
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
        unavailable: true,
      },
      { name: 'date', label: 'Event date', kind: 'date' },
      {
        name: 'role',
        label: 'Type of attendance',
        kind: 'segmented',
        options: EVENT_ROLES,
        initial: 'participant',
      },
      {
        name: 'mode',
        label: 'How it ran',
        kind: 'segmented',
        options: EVENT_MODES,
        initial: 'in_person',
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

// Every field the mentee can fill in is required unless marked optional; segmented and stage
// fields start filled
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
    .filter((field) => !field.unavailable && !field.optional && !(values[field.name] ?? '').trim())
    .map((field) => field.name)
}

// The API has no field for these answers, so they share the description under headings.
// See docs/api-gaps.md.
function academicDescription(values: ActivityFormValues): string {
  return [
    `Lesson or experience used: ${values.lesson.trim()}`,
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
        consultant_id: v.consultant,
        details: {
          consultation_type: v.consultationType,
          summary: v.summary,
          support_received: v.support || null,
          status: v.status as ConsultationStatus,
        },
      })
    case 'event':
      return api.extraActivities.logEvent({
        ...base,
        title: v.name,
        description: v.about,
        details: {
          event_role: v.role as EventRole,
          mode: v.mode as EventMode,
          learnings: v.reflection,
        },
      })
    // The type of job and support received have no API field yet, so they go in the
    // description. See docs/api-gaps.md.
    case 'job':
      return api.extraActivities.logOpportunity({
        ...base,
        title: v.role,
        description: `Type of job: ${v.jobType}\n\nSupport received: ${v.support}`,
        details: {
          organisation: v.organization,
          date_applied: v.date,
          how_applied: v.preparation,
          stage: v.stage as OpportunityStage,
          final_outcome: v.finalOutcome as FinalOutcome,
        },
      })
    case 'scholarship':
      return api.extraActivities.logScholarship({
        ...base,
        title: v.name,
        description: `Purpose: ${v.purpose}\n\nSupport received: ${v.support}`,
        details: {
          organisation: v.name,
          date_applied: v.date,
          how_applied: v.preparation,
          stage: v.stage as OpportunityStage,
          final_outcome: v.finalOutcome as FinalOutcome,
        },
      })
    case 'academic':
      return api.extraActivities.logAcademic({
        ...base,
        title: v.workType,
        description: academicDescription(values),
        details: { kami_limu_pillar: v.pillar, related_session_ids: [], how_applied: v.how },
      })
  }
}
