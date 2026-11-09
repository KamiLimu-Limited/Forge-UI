'use client'

import { api } from '@/lib/api'
import { fullName } from '@/lib/format'
import { roleLabel } from '@/lib/roles'
import type { UserProfileResponse } from '@/types/auth'
import type { MenteeProfileData } from '@/types/menteeProfile'
import { useApiQuery, type ApiQuery } from './useApiQuery'

async function loadProfile(user: UserProfileResponse): Promise<MenteeProfileData> {
  const overview = await api.dashboard.mentee.overview()
  const cohortId = overview.cohort_id
  const [cohort, enrollments] = await Promise.all([
    api.cohorts.getById(cohortId),
    api.cohorts.enrollments.list(cohortId, { role: 'mentee', page_size: 100 }),
  ])
  const enrollment = enrollments.items.find((item) => item.user.id === user.id)
  return {
    name: fullName(user),
    email: user.email,
    cohortLabel: `${cohort.name}, ${roleLabel('mentee')}`,
    ictTrack: enrollment?.ict_track ?? null,
    hasPeerMentor: Boolean(enrollment?.peer_mentor_id),
  }
}

export function useMenteeProfile(user: UserProfileResponse): ApiQuery<MenteeProfileData> {
  return useApiQuery(() => loadProfile(user), [user.id], {
    fallbackError: "We couldn't load your profile. Try again.",
  })
}
