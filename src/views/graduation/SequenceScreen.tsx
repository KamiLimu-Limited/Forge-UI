'use client'

import type { ReactNode } from 'react'
import { KamiLimuLogo } from '@/components/layout/KamiLimuLogo'
import { ErrorState } from '@/components/ui/ErrorState'
import { Icon, type IconName } from '@/components/ui/Icon'
import { LoadingState } from '@/components/ui/LoadingState'
import { useCountUp } from '@/hooks/useCountUp'
import { cx } from '@/lib/cx'
import { formatCount, formatLongDate } from '@/lib/format'
import type { SequenceStep, SequenceView } from '@/types/graduation'

interface SequenceScreenProps {
  // null until the data loads
  data: SequenceView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  step: SequenceStep | null
  index: number
  count: number
  isPlaying: boolean
  reducedMotion: boolean
  isFullscreen: boolean
  onNext: () => void
  onPrevious: () => void
  onTogglePlay: () => void
  onReplay: () => void
  onToggleFullscreen: () => void
}

const WORDS = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
]

function monthsPhrase(months: number): string {
  if (months <= 0) return 'Months'
  return `${WORDS[months] ?? String(months)} month${months === 1 ? '' : 's'}`
}

// Fixed spots so the confetti looks the same on every screen and every replay
const CONFETTI = [
  [9, 0.0, 'bg-teal-500'],
  [20, 1.1, 'bg-gamboge'],
  [16, 2.3, 'bg-ivory'],
  [7, 3.0, 'bg-teal-300'],
  [30, 0.6, 'bg-auburn'],
  [70, 0.3, 'bg-teal-500'],
  [81, 1.6, 'bg-ivory'],
  [88, 2.7, 'bg-gamboge'],
  [93, 0.9, 'bg-teal-300'],
  [76, 3.4, 'bg-auburn'],
  [42, 2.0, 'bg-teal-300'],
  [58, 1.3, 'bg-gamboge'],
] as const

function Confetti() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden motion-safe:block"
    >
      {CONFETTI.map(([left, delay, colour], index) => (
        <i
          key={index}
          className={cx('absolute -top-8 block h-5 w-2.5 rounded-sm animate-seq-fall', colour)}
          style={{ left: `${left}%`, animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  )
}

function Figure({
  value,
  label,
  run,
  reduced,
}: {
  value: number
  label: string
  run: boolean
  reduced: boolean
}) {
  const shown = useCountUp(value, run, reduced)
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-mono text-seq-number font-bold leading-none text-teal-300 tabular-nums">
        {formatCount(shown)}
      </span>
      <span className="font-sans text-seq-body text-ivory">{label}</span>
    </div>
  )
}

function Part({
  data,
  step,
  reducedMotion,
}: {
  data: SequenceView
  step: SequenceStep
  reducedMotion: boolean
}) {
  switch (step.kind) {
    case 'opening':
      return (
        <div className="flex flex-col items-center gap-5">
          <h1 className="font-mono text-seq-hero font-bold leading-none text-ivory">
            {data.cohortName}
          </h1>
          <p className="font-sans text-seq-lead text-teal-100">
            {formatLongDate(data.startDate)} to {formatLongDate(data.endDate)}
          </p>
          <p className="mt-3 max-w-3xl font-sans text-seq-body text-teal-100">
            {monthsPhrase(data.months)} of sessions, mentorship and hard work. Today we celebrate
            the people who saw it through.
          </p>
        </div>
      )
    case 'numbers':
      return (
        <div className="flex w-full max-w-6xl flex-col items-center gap-14">
          <h1 className="font-mono text-seq-title font-semibold text-ivory">
            The programme in numbers
          </h1>
          <div className="grid w-full grid-cols-2 gap-10 md:grid-cols-5">
            {data.numbers.map((figure) => (
              <Figure
                key={figure.label}
                value={figure.value}
                label={figure.label}
                run
                reduced={reducedMotion}
              />
            ))}
          </div>
        </div>
      )
    case 'reveal': {
      const graduate = data.graduates[step.index]
      return (
        <>
          <Confetti />
          <div className="relative flex flex-col items-center gap-4">
            <p className="font-sans text-seq-lead text-teal-100">Congratulations</p>
            <h1 className="max-w-5xl font-mono text-seq-hero font-bold leading-tight text-ivory">
              {graduate?.name}
            </h1>
            {graduate?.university && (
              <p className="font-sans text-seq-lead text-teal-100">{graduate.university}</p>
            )}
          </div>
        </>
      )
    }
    case 'mentors':
      return (
        <div className="flex w-full max-w-6xl flex-col items-center gap-12">
          <h1 className="font-mono text-seq-title font-semibold text-ivory">
            Thank you to the mentors
          </h1>
          <ul
            className={cx(
              'grid w-full grid-cols-2 gap-x-16 gap-y-9',
              data.mentors.length > 9 ? 'md:grid-cols-4' : 'md:grid-cols-3'
            )}
          >
            {data.mentors.map((mentor) => (
              <li key={`${mentor.name}-${mentor.role}`} className="flex flex-col gap-1">
                <span className="font-sans text-seq-lead font-semibold text-ivory">
                  {mentor.name}
                </span>
                <span className="font-sans text-seq-body text-teal-100">{mentor.role}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    case 'closing':
      return (
        <div className="flex flex-col items-center gap-8">
          <h1 className="font-mono text-seq-hero font-bold leading-none text-ivory">
            {data.cohortName}
          </h1>
          <KamiLimuLogo tone="light" className="w-64 md:w-80" />
        </div>
      )
  }
}

function Control({ label, icon, onClick }: { label: string; icon: IconName; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-control items-center justify-center rounded-full text-ivory hover:bg-teal-500 hover:text-text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300"
    >
      <Icon name={icon} />
    </button>
  )
}

function Stage({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-teal-900 px-6 py-24 text-center text-ivory">
      {children}
    </main>
  )
}

// The graduation sequence, made to be projected (Seq-1 to Seq-5).
export function SequenceScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  step,
  index,
  count,
  isPlaying,
  reducedMotion,
  isFullscreen,
  onNext,
  onPrevious,
  onTogglePlay,
  onReplay,
  onToggleFullscreen,
}: SequenceScreenProps) {
  if (error || isLoading || !data || !step) {
    return (
      <Stage>
        <div className="w-full max-w-md rounded-xl bg-surface p-6 text-left shadow-card">
          {error ? (
            <ErrorState message={error} onRetry={onRetry} />
          ) : (
            <LoadingState label="Loading the graduation sequence" />
          )}
        </div>
      </Stage>
    )
  }
  const isClosing = step.kind === 'closing'
  return (
    <Stage>
      {data.isRehearsal && (
        <p
          role="status"
          className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-warning-bg px-4 py-1 font-sans text-small font-semibold text-warning-text"
        >
          Rehearsal, from the live graduation report
        </p>
      )}
      <div
        key={index}
        className={cx(
          'flex w-full flex-col items-center',
          step.kind === 'opening' ? 'motion-safe:animate-seq-dawn' : 'motion-safe:animate-seq-rise'
        )}
      >
        <Part data={data} step={step} reducedMotion={reducedMotion} />
      </div>
      <p className="sr-only" aria-live="polite">
        Part {index + 1} of {count}
      </p>
      <div
        role="group"
        aria-label="Sequence controls"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-teal-700 p-1.5"
      >
        <Control label="Previous" icon="chevron-left" onClick={onPrevious} />
        {isClosing ? (
          <Control label="Replay" icon="replay" onClick={onReplay} />
        ) : (
          <>
            <Control
              label={isPlaying ? 'Pause' : 'Play'}
              icon={isPlaying ? 'pause' : 'play'}
              onClick={onTogglePlay}
            />
            <Control label="Next" icon="chevron-right" onClick={onNext} />
          </>
        )}
        <Control
          label={isFullscreen ? 'Leave full screen' : 'Full screen'}
          icon={isFullscreen ? 'minimize' : 'maximize'}
          onClick={onToggleFullscreen}
        />
      </div>
    </Stage>
  )
}
