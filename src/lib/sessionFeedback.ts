// Turns a session's feedback into the grouped averages FeedbackSummary draws. Used by
// the peer mentor's facilitator view and the professional mentor's feedback screen.

import { ratingGroups } from '@/lib/attendanceQuestions'
import { averageOf } from '@/lib/peerMentor'
import type { FeedbackGroupView } from '@/types/peerMentor'
import type { QuestionAverage, SessionFeedbackResponse } from '@/types/sessionFeedback'

function rounded(value: number | null): number | null {
  return value === null ? null : Math.round(value * 10) / 10
}

// The nine questions under their group headings, each with the API's average
export function feedbackGroupsOf(questions: QuestionAverage[]): FeedbackGroupView[] {
  return ratingGroups(questions).map((group) => ({
    label: group.title,
    questions: group.questions.map((question) => {
      const average = questions.find((item) => item.number === question.number)?.average ?? null
      return { label: question.text, average: rounded(average) }
    }),
  }))
}

export function feedbackGroups(response: SessionFeedbackResponse): FeedbackGroupView[] {
  return feedbackGroupsOf(response.questions)
}

// One number for the session: the mean of its question averages
export function overallAverage(response: SessionFeedbackResponse): number | null {
  if (response.responses === 0) return null
  return averageOf(
    response.questions.flatMap((question) => (question.average === null ? [] : [question.average]))
  )
}

export function writtenFeedback(response: SessionFeedbackResponse): string[] {
  return response.entries.flatMap((entry) => {
    const text = entry.feedback?.trim()
    return text ? [text] : []
  })
}
