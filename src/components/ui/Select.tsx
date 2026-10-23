'use client'

import { useId, type SelectHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import { Field, controlClasses, fieldDescribedBy } from './Field'
import { Icon } from './Icon'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  // Shown as a disabled first option when nothing is selected yet
  placeholder?: string
}

export function Select({
  label,
  error,
  hint,
  options,
  placeholder,
  id,
  className,
  ...rest
}: SelectProps) {
  const autoId = useId()
  const selectId = id ?? autoId

  return (
    <Field id={selectId} label={label} hint={hint} error={error}>
      <div className="relative">
        <select
          id={selectId}
          className={cx(
            controlClasses(Boolean(error)),
            'h-control appearance-none pr-10',
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={fieldDescribedBy(selectId, error, hint)}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.length === 0 && !placeholder && (
            <option value="" disabled>
              No options available
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-text-muted">
          <Icon name="chevron-down" className="size-4" />
        </span>
      </div>
    </Field>
  )
}
