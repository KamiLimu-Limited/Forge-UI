'use client'

import { useState } from 'react'
import { RATING_FIELDS } from '@/lib/attendanceQuestions'
import type { AttendanceAnswers, RatingField } from '@/types/menteeSessions'

const EMPTY: AttendanceAnswers = { status: 'attended', ratings: {}, feedback: '' }

interface UseAttendanceAnswersReturn {
  answers: AttendanceAnswers
  setStatus: (status: AttendanceAnswers['status']) => void
  setRating: (field: RatingField, value: number) => void
  setFeedback: (feedback: string) => void
  isPresent: boolean
  ratedCount: number
  totalRatings: number
  isFeedbackWritten: boolean
  isComplete: boolean
  // Turns on the per-question messages after a failed submit
  showErrors: boolean
  // True when the answers can be sent; otherwise shows what's missing
  check: () => boolean
}

// The attendance form's answers and what is still missing. Present needs every rating and
// the feedback. Absent needs nothing else, since the API only takes ratings for Present.
export function useAttendanceAnswers(): UseAttendanceAnswersReturn {
  const [answers, setAnswers] = useState<AttendanceAnswers>(EMPTY)
  const [showErrors, setShowErrors] = useState(false)

  const isPresent = answers.status === 'attended'
  const ratedCount = RATING_FIELDS.filter((field) => answers.ratings[field] !== undefined).length
  const isFeedbackWritten = answers.feedback.trim().length > 0
  const isComplete = !isPresent || (ratedCount === RATING_FIELDS.length && isFeedbackWritten)

  return {
    answers,
    setStatus: (status) => setAnswers((current) => ({ ...current, status })),
    setRating: (field, value) =>
      setAnswers((current) => ({
        ...current,
        ratings: { ...current.ratings, [field]: value },
      })),
    setFeedback: (feedback) => setAnswers((current) => ({ ...current, feedback })),
    isPresent,
    ratedCount,
    totalRatings: RATING_FIELDS.length,
    isFeedbackWritten,
    isComplete,
    showErrors,
    check: () => {
      setShowErrors(!isComplete)
      return isComplete
    },
  }
}
