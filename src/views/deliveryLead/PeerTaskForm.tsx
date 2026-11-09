'use client'

import { usePeerTaskForm } from '@/hooks/usePeerTasks'
import { PeerTaskFormScreen } from './PeerTaskFormScreen'

interface PeerTaskFormProps {
  // null for a new task
  sessionId: string | null
}

export function PeerTaskForm({ sessionId }: PeerTaskFormProps) {
  const task = usePeerTaskForm(sessionId)
  return (
    <PeerTaskFormScreen
      form={task.form}
      draft={task.draft}
      isLoading={task.isLoading}
      error={task.error}
      onRetry={task.refetch}
      onChange={task.setDraft}
      errors={task.errors}
      canSave={task.canSave}
      onSave={task.check}
    />
  )
}
