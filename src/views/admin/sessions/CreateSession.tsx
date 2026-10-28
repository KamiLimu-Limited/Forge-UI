'use client'

import { useRouter } from 'next/navigation'
import { SessionForm } from '@/components/forge/SessionForm'
import { NoCohortNotice } from '@/components/layout/NoCohortNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { useMentorOptions } from '@/hooks/useMentorOptions'
import { useSessionEditor } from '@/hooks/useSessionEditor'
import { useToast } from '@/hooks/useToast'

export function CreateSessionPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const { cohort, cohortId, isLoading } = useActiveCohort()
  const editor = useSessionEditor({ cohort })
  const mentors = useMentorOptions(cohortId)

  const submit = async (publish: boolean) => {
    const result = await editor.save(publish)
    if (!result.ok) return
    showToast(result.message)
    router.push(result.session ? `/admin/sessions/${result.session.id}` : '/admin/sessions')
  }

  return (
    <>
      <BackLink href="/admin/sessions">Back to the calendar</BackLink>
      <PageHeader
        title="New session"
        subtitle={
          cohort
            ? `${cohort.name}. Drafts are visible only to admins until you publish them.`
            : 'Drafts are visible only to admins until you publish them.'
        }
        action={
          cohort && (
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => void submit(false)}
                disabled={editor.isSaving}
              >
                Save as draft
              </Button>
              <Button onClick={() => void submit(true)} isLoading={editor.isSaving}>
                Publish
              </Button>
            </div>
          )
        }
      />
      {isLoading ? (
        <LoadingState label="Loading cohort" />
      ) : !cohort ? (
        <NoCohortNotice />
      ) : (
        <>
          {editor.saveError && <Notice variant="danger">{editor.saveError}</Notice>}
          <SessionForm
            values={editor.values}
            errors={editor.errors}
            onChange={editor.setValue}
            cohort={cohort}
            mentors={mentors.mentors}
            mentorsLoading={mentors.isLoading}
            mentorsError={mentors.error}
            disabled={editor.isSaving}
          />
        </>
      )}
    </>
  )
}
