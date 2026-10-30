'use client'

import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { Home as MenteeHome } from '@/views/mentee/Home'

// /dashboard shows the screen for the signed-in user's role
export function DashboardHome() {
  const { user } = useAuth()

  if (user?.roles.some((item) => item.role === 'mentee')) return <MenteeHome user={user} />

  return (
    <>
      <PageHeader title="Dashboard" />
      <Card>
        <EmptyState
          icon="home"
          title="Nothing here yet"
          description="Your dashboard is on its way."
        />
      </Card>
    </>
  )
}
