'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useActiveCohort } from '@/hooks/useActiveCohort'

// Shown in place of a cohort-scoped screen when there is no cohort to work on
export function NoCohortNotice() {
  const active = useActiveCohort()
  if (active.isLoading) return null
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface px-4 py-12 text-center shadow-card">
      <h2 className="font-mono text-card-title font-semibold text-text-primary">
        {active.error ? "Cohorts didn't load" : 'No cohort yet'}
      </h2>
      <p className="max-w-sm font-sans text-body text-text-secondary">
        {active.error ?? 'Create a cohort first. This page shows data for one cohort at a time.'}
      </p>
      {active.error ? (
        <Button variant="secondary" onClick={active.refresh}>
          Try again
        </Button>
      ) : (
        <Link
          href="/admin/cohorts/new"
          className="inline-flex h-control items-center rounded-control border border-teal-500 bg-teal-500 px-4 font-mono text-small font-semibold text-text-on-primary no-underline hover:bg-teal-300 hover:no-underline"
        >
          New cohort
        </Link>
      )}
    </div>
  )
}
