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
import { useCohortRules } from '@/hooks/useCohortRules'
import { errorMessage } from '@/lib/errors'
import { useToast } from '@/hooks/useToast'

export function CohortSettingsPage() {
  const { showToast } = useToast()
  const active = useActiveCohort()
  const detail = useCohortDetail(active.cohortId)
  const form = useCohortForm(detail.data)
  const rules = useCohortRules(active.cohortId)

  const save = async () => {
    if (!rules.check() || !detail.data) return
    const saved = await form.save()
    if (!saved) return
    detail.setData({ ...detail.data, ...saved })
    active.refresh()
    try {
      await rules.save(detail.data.id)
      showToast('Cohort settings saved.')
    } catch (err: unknown) {
      showToast(
        `The cohort saved, but the points or questions didn't: ${errorMessage(err, 'try again.')}`,
        'error'
      )
    }
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
            <Button
              onClick={() => void save()}
              isLoading={form.isSaving}
              disabled={!form.isDirty && !rules.isDirty}
            >
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
          {detail.data.status === 'archived' && (
            <Notice variant="warning">This cohort is archived, so it is a read-only record.</Notice>
          )}
          <CohortFormFields form={form} rules={rules} variant="settings" />
        </>
      )}
    </>
  )
}
