import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

interface FieldProps {
  id: string
  label?: string
  // Optional content on the right of the label row, such as a "Forgot password?" link
  labelAside?: ReactNode
  hint?: string
  error?: string
  children: ReactNode
}

// Shared look for every text-like control (Input, Select, Textarea, PasswordInput)
export function controlClasses(hasError: boolean): string {
  return cx(
    'w-full rounded-control border bg-surface px-3 font-sans text-body text-text-primary',
    'placeholder:text-text-muted transition-colors duration-fast',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary',
    'disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:text-disabled-text',
    hasError ? 'border-auburn' : 'border-border-strong'
  )
}

// aria-describedby value for a control inside a Field
export function fieldDescribedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}

export function Field({ id, label, labelAside, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {(label ?? labelAside) && (
        <div className="flex items-center justify-between gap-3">
          {label && (
            <label htmlFor={id} className="font-sans text-small font-semibold text-text-primary">
              {label}
            </label>
          )}
          {labelAside}
        </div>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="font-sans text-caption text-danger-text">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="font-sans text-caption text-text-muted">
          {hint}
        </p>
      )}
    </div>
  )
}
