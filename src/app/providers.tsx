'use client'

import type { ReactNode } from 'react'
import { AuthProvider } from '@/hooks/useAuth'
import { ToastProvider } from '@/hooks/useToast'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  )
}
