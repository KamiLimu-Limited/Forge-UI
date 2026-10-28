import type { ButtonHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import { Spinner } from './Spinner'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  /** @deprecated Use `secondary`. Kept as an alias so older call sites keep working. */
  | 'ghost'

type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
}

const base = cx(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap border',
  'font-mono font-semibold transition-colors duration-fast',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary',
  'disabled:cursor-not-allowed disabled:border-disabled-bg disabled:bg-disabled-bg disabled:text-disabled-text'
)

const secondary = 'border-border-strong bg-surface text-text-primary hover:bg-background'

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-teal-500 bg-teal-500 text-text-on-primary hover:border-teal-300 hover:bg-teal-300',
  secondary,
  danger: 'border-auburn bg-surface text-danger-text hover:bg-danger-bg',
  ghost: secondary,
}

// sm is 36px tall; the ::before layer stretches its hit area to the 44px touch target
const sizes: Record<ButtonSize, string> = {
  sm: "h-control-sm rounded-md px-3 text-caption before:absolute before:inset-x-0 before:-inset-y-1 before:content-['']",
  md: 'h-control rounded-control px-4 text-small',
  lg: 'h-control-lg rounded-control px-6 text-body',
}

// Classes for anything that should look like a Button, such as ButtonLink
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  fullWidth = false
): string {
  return cx(base, variants[variant], sizes[size], fullWidth && 'w-full')
}

export type { ButtonVariant, ButtonSize }

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(buttonClasses(variant, size, fullWidth), className)}
      disabled={disabled === true || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
