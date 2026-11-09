import { RatingBar } from '@/components/forge/RatingBar'
import { Card } from '@/components/ui/Card'
import { plural } from '@/lib/format'
import type { FeedbackGroupView } from '@/types/peerMentor'

interface FeedbackSummaryProps {
  groups: FeedbackGroupView[]
  // Shown without names
  feedback: string[]
  // Shown large in the header when given
  average?: number | null
  // Shows "3 responses" beside Written feedback
  showResponseCount?: boolean
}

// A group's average per question and their written feedback for one session
export function FeedbackSummary({
  groups,
  feedback,
  average,
  showResponseCount = false,
}: FeedbackSummaryProps) {
  return (
    <>
      <Card
        title="Average per question"
        action={
          typeof average === 'number' ? (
            <span className="font-mono text-stat font-semibold text-text-primary">
              {average.toFixed(1)}
            </span>
          ) : undefined
        }
      >
        <div className="flex flex-col gap-5">
          {groups.map((group) => (
            <section key={group.label} className="flex flex-col gap-3">
              <h3 className="font-sans text-small text-text-secondary">{group.label}</h3>
              {group.questions.map((question) => (
                <RatingBar key={question.label} label={question.label} average={question.average} />
              ))}
            </section>
          ))}
        </div>
      </Card>
      <Card
        title="Written feedback"
        action={
          showResponseCount && feedback.length > 0 ? (
            <span className="font-sans text-caption text-text-muted">
              {plural(feedback.length, 'response')}
            </span>
          ) : undefined
        }
      >
        {feedback.length === 0 ? (
          <p className="font-sans text-small text-text-muted">No written feedback yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {feedback.map((text, index) => (
              <li
                key={index}
                className="rounded-control bg-background px-4 py-3 font-sans text-body text-text-primary"
              >
                <q>{text}</q>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
