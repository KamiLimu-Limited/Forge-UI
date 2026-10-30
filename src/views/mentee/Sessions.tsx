'use client'

import { useMenteeSessions } from '@/hooks/useMenteeSessions'
import { SessionsScreen } from './SessionsScreen'

// Loads the mentee's sessions and hands them to the screen
export function Sessions() {
  const { data, isLoading, error, refetch } = useMenteeSessions()
  return <SessionsScreen data={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
