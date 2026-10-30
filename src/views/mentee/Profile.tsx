'use client'

import { useAuth } from '@/hooks/useAuth'
import { useMenteeProfile } from '@/hooks/useMenteeProfile'
import type { UserProfileResponse } from '@/types/auth'
import { ProfileScreen } from './ProfileScreen'

function LoadedProfile({ user }: { user: UserProfileResponse }) {
  const { logout } = useAuth()
  const { data, isLoading, error, refetch } = useMenteeProfile(user)
  return (
    <ProfileScreen
      data={data}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      onSignOut={() => void logout()}
    />
  )
}

// RequireAuth in the dashboard layout means the user is set by the time this draws
export function Profile() {
  const { user } = useAuth()
  return user ? <LoadedProfile user={user} /> : null
}
