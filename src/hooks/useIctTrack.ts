'use client'

import { loadMyTrack, loadTrackSessionsView } from '@/lib/ictPeerMentor'
import type { MyTrackView, TrackSessionsView } from '@/types/ictPeerMentor'
import { useApiQuery, type ApiQuery } from './useApiQuery'
import { useParticipantRole } from './useParticipantRole'

// The ICT peer mentor's track. data is null while loading and when no track is assigned yet.
export function useMyTrack(): ApiQuery<MyTrackView | null> {
  const { peerCohortId } = useParticipantRole()
  return useApiQuery(() => loadMyTrack(peerCohortId as string), [peerCohortId], {
    enabled: peerCohortId !== null,
    fallbackError: "We couldn't load your track. Try again.",
  })
}

export function useTrackSessions(): ApiQuery<TrackSessionsView | null> {
  const { peerCohortId } = useParticipantRole()
  return useApiQuery(() => loadTrackSessionsView(peerCohortId as string), [peerCohortId], {
    enabled: peerCohortId !== null,
    fallbackError: "We couldn't load your track's sessions. Try again.",
  })
}
