import { cx } from '@/lib/cx'
import { PILLAR_LABELS, type Pillar } from '@/lib/labels'

interface TrackBadgeProps {
  pillar: Pillar
  // Overrides the pillar name, for example an ICT track such as "Cybersecurity"
  label?: string
}

// The six pillar colours from global.css
const pillarClasses: Record<Pillar, string> = {
  ict: 'bg-track-ict-bg text-accent-text',
  innovation: 'bg-track-innovation-bg text-info-text',
  'personal-dev': 'bg-track-personal-dev-bg text-warning-text',
  'professional-dev': 'bg-track-professional-dev-bg text-danger-text',
  scholarship: 'bg-track-scholarship-bg text-success-text',
  community: 'bg-track-community-bg text-text-primary',
}

export function TrackBadge({ pillar, label }: TrackBadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 font-sans text-caption font-medium',
        pillarClasses[pillar]
      )}
    >
      {label ?? PILLAR_LABELS[pillar]}
    </span>
  )
}
