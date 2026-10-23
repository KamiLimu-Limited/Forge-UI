'use client'

import { useId, type TextareaHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import { Field, controlClasses, fieldDescribedBy } from './Field'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, id, className, ...rest }: TextareaProps) {
  const autoId = useId()
  const textareaId = id ?? autoId

  return (
    <Field id={textareaId} label={label} hint={hint} error={error}>
      <textarea
        id={textareaId}
        className={cx(controlClasses(Boolean(error)), 'min-h-textarea py-3', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={fieldDescribedBy(textareaId, error, hint)}
        {...rest}
      />
    </Field>
  )
}
