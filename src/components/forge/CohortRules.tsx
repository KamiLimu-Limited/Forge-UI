'use client'

import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import type { useCohortForm } from '@/hooks/useCohortForm'
import { POINT_FIELDS, type useCohortRules } from '@/hooks/useCohortRules'
import type { RatingPoint } from '@/types/cohort'

interface CohortRulesProps {
  form: ReturnType<typeof useCohortForm>
  rules: ReturnType<typeof useCohortRules>
  // "create" shows the points card; "settings" adds windows and rating questions
  variant: 'create' | 'settings'
}

const NOT_YET = 'Not available yet'

const WINDOW_LABELS: Record<RatingPoint, string> = { start: 'Start', mid: 'Mid', end: 'End' }

const QUESTION_LABELS = [
  'Reaction 1',
  'Reaction 2',
  'Reaction 3',
  'Learning 1',
  'Learning 2',
  'Learning 3',
  'Intended behaviour 1',
  'Intended behaviour 2',
  'Intended behaviour 3',
]

// Extra activity points, the logging and objective rating windows, and the nine session
// rating questions. The logging window and per-role event points have no API field yet, so
// those controls are disabled. See docs/api-gaps.md.
export function CohortRules({ form, rules, variant }: CohortRulesProps) {
  const disabled = form.isSaving
  const { objectiveWindows } = form.values

  const setWindow = (point: RatingPoint, part: 'opens' | 'closes', value: string) =>
    form.setField('objectiveWindows', {
      ...objectiveWindows,
      [point]: { ...objectiveWindows[point], [part]: value },
    })

  return (
    <>
      <Card title="Extra activity points">
        {rules.isLoading ? (
          <LoadingState label="Loading points" />
        ) : rules.loadError ? (
          <ErrorState message={rules.loadError} />
        ) : (
          <fieldset disabled={disabled} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {POINT_FIELDS.map((field) => (
              <Input
                key={field.key}
                label={field.label}
                placeholder="Points"
                inputMode="numeric"
                value={field.unavailable ? '' : rules.points[field.key]}
                onChange={(e) => rules.setPoint(field.key, e.target.value)}
                error={rules.pointErrors[field.key]}
                disabled={field.unavailable}
                hint={field.unavailable ? NOT_YET : undefined}
              />
            ))}
          </fieldset>
        )}
      </Card>
      {variant === 'settings' && (
        <>
          <Card title="Logging and rating windows">
            <fieldset disabled={disabled} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Extra activity logging opens" type="date" disabled hint={NOT_YET} />
                <Input label="Extra activity logging closes" type="date" disabled hint={NOT_YET} />
              </div>
              {(['start', 'mid', 'end'] as RatingPoint[]).map((point) => (
                <div key={point} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label={`Objectives ${WINDOW_LABELS[point]}: opens`}
                    type="date"
                    value={objectiveWindows[point].opens}
                    onChange={(e) => setWindow(point, 'opens', e.target.value)}
                  />
                  <Input
                    label="Closes"
                    type="date"
                    value={objectiveWindows[point].closes}
                    onChange={(e) => setWindow(point, 'closes', e.target.value)}
                  />
                </div>
              ))}
              {form.errors.objectiveWindows && (
                <p role="alert" className="font-sans text-caption text-danger-text">
                  {form.errors.objectiveWindows}
                </p>
              )}
            </fieldset>
          </Card>
          <Card
            title="Session rating questions"
            action={<span className="font-sans text-caption text-text-muted">Rated 1 to 5</span>}
          >
            {rules.isLoading ? (
              <LoadingState label="Loading questions" />
            ) : rules.loadError ? (
              <ErrorState message={rules.loadError} />
            ) : (
              <fieldset disabled={disabled} className="flex flex-col gap-3">
                {rules.questionError && <Notice variant="danger">{rules.questionError}</Notice>}
                {rules.questions.map((text, index) => (
                  <Input
                    key={QUESTION_LABELS[index] ?? index}
                    label={QUESTION_LABELS[index] ?? `Question ${index + 1}`}
                    placeholder="Question wording"
                    maxLength={300}
                    value={text}
                    onChange={(e) => rules.setQuestion(index, e.target.value)}
                  />
                ))}
              </fieldset>
            )}
          </Card>
        </>
      )}
    </>
  )
}
