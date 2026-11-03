'use client'

import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { Home as MenteeHome } from '@/views/mentee/Home'
import { MyMentees } from '@/views/peerMentor/MyMentees'

// /dashboard shows the screen for the signed-in user's role
export function DashboardHome() {
  const { user } = useAuth()

  // Someone can be a mentee in one cohort and a peer mentor in a later one, so the newest wins
  const role = [...(user?.roles ?? [])]
    .filter((item) => item.role === 'mentee' || item.role === 'peer_mentor_1:1')
    .sort((a, b) => b.assigned_at.localeCompare(a.assigned_at))[0]?.role

  if (user && role === 'mentee') return <MenteeHome user={user} />
  if (role === 'peer_mentor_1:1') return <MyMentees />

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
