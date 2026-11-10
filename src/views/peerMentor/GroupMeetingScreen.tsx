import { TrackBadge } from '@/components/forge/TrackBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { GroupMeetingDraft } from '@/hooks/useGroupMeeting'
import { MODE_LABELS } from '@/lib/labels'
import { PEER_MENTOR_ROUTES } from '@/lib/peerMentorRoutes'
import type { GroupMeetingView, MeetingMode } from '@/types/peerMentor'

const MODES: { value: MeetingMode; label: string }[] = [
  { value: 'physical', label: MODE_LABELS.physical },
  { value: 'virtual', label: MODE_LABELS.virtual },
]

interface GroupMeetingScreenProps {
  // null when there is no session to plan for, or until it loads
  data: GroupMeetingView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  draft: GroupMeetingDraft
  onDraftChange: (changes: Partial<GroupMeetingDraft>) => void
}

// Where a peer mentor sets when and how their group meets for a peer mentorship session.
// Saving needs an API route that doesn't exist yet, so it stays switched off. See docs/api-
// gaps.md.
export function GroupMeetingScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  draft,
  onDraftChange,
}: GroupMeetingScreenProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <BackLink href={PEER_MENTOR_ROUTES.home}>Back to my mentees</BackLink>
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading ? (
        <LoadingState label="Loading your group meeting" />
      ) : !data ? (
        <>
          <PageHeader title="Group meeting" />
          <Card>
            <EmptyState icon="calendar" title="Nothing to plan yet" />
          </Card>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <PageHeader title="Group meeting" subtitle={data.title} />
            <div className="flex flex-wrap items-center gap-2">
              <TrackBadge pillar="personal-dev" />
              <span className="font-sans text-small text-text-secondary">
                {data.windowLine}. Meet your group any time in this window.
              </span>
            </div>
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-3 lg:gap-5">
            <Card title="When and where" className="lg:col-span-2">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <span className="font-sans text-small font-semibold text-text-primary">
                    How will you meet?
                  </span>
                  <SegmentedControl
                    label="How will you meet?"
                    variant="joined"
                    options={MODES}
                    value={draft.mode}
                    onChange={(mode) => onDraftChange({ mode })}
                  />
                </div>
                <Input
                  label="Date"
                  type="date"
                  min={data.firstDay}
                  max={data.lastDay}
                  value={draft.date}
                  onChange={(event) => onDraftChange({ date: event.target.value })}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Starts"
                    type="time"
                    value={draft.startTime}
                    onChange={(event) => onDraftChange({ startTime: event.target.value })}
                  />
                  <Input
                    label="Ends"
                    type="time"
                    value={draft.endTime}
                    onChange={(event) => onDraftChange({ endTime: event.target.value })}
                  />
                </div>
                {draft.mode === 'physical' ? (
                  <Input
                    label="Place"
                    placeholder="For example, the library on main campus"
                    value={draft.place}
                    onChange={(event) => onDraftChange({ place: event.target.value })}
                  />
                ) : (
                  <>
                    <Notice>
                      We&apos;ll create a Google Meet on KamiLimu&apos;s Workspace and send the
                      invitation to your group. The meeting can be recorded, and the recording is
                      saved to KamiLimu&apos;s Drive.
                    </Notice>
                    <p className="font-sans text-small text-text-muted">
                      Meeting in person instead? Choose Physical and add the place.
                    </p>
                  </>
                )}
                <div className="flex flex-col gap-1">
                  <Button size="lg" fullWidth disabled className="md:w-auto md:self-start">
                    Save meeting
                  </Button>
                  <p className="font-sans text-caption text-text-muted">Not available yet</p>
                </div>
              </div>
            </Card>

            <Card title="Your group">
              {data.group.length === 0 ? (
                <p className="font-sans text-small text-text-muted">
                  No mentees in your group yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {data.group.map((mentee) => (
                    <li key={mentee.id} className="flex items-center gap-3">
                      <Avatar name={mentee.name} />
                      <span className="min-w-0 truncate font-sans text-small font-semibold text-text-primary">
                        {mentee.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
