import { Card } from '@/components/ui/Card'

export const PEER_MENTOR_PENDING =
  "You'll see your 1:1 peer mentor here once they're assigned, about a month into the programme."

interface PeerMentorCardProps {
  name: string | null
  // True when a peer mentor is assigned, even if the API can't tell us their name
  isAssigned: boolean
  className?: string
}

export function PeerMentorCard({ name, isAssigned, className }: PeerMentorCardProps) {
  return (
    <Card className={className}>
      <p className="font-sans text-small text-text-secondary">Your peer mentor</p>
      {name ? (
        <p className="font-sans text-body font-semibold text-text-primary">{name}</p>
      ) : isAssigned ? (
        <p className="mt-1 font-sans text-small text-text-muted">Not available yet</p>
      ) : (
        <p className="mt-1 font-sans text-small text-text-primary">{PEER_MENTOR_PENDING}</p>
      )}
    </Card>
  )
}
