'use client'

import { useFailedEmails } from '@/hooks/useFailedEmails'
import { EmailDeliveryScreen } from './EmailDeliveryScreen'

export function EmailDelivery() {
  const emails = useFailedEmails()
  return (
    <EmailDeliveryScreen
      data={emails.data}
      isLoading={emails.isLoading}
      error={emails.error}
      onRetry={emails.refetch}
      onPageChange={emails.setPage}
    />
  )
}
