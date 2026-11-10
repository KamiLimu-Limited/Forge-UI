'use client'

import { useParticipantRole } from '@/hooks/useParticipantRole'
import { useSessionNotes } from '@/hooks/useSessionNotes'
import { useSessionRecord } from '@/hooks/useSessionRecord'
import { NotesScreen } from './NotesScreen'

interface NotesProps {
  sessionId: string
}

export function Notes({ sessionId }: NotesProps) {
  const { data, isLoading, error, refetch } = useSessionRecord(sessionId)
  const notes = useSessionNotes(data)
  const { saveBlockedNote } = useParticipantRole()
  return (
    <NotesScreen
      session={data}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      notes={notes.notes}
      onNotesChange={notes.setNotes}
      onSave={() => void notes.save()}
      isSaving={notes.isSaving}
      saveError={notes.error}
      savedAt={notes.savedAt}
      saveBlockedNote={saveBlockedNote}
    />
  )
}
