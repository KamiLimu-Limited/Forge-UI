import type { ReactNode } from 'react'
import { AdminShell } from '@/components/layout/AdminShell'
import { RequireAdmin } from '@/components/layout/guards'
import { ActiveCohortProvider } from '@/hooks/useActiveCohort'

interface AdminRouteLayoutProps {
  children: ReactNode
}

export default function AdminRouteLayout({ children }: AdminRouteLayoutProps) {
  return (
    <RequireAdmin>
      <ActiveCohortProvider>
        <AdminShell>{children}</AdminShell>
      </ActiveCohortProvider>
    </RequireAdmin>
  )
}
