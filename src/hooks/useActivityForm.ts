'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { initialValues, missingFields, saveActivity } from '@/lib/activityForms'
import { api } from '@/lib/api'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import type { ActivityFormConfig, ActivityFormValues } from '@/types/menteeActivities'
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
}

export function useActivityForm(config: ActivityFormConfig): UseActivityFormReturn {
  const router = useRouter()
  const { showToast } = useToast()
  const [values, setValues] = useState(() => initialValues(config))
  const [missing, setMissing] = useState<string[]>([])

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
  }
}
