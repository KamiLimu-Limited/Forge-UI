'use client'

import { useAuth } from '@/hooks/useAuth'
import { isProgramLead } from '@/lib/roles'
import { ProgramLeadHome } from '@/views/programLead/ProgramLeadHome'
import { OverviewPage } from './Overview'

// /admin is the Program Lead's overview for the Program Lead and SA-Home for the System Admin
export function AdminHome() {
  const { user } = useAuth()
  return isProgramLead(user) ? <ProgramLeadHome /> : <OverviewPage />
}
