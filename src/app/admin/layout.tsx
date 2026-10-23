import type { ReactNode } from 'react'
import { RequireAdmin } from '@/components/layout/guards'
import { AdminLayout } from '@/components/layout/AdminLayout'

interface AdminRouteLayoutProps {
  children: ReactNode
}

export default function AdminRouteLayout({ children }: AdminRouteLayoutProps) {
  return (
    <RequireAdmin>
      <AdminLayout>{children}</AdminLayout>
    </RequireAdmin>
  )
}
