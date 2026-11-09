import type { ReactNode } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { RequireAuth } from '@/components/layout/guards'
import { ActiveViewProvider } from '@/hooks/useActiveView'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <RequireAuth>
      <ActiveViewProvider>
        <AppShell>{children}</AppShell>
      </ActiveViewProvider>
    </RequireAuth>
  )
}
