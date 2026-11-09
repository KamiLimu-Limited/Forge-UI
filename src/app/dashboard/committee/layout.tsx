import type { ReactNode } from 'react'
import { RequireRole } from '@/components/layout/guards'

interface CommitteeLayoutProps {
  children: ReactNode
}

export default function CommitteeLayout({ children }: CommitteeLayoutProps) {
  return (
    <RequireRole roles={['committee', 'program_delivery_lead']} area="the committee">
      {children}
    </RequireRole>
  )
}
