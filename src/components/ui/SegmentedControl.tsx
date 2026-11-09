'use client'

import { useRef, type KeyboardEvent } from 'react'
import { cx } from '@/lib/cx'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  // Names the group for screen readers, for example "Filter users by status"
  label: string
  disabled?: boolean
  // "pill" has a gap between options; "joined" fills the row with divided cells
  variant?: 'pill' | 'joined'
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  disabled = false,
  variant = 'pill',
}: SegmentedControlProps<T>) {
  const isJoined = variant === 'joined'
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([])

  // Arrow keys move between options, as in a tab list
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (step === 0) return
    e.preventDefault()
    const next = (index + step + options.length) % options.length
    onChange(options[next].value)
    buttonsRef.current[next]?.focus()
  }

  if (options.length === 0) return null

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cx(
        'flex w-full rounded-control border border-border-strong bg-surface',
        isJoined ? 'overflow-hidden' : 'gap-1 p-1 md:w-auto md:self-start'
      )}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value
        return (
          <button
            key={option.value}
            ref={(el) => {
              buttonsRef.current[index] = el
            }}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cx(
              'h-control flex-1 whitespace-nowrap px-2 transition-colors duration-fast md:px-4',
              isJoined
                ? 'border-l border-border-strong font-sans text-body first:border-l-0'
                : 'rounded-md font-mono text-small',
              isSelected
                ? 'bg-accent-bg font-semibold text-accent-text'
                : 'text-text-secondary hover:bg-background hover:text-text-primary',
              'disabled:cursor-not-allowed disabled:text-disabled-text'
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
