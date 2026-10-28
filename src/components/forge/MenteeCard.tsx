'use client'

import type { DragEvent } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cx } from '@/lib/cx'

export interface AssignOption {
  value: string
  label: string
  disabled?: boolean
}

interface MenteeCardProps {
  id: string
  name: string
  detail?: string
  // "Assign to" choices for keyboard and touch users; the current one is `value`
  options: AssignOption[]
  value: string
  onAssign: (value: string) => void
  isChanged?: boolean
  disabled?: boolean
}

export const MENTEE_DRAG_TYPE = 'application/x-kamilimu-mentee'

// A draggable mentee with an "Assign to" select, so moving works without dragging too
export function MenteeCard({
  id,
  name,
  detail,
  options,
  value,
  onAssign,
  isChanged = false,
  disabled = false,
}: MenteeCardProps) {
  const onDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(MENTEE_DRAG_TYPE, id)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable={!disabled}
      onDragStart={onDragStart}
      className={cx(
        'flex flex-wrap items-center gap-3 rounded-control border bg-surface px-3 py-2',
        isChanged ? 'border-teal-500' : 'border-border',
        !disabled && 'cursor-grab active:cursor-grabbing'
      )}
    >
      <Icon name="grip" className="size-4 text-text-muted" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-sans text-body font-semibold text-text-primary">{name}</span>
        {(detail ?? isChanged) && (
          <span className="truncate font-sans text-caption text-text-muted">
            {isChanged ? 'Moved, not saved yet' : detail}
          </span>
        )}
      </div>
      <div className="relative w-full sm:w-40">
        <select
          aria-label={`Assign ${name} to`}
          value={value}
          onChange={(e) => onAssign(e.target.value)}
          disabled={disabled}
          className="h-control w-full appearance-none rounded-control border border-border-strong bg-surface pl-3 pr-8 font-sans text-small text-text-primary disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:text-disabled-text"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-text-muted">
          <Icon name="chevron-down" className="size-4" />
        </span>
      </div>
    </div>
  )
}
