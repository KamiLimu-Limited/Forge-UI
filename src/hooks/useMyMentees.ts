'use client'

import { api } from '@/lib/api'
import { menteeCard } from '@/lib/peerMentor'
import type { MenteeCardView } from '@/types/peerMentor'
import { useApiQuery, type ApiQuery } from './useApiQuery'

export function useMyMentees(): ApiQuery<MenteeCardView[]> {
  return useApiQuery(
    () => api.peerMentor.group().then((group) => group.mentees.map(menteeCard)),
    [],
    {
      fallbackError: "We couldn't load your mentees. Try again.",
    }
  )
}
