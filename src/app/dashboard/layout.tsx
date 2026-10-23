import type { ReactNode } from 'react'
import { RequireAuth } from '@/components/layout/guards'
import { AdminLayout } from '@/components/layout/AdminLayout'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <RequireAuth>
      <AdminLayout>{children}</AdminLayout>
    </RequireAuth>
  )
}
