'use client'

import { useMenteeHome } from '@/hooks/useMenteeHome'
import type { UserProfileResponse } from '@/types/auth'
import { HomeScreen } from './HomeScreen'

interface HomeProps {
  user: UserProfileResponse
}

// Loads the mentee's home and hands it to the screen
export function Home({ user }: HomeProps) {
  const { data, isLoading, error, refetch } = useMenteeHome(user.id, user.first_name ?? 'there')
  return <HomeScreen data={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
