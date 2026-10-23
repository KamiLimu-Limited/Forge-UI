import { Suspense } from 'react'
import { Activate } from '@/views/Activate'

// Activate reads ?token= with useSearchParams, which needs a Suspense boundary to prerender
export default function ActivatePage() {
  return (
    <Suspense>
      <Activate />
    </Suspense>
  )
}
