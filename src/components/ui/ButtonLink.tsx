import Link from 'next/link'
import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './Button'

interface ButtonLinkProps {
  href: string
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
  'aria-label'?: string
}

// A next/link that looks like a Button, for actions that open another page
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  'aria-label': ariaLabel,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cx(
        buttonClasses(variant, size, fullWidth),
        'no-underline hover:no-underline',
        className
      )}
    >
      {children}
    </Link>
  )
}
