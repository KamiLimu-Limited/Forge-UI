import { TrackBadge } from '@/components/forge/TrackBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { ViewTabs } from '@/components/ui/ViewTabs'
import { ICT_PEER_MENTOR_ROUTES } from '@/lib/peerMentorRoutes'

const VIEWS = [
  { label: 'Mentees', href: ICT_PEER_MENTOR_ROUTES.track },
  { label: 'ICT sessions', href: ICT_PEER_MENTOR_ROUTES.trackSessions },
]

interface TrackHeaderProps {
  title: string
  subtitle?: string
}

// The ICT badge, track title and, on phones, the switch between mentees and sessions
// (the sidebar has both from md up)
export function TrackHeader({ title, subtitle }: TrackHeaderProps) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <span>
          <TrackBadge pillar="ict" />
        </span>
        <PageHeader title={title} subtitle={subtitle} />
      </div>
      <ViewTabs items={VIEWS} label="Track views" desktop="phone-only" />
    </>
  )
}
