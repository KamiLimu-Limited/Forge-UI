import { Suspense } from 'react'
import { ResetPassword } from '@/views/ResetPassword'

// ResetPassword reads ?token= with useSearchParams, which needs a Suspense boundary to prerender
export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  )
}
