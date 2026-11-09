'use client'

import { useId } from 'react'
import { cx } from '@/lib/cx'

const VALUES = [1, 2, 3, 4, 5]

interface RatingScaleProps {
  question: string
  value: number | undefined
  onChange: (value: number) => void
  error?: string
  disabled?: boolean
  // Keeps the question for screen readers only, for when it sits beside the scale
  compact?: boolean
}

// One 1 to 5 question. Real radio inputs, so keyboards and screen readers work as usual.
export function RatingScale({
  question,
  value,
  onChange,
  error,
  disabled,
  compact = false,
}: RatingScaleProps) {
  const name = useId()
  return (
    <fieldset
      className={cx('flex flex-col gap-2', !compact && 'border-t border-border py-3')}
      disabled={disabled}
    >
      <legend
        className={cx(
          compact ? 'sr-only' : 'float-left mb-2 w-full font-sans text-small text-text-primary'
        )}
      >
        {question}
      </legend>
      <div className="clear-both grid grid-cols-5 gap-2">
        {VALUES.map((option) => {
          const isOn = value === option
          return (
            <label
              key={option}
              className={cx(
                'flex h-control cursor-pointer items-center justify-center rounded-control border font-mono text-body font-semibold focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-primary',
                isOn
                  ? 'border-primary bg-primary text-text-on-primary'
                  : 'border-border-strong bg-surface text-text-primary hover:bg-background',
                disabled && 'cursor-not-allowed opacity-60'
              )}
            >
              <input
                type="radio"
                name={name}
                value={option}
                checked={isOn}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              {option}
            </label>
          )
        })}
      </div>
      {error && (
        <p role="alert" className="font-sans text-caption text-danger-text">
          {error}
        </p>
      )}
    </fieldset>
  )
}
