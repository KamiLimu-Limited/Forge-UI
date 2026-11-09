import { Suspense } from 'react'
import { ProFeedback } from '@/views/proMentor/ProFeedback'

// ProFeedback reads ?session= with useSearchParams, which needs a Suspense boundary
export default function ProFeedbackPage() {
  return (
    <Suspense>
      <ProFeedback />
    </Suspense>
  )
}
