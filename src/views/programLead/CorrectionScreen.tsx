import type { FormEvent } from 'react'
import { NoCohortNotice } from '@/components/layout/NoCohortNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Select } from '@/components/ui/Select'
import { Steps } from '@/components/ui/Steps'
import { Textarea } from '@/components/ui/Textarea'
import type { CorrectedResult, CorrectionDraft, UseCorrectionReturn } from '@/hooks/useGraduation'
import { PROGRAM_LEAD_ROUTES } from '@/lib/adminRoutes'
import type { GraduationPreviewView } from '@/types/graduation'

interface CorrectionScreenProps {
  // null until the data loads
  data: GraduationPreviewView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  hasCohort?: boolean
  draft: CorrectionDraft
  onChange: (changes: Partial<CorrectionDraft>) => void
  selected: UseCorrectionReturn['selected']
  errors: UseCorrectionReturn['errors']
  canSave: boolean
  onSave: () => void
}

const RESULTS: { value: CorrectedResult; label: string }[] = [
  { value: 'graduated', label: 'Graduated' },
  { value: 'not_graduated', label: 'Did not graduate' },
]

// Correcting one confirmed graduation result, with a reason and the Program Lead's
// password (PL-Correction). Recorded alongside the original, never over it. This only
// draws the screen; the API can't record corrections yet.
export function CorrectionScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  hasCohort = true,
  draft,
  onChange,
  selected,
  errors,
  canSave,
  onSave,
}: CorrectionScreenProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSave()
  }
  const name = selected?.name ?? 'The mentee'

  return (
    <>
      <BackLink href={PROGRAM_LEAD_ROUTES.graduation}>Back to the graduation record</BackLink>
      <PageHeader
        title="Correct a graduation result"
        subtitle={
          data
            ? `${data.cohortName}${data.isGraduated ? ' has graduated' : ' has not graduated yet'}. Only the Program Lead can correct a result.`
            : undefined
        }
      />
      {!hasCohort ? (
        <NoCohortNotice />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading the graduation record" />
      ) : (
        <div className="grid items-start gap-4 md:gap-5 lg:grid-cols-3">
          <form onSubmit={handleSubmit} noValidate className="lg:col-span-2">
            <Card>
              <div className="flex flex-col gap-4">
                <Select
                  label="Mentee"
                  value={draft.menteeId}
                  onChange={(event) => onChange({ menteeId: event.target.value })}
                  options={[...data.graduates, ...data.nonGraduates]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((row) => ({ value: row.id, label: row.name }))}
                />
                {selected && (
                  <dl className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2 font-sans text-small">
                    <dt className="text-text-secondary">Current result</dt>
                    <dd>
                      <Chip variant={selected.graduated ? 'ok' : 'default'}>
                        {selected.graduated ? 'Graduated' : 'Did not graduate'}
                      </Chip>
                    </dd>
                    <dt className="text-text-secondary">Core attendance rate</dt>
                    <dd className="font-mono text-text-primary">
                      {Math.round(selected.coreRate)}%
                    </dd>
                    <dt className="text-text-secondary">Threshold</dt>
                    <dd className="font-mono text-text-primary">{data.threshold}%</dd>
                  </dl>
                )}
                <div className="flex flex-col gap-2">
                  <span className="font-sans text-small font-semibold text-text-primary">
                    Corrected result
                  </span>
                  <SegmentedControl
                    label="Corrected result"
                    options={RESULTS}
                    value={draft.result}
                    onChange={(result) => onChange({ result })}
                    variant="joined"
                  />
                </div>
                <Textarea
                  label="Reason"
                  placeholder="For example, an approved extension that was recorded after graduation"
                  hint="Required. Saved in the graduation record and the audit trail."
                  value={draft.reason}
                  onChange={(event) => onChange({ reason: event.target.value })}
                  error={errors.reason}
                />
                <PasswordInput
                  label="Your password"
                  id="correction-password"
                  value={draft.password}
                  onChange={(event) => onChange({ password: event.target.value })}
                  error={errors.password}
                  autoComplete="current-password"
                />
                <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center">
                  <ButtonLink href={PROGRAM_LEAD_ROUTES.graduation} variant="secondary">
                    Cancel
                  </ButtonLink>
                  <Button type="submit" disabled={!canSave}>
                    Record correction
                  </Button>
                  {!canSave && (
                    <span className="font-sans text-caption text-text-muted">
                      Not available yet
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </form>
          <Card title="What the correction does">
            <Steps
              steps={[
                {
                  title: draft.result === 'graduated' ? 'Alumni status' : 'A private result',
                  description:
                    draft.result === 'graduated'
                      ? `${name} gets alumni status and sees their graduation card on their next sign in.`
                      : `${name} loses alumni status and sees their final result privately.`,
                },
                {
                  title: 'The record',
                  description:
                    'The graduation record shows the new count and the correction, with your name, the time and the reason.',
                },
                {
                  title: 'The history',
                  description: 'The original result stays in the history. Nothing is overwritten.',
                },
              ]}
            />
            <p className="mt-3 font-sans text-small text-text-muted">
              The graduation sequence doesn&apos;t change. Replays show the list as it was
              confirmed.
            </p>
          </Card>
        </div>
      )}
    </>
  )
}
