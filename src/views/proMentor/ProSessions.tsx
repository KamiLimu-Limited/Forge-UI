'use client'

import { useProSessions } from '@/hooks/useProMentor'
import { ProSessionsScreen } from './ProSessionsScreen'

export function ProSessions() {
  const { data, isLoading, error, refetch } = useProSessions()
  return <ProSessionsScreen data={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
