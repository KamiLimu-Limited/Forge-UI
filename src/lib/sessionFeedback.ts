// Turns a session's feedback into the grouped averages FeedbackSummary draws. Used by
// the peer mentor's facilitator view and the professional mentor's feedback screen.

import { averageOf } from '@/lib/peerMentor'
import type { FeedbackGroupView } from '@/types/peerMentor'
import type { FeedbackEntry, SessionFeedbackResponse } from '@/types/sessionFeedback'

type FeedbackField = 'quality_rating' | 'usefulness_rating' | 'understanding_score'

// The PRD asks nine questions in three groups. The feedback route returns three ratings,
// so each sits in the group it fits. See docs/api-gaps.md.
const FEEDBACK_GROUPS: { label: string; questions: { label: string; key: FeedbackField }[] }[] = [
  {
    label: 'Reaction',
    questions: [
      { label: 'Quality of the session', key: 'quality_rating' },
      { label: 'How useful it was', key: 'usefulness_rating' },
    ],
  },
  {
    label: 'Learning',
    questions: [{ label: 'How well they understood it', key: 'understanding_score' }],
  },
]

function answers(entries: FeedbackEntry[], key: FeedbackField): number[] {
  return entries.flatMap((entry) => {
    const value = entry[key]
    return typeof value === 'number' ? [value] : []
  })
}

// The API's average when it sent one, otherwise worked out from the answers
function questionAverage(response: SessionFeedbackResponse, key: FeedbackField): number | null {
  const sent = response.averages[key]
  if (typeof sent === 'number') return Math.round(sent * 10) / 10
  return averageOf(answers(response.entries, key))
}

export function feedbackGroups(response: SessionFeedbackResponse): FeedbackGroupView[] {
  return FEEDBACK_GROUPS.map((group) => ({
    label: group.label,
    questions: group.questions.map((question) => ({
      label: question.label,
      average: questionAverage(response, question.key),
    })),
  }))
}

// One number for the session: the mean of its question averages
export function overallAverage(response: SessionFeedbackResponse): number | null {
  if (response.responses === 0) return null
  return averageOf(
    feedbackGroups(response).flatMap((group) =>
      group.questions.flatMap((question) => (question.average === null ? [] : [question.average]))
    )
  )
}

export function writtenFeedback(response: SessionFeedbackResponse): string[] {
  return response.entries.flatMap((entry) => {
    const text = entry.feedback?.trim()
    return text ? [text] : []
  })
}
