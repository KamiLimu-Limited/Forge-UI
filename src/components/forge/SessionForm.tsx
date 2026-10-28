'use client'

import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Notice } from '@/components/ui/Notice'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import type { MentorOption } from '@/hooks/useMentorOptions'
import type {
  SessionFormErrors,
  SessionFormValues,
  SessionPillarChoice,
} from '@/hooks/useSessionEditor'
import { CATEGORY_OPTIONS, PILLAR_LABELS, type Pillar } from '@/lib/labels'
import { monthBoundaries, monthLabel } from '@/lib/sessions'
import type { CohortResponse } from '@/types/cohort'
import type { SessionCategory, SessionMode } from '@/types/session'
import { MentorPicker } from './MentorPicker'

interface SessionFormProps {
  values: SessionFormValues
  errors: SessionFormErrors
  onChange: <K extends keyof SessionFormValues>(key: K, value: SessionFormValues[K]) => void
  cohort: CohortResponse | null
  mentors: MentorOption[]
  mentorsLoading?: boolean
  mentorsError?: string | null
  // Edit mode shows the reschedule reason when the date or time changes
  isEdit?: boolean
  timeChanged?: boolean
  disabled?: boolean
  // Extra cards at the bottom of the right column, such as status and cancel
  aside?: ReactNode
}

const NOT_YET = 'Not available yet'

// Pillars the API cannot store yet are listed but disabled
const OTHER_PILLARS: Pillar[] = [
  'innovation',
  'personal-dev',
  'professional-dev',
  'scholarship',
  'community',
]

const SESSION_TYPES = ['Theory', 'Tell and Show', 'Hands-on', 'Simulation']

const MODE_OPTIONS: { value: SessionMode; label: string }[] = [
  { value: 'virtual', label: 'Virtual' },
  { value: 'physical', label: 'Physical' },
]

function pointOptions(current: number): { value: string; label: string }[] {
  const values = Array.from(new Set([5, 10, current])).sort((a, b) => a - b)
  return values.map((v) => ({ value: String(v), label: String(v) }))
}

export function SessionForm({
  values,
  errors,
  onChange,
  cohort,
  mentors,
  mentorsLoading = false,
  mentorsError,
  isEdit = false,
  timeChanged = false,
  disabled = false,
  aside,
}: SessionFormProps) {
  const ictTracks = cohort?.ict_tracks_offered ?? []
  const months = monthBoundaries(cohort)

  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-5">
      <Card title="Details" className="lg:col-span-3">
        <fieldset disabled={disabled} className="flex flex-col gap-5">
          <Input
            label="Title"
            value={values.title}
            onChange={(e) => onChange('title', e.target.value)}
            error={errors.title}
            maxLength={200}
            required
          />
          <Textarea
            label="Description and objective"
            placeholder="What the session aims to achieve"
            hint="Optional"
            value={values.description}
            onChange={(e) => onChange('description', e.target.value)}
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="session-track"
                className="font-sans text-small font-semibold text-text-primary"
              >
                Track
              </label>
              <select
                id="session-track"
                value={values.pillar}
                onChange={(e) => onChange('pillar', e.target.value as SessionPillarChoice)}
                aria-describedby="session-track-hint"
                className="h-control w-full rounded-control border border-border-strong bg-surface px-3 font-sans text-body text-text-primary disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:text-disabled-text"
              >
                <option value="none">No track</option>
                <option value="ict">{PILLAR_LABELS.ict}</option>
                {OTHER_PILLARS.map((pillar) => (
                  <option key={pillar} value={pillar} disabled>
                    {PILLAR_LABELS[pillar]} ({NOT_YET.toLowerCase()})
                  </option>
                ))}
              </select>
              <p id="session-track-hint" className="font-sans text-caption text-text-muted">
                Only ICT can be saved for now. The other pillars: {NOT_YET.toLowerCase()}.
              </p>
            </div>
            <Select
              label="Session type"
              options={SESSION_TYPES.map((t) => ({ value: t, label: t }))}
              placeholder="Choose a type"
              value=""
              onChange={() => undefined}
              disabled
              hint={NOT_YET}
            />
          </div>
          {values.pillar === 'ict' && (
            <Select
              label="ICT track"
              options={ictTracks.map((t) => ({ value: t, label: t }))}
              placeholder={
                ictTracks.length ? 'Choose an ICT track' : 'No ICT tracks in this cohort'
              }
              value={values.ictTrack}
              onChange={(e) => onChange('ictTrack', e.target.value)}
              error={errors.ictTrack}
              hint={ictTracks.length ? undefined : 'Add tracks on the ICT tracks page first.'}
            />
          )}
          <div className="flex flex-col gap-2">
            <span className="font-sans text-small font-semibold text-text-primary">Category</span>
            <SegmentedControl<SessionCategory>
              label="Category"
              options={CATEGORY_OPTIONS}
              value={values.category}
              onChange={(v) => onChange('category', v)}
              disabled={disabled}
            />
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Select
              label="KamiLimu month"
              options={[
                { value: '', label: 'From the start date' },
                ...months.map((b) => ({ value: String(b.month), label: monthLabel(b.month, b) })),
                ...(values.month && !months.some((b) => String(b.month) === values.month)
                  ? [{ value: values.month, label: `Month ${values.month}` }]
                  : []),
              ]}
              value={timeChanged ? '' : values.month}
              onChange={(e) => onChange('month', e.target.value)}
              disabled={timeChanged}
              hint={timeChanged ? 'Worked out from the new start date' : undefined}
            />
            <Input
              label="Start"
              type="datetime-local"
              value={values.start}
              onChange={(e) => onChange('start', e.target.value)}
              error={errors.start}
            />
            <Input
              label="End"
              type="datetime-local"
              value={values.end}
              onChange={(e) => onChange('end', e.target.value)}
              error={errors.end}
            />
          </div>
          {values.category === 'peer_mentorship' ? (
            <Input
              label="Attendance deadline"
              type="datetime-local"
              value={values.attendanceDeadline}
              onChange={(e) => onChange('attendanceDeadline', e.target.value)}
              error={errors.attendanceDeadline}
              hint="Optional. When peer mentorship attendance closes."
            />
          ) : (
            <p className="font-sans text-small text-text-secondary">
              Attendance opens at the start time and closes after the cohort&apos;s attendance
              window.
            </p>
          )}
          {isEdit && timeChanged && (
            <>
              <Notice variant="warning">
                Changing the date or time reschedules the session. Everyone enrolled and the
                assigned mentors get an email, the attendance window moves with it, and the change
                is recorded in the audit trail.
              </Notice>
              <Textarea
                label="Reason for the change"
                placeholder="Shown in the email and the audit trail"
                value={values.rescheduleReason}
                onChange={(e) => onChange('rescheduleReason', e.target.value)}
                error={errors.rescheduleReason}
                hint="Only needed when you change the date or time"
                maxLength={500}
              />
            </>
          )}
          <div className="flex flex-col gap-2">
            <span className="font-sans text-small font-semibold text-text-primary">Location</span>
            <SegmentedControl<SessionMode>
              label="Location"
              options={
                values.mode === 'hybrid'
                  ? [...MODE_OPTIONS, { value: 'hybrid', label: 'Hybrid' }]
                  : MODE_OPTIONS
              }
              value={values.mode}
              onChange={(v) => onChange('mode', v)}
              disabled={disabled}
            />
          </div>
          <Input
            label={values.mode === 'physical' ? 'Venue' : 'Meeting link'}
            value={values.location}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder={values.mode === 'physical' ? 'Where the session happens' : 'https://'}
          />
        </fieldset>
      </Card>

      <div className="flex flex-col gap-5 lg:col-span-2">
        <Card title="Points and mentors">
          <fieldset disabled={disabled} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="font-sans text-small font-semibold text-text-primary">Points</span>
              <SegmentedControl
                label="Points"
                options={pointOptions(values.points)}
                value={String(values.points)}
                onChange={(v) => onChange('points', Number(v))}
                disabled={disabled}
              />
            </div>
            <MentorPicker
              mentors={mentors}
              isLoading={mentorsLoading}
              error={mentorsError}
              leadId={values.leadMentorId}
              coMentorIds={values.coMentorIds}
              onLeadChange={(id) => onChange('leadMentorId', id)}
              onCoMentorsChange={(ids) => onChange('coMentorIds', ids)}
              disabled={disabled}
            />
          </fieldset>
        </Card>
        <Card title="Resources">
          <fieldset disabled={disabled}>
            <Input
              label="Resource link"
              type="url"
              value={values.resourceUrl}
              onChange={(e) => onChange('resourceUrl', e.target.value)}
              placeholder="https://drive.google.com/"
              hint="A Google Drive folder for the session materials"
              error={errors.resourceUrl}
            />
          </fieldset>
        </Card>
        {aside}
      </div>
    </div>
  )
}
