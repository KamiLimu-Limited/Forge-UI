'use client'

import { useId } from 'react'
import { cx } from '@/lib/cx'
import type { TrackOptionView } from '@/types/ictTrackSelection'

const NOT_AVAILABLE = 'Not available yet'

interface TrackChoiceListProps {
  tracks: TrackOptionView[]
  selected: string | null
  onSelect: (track: string) => void
  disabled?: boolean
}

// The ICT tracks as large radio cards: name, description and lead mentor. One column on
// phones, two from md up. Real radio inputs, so keyboards and screen readers work as usual.
export function TrackChoiceList({
  tracks,
  selected,
  onSelect,
  disabled = false,
}: TrackChoiceListProps) {
  const name = useId()
  return (
    <fieldset disabled={disabled} className="grid gap-3 md:grid-cols-2 md:gap-5">
      <legend className="sr-only">ICT track</legend>
      {tracks.map((track) => {
        const isOn = selected === track.name
        return (
          <label
            key={track.name}
            className={cx(
              'flex cursor-pointer items-start gap-3 rounded-lg bg-surface p-4 shadow-card focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary md:gap-4 md:p-5',
              isOn ? 'border-2 border-primary bg-accent-bg' : 'border border-border',
              disabled && 'cursor-not-allowed'
            )}
          >
            {/* The ::before layer stretches the 20px radio to a 44px target without moving it */}
            <span className="relative mt-0.5 flex shrink-0 before:absolute before:-inset-3 before:content-['']">
              <input
                type="radio"
                name={name}
                value={track.name}
                checked={isOn}
                onChange={() => onSelect(track.name)}
                className="size-5 accent-link"
              />
            </span>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="font-mono text-body font-semibold text-text-primary md:text-card-title">
                {track.name}
              </span>
              <span className="font-sans text-small text-text-secondary md:text-body">
                {track.description ?? `Description ${NOT_AVAILABLE.toLowerCase()}`}
              </span>
              <span className="font-sans text-small text-text-primary">
                Lead mentor: {track.leadMentorName ?? NOT_AVAILABLE}
              </span>
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}
