'use client'

import { CohortRules } from './CohortRules'
import { MonthBoundariesEditor } from './MonthBoundariesEditor'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { useCohortForm } from '@/hooks/useCohortForm'
import type { useCohortRules } from '@/hooks/useCohortRules'
import { COHORT_STATUS_LABELS } from '@/lib/labels'
import type { CohortStatus } from '@/types/cohort'

interface CohortFormFieldsProps {
  form: ReturnType<typeof useCohortForm>
  rules: ReturnType<typeof useCohortRules>
  variant: 'create' | 'settings'
}

// The fields shared by New cohort and Cohort settings
export function CohortFormFields({ form, rules, variant }: CohortFormFieldsProps) {
  const { values, errors, setField } = form
  const disabled = form.isSaving

  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
      <div className="flex flex-col gap-5">
        <Card title="Cohort">
          <fieldset disabled={disabled} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input
                label="Cohort name"
                placeholder="For example, Cohort 12"
                value={values.name}
                onChange={(e) => setField('name', e.target.value)}
                error={errors.name}
              />
              {variant === 'create' ? (
                <Input label="Programme type" value="Undergraduate" readOnly disabled />
              ) : (
                <Select
                  label="Status"
                  options={(Object.keys(COHORT_STATUS_LABELS) as CohortStatus[])
                    .filter((s) => s !== 'archived' || values.status === 'archived')
                    .map((s) => ({ value: s, label: COHORT_STATUS_LABELS[s] }))}
                  value={values.status}
                  onChange={(e) => setField('status', e.target.value as CohortStatus)}
                  hint="Mentees see a cohort only once it is active"
                />
              )}
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input
                label="Start date"
                type="date"
                value={values.startDate}
                onChange={(e) => setField('startDate', e.target.value)}
                error={errors.startDate}
              />
              <Input
                label="End date"
                type="date"
                value={values.endDate}
                onChange={(e) => setField('endDate', e.target.value)}
                error={errors.endDate}
              />
            </div>
          </fieldset>
        </Card>

        <Card
          flush
          title="KamiLimu months"
          action={
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => form.addMonth(true)}
                disabled={disabled}
              >
                Add a break month
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => form.addMonth(false)}
                disabled={disabled}
              >
                Add month
              </Button>
            </div>
          }
        >
          <MonthBoundariesEditor
            months={values.months}
            onChange={form.setMonth}
            onRemove={form.removeMonth}
            error={errors.months}
            disabled={disabled}
          />
        </Card>

        <Card title="Attendance and graduation">
          <fieldset disabled={disabled} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input
              label="Graduation threshold"
              type="number"
              min={0}
              max={100}
              inputMode="numeric"
              value={values.graduationThreshold}
              onChange={(e) => setField('graduationThreshold', e.target.value)}
              error={errors.graduationThreshold}
              hint="Minimum core attendance rate, as a percentage"
            />
            <div className="hidden md:block" />
            <Input
              label="Thursday attendance window"
              type="number"
              min={1}
              max={336}
              inputMode="numeric"
              value={values.thursdayHours}
              onChange={(e) => setField('thursdayHours', e.target.value)}
              error={errors.thursdayHours}
              hint="Hours after the session ends"
            />
            <Input
              label="Saturday attendance window"
              type="number"
              min={1}
              max={336}
              inputMode="numeric"
              value={values.saturdayHours}
              onChange={(e) => setField('saturdayHours', e.target.value)}
              error={errors.saturdayHours}
              hint="Hours after the session ends"
            />
          </fieldset>
        </Card>
      </div>

      <div className="flex flex-col gap-5">
        <CohortRules form={form} rules={rules} variant={variant} />
        {variant === 'create' && (
          <Card title="Set up later">
            <p className="font-sans text-small text-text-secondary">
              ICT tracks, rosters, rating windows and the nine session rating questions are set once
              the cohort exists.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
