'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  profileBody,
  profileValues,
  validateProfile,
  type ProfileErrors,
  type ProfileValues,
} from '@/lib/profile'
import type { UserProfileFields } from '@/types/auth'

export interface UseProfileFormReturn {
  values: ProfileValues
  setValue: <K extends keyof ProfileValues>(key: K, value: ProfileValues[K]) => void
  errors: ProfileErrors
  isDirty: boolean
  // The body to send, or null after showing what's wrong
  check: () => UserProfileFields | null
  reset: () => void
}

// The profile fields as a form, from what the account has now
export function useProfileForm(current: Partial<UserProfileFields> | null): UseProfileFormReturn {
  const initial = useMemo(() => profileValues(current ?? {}), [current])
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState<ProfileErrors>({})

  useEffect(() => {
    setValues(initial)
    setErrors({})
  }, [initial])

  return {
    values,
    setValue: (key, value) => {
      setValues((existing) => ({ ...existing, [key]: value }))
      setErrors((existing) => ({ ...existing, [key]: undefined }))
    },
    errors,
    isDirty: JSON.stringify(values) !== JSON.stringify(initial),
    check: () => {
      const found = validateProfile(values)
      setErrors(found)
      return Object.keys(found).length === 0 ? profileBody(values, current ?? {}) : null
    },
    reset: () => {
      setValues(initial)
      setErrors({})
    },
  }
}
