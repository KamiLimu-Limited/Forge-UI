'use client'

import { useId, useMemo, useState } from 'react'
import { Chip } from '@/components/ui/Chip'
import type { MentorOption } from '@/hooks/useMentorOptions'

interface CoMentorPickerProps {
  mentors: MentorOption[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  // Left out of the list, usually the lead mentor
  excludeId?: string
  disabled?: boolean
  // Visible label; when omitted, `ariaLabel` names the search box
  label?: string
  ariaLabel?: string
  placeholder?: string
}

// Search box plus toggle chips. Chosen co-mentors always show; others appear as you type.
export function CoMentorPicker({
  mentors,
  selectedIds,
  onChange,
  excludeId,
  disabled = false,
  label,
  ariaLabel,
  placeholder = 'Search professional or peer mentors',
}: CoMentorPickerProps) {
  const searchId = useId()
  const [search, setSearch] = useState('')

  const matches = useMemo(() => {
    const term = search.trim().toLowerCase()
    return mentors.filter(
      (m) =>
        m.id !== excludeId &&
        (selectedIds.includes(m.id) ||
          (term !== '' && `${m.name} ${m.email}`.toLowerCase().includes(term)))
    )
  }, [mentors, search, excludeId, selectedIds])

  const toggle = (id: string) =>
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id])

  const noOthers = search.trim() !== '' && matches.every((m) => selectedIds.includes(m.id))

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={searchId} className="font-sans text-small font-semibold text-text-primary">
          {label}
        </label>
      )}
      <input
        id={searchId}
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        aria-label={label ? undefined : ariaLabel}
        disabled={disabled || mentors.length === 0}
        className="h-control w-full rounded-control border border-border-strong bg-surface px-3 font-sans text-body text-text-primary placeholder:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:text-disabled-text"
      />
      {matches.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label={label ?? ariaLabel}>
          {matches.map((m) => {
            const isOn = selectedIds.includes(m.id)
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
      {noOthers && (
        <p className="font-sans text-caption text-text-muted">No other mentors match.</p>
      )}
    </div>
  )
}
