import { Chip } from '@/components/ui/Chip'
import { Input } from '@/components/ui/Input'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { chipValues, toggleChip } from '@/lib/activityForms'
import { cx } from '@/lib/cx'
import type { ActivityField } from '@/types/menteeActivities'

const NOT_AVAILABLE = 'Not available yet'

interface ActivityFormFieldProps {
  field: ActivityField
  value: string
  onChange: (value: string) => void
  isMissing: boolean
}

// One field of an activity form, drawn from its settings
export function ActivityFormField({ field, value, onChange, isMissing }: ActivityFormFieldProps) {
  const disabled = field.unavailable ?? false
  const hint = disabled ? NOT_AVAILABLE : field.hint
  const error = isMissing ? 'Fill this in' : undefined

  switch (field.kind) {
    case 'textarea':
      return (
        <Textarea
          label={field.label}
          placeholder={field.placeholder}
          value={value}
          disabled={disabled}
          hint={hint}
          error={error}
          onChange={(event) => onChange(event.target.value)}
        />
      )
    case 'select':
      return (
        <Select
          label={field.label}
          options={field.options ?? []}
          placeholder={field.placeholder ?? 'Choose one'}
          value={value}
          disabled={disabled}
          hint={hint}
          error={error}
          onChange={(event) => onChange(event.target.value)}
        />
      )
    case 'segmented':
      return (
        <div className="flex flex-col gap-1">
          <p className="font-sans text-small font-semibold text-text-primary">{field.label}</p>
          <SegmentedControl
            label={field.label}
            options={field.options ?? []}
            value={value}
            onChange={onChange}
            variant="joined"
          />
        </div>
      )
    case 'chips':
      return (
        <div className="flex flex-col gap-1">
          <p className="font-sans text-small font-semibold text-text-primary">{field.label}</p>
          <div className={cx('flex flex-wrap gap-2', disabled && 'opacity-60')}>
            {(field.options ?? []).map((option) =>
              disabled ? (
                <Chip key={option.value}>{option.label}</Chip>
              ) : (
                <Chip
                  key={option.value}
                  variant={chipValues(value).includes(option.value) ? 'on' : 'default'}
                  pressed={chipValues(value).includes(option.value)}
                  onClick={() => onChange(toggleChip(value, option.value))}
                >
                  {option.label}
                </Chip>
              )
            )}
          </div>
          {hint && <p className="font-sans text-caption text-text-muted">{hint}</p>}
          {error && (
            <p role="alert" className="font-sans text-caption text-danger-text">
              Choose at least one
            </p>
          )}
        </div>
      )
    default:
      return (
        <Input
          label={field.label}
          type={field.kind === 'date' ? 'date' : 'text'}
          placeholder={field.placeholder}
          value={value}
          disabled={disabled}
          hint={hint}
          error={error}
          onChange={(event) => onChange(event.target.value)}
        />
      )
  }
}
