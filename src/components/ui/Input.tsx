'use client'

import { useId, type ComponentProps, type ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { Field, controlClasses, fieldDescribedBy } from './Field'

// ComponentProps includes ref, which React 19 passes through as a normal prop
interface InputProps extends ComponentProps<'input'> {
  label?: string
  labelAside?: ReactNode
  error?: string
  hint?: string
}

export function Input({ label, labelAside, error, hint, id, className, ...rest }: InputProps) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <Field id={inputId} label={label} labelAside={labelAside} hint={hint} error={error}>
      <input
        id={inputId}
        className={cx(controlClasses(Boolean(error)), 'h-control', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={fieldDescribedBy(inputId, error, hint)}
        {...rest}
      />
    </Field>
  )
}
