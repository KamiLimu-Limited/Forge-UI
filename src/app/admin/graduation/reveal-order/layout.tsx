import type { ReactNode } from 'react'
import { RequireRole } from '@/components/layout/guards'

interface ProgramLeadOnlyLayoutProps {
  children: ReactNode
}

export default function ProgramLeadOnlyLayout({ children }: ProgramLeadOnlyLayoutProps) {
  return (
    <RequireRole roles={['program_lead']} area="the Program Lead">
      {children}
    </RequireRole>
  )
}
