import type { FormEvent } from 'react'
import { TrackChoiceList } from '@/components/forge/TrackChoiceList'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { formatLongDate } from '@/lib/format'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import type { ChooseTrackView } from '@/types/ictTrackSelection'

interface ChooseTrackScreenProps {
  // null until the data loads
  data: ChooseTrackView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  selected: string | null
  onSelect: (track: string) => void
  // False until the API can save a track choice
  canSave: boolean
  onSave?: () => void
}

function subtitle(closesOn: string | null): string {
  return closesOn
    ? `Pick the track you want to follow. You can change your choice until selection closes on ${formatLongDate(closesOn)}.`
    : 'Pick the track you want to follow. You can change your choice until selection closes.'
}

// The cohort's ICT tracks as a choice. This only draws the screen; the page's hook loads
// the data.
export function ChooseTrackScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  selected,
  onSelect,
  canSave,
  onSave,
}: ChooseTrackScreenProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (canSave && selected) onSave?.()
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <BackLink href={MENTEE_ROUTES.home}>Back to home</BackLink>
      <PageHeader title="Choose your ICT track" subtitle={subtitle(data?.closesOn ?? null)} />
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading the ICT tracks" />
      ) : data.tracks.length === 0 ? (
        <Card>
          <EmptyState
            icon="code"
            title="No ICT tracks yet"
            description="Your cohort has no ICT tracks set up. Ask the System Admin to add them."
          />
        </Card>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex max-w-5xl flex-col gap-3 md:gap-5">
          <TrackChoiceList
            tracks={data.tracks}
            selected={selected}
            onSelect={onSelect}
            disabled={!canSave}
          />
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={!canSave || !selected}
              className="md:w-auto"
            >
              Save my track
            </Button>
            <p className="text-center font-sans text-small text-text-muted md:text-left">
              {canSave
                ? data.closesOn
                  ? `Selection closes ${formatLongDate(data.closesOn)}.`
                  : null
                : 'Not available yet'}
            </p>
          </div>
        </form>
      )}
    </div>
  )
}
