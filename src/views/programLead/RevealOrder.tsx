'use client'

import { useRouter } from 'next/navigation'
import { useRevealOrder } from '@/hooks/useGraduation'
import { graduationSequenceRoute } from '@/lib/adminRoutes'
import { RevealOrderScreen } from './RevealOrderScreen'

export function RevealOrder() {
  const router = useRouter()
  const reveal = useRevealOrder()
  const openSequence = () => {
    if (reveal.data) router.push(graduationSequenceRoute(reveal.data.cohortId))
  }
  return (
    <RevealOrderScreen
      data={reveal.data}
      isLoading={reveal.isLoading}
      error={reveal.error}
      onRetry={reveal.refetch}
      hasCohort={reveal.hasCohort}
      mode={reveal.mode}
      onModeChange={reveal.setMode}
      order={reveal.order}
      onMove={reveal.move}
      onRehearse={openSequence}
      onSaveAndStart={() => {
        void reveal.save().then((saved) => {
          if (saved) openSequence()
        })
      }}
      isSaving={reveal.isSaving}
      saveError={reveal.saveError}
    />
  )
}
