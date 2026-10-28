'use client'

import { useState, type FormEvent } from 'react'
import { TrackBadge } from '@/components/forge/TrackBadge'
import { NoCohortNotice } from '@/components/layout/NoCohortNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { useIctTracks, type TrackSummary } from '@/hooks/useIctTracks'
import { useToast } from '@/hooks/useToast'
import { fullName, plural } from '@/lib/format'
import type { EnrollmentResponse } from '@/types/enrollment'

const NOT_YET = 'Not available yet'

interface TrackCardProps {
  track: TrackSummary
  isBusy: boolean
  onRemove: () => void
}

function TrackCard({ track, isBusy, onRemove }: TrackCardProps) {
  const canRemove = track.mentees === 0 && track.peerMentors.length === 0
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <span className="self-start">
          <TrackBadge pillar="ict" />
        </span>
        <h2 className="font-mono text-card-title font-semibold text-text-primary">{track.name}</h2>
        <p className="font-sans text-small text-text-secondary">
          Lead mentor: {NOT_YET.toLowerCase()}
        </p>
        <p className="font-sans text-small text-text-secondary">
          ICT peer mentor:{' '}
          {track.peerMentors.length > 0
            ? track.peerMentors.map((m) => fullName(m.user)).join(', ')
            : 'not assigned'}
        </p>
        <p className="font-mono text-stat font-semibold text-text-primary">
          {track.mentees}{' '}
          <span className="font-sans text-body font-medium text-text-muted">
            {track.mentees === 1 ? 'mentee' : 'mentees'}
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          <ButtonLink variant="secondary" size="sm" href="/admin/assignments/ict">
            Assign peer mentor
          </ButtonLink>
          {canRemove && (
            <Button variant="danger" size="sm" onClick={onRemove} disabled={isBusy}>
              Remove track
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

interface ChooseTrackRowProps {
  mentee: EnrollmentResponse
  tracks: string[]
  isBusy: boolean
  onSave: (track: string) => void
}

function ChooseTrackRow({ mentee, tracks, isBusy, onSave }: ChooseTrackRowProps) {
  const [track, setTrack] = useState('')
  const name = fullName(mentee.user)
  return (
    <TableRow>
      <TableCell className="font-semibold">{name}</TableCell>
      <TableCell className="text-text-muted">{NOT_YET}</TableCell>
      <TableCell className="text-text-muted">{NOT_YET}</TableCell>
      <TableCell>
        <select
          aria-label={`Track for ${name}`}
          value={track}
          onChange={(e) => setTrack(e.target.value)}
          className="h-control w-full min-w-48 rounded-control border border-border-strong bg-surface px-3 font-sans text-body text-text-primary"
        >
          <option value="">Choose a track</option>
          {tracks.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </TableCell>
      <TableCell className="text-right">
        <Button size="sm" onClick={() => onSave(track)} disabled={!track} isLoading={isBusy}>
          Save
        </Button>
      </TableCell>
    </TableRow>
  )
}

export function IctTracksPage() {
  const { showToast } = useToast()
  const { cohortId, isLoading: cohortLoading } = useActiveCohort()
  const data = useIctTracks(cohortId)
  const [isAdding, setIsAdding] = useState(false)
  const [newTrack, setNewTrack] = useState('')
  const [newTrackError, setNewTrackError] = useState<string | null>(null)

  const addTrack = async (e: FormEvent) => {
    e.preventDefault()
    const name = newTrack.trim()
    if (!name) {
      setNewTrackError('Name the track, for example Cloud Engineering.')
      return
    }
    if (data.tracks.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      setNewTrackError('This cohort already offers that track.')
      return
    }
    if (await data.addTrack(name)) {
      showToast(`${name} added.`)
      setNewTrack('')
      setIsAdding(false)
    }
  }

  if (!cohortLoading && !cohortId) {
    return (
      <>
        <PageHeader title="ICT tracks" />
        <NoCohortNotice />
      </>
    )
  }

  const chosen = data.mentees.length - data.withoutTrack.length

  return (
    <>
      <PageHeader
        title="ICT tracks"
        subtitle="Mentees choose a track on their dashboard after the tracks and lead mentors are introduced."
        action={
          <Button variant="secondary" onClick={() => setIsAdding(true)}>
            Add track
          </Button>
        }
      />

      {isAdding && (
        <Card title="Add a track" className="max-w-xl">
          <form onSubmit={(e) => void addTrack(e)} noValidate className="flex flex-col gap-4">
            <Input
              label="Track name"
              placeholder="For example, Cloud Engineering"
              value={newTrack}
              onChange={(e) => {
                setNewTrack(e.target.value)
                setNewTrackError(null)
              }}
              error={newTrackError ?? undefined}
            />
            <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
              <Button variant="secondary" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={data.busyKey === `track:${newTrack.trim()}`}>
                Add track
              </Button>
            </div>
          </form>
        </Card>
      )}

      {data.actionError && <Notice variant="danger">{data.actionError}</Notice>}

      <Card title="Selection window">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <p className="font-sans text-small text-text-secondary">
            {data.isLoading
              ? 'Loading'
              : `${chosen} of ${plural(data.mentees.length, 'mentee')} chose a track. Opening and closing the window: ${NOT_YET.toLowerCase()}.`}
          </p>
          <fieldset disabled className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Input label="Opens" type="date" hint={NOT_YET} />
            <Input label="Closes" type="date" hint={NOT_YET} />
            <Button variant="secondary" className="sm:mb-6">
              Reopen window
            </Button>
          </fieldset>
        </div>
      </Card>

      {data.isLoading ? (
        <LoadingState label="Loading tracks" />
      ) : data.error ? (
        <ErrorState message={data.error} onRetry={data.refetch} />
      ) : data.tracks.length === 0 ? (
        <Card>
          <EmptyState
            title="No ICT tracks yet"
            description="Add the tracks this cohort offers. Mentees then choose one, and ICT sessions are linked to a track."
            action={<Button onClick={() => setIsAdding(true)}>Add track</Button>}
          />
        </Card>
      ) : (
        <section
          aria-label="Tracks"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {data.tracks.map((track) => (
            <TrackCard
              key={track.name}
              track={track}
              isBusy={data.busyKey === `track:${track.name}`}
              onRemove={() =>
                void data.removeTrack(track.name).then((ok) => {
                  if (ok) showToast(`${track.name} removed.`)
                })
              }
            />
          ))}
        </section>
      )}

      {!data.isLoading && !data.error && (
        <Card
          flush
          title={`Haven't chosen a track (${data.withoutTrack.length})`}
          action={
            <span className="font-sans text-caption text-text-muted">
              Setting a track on a mentee&apos;s behalf is recorded in the audit trail.
            </span>
          }
        >
          {data.withoutTrack.length === 0 ? (
            <EmptyState
              icon="check"
              title={data.mentees.length === 0 ? 'No mentees enrolled yet' : 'Everyone has chosen'}
              description={
                data.mentees.length === 0
                  ? 'Mentees show here once they accept their invitation.'
                  : undefined
              }
            />
          ) : (
            <Table label="Mentees without a track">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>University</TableHeaderCell>
                  <TableHeaderCell>Programme</TableHeaderCell>
                  <TableHeaderCell>Set track</TableHeaderCell>
                  <TableHeaderCell>
                    <span className="sr-only">Save</span>
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.withoutTrack.map((mentee) => (
                  <ChooseTrackRow
                    key={mentee.id}
                    mentee={mentee}
                    tracks={data.tracks.map((t) => t.name)}
                    isBusy={data.busyKey === mentee.id}
                    onSave={(track) =>
                      void data.setMenteeTrack(mentee.id, track).then((ok) => {
                        if (ok) showToast(`${fullName(mentee.user)} is now in ${track}.`)
                      })
                    }
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      )}
    </>
  )
}
