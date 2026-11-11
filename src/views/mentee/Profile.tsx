'use client'

import { useAuth } from '@/hooks/useAuth'
import { useMenteeProfile } from '@/hooks/useMenteeProfile'
import { useProfileForm } from '@/hooks/useProfileForm'
import type { UserProfileResponse } from '@/types/auth'
import { ProfileScreen } from './ProfileScreen'

function LoadedProfile({ user }: { user: UserProfileResponse }) {
  const { logout } = useAuth()
  const profile = useMenteeProfile(user)
  const form = useProfileForm(profile.data?.fields ?? null)
  return (
    <ProfileScreen
      data={profile.data}
      isLoading={profile.isLoading}
      error={profile.error}
      onRetry={profile.refetch}
      onSignOut={() => void logout()}
      profile={form}
      onSaveProfile={() => {
        const body = form.check()
        if (body) void profile.saveProfile(body)
      }}
      isSavingProfile={profile.isSavingProfile}
      profileError={profile.profileError}
    />
  )
}

// RequireAuth in the dashboard layout means the user is set by the time this draws
export function Profile() {
  const { user } = useAuth()
  return user ? <LoadedProfile user={user} /> : null
}
