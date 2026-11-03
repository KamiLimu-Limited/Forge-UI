'use client'

import { usePeerMenteeDetail } from '@/hooks/usePeerMenteeDetail'
import { MenteeDetailScreen } from './MenteeDetailScreen'

interface MenteeDetailProps {
  menteeId: string
}

// Loads one mentee and hands them to the screen
export function MenteeDetail({ menteeId }: MenteeDetailProps) {
  const { data, isLoading, error, refetch } = usePeerMenteeDetail(menteeId)
  return <MenteeDetailScreen detail={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
