import type { ReactNode } from 'react'
import { RequireRole } from '@/components/layout/guards'

interface MentorLayoutProps {
  children: ReactNode
}

export default function MentorLayout({ children }: MentorLayoutProps) {
  return (
    <RequireRole roles={['professional_mentor']} area="professional mentors">
      {children}
    </RequireRole>
  )
}
