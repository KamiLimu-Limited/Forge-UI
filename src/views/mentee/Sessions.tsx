'use client'

import { useParticipantRole } from '@/hooks/useParticipantRole'
import { useMenteeSessions } from '@/hooks/useMenteeSessions'
import { SessionsScreen } from './SessionsScreen'

export function Sessions() {
  const participant = useParticipantRole()
  const { data, isLoading, error, refetch } = useMenteeSessions(participant)
  return <SessionsScreen data={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
