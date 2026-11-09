'use client'

import { useGraduationResult } from '@/hooks/useGraduationResult'
import { ALUMNI_ROUTES } from '@/lib/alumniRoutes'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import { GraduationResultScreen } from './GraduationResultScreen'

export function GraduationResult() {
  const { data, isLoading, error, refetch } = useGraduationResult()
  return (
    <GraduationResultScreen
      data={data}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      recordHref={data?.graduated ? ALUMNI_ROUTES.history : MENTEE_ROUTES.sessionHistory}
    />
  )
}
