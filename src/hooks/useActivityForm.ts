'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { initialValues, missingFields, saveActivity } from '@/lib/activityForms'
import { api } from '@/lib/api'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import type {
  ActivityField,
  ActivityFormConfig,
  ActivityFormValues,
  FieldOption,
} from '@/types/menteeActivities'
import { useApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'
import { useToast } from './useToast'

interface UseActivityFormReturn {
  values: ActivityFormValues
  setValue: (name: string, value: string) => void
  // Field names to mark as missing after a failed save
  missing: string[]
  save: () => Promise<void>
  isSaving: boolean
  error: string | null
  // The field with its loaded options, for fields that load them
  fieldWithOptions: (field: ActivityField) => ActivityField
  optionsError: string | null
}

async function loadConsultantOptions(): Promise<FieldOption[]> {
  const consultants = await api.consultants.list()
  return consultants
    .filter((consultant) => consultant.is_active)
    .map((consultant) => ({ value: consultant.id, label: consultant.name }))
}

export function useActivityForm(config: ActivityFormConfig): UseActivityFormReturn {
  const router = useRouter()
  const { showToast } = useToast()
  const [values, setValues] = useState(() => initialValues(config))
  const [missing, setMissing] = useState<string[]>([])
  const needsConsultants = config.fields.some((field) => field.optionsFrom === 'consultants')
  const consultants = useApiQuery(loadConsultantOptions, [], {
    enabled: needsConsultants,
    fallbackError: "We couldn't load the consultant list. Try again.",
  })

  const send = useCallback(
    async (answers: ActivityFormValues) => {
      const overview = await api.dashboard.mentee.overview()
      return saveActivity(config.kind, answers, overview.cohort_id)
    },
    [config.kind]
  )
  const action = useAsyncAction(send, "We couldn't save this log. Try again.")

  return {
    values,
    setValue: (name, value) => {
      setValues((current) => ({ ...current, [name]: value }))
      setMissing((current) => current.filter((item) => item !== name))
    },
    missing,
    save: async () => {
      const empty = missingFields(config, values)
      setMissing(empty)
      if (empty.length > 0) return
      const saved = await action.run(values)
      if (!saved) return
      showToast('Log saved', 'success')
      router.push(MENTEE_ROUTES.activities)
    },
    isSaving: action.isLoading,
    error: action.error,
    fieldWithOptions: (field) =>
      field.optionsFrom === 'consultants'
        ? {
            ...field,
            options: consultants.data ?? [],
            placeholder: consultants.isLoading
              ? 'Loading consultants'
              : consultants.data?.length === 0
                ? 'No consultants on the list yet'
                : field.placeholder,
          }
        : field,
    optionsError: consultants.error,
  }
}
