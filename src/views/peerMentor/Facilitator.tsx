'use client'

import { useFacilitator } from '@/hooks/useFacilitator'
import { FacilitatorScreen } from './FacilitatorScreen'

export function Facilitator() {
  const { data, isLoading, error, refetch } = useFacilitator()
  return <FacilitatorScreen data={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
