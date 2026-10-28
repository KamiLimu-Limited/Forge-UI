'use client'

import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Notice } from '@/components/ui/Notice'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { useCohortForm } from '@/hooks/useCohortForm'
import { useToast } from '@/hooks/useToast'
import { CohortFormFields } from '@/components/forge/CohortFormFields'

export function CreateCohortPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const { refresh, setCohortId } = useActiveCohort()
  const form = useCohortForm(null)

  // Both buttons create a draft. "Create cohort" also switches to it and opens its settings.
  const create = async (openSettings: boolean) => {
    const cohort = await form.save('draft')
    if (!cohort) return
    refresh()
    showToast(`${cohort.name} created as a draft.`)
    if (openSettings) {
      setCohortId(cohort.id)
      router.push('/admin/settings')
    } else {
      router.push('/admin/cohorts')
    }
  }

  return (
    <>
      <BackLink href="/admin/cohorts">Back to all cohorts</BackLink>
      <PageHeader
        title="New cohort"
        subtitle="Starts as a draft. Mentees can't see it until you activate it."
        action={
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => void create(false)} disabled={form.isSaving}>
              Save as draft
            </Button>
            <Button onClick={() => void create(true)} isLoading={form.isSaving}>
              Create cohort
            </Button>
          </div>
        }
      />
      {form.saveError && <Notice variant="danger">{form.saveError}</Notice>}
      <CohortFormFields form={form} variant="create" />
    </>
  )
}
