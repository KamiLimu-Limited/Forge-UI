'use client'

import { useCallback } from 'react'
import { api } from '@/lib/api'
import type { ConsultantRequest, ConsultantResponse } from '@/types/activity'
import { useApiQuery, type ApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'

interface UseConsultantsReturn extends ApiQuery<ConsultantResponse[]> {
  add: (body: ConsultantRequest) => Promise<ConsultantResponse | null>
  isAdding: boolean
  addError: string | null
  remove: (consultantId: string) => Promise<boolean>
  isRemoving: boolean
  removeError: string | null
  clearRemoveError: () => void
}

// The consultant roster mentees pick from when they log a consultation
export function useConsultants(): UseConsultantsReturn {
  const query = useApiQuery(() => api.consultants.list(), [], {
    fallbackError: "We couldn't load the consultants. Try again.",
  })
  const addAction = useAsyncAction(
    useCallback((body: ConsultantRequest) => api.consultants.create(body), []),
    "The consultant wasn't added. Try again."
  )
  const removeAction = useAsyncAction(
    useCallback(async (id: string) => {
      await api.consultants.remove(id)
      return id
    }, []),
    "The consultant wasn't removed. Try again."
  )
  return {
    ...query,
    add: async (body) => {
      const added = await addAction.run(body)
      if (added && query.data) query.setData([...query.data, added])
      return added
    },
    isAdding: addAction.isLoading,
    addError: addAction.error,
    remove: async (id) => {
      const removed = await removeAction.run(id)
      if (removed && query.data) query.setData(query.data.filter((item) => item.id !== id))
      return removed !== null
    },
    isRemoving: removeAction.isLoading,
    removeError: removeAction.error,
    clearRemoveError: removeAction.clearError,
  }
}
