'use client'

import { LoadingState } from '@/components/ui/LoadingState'
import { useGraduationResult } from '@/hooks/useGraduationResult'
import { ALUMNI_ROUTES } from '@/lib/alumniRoutes'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import type { UserProfileResponse } from '@/types/auth'
import { GraduationResultScreen } from './GraduationResultScreen'
import { Home } from './Home'

interface MenteeLandingProps {
  user: UserProfileResponse
}

// Once the cohort's graduation is final, the mentee's home is their result. A failed
// check never hides the home: it falls back to it.
export function MenteeLanding({ user }: MenteeLandingProps) {
  const result = useGraduationResult()
  if (result.isLoading) return <LoadingState label="Loading your home" />
  if (result.data) {
    return (
      <GraduationResultScreen
        data={result.data}
        recordHref={result.data.graduated ? ALUMNI_ROUTES.history : MENTEE_ROUTES.sessionHistory}
      />
    )
  }
  return <Home user={user} />
}
