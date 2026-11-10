'use client'

import type { FormEvent } from 'react'
import { ActivityFormField } from '@/components/forge/ActivityFormField'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Notice } from '@/components/ui/Notice'
import { useActivityForm } from '@/hooks/useActivityForm'
import { useParticipantRole } from '@/hooks/useParticipantRole'
import { cx } from '@/lib/cx'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import type { ActivityFormConfig } from '@/types/menteeActivities'

interface ActivityFormScreenProps {
  config: ActivityFormConfig
}

// One extra activity form, drawn from its settings in lib/activityForms.ts
export function ActivityFormScreen({ config }: ActivityFormScreenProps) {
  const form = useActivityForm(config)
  const { saveBlockedNote } = useParticipantRole()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    void form.save()
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <BackLink href={MENTEE_ROUTES.activities}>Back to activities</BackLink>
      <PageHeader title={config.title} subtitle={config.subtitle} />
      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid items-start gap-4 lg:grid-cols-3 lg:gap-5"
      >
        <div className="min-w-0 lg:col-span-2">
          <Card>
            <div className="grid gap-4 md:grid-cols-2">
              {config.fields.map((field) => (
                <div key={field.name} className={cx('min-w-0', !field.half && 'md:col-span-2')}>
                  <ActivityFormField
                    field={field}
                    value={form.values[field.name] ?? ''}
                    onChange={(value) => form.setValue(field.name, value)}
                    isMissing={form.missing.includes(field.name)}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="lg:sticky lg:top-6">
          <Card>
            <div className="flex flex-col gap-3">
              <p className="font-sans text-small text-text-secondary">
                The System Admin may reverse a log that doesn&apos;t qualify.
              </p>
              {form.error && <Notice variant="danger">{form.error}</Notice>}
              {saveBlockedNote && <Notice>{saveBlockedNote}</Notice>}
              <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={form.isSaving}
                disabled={Boolean(saveBlockedNote)}
              >
                {config.saveLabel}
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  )
}
