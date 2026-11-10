import { GraduationResultCard } from '@/components/forge/GraduationResultCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import type { GraduationResultView } from '@/types/graduation'

interface GraduationResultScreenProps {
  // null while loading, and when the cohort's result isn't final yet
  data: GraduationResultView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  // The past record: alumni history for a graduate, session history otherwise
  recordHref: string
}

// A mentee's final result once their cohort has graduated (MD-Result, MD-
// ResultNotGraduated). Only the mentee sees it.
export function GraduationResultScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  recordHref,
}: GraduationResultScreenProps) {
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  if (isLoading) return <LoadingState label="Loading your result" />
  if (!data) {
    return (
      <>
        <PageHeader title="Your result" />
        <Card>
          <EmptyState icon="star" title="No result yet" />
        </Card>
      </>
    )
  }
  const recordLabel = `View my ${data.cohortName} record`
  if (data.graduated) {
    return (
      <div className="flex flex-col gap-4 md:gap-5">
        <GraduationResultCard result={data} />
        <p className="font-sans text-body text-text-secondary">
          You now have alumni status. Your {data.cohortName} record stays available to you here.
        </p>
        <ButtonLink
          href={recordHref}
          variant="secondary"
          fullWidth
          className="md:w-auto md:self-start"
        >
          {recordLabel}
        </ButtonLink>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader title={`Your ${data.cohortName} result`} subtitle="Private to you." />
      <GraduationResultCard result={data} />
      <Card title="What happens now">
        <div className="flex flex-col gap-3">
          <p className="font-sans text-small text-text-secondary">
            Your {data.cohortName} record stays available here, including every session, activity
            and objective.
          </p>
          <p className="font-sans text-small text-text-secondary">
            If you think a record is wrong, talk to the System Admin. The Program Lead can correct a
            result after graduation.
          </p>
          <ButtonLink
            href={recordHref}
            variant="secondary"
            fullWidth
            className="md:w-auto md:self-start"
          >
            {recordLabel}
          </ButtonLink>
        </div>
      </Card>
    </div>
  )
}
