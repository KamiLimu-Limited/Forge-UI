import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface CohortRulesUnavailableProps {
  // "create" shows the points card; "settings" adds windows and rating questions
  variant: 'create' | 'settings'
}

const NOT_YET = 'Not available yet'

const POINT_FIELDS = [
  'External event, participant',
  'External event, speaker',
  'External event, organizer',
  'KamiLimu to Academia',
  'Consultation session',
  'Application, Applied',
  'Application, interview stage',
  'Application, Offer Made',
]

const RATING_QUESTIONS = [
  'Reaction 1',
  'Reaction 2',
  'Reaction 3',
  'Learning 1',
  'Learning 2',
  'Intended behaviour 1',
  'Intended behaviour 2',
  'Intended behaviour 3',
  'Intended behaviour 4',
]

// Cohort rules from the design that the API has no fields for yet.
// Every control is disabled and nothing here is saved. See docs/api-gaps.md.
export function CohortRulesUnavailable({ variant }: CohortRulesUnavailableProps) {
  return (
    <>
      <Card
        title="Extra activity points"
        action={<span className="font-sans text-caption text-text-muted">{NOT_YET}</span>}
      >
        <fieldset disabled className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {POINT_FIELDS.map((label) => (
            <Input key={label} label={label} placeholder="Points" inputMode="numeric" />
          ))}
        </fieldset>
      </Card>
      {variant === 'settings' && (
        <>
          <Card
            title="Logging and rating windows"
            action={<span className="font-sans text-caption text-text-muted">{NOT_YET}</span>}
          >
            <fieldset disabled className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Extra activity logging opens" type="date" />
                <Input label="Extra activity logging closes" type="date" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input label="Objectives: Start" type="date" />
                <Input label="Mid" type="date" />
                <Input label="End" type="date" />
              </div>
            </fieldset>
          </Card>
          <Card
            title="Session rating questions"
            action={
              <span className="font-sans text-caption text-text-muted">
                Rated 1 to 5. {NOT_YET}
              </span>
            }
          >
            <fieldset disabled className="flex flex-col gap-3">
              {RATING_QUESTIONS.map((label) => (
                <Input key={label} label={label} placeholder="Question wording" />
              ))}
            </fieldset>
          </Card>
        </>
      )}
    </>
  )
}
