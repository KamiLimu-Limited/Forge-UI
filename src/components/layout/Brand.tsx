import Link from 'next/link'
import { KamiLimuLogo } from './KamiLimuLogo'

interface BrandProps {
  // Where the logo links to, usually the signed-in home page
  href?: string
}

// The KamiLimu wordmark at shell size (about 26px tall), linking home
export function Brand({ href = '/dashboard' }: BrandProps) {
  return (
    <Link href={href} aria-label="KamiLimu home" className="inline-flex min-h-control items-center">
      <KamiLimuLogo className="w-36 md:w-40" />
    </Link>
  )
}
