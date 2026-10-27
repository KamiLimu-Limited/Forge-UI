import type { ReactNode } from 'react'
import { KamiLimuLogo } from './KamiLimuLogo'

interface AuthLayoutProps {
  title: string
  description?: ReactNode
  children: ReactNode
}

// Centred card shared by the sign in, activate and password screens
export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 py-12 md:justify-center">
      <div className="flex w-full max-w-auth-card flex-col gap-5 rounded-xl border border-border bg-surface p-6 shadow-card md:p-9">
        <KamiLimuLogo />
        <div className="flex flex-col gap-2">
          <h1 className="font-mono text-subtitle font-semibold text-text-primary">{title}</h1>
          {description && <p className="font-sans text-body text-text-secondary">{description}</p>}
        </div>
        {children}
      </div>
    </main>
  )
}
