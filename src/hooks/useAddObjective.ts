'use client'

import { useCallback, useState } from 'react'
import { api } from '@/lib/api'
import type { ObjectiveType } from '@/types/objective'
import { useAsyncAction } from './useAsyncAction'
import { useToast } from './useToast'

interface UseAddObjectiveReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  type: ObjectiveType
  setType: (type: ObjectiveType) => void
  text: string
  setText: (text: string) => void
  textError: string | null
  save: () => Promise<void>
  isSaving: boolean
  saveError: string | null
}

// The Add objective dialog. A saved objective reloads the list.
export function useAddObjective(
  cohortId: string | null,
  onAdded: () => void
): UseAddObjectiveReturn {
  const { showToast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<ObjectiveType>('human')
  const [text, setTextState] = useState('')
  const [textError, setTextError] = useState<string | null>(null)
  const action = useAsyncAction(
    useCallback(
      (body: { type: ObjectiveType; text: string }) =>
        api.objectives.create({ cohort_id: cohortId, ...body }),
      [cohortId]
    ),
    "The objective wasn't added. Try again."
  )

  const close = () => {
    setIsOpen(false)
    setTextState('')
    setTextError(null)
    action.clearError()
  }

  return {
    isOpen,
    open: () => setIsOpen(true),
    close,
    type,
    setType,
    text,
    setText: (value) => {
      setTextState(value)
      setTextError(null)
    },
    textError,
    save: async () => {
      if (!text.trim()) {
        setTextError('Write the objective')
        return
      }
      const saved = await action.run({ type, text: text.trim() })
      if (!saved) return
      showToast('Objective added', 'success')
      close()
      onAdded()
    },
    isSaving: action.isLoading,
    saveError: action.error,
  }
}
