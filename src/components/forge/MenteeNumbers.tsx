import { formatPercentage } from '@/lib/format'
import type { MenteeCardView } from '@/types/peerMentor'

interface MenteeNumbersProps {
  mentee: MenteeCardView
}

// Numbers only, with no colour coding or standing labels
export function MenteeNumbers({ mentee }: MenteeNumbersProps) {
  const numbers = [
    { label: 'Core rate', value: formatPercentage(mentee.coreRate) ?? '-' },
    { label: 'Overall', value: formatPercentage(mentee.overallRate) ?? '-' },
    { label: 'Points', value: String(mentee.points) },
  ]
  return (
    <dl className="grid grid-cols-3 gap-2">
      {numbers.map((number) => (
        <div key={number.label} className="rounded-md bg-background px-2.5 py-2">
          <dt className="font-sans text-tab text-text-secondary">{number.label}</dt>
          <dd className="font-mono text-subheading font-semibold tabular-nums text-text-primary">
            {number.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
