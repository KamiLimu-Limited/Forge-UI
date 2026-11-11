'use client'

import { useCallback } from 'react'
import { api } from '@/lib/api'
import { fullName } from '@/lib/format'
import { roleLabel } from '@/lib/roles'
import type { UserProfileFields, UserProfileResponse } from '@/types/auth'
import type { MenteeProfileData } from '@/types/menteeProfile'
import { useApiQuery, type ApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'
import { useToast } from './useToast'

function fieldsOf(user: UserProfileResponse): UserProfileFields {
  return {
    university: user.university,
    programme_of_study: user.programme_of_study,
    degree_level: user.degree_level,
    gender: user.gender,
    phone: user.phone,
    birthday: user.birthday,
    social_links: user.social_links,
  }
}

async function loadProfile(userId: string): Promise<MenteeProfileData> {
  const [me, overview] = await Promise.all([api.users.getMe(), api.dashboard.mentee.overview()])
  const cohortId = overview.cohort_id
  const [cohort, enrollments] = await Promise.all([
    api.cohorts.getById(cohortId),
    api.cohorts.enrollments.list(cohortId, { role: 'mentee', page_size: 100 }),
  ])
  const enrollment = enrollments.items.find((item) => item.user.id === userId)
  return {
    name: fullName(me),
    email: me.email,
    cohortLabel: `${cohort.name}, ${roleLabel('mentee')}`,
    ictTrack: me.ict_track ?? enrollment?.ict_track ?? null,
    hasPeerMentor: Boolean(enrollment?.peer_mentor_id),
    fields: fieldsOf(me),
  }
}

export interface UseMenteeProfileReturn extends ApiQuery<MenteeProfileData> {
  saveProfile: (body: UserProfileFields) => Promise<void>
  isSavingProfile: boolean
  profileError: string | null
}

export function useMenteeProfile(user: UserProfileResponse): UseMenteeProfileReturn {
  const { showToast } = useToast()
  const query = useApiQuery(() => loadProfile(user.id), [user.id], {
    fallbackError: "We couldn't load your profile. Try again.",
  })
  const action = useAsyncAction(
    useCallback((body: UserProfileFields) => api.users.updateMe(body), []),
    "Your profile didn't save. Try again."
  )
  return {
    ...query,
    saveProfile: async (body) => {
      const saved = await action.run(body)
      if (!saved || !query.data) return
      query.setData({ ...query.data, fields: fieldsOf(saved) })
      showToast('Profile saved', 'success')
    },
    isSavingProfile: action.isLoading,
    profileError: action.error,
  }
}
