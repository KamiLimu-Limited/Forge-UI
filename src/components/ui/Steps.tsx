import { cx } from '@/lib/cx'
import { Icon } from './Icon'

export interface StepItem {
  title: string
  description: string
  done?: boolean
}

interface StepsProps {
  steps: StepItem[]
}

// A numbered list of steps. Finished steps show a green tick.
export function Steps({ steps }: StepsProps) {
  return (
    <ol className="flex flex-col gap-4">
      {steps.map((step, index) => (
        <li key={step.title} className="flex items-start gap-3">
          <span
            className={cx(
              'flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-caption font-semibold',
              step.done ? 'bg-success-bg text-success-text' : 'bg-accent-bg text-accent-text'
            )}
          >
            {step.done ? <Icon name="check" className="size-4" /> : index + 1}
            <span className="sr-only">{step.done ? `Step ${index + 1}, done` : ''}</span>
          </span>
          <div className="flex flex-col">
            <span className="font-sans text-body font-semibold text-text-primary">
              {step.title}
            </span>
            <span className="font-sans text-small text-text-secondary">{step.description}</span>
          </div>
        </li>
      ))}
    </ol>
  )
}
