import Link from 'next/link'
import { peerMenteeRoute } from '@/lib/peerMentorRoutes'
import type { MenteeCardView } from '@/types/peerMentor'
import { MenteeNumbers } from './MenteeNumbers'

interface PeerMenteeCardProps {
  mentee: MenteeCardView
}

// One mentee in a peer mentor's group. The whole card opens their read-only detail.
export function PeerMenteeCard({ mentee }: PeerMenteeCardProps) {
  return (
    <Link
      href={peerMenteeRoute(mentee.id)}
      className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 text-inherit no-underline shadow-card transition-shadow duration-fast hover:no-underline hover:shadow-md md:px-6 md:py-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-sans text-body font-semibold text-text-primary">{mentee.name}</h2>
          <p className="font-sans text-small text-text-muted">University not available yet</p>
        </div>
        <span className="font-sans text-caption font-semibold text-link">View</span>
      </div>
      <MenteeNumbers mentee={mentee} />
    </Link>
  )
}
