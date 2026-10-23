interface AvatarProps {
  // Full name; the first letters of the first two words become the initials
  name: string
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export function Avatar({ name }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-avatar shrink-0 items-center justify-center rounded-full bg-accent-bg font-mono text-caption font-semibold text-accent-text"
    >
      {initialsFor(name)}
    </span>
  )
}
