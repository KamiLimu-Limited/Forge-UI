'use client'

import { useAlumniHome } from '@/hooks/useAlumni'
import { AlumniHomeScreen } from './AlumniHomeScreen'

// Loads the alumnus's past cohort numbers and hands them to the screen
export function AlumniHome() {
  const { data, isLoading, error, refetch } = useAlumniHome()
  return <AlumniHomeScreen data={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
