'use client'

import { NoCohortNotice } from '@/components/layout/NoCohortNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { CohortFormFields } from '@/components/forge/CohortFormFields'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { useCohortDetail } from '@/hooks/useCohortDetail'
import { useCohortForm } from '@/hooks/useCohortForm'
import { useToast } from '@/hooks/useToast'

export function CohortSettingsPage() {
  const { showToast } = useToast()
  const active = useActiveCohort()
  const detail = useCohortDetail(active.cohortId)
  const form = useCohortForm(detail.data)

  const save = async () => {
    const saved = await form.save()
    if (!saved || !detail.data) return
    detail.setData({ ...detail.data, ...saved })
    active.refresh()
    showToast('Cohort settings saved.')
  }

  if (!active.isLoading && !active.cohortId) {
    return (
      <>
        <PageHeader title="Cohort settings" />
        <NoCohortNotice />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Cohort settings"
        subtitle={`These values apply to ${active.cohort?.name ?? 'this cohort'} only.`}
        action={
          detail.data && (
            <Button onClick={() => void save()} isLoading={form.isSaving} disabled={!form.isDirty}>
              Save changes
            </Button>
          )
        }
      />
      {detail.isLoading || active.isLoading ? (
        <LoadingState label="Loading settings" />
      ) : detail.error || !detail.data ? (
        <ErrorState
          message={detail.error ?? "We couldn't find this cohort."}
          onRetry={detail.refetch}
        />
      ) : (
        <>
          {form.saveError && <Notice variant="danger">{form.saveError}</Notice>}
          {detail.data.status === 'completed' && (
            <Notice variant="warning">
              This cohort is archived. Change its status to edit it again.
            </Notice>
          )}
          <CohortFormFields form={form} variant="settings" />
        </>
      )}
    </>
  )
}
