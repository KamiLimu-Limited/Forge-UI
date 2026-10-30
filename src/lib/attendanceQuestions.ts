import type { RatingField } from '@/types/menteeSessions'

export interface RatingQuestion {
  field: RatingField
  text: string
}

export interface RatingGroup {
  title: string
  questions: RatingQuestion[]
}

// The API stores five ratings today. The PRD asks for nine, and their wording is still an
// open item, so this wording is a stand-in. See docs/api-gaps.md. Only this list needs to
// change when the nine arrive.
export const RATING_GROUPS: RatingGroup[] = [
  {
    title: 'Reaction',
    questions: [
      { field: 'quality_rating', text: 'How would you rate the quality of this session?' },
      { field: 'usefulness_rating', text: 'How useful was this session to you?' },
    ],
  },
  {
    title: 'Learning',
    questions: [{ field: 'understanding_score', text: 'How well did you understand the content?' }],
  },
  {
    title: 'Intended behaviour',
    questions: [
      {
        field: 'academic_application_score',
        text: 'How likely are you to use this in your academic work?',
      },
      {
        field: 'career_application_score',
        text: 'How likely are you to use this in your career?',
      },
    ],
  },
]

export const RATING_FIELDS: RatingField[] = RATING_GROUPS.flatMap((group) =>
  group.questions.map((question) => question.field)
)
