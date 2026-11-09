'use client'

import { api } from '@/lib/api'
import { menteeCard } from '@/lib/peerMentor'
import type { MenteeCardView } from '@/types/peerMentor'
import { useActiveView } from './useActiveView'
import { useApiQuery, type ApiQuery } from './useApiQuery'

export function useMyMentees(): ApiQuery<MenteeCardView[]> {
  const { cohortId } = useActiveView()
  return useApiQuery(
    () => api.peerMentor.group(cohortId).then((group) => group.mentees.map(menteeCard)),
    [cohortId],
    {
      fallbackError: "We couldn't load your mentees. Try again.",
    }
  )
}
