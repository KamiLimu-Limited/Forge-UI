import Link from 'next/link'
import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

interface TextLinkProps {
  href: string
  children: ReactNode
  // "inline" sits inside a label row; "block" stands alone and gets a 44px tall target
  layout?: 'inline' | 'block'
}

// teal-700 text link. Inline links stretch their hit area with ::before to reach 44px.
export function TextLink({ href, children, layout = 'block' }: TextLinkProps) {
  return (
    <Link
      href={href}
      className={cx(
        'font-sans text-caption font-semibold text-link hover:underline',
        layout === 'inline'
          ? "relative before:absolute before:-inset-x-2 before:-inset-y-3 before:content-['']"
          : 'inline-flex min-h-control items-center self-center'
      )}
    >
      {children}
    </Link>
  )
}
