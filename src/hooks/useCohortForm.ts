'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { errorMessage } from '@/lib/errors'
import type {
  CohortDetailResponse,
  CohortResponse,
  CohortStatus,
  CohortUpdateRequest,
  MonthBoundary,
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
}

export type CohortFormErrors = Partial<
  Record<'name' | 'startDate' | 'endDate' | 'graduationThreshold' | 'months', string>
>

export const DEFAULT_MONTH_COUNT = 8
export const DEFAULT_GRADUATION_THRESHOLD = 80

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
