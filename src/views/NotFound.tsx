'use client'

import { useAuth } from '@/hooks/useAuth'
import { homeFor } from '@/lib/roles'
import { NotFoundScreen } from './NotFoundScreen'

// Any unknown address, signed in or not
export function NotFound() {
  const { user, isAuthenticated } = useAuth()
  return <NotFoundScreen isSignedIn={isAuthenticated} homeHref={homeFor(user)} />
}
