'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'

interface GuardProps {
  children: ReactNode
}

function FullScreenSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner size="lg" />
    </div>
  )
}

function isAdminUser(roles: { role: string }[] | undefined): boolean {
  return roles?.some((r) => r.role === 'admin') ?? false
}

// Where a signed-out visitor goes: the cover page after signing out, otherwise sign in
function signedOutHome(hasSignedOut: boolean): string {
  return hasSignedOut ? '/' : '/login'
}

// Sends signed-out visitors to sign in, or to the cover page if they just signed out
export function RequireAuth({ children }: GuardProps) {
  const { isAuthenticated, isLoading, hasSignedOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace(signedOutHome(hasSignedOut))
  }, [isLoading, isAuthenticated, hasSignedOut, router])

  if (isLoading || !isAuthenticated) return <FullScreenSpinner />
  return <>{children}</>
}

// Sends signed-in users away from the auth screens
export function RedirectIfAuthed({ children }: GuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/dashboard')
  }, [isLoading, isAuthenticated, router])

  if (isLoading || isAuthenticated) return <FullScreenSpinner />
  return <>{children}</>
}

// Requires a signed-in user with the admin role
export function RequireAdmin({ children }: GuardProps) {
  const { user, isAuthenticated, isLoading, hasSignedOut } = useAuth()
  const router = useRouter()
  const isAdmin = isAdminUser(user?.roles)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) router.replace(signedOutHome(hasSignedOut))
    else if (!isAdmin) router.replace('/dashboard')
  }, [isLoading, isAuthenticated, isAdmin, hasSignedOut, router])

  if (isLoading || !isAuthenticated || !isAdmin) return <FullScreenSpinner />
  return <>{children}</>
}
