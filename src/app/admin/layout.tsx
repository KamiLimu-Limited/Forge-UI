import type { ReactNode } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { RequireAdmin } from '@/components/layout/guards'

interface AdminRouteLayoutProps {
  children: ReactNode
}

export default function AdminRouteLayout({ children }: AdminRouteLayoutProps) {
  return (
    <RequireAdmin>
      <AppShell>{children}</AppShell>
    </RequireAdmin>
  )
}
