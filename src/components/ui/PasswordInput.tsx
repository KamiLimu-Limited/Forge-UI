'use client'

import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { cx } from '@/lib/cx'
import type { PasswordRule } from '@/lib/password'
import { Field, controlClasses, fieldDescribedBy } from './Field'
import { Icon } from './Icon'

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  labelAside?: ReactNode
  error?: string
  hint?: string
  value: string
  // When set, renders a live checklist of these rules under the field
  rules?: PasswordRule[]
}

export function PasswordInput({
  label,
  labelAside,
  error,
  hint,
  value,
  rules,
  id,
  className,
  ...rest
}: PasswordInputProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const rulesId = `${inputId}-rules`
  const [isVisible, setIsVisible] = useState(false)

  const describedBy = [fieldDescribedBy(inputId, error, hint), rules ? rulesId : undefined]
    .filter(Boolean)
    .join(' ')

  return (
    <Field id={inputId} label={label} labelAside={labelAside} hint={hint} error={error}>
      <div className="relative">
        <input
          id={inputId}
          type={isVisible ? 'text' : 'password'}
          value={value}
          className={cx(controlClasses(Boolean(error)), 'h-control pr-control', className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setIsVisible((v) => !v)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-controls={inputId}
          className="absolute inset-y-0 right-0 flex w-control items-center justify-center rounded-r-control text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
        >
          <Icon name={isVisible ? 'eye-off' : 'eye'} />
        </button>
      </div>
      {rules && (
        <ul id={rulesId} className="flex flex-col gap-2" aria-label="Password requirements">
          {rules.map((rule) => {
            const isMet = rule.test(value)
            return (
              <li
                key={rule.label}
                className={cx(
                  'flex items-center gap-2 font-sans text-caption',
                  isMet ? 'text-text-primary' : 'text-text-secondary'
                )}
              >
                <span
                  className={cx(
                    'flex size-4 shrink-0 items-center justify-center rounded-full border',
                    isMet ? 'border-success bg-success text-text-inverse' : 'border-border-strong'
                  )}
                >
                  {isMet && <Icon name="check" className="size-3" />}
                </span>
                {rule.label}
                <span className="sr-only">{isMet ? '(done)' : '(not yet)'}</span>
              </li>
            )
          })}
        </ul>
      )}
    </Field>
  )
}
