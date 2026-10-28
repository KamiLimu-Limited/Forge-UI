import { Suspense } from 'react'
import { LoadingState } from '@/components/ui/LoadingState'
import { AuditTrailPage } from '@/views/admin/AuditTrail'

export default function AdminAuditTrailPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading audit trail" />}>
      <AuditTrailPage />
    </Suspense>
  )
}
