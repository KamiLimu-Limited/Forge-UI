'use client'

import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useActiveView } from '@/hooks/useActiveView'
import { Home as MenteeHome } from '@/views/mentee/Home'
import { AlumniHome } from '@/views/alumni/AlumniHome'
import { CommitteeOverview } from '@/views/committee/CommitteeOverview'
import { ProSessions } from '@/views/proMentor/ProSessions'
import { MyTrack } from '@/views/ictPeerMentor/MyTrack'
import { MyMentees } from '@/views/peerMentor/MyMentees'

// /dashboard shows the home of the view picked in "Switch view"
export function DashboardHome() {
  const { user } = useAuth()
  const { role } = useActiveView()

  if (user && role === 'mentee') return <MenteeHome user={user} />
  if (role === 'peer_mentor') return <MyMentees />
  if (role === 'ict_peer_mentor') return <MyTrack />
  if (role === 'alumni') return <AlumniHome />
  if (role === 'professional_mentor') return <ProSessions />
  if (role === 'committee') return <CommitteeOverview />

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
