'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useProFeedback } from '@/hooks/useProMentor'
import { ProFeedbackScreen } from './ProFeedbackScreen'

// Reads ?session= so a past session's "View feedback" opens on that session
export function ProFeedback() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const feedback = useProFeedback(params.get('session'))
  return (
    <ProFeedbackScreen
      sessions={feedback.sessions}
      selectedId={feedback.selectedId}
      onSelect={(id) => router.replace(`${pathname}?session=${id}`)}
      feedback={feedback.feedback}
      isLoading={feedback.isLoading}
      error={feedback.error}
      onRetry={feedback.refetch}
    />
  )
}
