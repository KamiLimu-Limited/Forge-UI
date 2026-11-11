'use client'

import type { FormEvent } from 'react'
import { ObjectiveRatingRow } from '@/components/forge/ObjectiveRatingRow'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import { useObjectiveRatings } from '@/hooks/useObjectiveRatings'
import { cx } from '@/lib/cx'
import { OBJECTIVE_GROUPS } from '@/lib/menteeObjectives'
import type { MenteeObjectivesData } from '@/types/menteeObjectives'

const FORM_ID = 'objective-ratings'

interface ObjectivesScreenProps {
  // null until the data loads
  data: MenteeObjectivesData | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  onSave: (ratings: Record<string, number>) => void
  isSaving?: boolean
  saveError?: string | null
  onAddObjective: () => void
}

function openLine(data: MenteeObjectivesData): string {
  const { openWindow } = data
  if (!openWindow) return 'No rating window is open right now.'
  return openWindow.closesLabel
    ? `${openWindow.label} rating is open until ${openWindow.closesLabel}.`
    : `${openWindow.label} rating is open.`
}

export function ObjectivesScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  onSave,
  isSaving = false,
  saveError = null,
  onAddObjective,
}: ObjectivesScreenProps) {
  const form = useObjectiveRatings(data)
  const openWindow = data?.openWindow ?? null
  const saveLabel = openWindow ? `Save ${openWindow.label} ratings` : ''
  // Phones hide the scale once a rating is saved, as in the design, so nothing is left to save
  const hasUnrated =
    openWindow !== null &&
    (data?.objectives ?? []).some((objective) => objective.scores[openWindow.point] === null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (form.check()) onSave(form.ratings)
  }

  const saveButton = (fullWidth: boolean) => (
    <Button type="submit" form={FORM_ID} size="lg" fullWidth={fullWidth} isLoading={isSaving}>
      {saveLabel}
    </Button>
  )

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title="Objectives"
        subtitle={
          data ? (
            <>
              {openLine(data)}
              {data.openWindow && (
                <span className="hidden md:inline"> Rate each objective from 1 to 5.</span>
              )}
            </>
          ) : undefined
        }
        keepActionBeside
        action={
          <div className="flex items-start gap-2">
            <Button variant="secondary" size="sm" onClick={onAddObjective}>
              <span className="md:hidden">Add</span>
              <span className="hidden md:inline">Add objective</span>
            </Button>
            {openWindow && <div className="hidden md:block">{saveButton(false)}</div>}
          </div>
        }
      />
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading your objectives" />
      ) : data.objectives.length === 0 ? (
        <Card>
          <EmptyState
            icon="target"
            title="No objectives yet"
            action={<Button onClick={onAddObjective}>Add objective</Button>}
          />
        </Card>
      ) : (
        <form
          id={FORM_ID}
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4 md:gap-5"
        >
          {saveError && <Notice variant="danger">{saveError}</Notice>}
          {OBJECTIVE_GROUPS.map((group) => {
            const objectives = data.objectives.filter((objective) => objective.group === group)
            if (objectives.length === 0) return null
            return (
              <Card key={group} title={group}>
                <div className="hidden gap-4 pb-1 font-sans text-caption font-semibold text-text-secondary md:flex">
                  <span className="flex-1">Objective</span>
                  {data.windows.map((window) => (
                    <span
                      key={window.point}
                      className={cx('text-center', window.isOpen ? 'w-64' : 'w-20')}
                    >
                      {window.label}
                    </span>
                  ))}
                </div>
                {objectives.map((objective) => (
                  <ObjectiveRatingRow
                    key={objective.id}
                    objective={objective}
                    windows={data.windows}
                    value={form.ratings[objective.id]}
                    onChange={(value) => form.setRating(objective.id, value)}
                    error={
                      form.showErrors && form.ratings[objective.id] === undefined
                        ? 'Choose a rating'
                        : undefined
                    }
                  />
                ))}
              </Card>
            )
          })}
          {hasUnrated && <div className="md:hidden">{saveButton(true)}</div>}
        </form>
      )}
    </div>
  )
}
