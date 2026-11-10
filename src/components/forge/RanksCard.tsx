import { Card } from '@/components/ui/Card'
import { TextLink } from '@/components/ui/TextLink'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import { ordinal } from '@/lib/ordinal'
import type { LeaderboardRank } from '@/types/home'

interface RanksCardProps {
  ranks: LeaderboardRank[]
  // Hidden in the first month, when most boards are still empty
  showLeaderboardLink?: boolean
}

export function RanksCard({ ranks, showLeaderboardLink = true }: RanksCardProps) {
  return (
    <Card
      title={
        <>
          <span className="md:hidden">Your leaderboard ranks</span>
          <span className="hidden md:inline">Your ranks</span>
        </>
      }
      action={
        showLeaderboardLink ? (
          <TextLink href={MENTEE_ROUTES.leaderboard} layout="inline">
            <span className="md:hidden">View</span>
            <span className="hidden md:inline">Leaderboard</span>
          </TextLink>
        ) : undefined
      }
    >
      {ranks.length === 0 ? (
        <p className="font-sans text-small text-text-secondary">No ranks yet.</p>
      ) : (
        <ul>
          {ranks.map((item) => (
            <li
              key={item.label}
              className="flex items-baseline justify-between gap-3 border-b border-border py-2 font-sans text-small text-text-primary last:border-b-0"
            >
              <span>{item.label}</span>
              {item.rank === null ? (
                <span className="text-text-muted">No logs yet</span>
              ) : (
                <span className="font-mono font-semibold tabular-nums">
                  {item.isTied ? `Tied ${ordinal(item.rank)}` : ordinal(item.rank)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
