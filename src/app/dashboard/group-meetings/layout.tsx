import type { ReactNode } from 'react'
import { RequireRole } from '@/components/layout/guards'

interface GroupMeetingsLayoutProps {
  children: ReactNode
}

export default function GroupMeetingsLayout({ children }: GroupMeetingsLayoutProps) {
  return (
    <RequireRole roles={['program_delivery_lead']} area="the Program Delivery Lead">
      {children}
    </RequireRole>
  )
}
