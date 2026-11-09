import type { ReactNode } from 'react'
import { RequireRole } from '@/components/layout/guards'

interface ResultLayoutProps {
  children: ReactNode
}

// A result is private to the mentee it belongs to
export default function ResultLayout({ children }: ResultLayoutProps) {
  return (
    <RequireRole roles={['mentee', 'alumni']} area="mentees">
      {children}
    </RequireRole>
  )
}
