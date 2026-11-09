import type { ReactNode } from 'react'
import { RequireRole } from '@/components/layout/guards'

interface GraduationSequenceLayoutProps {
  children: ReactNode
}

// Full screen with no shell, so it can be projected. The System Admin can rehearse it too.
export default function GraduationSequenceLayout({ children }: GraduationSequenceLayoutProps) {
  return (
    <RequireRole roles={['program_lead', 'admin']} area="the Program Lead">
      {children}
    </RequireRole>
  )
}
