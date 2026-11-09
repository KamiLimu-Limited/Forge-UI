import type { ReactNode } from 'react'
import { RequireRole } from '@/components/layout/guards'

interface TasksLayoutProps {
  children: ReactNode
}

export default function TasksLayout({ children }: TasksLayoutProps) {
  return (
    <RequireRole roles={['program_delivery_lead']} area="the Program Delivery Lead">
      {children}
    </RequireRole>
  )
}
