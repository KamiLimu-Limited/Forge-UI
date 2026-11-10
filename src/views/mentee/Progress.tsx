'use client'

import { useMenteeProgress } from '@/hooks/useMenteeProgress'
import { ProgressScreen } from './ProgressScreen'

export function Progress() {
  const { data, isLoading, error, refetch } = useMenteeProgress()
  return (
    <ProgressScreen
      summary={data?.summary ?? null}
      months={data?.months ?? []}
      tracks={data?.tracks ?? []}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
    />
  )
}
