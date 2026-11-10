'use client'

import { useState } from 'react'
import { NoCohortNotice } from '@/components/layout/NoCohortNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { Icon } from '@/components/ui/Icon'
import { LoadingState } from '@/components/ui/LoadingState'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { RevealMode } from '@/hooks/useGraduation'
import { PROGRAM_LEAD_ROUTES } from '@/lib/adminRoutes'
import type { GraduateRow, GraduationPreviewView } from '@/types/graduation'

const FIRST_SHOWN = 6

interface RevealOrderScreenProps {
  // null until the data loads
  data: GraduationPreviewView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  hasCohort?: boolean
  mode: RevealMode
  onModeChange: (mode: RevealMode) => void
  order: GraduateRow[]
  onMove: (id: string, step: -1 | 1) => void
  // Keeps the order in this browser and opens the rehearsal
  onRehearse: () => void
}

const MODES: { value: RevealMode; label: string }[] = [
  { value: 'alphabetical', label: 'Alphabetical' },
  { value: 'custom', label: 'Custom' },
]

function moveButtonClasses(): string {
  return 'flex size-control items-center justify-center rounded-md border border-border text-text-primary hover:bg-background disabled:cursor-not-allowed disabled:text-disabled-text'
}

// The order graduates appear in before the sequence plays (PL-RevealOrder).
export function RevealOrderScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  hasCohort = true,
  mode,
  onModeChange,
  order,
  onMove,
  onRehearse,
}: RevealOrderScreenProps) {
  const [showAll, setShowAll] = useState(false)
  const shown = showAll ? order : order.slice(0, FIRST_SHOWN)
  const isCustom = mode === 'custom'

  return (
    <>
      <PageHeader
        title="Graduation sequence"
        action={
          <div className="flex flex-wrap items-start gap-3">
            <ButtonLink href={PROGRAM_LEAD_ROUTES.graduation} variant="secondary">
              Back to preview
            </ButtonLink>
            {data && (
              <Button variant="secondary" onClick={onRehearse}>
                Rehearse this order
              </Button>
            )}
            <div className="flex flex-col gap-1">
              <Button disabled>Save and start</Button>
              <span className="font-sans text-caption text-text-muted">Not available yet</span>
            </div>
          </div>
        }
      />
      {!hasCohort ? (
        <NoCohortNotice />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading the graduates" />
      ) : (
        <div className="grid items-start gap-4 md:gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card
              title="Reveal order"
              action={
                <SegmentedControl
                  label="Order"
                  options={MODES}
                  value={mode}
                  onChange={onModeChange}
                />
              }
            >
              {order.length === 0 ? (
                <p className="font-sans text-small text-text-muted">No graduates in the preview</p>
              ) : (
                <div className="flex flex-col gap-3">
                  <ol className="flex flex-col">
                    {shown.map((row, index) => (
                      <li
                        key={row.id}
                        className="flex items-center gap-3 border-b border-border py-2 last:border-b-0"
                      >
                        <span className="w-8 shrink-0 text-center font-mono text-small font-semibold text-text-secondary">
                          {index + 1}
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate font-sans text-body font-semibold text-text-primary">
                            {row.name}
                          </span>
                          <span className="font-sans text-caption text-text-muted">
                            {row.university ?? 'University not available yet'}
                          </span>
                        </span>
                        {isCustom && (
                          <span className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              className={moveButtonClasses()}
                              aria-label={`Move ${row.name} up`}
                              disabled={index === 0}
                              onClick={() => onMove(row.id, -1)}
                            >
                              <Icon name="chevron-up" />
                            </button>
                            <button
                              type="button"
                              className={moveButtonClasses()}
                              aria-label={`Move ${row.name} down`}
                              disabled={index === order.length - 1}
                              onClick={() => onMove(row.id, 1)}
                            >
                              <Icon name="chevron-down" />
                            </button>
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                  {order.length > FIRST_SHOWN && (
                    <Button variant="secondary" size="sm" onClick={() => setShowAll((all) => !all)}>
                      {showAll ? 'Show fewer' : `Show all ${order.length} graduates`}
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </div>
          <Card title="What plays">
            <ol className="flex flex-col font-sans text-small">
              {[
                ['Opening', data.cohortName],
                ['The programme in numbers', 'Totals'],
                ['Graduate reveal', `${order.length} graduates`],
                ['Thank you to the mentors', 'Peer and professional mentors'],
                ['Closing', 'Cohort name and logo'],
              ].map(([part, detail], index) => (
                <li
                  key={part}
                  className="flex justify-between gap-3 border-b border-border py-2 last:border-b-0"
                >
                  <span className="text-text-primary">
                    {index + 1}. {part}
                  </span>
                  <span className="text-text-muted">{detail}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 font-sans text-small text-text-muted">
              Non-graduates never appear in the sequence.
            </p>
          </Card>
        </div>
      )}
    </>
  )
}
