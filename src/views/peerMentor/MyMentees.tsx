'use client'

import { useMyMentees } from '@/hooks/useMyMentees'
import { usePeerSession } from '@/hooks/usePeerSession'
import { MyMenteesScreen } from './MyMenteesScreen'

export function MyMentees() {
  const { data, isLoading, error, refetch } = useMyMentees()
  const peerSession = usePeerSession()
  return (
    <MyMenteesScreen
      mentees={data}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      peerSession={peerSession.data}
      isPeerSessionLoading={peerSession.isLoading}
      peerSessionError={peerSession.error}
      onRetryPeerSession={peerSession.refetch}
    />
  )
}
