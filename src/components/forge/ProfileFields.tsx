import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { UseProfileFormReturn } from '@/hooks/useProfileForm'
import { DEGREE_LEVEL_LABELS, GENDER_LABELS } from '@/lib/profile'
import type { DegreeLevel, Gender } from '@/types/auth'

interface ProfileFieldsProps {
  form: UseProfileFormReturn
  disabled?: boolean
}

const DEGREE_OPTIONS = (Object.keys(DEGREE_LEVEL_LABELS) as DegreeLevel[]).map((value) => ({
  value,
  label: DEGREE_LEVEL_LABELS[value],
}))

const GENDER_OPTIONS = (Object.keys(GENDER_LABELS) as Gender[]).map((value) => ({
  value,
  label: GENDER_LABELS[value],
}))

// University, programme, degree, gender, phone, birthday and links
export function ProfileFields({ form, disabled = false }: ProfileFieldsProps) {
  const { values, setValue, errors } = form
  return (
    <fieldset disabled={disabled} className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="University"
          value={values.university}
          onChange={(e) => setValue('university', e.target.value)}
          maxLength={200}
        />
        <Input
          label="Programme of study"
          value={values.programme}
          onChange={(e) => setValue('programme', e.target.value)}
          maxLength={200}
        />
        <Select
          label="Degree level"
          options={DEGREE_OPTIONS}
          placeholder="Choose one"
          value={values.degreeLevel}
          onChange={(e) => setValue('degreeLevel', e.target.value as DegreeLevel | '')}
        />
        <Select
          label="Gender"
          options={GENDER_OPTIONS}
          placeholder="Choose one"
          value={values.gender}
          onChange={(e) => setValue('gender', e.target.value as Gender | '')}
        />
        <Input
          label="Phone number"
          type="tel"
          value={values.phone}
          onChange={(e) => setValue('phone', e.target.value)}
          error={errors.phone}
        />
        <Input
          label="Birthday"
          type="date"
          value={values.birthday}
          onChange={(e) => setValue('birthday', e.target.value)}
        />
      </div>
      <p className="font-sans text-caption text-text-muted">
        Only the person and the System Admin can see the phone number and birthday.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          label="LinkedIn"
          type="url"
          placeholder="Optional"
          value={values.linkedin}
          onChange={(e) => setValue('linkedin', e.target.value)}
          error={errors.linkedin}
        />
        <Input
          label="GitHub"
          type="url"
          placeholder="Optional"
          value={values.github}
          onChange={(e) => setValue('github', e.target.value)}
          error={errors.github}
        />
        <Input
          label="Instagram"
          type="url"
          placeholder="Optional"
          value={values.instagram}
          onChange={(e) => setValue('instagram', e.target.value)}
          error={errors.instagram}
        />
      </div>
    </fieldset>
  )
}
