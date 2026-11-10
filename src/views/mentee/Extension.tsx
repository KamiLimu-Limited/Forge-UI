'use client'

import { useParticipantRole } from '@/hooks/useParticipantRole'
import { useExtensionRequest } from '@/hooks/useExtensionRequest'
import { ExtensionScreen } from './ExtensionScreen'

interface ExtensionProps {
  sessionId: string
}

export function Extension({ sessionId }: ExtensionProps) {
  const extension = useExtensionRequest(sessionId)
  const { saveBlockedNote } = useParticipantRole()
  return (
    <ExtensionScreen
      data={extension.data}
      isLoading={extension.isLoading}
      error={extension.error}
      onRetry={extension.refetch}
      reason={extension.reason}
      onReasonChange={extension.setReason}
      reasonError={extension.reasonError}
      onSend={() => void extension.send()}
      isSending={extension.isSending}
      sendError={extension.sendError}
      saveBlockedNote={saveBlockedNote}
    />
  )
}
