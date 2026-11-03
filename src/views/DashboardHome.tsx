'use client'

import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { participantRole } from '@/lib/participation'
import { Home as MenteeHome } from '@/views/mentee/Home'
import { MyMentees } from '@/views/peerMentor/MyMentees'

// /dashboard shows the screen for the signed-in user's role
export function DashboardHome() {
  const { user } = useAuth()

  const role = participantRole(user)

  if (user && role === 'mentee') return <MenteeHome user={user} />
  if (role === 'peer_mentor') return <MyMentees />

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
