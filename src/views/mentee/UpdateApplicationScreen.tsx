import type { FormEvent } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { APPLICATION_STAGES } from '@/lib/activityForms'
import { plural } from '@/lib/format'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import type { OpportunityOutcome } from '@/types/activity'
import type { ApplicationView } from '@/types/menteeActivities'

const NOT_AVAILABLE = 'Not available yet'

interface UpdateApplicationScreenProps {
  // null until the data loads
  application: ApplicationView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  stage: OpportunityOutcome
  onStageChange: (stage: OpportunityOutcome) => void
  onSave: () => void
  isSaving?: boolean
  saveError?: string | null
}

// Moves an application to its next stage. The API only allows this before review.
export function UpdateApplicationScreen({
  application,
  isLoading = false,
  error = null,
  onRetry,
  stage,
  onStageChange,
  onSave,
  isSaving = false,
  saveError = null,
}: UpdateApplicationScreenProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSave()
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <BackLink href={MENTEE_ROUTES.activities}>Back to activities</BackLink>
      <PageHeader title="Update application" />
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !application ? (
        <LoadingState label="Loading this application" />
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-3 lg:gap-5">
          <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
            <Card>
              <p className="font-sans text-body font-semibold text-text-primary">
                {application.kind === 'job'
                  ? `${application.organization}, ${application.title}`
                  : application.title}
              </p>
              <p className="font-sans text-small text-text-secondary">
                {application.kind === 'job' ? 'Job application' : 'Scholarship application'},{' '}
                {plural(application.points, 'point')}
              </p>
            </Card>
            <form onSubmit={handleSubmit}>
              <Card>
                <div className="flex flex-col gap-4">
                  {!application.canUpdate && (
                    <Notice>This application has been reviewed, so it can no longer change.</Notice>
                  )}
                  <Select
                    label="Application stage"
                    options={APPLICATION_STAGES}
                    value={stage}
                    disabled={!application.canUpdate}
                    onChange={(event) => onStageChange(event.target.value as OpportunityOutcome)}
                  />
                  <Select
                    label="Final outcome"
                    options={[]}
                    placeholder="Choose an outcome"
                    value=""
                    disabled
                    hint={NOT_AVAILABLE}
                  />
                  <Textarea
                    label="Personal notes"
                    placeholder="Only you can see these"
                    disabled
                    hint={NOT_AVAILABLE}
                  />
                  {saveError && <Notice variant="danger">{saveError}</Notice>}
                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    isLoading={isSaving}
                    disabled={!application.canUpdate}
                  >
                    Save changes
                  </Button>
                </div>
              </Card>
            </form>
          </div>
          <Card title="Stage history">
            <p className="font-sans text-small text-text-muted">{NOT_AVAILABLE}</p>
          </Card>
        </div>
      )}
    </div>
  )
}
