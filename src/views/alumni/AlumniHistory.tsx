'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAlumniRecord } from '@/hooks/useAlumni'
import type { AlumniRecordTab } from '@/types/alumni'
import { AlumniHistoryScreen } from './AlumniHistoryScreen'

function tabFrom(value: string | null): AlumniRecordTab {
  return value === 'activities' || value === 'objectives' ? value : 'sessions'
}

// Loads the alumnus's past record and hands it to the screen. ?view= picks the first tab,
// so the links on Home open the right part.
export function AlumniHistory() {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<AlumniRecordTab>(() => tabFrom(searchParams.get('view')))
  const { data, isLoading, error, refetch } = useAlumniRecord()
  return (
    <AlumniHistoryScreen
      data={data}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      tab={tab}
      onTabChange={setTab}
    />
  )
}
