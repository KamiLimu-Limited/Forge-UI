'use client'

import { useMenteeHome } from '@/hooks/useMenteeHome'
import type { UserProfileResponse } from '@/types/auth'
import { HomeScreen } from './HomeScreen'

interface HomeProps {
  user: UserProfileResponse
}

export function Home({ user }: HomeProps) {
  const { data, isLoading, error, refetch } = useMenteeHome(user.id, user.first_name ?? 'there')
  return <HomeScreen data={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
