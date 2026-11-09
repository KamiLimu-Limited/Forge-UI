'use client'

import { useProgramLeadHome } from '@/hooks/useGraduation'
import { ProgramLeadHomeScreen } from './ProgramLeadHomeScreen'

export function ProgramLeadHome() {
  const query = useProgramLeadHome()
  return (
    <ProgramLeadHomeScreen
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      onRetry={query.refetch}
      hasCohort={query.hasCohort}
    />
  )
}
