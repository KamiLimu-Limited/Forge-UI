'use client'

import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import type { PointsConfig } from '@/types/cohort'
import type { RatingQuestion } from '@/types/sessionFeedback'
import { useApiQuery } from './useApiQuery'

// The point boxes the design shows. The API has one value for every external event, so only
// the participant box saves; speaker and organizer wait for per-role points. The design's
// single interview box sets all three interview stages, and each value applies to job and
// scholarship applications alike. See docs/api-gaps.md.
export type PointKey =
  | 'eventParticipant'
  | 'eventSpeaker'
  | 'eventOrganizer'
  | 'academic'
  | 'consultation'
  | 'applied'
  | 'interview'
  | 'offer'

export const POINT_FIELDS: { key: PointKey; label: string; unavailable?: boolean }[] = [
  { key: 'eventParticipant', label: 'External event, participant' },
  { key: 'eventSpeaker', label: 'External event, speaker', unavailable: true },
  { key: 'eventOrganizer', label: 'External event, organizer', unavailable: true },
  { key: 'academic', label: 'KamiLimu to Academia' },
  { key: 'consultation', label: 'Consultation session' },
  { key: 'applied', label: 'Application, Applied' },
  { key: 'interview', label: 'Application, interview stage' },
  { key: 'offer', label: 'Application, Offer Made' },
]

export type PointValues = Record<PointKey, string>

const BLANK_POINTS: PointValues = {
  eventParticipant: '',
  eventSpeaker: '',
  eventOrganizer: '',
  academic: '',
  consultation: '',
  applied: '',
  interview: '',
  offer: '',
}

const QUESTION_COUNT = 9

function pointsFrom(config: PointsConfig): PointValues {
  return {
    ...BLANK_POINTS,
    eventParticipant: String(config.event),
    academic: String(config.academic),
    consultation: String(config.consultation),
    applied: String(config.opportunity.applied),
    interview: String(config.opportunity.general_interview),
    offer: String(config.opportunity.offer_made),
  }
}

// Blank boxes keep what the cohort already has
function configFrom(values: PointValues, current: PointsConfig): PointsConfig {
  const pick = (value: string, fallback: number) => (value.trim() ? Number(value) : fallback)
  const stages = (base: PointsConfig['opportunity']) => {
    const interview = values.interview.trim() ? Number(values.interview) : null
    return {
      applied: pick(values.applied, base.applied),
      general_interview: interview ?? base.general_interview,
      technical_interview: interview ?? base.technical_interview,
      final_interview: interview ?? base.final_interview,
      offer_made: pick(values.offer, base.offer_made),
    }
  }
  return {
    academic: pick(values.academic, current.academic),
    event: pick(values.eventParticipant, current.event),
    consultation: pick(values.consultation, current.consultation),
    opportunity: stages(current.opportunity),
    scholarship: stages(current.scholarship),
    targets: current.targets,
  }
}

export type PointErrors = Partial<Record<PointKey, string>>

function validatePoints(values: PointValues): PointErrors {
  const errors: PointErrors = {}
  for (const field of POINT_FIELDS) {
    const raw = values[field.key].trim()
    if (field.unavailable || !raw) continue
    const value = Number(raw)
    if (!Number.isInteger(value) || value < 0 || value > 100) {
      errors[field.key] = 'Enter a whole number from 0 to 100.'
    }
  }
  return errors
}

interface UseCohortRulesReturn {
  points: PointValues
  setPoint: (key: PointKey, value: string) => void
  pointErrors: PointErrors
  // Nine wordings in question order, empty until loaded
  questions: string[]
  setQuestion: (index: number, text: string) => void
  questionError: string | null
  isLoading: boolean
  loadError: string | null
  isDirty: boolean
  // True when everything filled in is valid
  check: () => boolean
  // Saves what changed to the given cohort, for a new cohort right after it's created
  save: (cohortId: string) => Promise<void>
}

// A cohort's extra activity points and session rating questions, which the API keeps on their
// own routes. With no cohort (a new one) nothing loads and only the points are offered.
export function useCohortRules(cohortId: string | null): UseCohortRulesReturn {
  const query = useApiQuery(
    async () => {
      const [config, questions] = await Promise.all([
        api.cohorts.pointsConfig(cohortId as string),
        api.cohorts.ratingQuestions(cohortId as string),
      ])
      return { config, questions }
    },
    [cohortId],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the points and questions." }
  )
  const initialPoints = useMemo(
    () => (query.data ? pointsFrom(query.data.config) : BLANK_POINTS),
    [query.data]
  )
  const initialQuestions = useMemo(
    () =>
      [...(query.data?.questions ?? [])]
        .sort((a: RatingQuestion, b: RatingQuestion) => a.number - b.number)
        .map((question) => question.text),
    [query.data]
  )
  const [points, setPoints] = useState(initialPoints)
  const [questions, setQuestions] = useState(initialQuestions)
  const [pointErrors, setPointErrors] = useState<PointErrors>({})
  const [questionError, setQuestionError] = useState<string | null>(null)

  useEffect(() => setPoints(initialPoints), [initialPoints])
  useEffect(() => setQuestions(initialQuestions), [initialQuestions])

  const pointsDirty = JSON.stringify(points) !== JSON.stringify(initialPoints)
  const questionsDirty = JSON.stringify(questions) !== JSON.stringify(initialQuestions)

  const check = () => {
    const errors = validatePoints(points)
    setPointErrors(errors)
    const blank = questionsDirty && questions.some((text) => !text.trim())
    setQuestionError(blank ? 'Every question needs wording.' : null)
    return Object.keys(errors).length === 0 && !blank
  }

  return {
    points,
    setPoint: (key, value) => {
      setPoints((current) => ({ ...current, [key]: value }))
      setPointErrors((current) => ({ ...current, [key]: undefined }))
    },
    pointErrors,
    questions,
    setQuestion: (index, text) => {
      setQuestions((current) => current.map((item, i) => (i === index ? text : item)))
      setQuestionError(null)
    },
    questionError,
    isLoading: query.isLoading,
    loadError: query.error,
    isDirty: pointsDirty || questionsDirty,
    check,
    save: async (targetId) => {
      if (pointsDirty) {
        const current = query.data?.config ?? (await api.cohorts.pointsConfig(targetId))
        const saved = await api.cohorts.setPointsConfig(targetId, configFrom(points, current))
        if (query.data) query.setData({ ...query.data, config: saved })
      }
      if (questionsDirty && questions.length === QUESTION_COUNT) {
        const saved = await api.cohorts.setRatingQuestions(
          targetId,
          questions.map((text) => text.trim())
        )
        if (query.data) query.setData({ ...query.data, questions: saved })
      }
    },
  }
}
