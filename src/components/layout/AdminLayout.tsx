import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — hidden on mobile, visible md+ */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  )
}
