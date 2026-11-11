'use client'

import { useState } from 'react'
import type { AttendanceAnswers, AttendanceDraft, RatingField } from '@/types/menteeSessions'

const EMPTY: AttendanceDraft = { status: null, ratings: {}, feedback: '' }

interface UseAttendanceAnswersReturn {
  answers: AttendanceDraft
  setStatus: (status: AttendanceAnswers['status']) => void
  setRating: (field: RatingField, value: number) => void
  setFeedback: (feedback: string) => void
  isPresent: boolean
  hasStatus: boolean
  ratedCount: number
  totalRatings: number
  isFeedbackWritten: boolean
  isComplete: boolean
  // Turns on the per-question messages after a failed submit
  showErrors: boolean
  // The answers ready to send, or null after showing what's missing
  check: () => AttendanceAnswers | null
}

// The attendance form's answers and what is still missing. Present or Absent must be
// picked; nothing starts selected, so nobody is marked present by default. Present needs
// every rating and the feedback. Absent needs nothing else, since the API only takes
// ratings for Present.
export function useAttendanceAnswers(fields: RatingField[]): UseAttendanceAnswersReturn {
  const [answers, setAnswers] = useState<AttendanceDraft>(EMPTY)
  const [showErrors, setShowErrors] = useState(false)

  const isPresent = answers.status === 'present'
  const hasStatus = answers.status !== null
  const ratedCount = fields.filter((field) => answers.ratings[field] !== undefined).length
  const isFeedbackWritten = answers.feedback.trim().length > 0
  const isComplete =
    hasStatus &&
    (!isPresent || (fields.length > 0 && ratedCount === fields.length && isFeedbackWritten))

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
    hasStatus,
    ratedCount,
    totalRatings: fields.length,
    isFeedbackWritten,
    isComplete,
    showErrors,
    check: () => {
      setShowErrors(!isComplete)
      const { status } = answers
      return isComplete && status !== null ? { ...answers, status } : null
    },
  }
}
