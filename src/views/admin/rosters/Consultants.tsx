'use client'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Notice } from '@/components/ui/Notice'
import { Select } from '@/components/ui/Select'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { ROSTER_TABS } from '@/components/layout/navConfig'
import { Tabs } from '@/components/ui/Tabs'

const CONSULTATION_TYPES = [
  'About KamiLimu',
  'AI, ML, and Data Science',
  'Communication and Public Speaking',
  'Cybersecurity',
  'Career and Employability',
  'Innovation and Entrepreneurship',
  'Software Engineering',
  'Personal Growth, Wellbeing, and Life Skills',
  'Personal Interest and Hobbies',
  'Postgrad, Scholarship and Academia',
]

const NOT_YET = 'Not available yet'

// The API has no consultant roster yet, so the list is empty and the form is disabled
export function ConsultantsPage() {
  const { cohort } = useActiveCohort()
  return (
    <>
      <PageHeader
        title="Rosters"
        subtitle={`The people mentees and sessions can be linked to in ${cohort?.name ?? 'this cohort'}.`}
      />
      <Tabs label="Roster" items={ROSTER_TABS} />
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
        <Card flush className="lg:col-span-2">
          <EmptyState
            icon="users"
            title="No consultants listed"
            description="The consultant roster is not available yet. Consultants will show here once the API stores them."
          />
        </Card>
        <Card title="Add a consultant">
          <fieldset disabled className="flex flex-col gap-5">
            <Input label="Name" placeholder="Full name" hint={NOT_YET} />
            <Select
              label="Consultation type"
              placeholder="Choose a type"
              options={CONSULTATION_TYPES.map((t) => ({ value: t, label: t }))}
              value=""
              onChange={() => undefined}
              hint={NOT_YET}
            />
            <p className="font-sans text-caption text-text-muted">
              Mentees pick from this list when they log a consultation. Consultants don&apos;t get
              an account.
            </p>
            <Button className="self-start" disabled>
              Add consultant
            </Button>
          </fieldset>
          <Notice variant="info" className="mt-4">
            Not available yet. Nothing is saved from this form.
          </Notice>
        </Card>
      </div>
    </>
  )
}
