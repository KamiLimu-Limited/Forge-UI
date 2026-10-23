import type { ReactNode } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { RequireAuth } from '@/components/layout/guards'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  )
}
