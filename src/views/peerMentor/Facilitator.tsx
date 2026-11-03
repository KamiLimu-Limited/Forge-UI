'use client'

import { useFacilitator } from '@/hooks/useFacilitator'
import { FacilitatorScreen } from './FacilitatorScreen'

// Loads the peer mentor's sessions and ratings and hands them to the screen
export function Facilitator() {
  const { data, isLoading, error, refetch } = useFacilitator()
  return <FacilitatorScreen data={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
