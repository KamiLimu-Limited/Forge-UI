import Image from 'next/image'

interface KamiLimuLogoProps {
  className?: string
  // "light" always uses the ivory lettering, for dark surfaces such as the graduation sequence
  tone?: 'auto' | 'light'
}

// The full KamiLimu wordmark. The dark mode file swaps the black lettering
// for ivory so it stays readable on dark surfaces.
export function KamiLimuLogo({ className = 'w-48 md:w-56', tone = 'auto' }: KamiLimuLogoProps) {
  if (tone === 'light') {
    return (
      <div className={className}>
        <Image
          src="/logos/kamilimu-wordmark-dark.png"
          alt="KamiLimu"
          width={1152}
          height={186}
          className="h-auto w-full"
        />
      </div>
    )
  }
  return (
    <div className={className}>
      <Image
        src="/logos/kamilimu-wordmark.png"
        alt="KamiLimu"
        width={1152}
        height={186}
        priority
        className="h-auto w-full dark:hidden"
      />
      <Image
        src="/logos/kamilimu-wordmark-dark.png"
        alt="KamiLimu"
        width={1152}
        height={186}
        priority
        className="hidden h-auto w-full dark:block"
      />
    </div>
  )
}
