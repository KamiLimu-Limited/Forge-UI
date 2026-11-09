import { Suspense } from 'react'
import { AlumniHistory } from '@/views/alumni/AlumniHistory'

// AlumniHistory reads ?view=, so it needs a Suspense boundary for the static build
export default function AlumniHistoryPage() {
  return (
    <Suspense>
      <AlumniHistory />
    </Suspense>
  )
}
