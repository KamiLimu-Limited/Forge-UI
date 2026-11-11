'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { errorMessage } from '@/lib/errors'
import { toDateOnly } from '@/lib/format'
import type {
  CohortDetailResponse,
  CohortResponse,
  CohortStatus,
  CohortUpdateRequest,
  MonthBoundary,
  ObjectiveWindows,
  RatingPoint,
} from '@/types/cohort'

export interface MonthRow {
  key: string
  month: number
  name: string
  start: string
  end: string
}

export interface CohortFormValues {
  name: string
  startDate: string
  endDate: string
  graduationThreshold: string
  status: CohortStatus
  months: MonthRow[]
  // Hours the attendance window stays open after the session ends
  thursdayHours: string
  saturdayHours: string
  // YYYY-MM-DD, '' when not set
  objectiveWindows: Record<RatingPoint, { opens: string; closes: string }>
}

export type CohortFormErrors = Partial<
  Record<
    | 'name'
    | 'startDate'
    | 'endDate'
    | 'graduationThreshold'
    | 'months'
    | 'thursdayHours'
    | 'saturdayHours'
    | 'objectiveWindows',
    string
  >
>

export const DEFAULT_MONTH_COUNT = 8
export const DEFAULT_GRADUATION_THRESHOLD = 80
const DEFAULT_THURSDAY_HOURS = 24
const DEFAULT_SATURDAY_HOURS = 48
const RATING_POINTS: RatingPoint[] = ['start', 'mid', 'end']

function windowValues(windows: ObjectiveWindows | null): CohortFormValues['objectiveWindows'] {
  const entry = (point: RatingPoint) => {
    const window = windows?.[point]
    return window
      ? { opens: toDateOnly(window.opens_at), closes: toDateOnly(window.closes_at) }
      : { opens: '', closes: '' }
  }
  return { start: entry('start'), mid: entry('mid'), end: entry('end') }
}

// A window opens at the start of its first day and closes at the end of its last, local time
function windowsFrom(values: CohortFormValues['objectiveWindows']): ObjectiveWindows | null {
  const result: ObjectiveWindows = {}
  for (const point of RATING_POINTS) {
    const { opens, closes } = values[point]
    if (opens && closes) {
      result[point] = {
        opens_at: new Date(`${opens}T00:00:00`).toISOString(),
        closes_at: new Date(`${closes}T23:59:59`).toISOString(),
      }
    }
  }
  return Object.keys(result).length > 0 ? result : null
}

let rowCounter = 0
function rowKey(): string {
  rowCounter += 1
  return `month-${rowCounter}`
}

function blankMonths(): MonthRow[] {
  return Array.from({ length: DEFAULT_MONTH_COUNT }, (_, i) => ({
    key: rowKey(),
    month: i + 1,
    name: '',
    start: '',
    end: '',
  }))
}

function valuesFrom(cohort: CohortResponse | null): CohortFormValues {
  if (!cohort) {
    return {
      name: '',
      startDate: '',
      endDate: '',
      graduationThreshold: String(DEFAULT_GRADUATION_THRESHOLD),
      status: 'draft',
      months: blankMonths(),
      thursdayHours: String(DEFAULT_THURSDAY_HOURS),
      saturdayHours: String(DEFAULT_SATURDAY_HOURS),
      objectiveWindows: windowValues(null),
    }
  }
  const months = [...(cohort.kami_limu_month_boundaries ?? [])]
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((b) => ({ key: rowKey(), month: b.month, name: b.name ?? '', start: b.start, end: b.end }))
  return {
    name: cohort.name,
    startDate: cohort.start_date,
    endDate: cohort.end_date,
    graduationThreshold: String(cohort.graduation_threshold),
    status: cohort.status,
    months,
    thursdayHours: String(cohort.thursday_window_hours),
    saturdayHours: String(cohort.saturday_window_hours),
    objectiveWindows: windowValues(cohort.objective_windows),
  }
}

// Rows with both dates become boundaries; half-filled rows are a validation error
function boundariesFrom(rows: MonthRow[]): MonthBoundary[] {
  return rows
    .filter((r) => r.start && r.end)
    .map((r) => ({ month: r.month, name: r.name.trim() || null, start: r.start, end: r.end }))
}

export function validateCohort(values: CohortFormValues): CohortFormErrors {
  const errors: CohortFormErrors = {}
  if (!values.name.trim()) errors.name = 'Name the cohort, for example Cohort 12.'
  if (!values.startDate) errors.startDate = 'Choose a start date.'
  if (!values.endDate) errors.endDate = 'Choose an end date.'
  if (values.startDate && values.endDate && values.endDate <= values.startDate) {
    errors.endDate = 'The end date must be after the start date.'
  }
  const threshold = Number(values.graduationThreshold)
  if (!Number.isInteger(threshold) || threshold < 0 || threshold > 100) {
    errors.graduationThreshold = 'Enter a whole number from 0 to 100.'
  }
  for (const key of ['thursdayHours', 'saturdayHours'] as const) {
    const hours = Number(values[key])
    if (!Number.isInteger(hours) || hours < 1 || hours > 336) {
      errors[key] = 'Enter a whole number of hours from 1 to 336.'
    }
  }
  const badWindow = RATING_POINTS.find((point) => {
    const { opens, closes } = values.objectiveWindows[point]
    return Boolean(opens) !== Boolean(closes) || (opens && closes && closes < opens)
  })
  if (badWindow) {
    errors.objectiveWindows =
      'Each rating window needs an opening and a closing date, with the closing date last.'
  }
  const half = values.months.find((r) => Boolean(r.start) !== Boolean(r.end))
  const backwards = values.months.find((r) => r.start && r.end && r.end < r.start)
  if (half) errors.months = `Month ${half.month} needs both a start and an end date, or neither.`
  else if (backwards) errors.months = `Month ${backwards.month} ends before it starts.`
  return errors
}

interface UseCohortFormReturn {
  values: CohortFormValues
  setField: <K extends keyof CohortFormValues>(key: K, value: CohortFormValues[K]) => void
  setMonth: (key: string, patch: Partial<MonthRow>) => void
  addMonth: (isBreak: boolean) => void
  removeMonth: (key: string) => void
  errors: CohortFormErrors
  isDirty: boolean
  isSaving: boolean
  saveError: string | null
  // Create (no cohort) or PATCH the changed fields (with a cohort)
  save: (statusOverride?: CohortStatus) => Promise<CohortResponse | null>
}

export function useCohortForm(cohort: CohortDetailResponse | null): UseCohortFormReturn {
  const initial = useMemo(() => valuesFrom(cohort), [cohort])
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState<CohortFormErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    setValues(initial)
    setErrors({})
  }, [initial])

  const setField = useCallback(
    <K extends keyof CohortFormValues>(key: K, value: CohortFormValues[K]) => {
      setValues((v) => ({ ...v, [key]: value }))
      setErrors((e) => ({ ...e, [key]: undefined }))
    },
    []
  )

  const setMonth = useCallback((key: string, patch: Partial<MonthRow>) => {
    setValues((v) => ({
      ...v,
      months: v.months.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    }))
    setErrors((e) => ({ ...e, months: undefined }))
  }, [])

  // A break month keeps the number of the month before it, so sessions in the break count there
  const addMonth = useCallback((isBreak: boolean) => {
    setValues((v) => {
      const last = v.months[v.months.length - 1]
      const lastNumber = last?.month ?? 0
      const month = isBreak ? Math.max(lastNumber, 1) : lastNumber + 1
      return {
        ...v,
        months: [
          ...v.months,
          { key: rowKey(), month, name: isBreak ? `Month ${month} Break` : '', start: '', end: '' },
        ],
      }
    })
  }, [])

  const removeMonth = useCallback((key: string) => {
    setValues((v) => ({ ...v, months: v.months.filter((r) => r.key !== key) }))
  }, [])

  const save = async (statusOverride?: CohortStatus): Promise<CohortResponse | null> => {
    const found = validateCohort(values)
    setErrors(found)
    if (Object.values(found).some(Boolean)) return null
    setIsSaving(true)
    setSaveError(null)
    try {
      const boundaries = boundariesFrom(values.months)
      if (!cohort) {
        return await api.cohorts.create({
          name: values.name.trim(),
          programme_type: 'undergraduate',
          start_date: values.startDate,
          end_date: values.endDate,
          graduation_threshold: Number(values.graduationThreshold),
          status: statusOverride ?? 'draft',
          kami_limu_month_boundaries: boundaries.length ? boundaries : null,
          thursday_window_hours: Number(values.thursdayHours),
          saturday_window_hours: Number(values.saturdayHours),
          objective_windows: windowsFrom(values.objectiveWindows),
        })
      }
      const patch: CohortUpdateRequest = {}
      if (values.name.trim() !== cohort.name) patch.name = values.name.trim()
      if (values.startDate !== cohort.start_date) patch.start_date = values.startDate
      if (values.endDate !== cohort.end_date) patch.end_date = values.endDate
      if (Number(values.graduationThreshold) !== cohort.graduation_threshold) {
        patch.graduation_threshold = Number(values.graduationThreshold)
      }
      const status = statusOverride ?? values.status
      if (status !== cohort.status) patch.status = status
      if (JSON.stringify(boundaries) !== JSON.stringify(boundariesFrom(initial.months))) {
        patch.kami_limu_month_boundaries = boundaries
      }
      if (Number(values.thursdayHours) !== cohort.thursday_window_hours) {
        patch.thursday_window_hours = Number(values.thursdayHours)
      }
      if (Number(values.saturdayHours) !== cohort.saturday_window_hours) {
        patch.saturday_window_hours = Number(values.saturdayHours)
      }
      if (JSON.stringify(values.objectiveWindows) !== JSON.stringify(initial.objectiveWindows)) {
        patch.objective_windows = windowsFrom(values.objectiveWindows)
      }
      if (Object.keys(patch).length === 0) return cohort
      return await api.cohorts.update(cohort.id, patch)
    } catch (err: unknown) {
      setSaveError(errorMessage(err, "The cohort didn't save. Try again."))
      return null
    } finally {
      setIsSaving(false)
    }
  }

  return {
    values,
    setField,
    setMonth,
    addMonth,
    removeMonth,
    errors,
    isDirty: JSON.stringify(values) !== JSON.stringify(initial),
    isSaving,
    saveError,
    save,
  }
}
