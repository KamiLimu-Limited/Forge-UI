'use client'

import { useAlumniHome } from '@/hooks/useAlumni'
import { AlumniHomeScreen } from './AlumniHomeScreen'

export function AlumniHome() {
  const { data, isLoading, error, refetch } = useAlumniHome()
  return <AlumniHomeScreen data={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
