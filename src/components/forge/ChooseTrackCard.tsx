import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { formatLongDate } from '@/lib/format'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'

interface ChooseTrackCardProps {
  // YYYY-MM-DD
  closesOn: string
}

// Asks a new mentee to choose an ICT track while selection is open
export function ChooseTrackCard({ closesOn }: ChooseTrackCardProps) {
  return (
    <Card className="!border-primary">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="font-mono text-card-title font-semibold text-text-primary">
            Choose your ICT track
          </h2>
          <p className="font-sans text-small text-text-secondary">
            Selection is open until {formatLongDate(closesOn)}.
          </p>
        </div>
        <ButtonLink href={MENTEE_ROUTES.chooseTrack} fullWidth className="md:w-auto md:shrink-0">
          Choose a track
        </ButtonLink>
      </div>
    </Card>
  )
}
