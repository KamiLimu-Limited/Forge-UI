import { ViewTabs } from '@/components/ui/ViewTabs'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'

const VIEWS = [
  { label: 'Open and upcoming', href: MENTEE_ROUTES.sessions },
  { label: 'History', href: MENTEE_ROUTES.sessionHistory },
]

// Switches between open and upcoming sessions and session history
export function SessionViewTabs() {
  return <ViewTabs items={VIEWS} label="Session views" />
}
