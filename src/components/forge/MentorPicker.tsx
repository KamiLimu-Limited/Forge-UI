'use client'

import { Select } from '@/components/ui/Select'
import type { MentorOption } from '@/hooks/useMentorOptions'
import { CoMentorPicker } from './CoMentorPicker'

interface MentorPickerProps {
  mentors: MentorOption[]
  isLoading?: boolean
  error?: string | null
  leadId: string
  coMentorIds: string[]
  onLeadChange: (id: string) => void
  onCoMentorsChange: (ids: string[]) => void
  disabled?: boolean
}

// Lead mentor select plus a searchable list of co-mentor toggles, for the session form
export function MentorPicker({
  mentors,
  isLoading = false,
  error,
  leadId,
  coMentorIds,
  onLeadChange,
  onCoMentorsChange,
  disabled = false,
}: MentorPickerProps) {
  const hint = isLoading
    ? 'Loading mentors'
    : (error ??
      (mentors.length === 0
        ? 'No mentors in this cohort yet. Invite one from Rosters.'
        : undefined))

  return (
    <div className="flex flex-col gap-5">
      <Select
        label="Lead mentor"
        options={[
          { value: '', label: 'No lead mentor' },
          ...mentors.map((m) => ({ value: m.id, label: `${m.name}, ${m.roleLabel}` })),
        ]}
        value={leadId}
        onChange={(e) => onLeadChange(e.target.value)}
        disabled={disabled || isLoading}
        hint={hint}
      />
      <CoMentorPicker
        label="Co-mentors"
        mentors={mentors}
        selectedIds={coMentorIds}
        onChange={onCoMentorsChange}
        excludeId={leadId}
        disabled={disabled || isLoading}
      />
    </div>
  )
}
