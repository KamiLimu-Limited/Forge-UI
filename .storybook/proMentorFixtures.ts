import type { ProFeedbackView, ProSessionRow, ProSessionsView } from '../src/types/proMentor'

// Sample data for the professional mentor stories. Not real people. Nothing in src/ uses it.

const row = (overrides: Partial<ProSessionRow>): ProSessionRow => ({
  id: 's-1',
  title: 'General Interview Skills and Career Development',
  startsAt: '2026-09-03T17:30:00+03:00',
  endsAt: '2026-09-03T20:00:00+03:00',
  pillar: null,
  role: 'lead',
  statusLabel: 'Published',
  attended: 0,
  eligible: 40,
  rating: null,
  materialsUrl: 'https://drive.google.com/drive/folders/interview-skills',
  ...overrides,
})

export const sampleProSessions: ProSessionsView = {
  cohortName: 'Cohort 11',
  upcoming: [
    row({}),
    row({
      id: 's-2',
      title: 'Career Development: CVs, Applications and Opportunities',
      startsAt: '2026-09-12T09:30:00+03:00',
      materialsUrl: null,
    }),
  ],
  past: [
    row({
      id: 's-3',
      title: 'Responsible AI Use for Job Applications',
      startsAt: '2026-06-06T09:30:00+03:00',
      statusLabel: 'Completed',
      attended: 36,
      rating: 4.5,
      materialsUrl: 'https://drive.google.com/drive/folders/responsible-ai-jobs',
    }),
    row({
      id: 's-4',
      title: 'Resume Skills II and Reference Letter Skills',
      startsAt: '2026-04-09T17:30:00+03:00',
      role: 'co_mentor',
      statusLabel: 'Completed',
      attended: 34,
      rating: 4.3,
    }),
  ],
}

export const sampleProFeedback: ProFeedbackView = {
  session: sampleProSessions.past[0],
  responses: 36,
  average: 4.5,
  groups: [
    {
      label: 'Reaction',
      questions: [
        { label: 'Quality of the session', average: 4.7 },
        { label: 'How useful it was', average: 4.6 },
      ],
    },
    { label: 'Learning', questions: [{ label: 'How well they understood it', average: 4.4 }] },
  ],
  feedback: [
    'The examples of good and bad prompts were the most useful part.',
    'I would like a follow-up on cover letters.',
    'Clear and practical. More time for questions next time.',
    'Loved the live demo.',
    'The slides were easy to follow.',
  ].map((text, index) => ({ label: `Participant ${String(index + 1).padStart(2, '0')}`, text })),
}
