'use client'

import { useMyMentees } from '@/hooks/useMyMentees'
import { MyMenteesScreen } from './MyMenteesScreen'

// Loads the peer mentor's group and hands it to the screen
export function MyMentees() {
  const { data, isLoading, error, refetch } = useMyMentees()
  return <MyMenteesScreen mentees={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
