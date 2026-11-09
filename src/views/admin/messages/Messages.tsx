'use client'

import { useBroadcast } from '@/hooks/useBroadcast'
import { MessagesScreen } from './MessagesScreen'

export function Messages() {
  const broadcast = useBroadcast()
  return (
    <MessagesScreen
      cohortName={broadcast.cohortName}
      draft={broadcast.draft}
      onChange={broadcast.setDraft}
      recipients={broadcast.recipients}
      errors={broadcast.errors}
      onReview={broadcast.review}
      isConfirming={broadcast.isConfirming}
      onCancel={broadcast.cancel}
      onSend={broadcast.send}
      isSending={broadcast.isSending}
      sendError={broadcast.sendError}
    />
  )
}
