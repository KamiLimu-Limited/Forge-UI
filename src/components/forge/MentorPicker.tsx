'use client'

import { useId, useMemo, useState } from 'react'
import { Chip } from '@/components/ui/Chip'
import { Select } from '@/components/ui/Select'
import type { MentorOption } from '@/hooks/useMentorOptions'
import { cx } from '@/lib/cx'

interface MentorPickerProps {
  mentors: MentorOption[]
  isLoading?: boolean
  error?: string | null
  leadId: string
  coMentorIds: string[]
  onLeadChange: (id: string) => void
  onCoMentorsChange: (ids: string[]) => void
  disabled?: boolean
  // Names the session in screen reader labels when the visible labels are hidden
  sessionTitle?: string
  // Hides the visible labels for use inside a table row
  compact?: boolean
}

// Lead mentor select plus a searchable list of co-mentor toggles
export function MentorPicker({
  mentors,
  isLoading = false,
  error,
  leadId,
  coMentorIds,
  onLeadChange,
  onCoMentorsChange,
  disabled = false,
  sessionTitle,
  compact = false,
}: MentorPickerProps) {
  const searchId = useId()
  const [search, setSearch] = useState('')
  const suffix = sessionTitle ? ` for ${sessionTitle}` : ''

  const leadOptions = mentors.map((m) => ({ value: m.id, label: `${m.name}, ${m.roleLabel}` }))
  const unavailableHint = isLoading
    ? 'Loading mentors'
    : (error ??
      (mentors.length === 0
        ? 'No mentors in this cohort yet. Invite one from Rosters.'
        : undefined))

  const matches = useMemo(() => {
    const term = search.trim().toLowerCase()
    return mentors.filter(
      (m) =>
        m.id !== leadId &&
        (coMentorIds.includes(m.id) ||
          (term !== '' && `${m.name} ${m.email}`.toLowerCase().includes(term)))
    )
  }, [mentors, search, leadId, coMentorIds])

  const toggle = (id: string) => {
    onCoMentorsChange(
      coMentorIds.includes(id) ? coMentorIds.filter((x) => x !== id) : [...coMentorIds, id]
    )
  }

  return (
    <div className={cx('flex flex-col', compact ? 'gap-2' : 'gap-5')}>
      <Select
        label={compact ? undefined : 'Lead mentor'}
        aria-label={compact ? `Lead mentor${suffix}` : undefined}
        options={[{ value: '', label: 'No lead mentor' }, ...leadOptions]}
        value={leadId}
        onChange={(e) => onLeadChange(e.target.value)}
        disabled={disabled || isLoading}
        hint={compact ? undefined : unavailableHint}
      />
      <div className="flex flex-col gap-2">
        {!compact && (
          <label
            htmlFor={searchId}
            className="font-sans text-small font-semibold text-text-primary"
          >
            Co-mentors
          </label>
        )}
        <input
          id={searchId}
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={compact ? 'Add co-mentors' : 'Search professional or peer mentors'}
          aria-label={compact ? `Co-mentors${suffix}` : undefined}
          disabled={disabled || isLoading || mentors.length === 0}
          className="h-control w-full rounded-control border border-border-strong bg-surface px-3 font-sans text-body text-text-primary placeholder:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:text-disabled-text"
        />
        {matches.length > 0 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label={`Co-mentors${suffix}`}>
            {matches.map((m) => {
              const isOn = coMentorIds.includes(m.id)
              return (
                <Chip
                  key={m.id}
                  variant={isOn ? 'on' : 'default'}
                  pressed={isOn}
                  onClick={() => toggle(m.id)}
                  disabled={disabled}
                >
                  {m.name}
                </Chip>
              )
            })}
          </div>
        )}
        {search.trim() !== '' && matches.every((m) => coMentorIds.includes(m.id)) && (
          <p className="font-sans text-caption text-text-muted">No other mentors match.</p>
        )}
        {compact && unavailableHint && (
          <p className="font-sans text-caption text-text-muted">{unavailableHint}</p>
        )}
      </div>
    </div>
  )
}
