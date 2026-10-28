import Link from 'next/link'
import { Icon } from './Icon'

interface BackLinkProps {
  href: string
  children: string
}

// "Back to the calendar" above a page title, with a 44px tall target
export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-control items-center gap-1 self-start font-sans text-small font-semibold text-link hover:underline"
    >
      <Icon name="chevron-left" className="size-4" />
      {children}
    </Link>
  )
}
