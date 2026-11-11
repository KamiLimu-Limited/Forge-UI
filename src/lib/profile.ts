// The profile fields a person and the System Admin can fill in, shared by the mentee profile
// and the admin user detail

import type { DegreeLevel, Gender, UserProfileFields } from '@/types/auth'

export const DEGREE_LEVEL_LABELS: Record<DegreeLevel, string> = {
  diploma: 'Diploma',
  bachelors: "Bachelor's",
  masters: "Master's",
  doctorate: 'Doctorate',
}

export const GENDER_LABELS: Record<Gender, string> = {
  female: 'Female',
  male: 'Male',
  non_binary: 'Non-binary',
  prefer_not_to_say: 'Prefer not to say',
}

// Strings for the form; '' means not set
export interface ProfileValues {
  university: string
  programme: string
  degreeLevel: DegreeLevel | ''
  gender: Gender | ''
  phone: string
  // YYYY-MM-DD
  birthday: string
  linkedin: string
  github: string
  instagram: string
}

export type ProfileErrors = Partial<Record<keyof ProfileValues, string>>

export function profileValues(fields: Partial<UserProfileFields>): ProfileValues {
  return {
    university: fields.university ?? '',
    programme: fields.programme_of_study ?? '',
    degreeLevel: fields.degree_level ?? '',
    gender: fields.gender ?? '',
    phone: fields.phone ?? '',
    birthday: fields.birthday ?? '',
    linkedin: fields.social_links?.linkedin ?? '',
    github: fields.social_links?.github ?? '',
    instagram: fields.social_links?.instagram ?? '',
  }
}

// Every field is sent, so clearing one clears it on the account. Links the form doesn't
// show (Twitter, website) are kept.
export function profileBody(
  values: ProfileValues,
  current: Partial<UserProfileFields>
): UserProfileFields {
  const text = (value: string) => value.trim() || null
  const linkedin = text(values.linkedin)
  const github = text(values.github)
  const instagram = text(values.instagram)
  const others = { twitter: current.social_links?.twitter, website: current.social_links?.website }
  const hasLinks = Boolean(linkedin || github || instagram || others.twitter || others.website)
  return {
    university: text(values.university),
    programme_of_study: text(values.programme),
    degree_level: values.degreeLevel || null,
    gender: values.gender || null,
    phone: text(values.phone),
    birthday: values.birthday || null,
    social_links: hasLinks ? { linkedin, github, instagram, ...others } : null,
  }
}

export function validateProfile(values: ProfileValues): ProfileErrors {
  const errors: ProfileErrors = {}
  const phone = values.phone.trim()
  if (phone && !/^\+?[0-9 ()-]{7,30}$/.test(phone)) {
    errors.phone = 'Enter a phone number such as +254 712 345 678'
  }
  for (const key of ['linkedin', 'github', 'instagram'] as const) {
    const link = values[key].trim()
    if (link && !/^https?:\/\/\S+$/.test(link))
      errors[key] = 'Enter a full link that starts with https://'
  }
  return errors
}

// Label and value pairs for showing a profile, with 'Not given' for empty fields
export function profileRows(
  fields: Partial<UserProfileFields>
): { label: string; value: string }[] {
  const links = [
    fields.social_links?.linkedin,
    fields.social_links?.github,
    fields.social_links?.instagram,
    fields.social_links?.twitter,
    fields.social_links?.website,
  ].filter((link): link is string => Boolean(link))
  return [
    { label: 'University', value: fields.university ?? '' },
    { label: 'Programme', value: fields.programme_of_study ?? '' },
    {
      label: 'Degree level',
      value: fields.degree_level ? DEGREE_LEVEL_LABELS[fields.degree_level] : '',
    },
    { label: 'Gender', value: fields.gender ? GENDER_LABELS[fields.gender] : '' },
    { label: 'Phone', value: fields.phone ?? '' },
    { label: 'Birthday', value: fields.birthday ?? '' },
    { label: 'Links', value: links.join(', ') },
  ].map((row) => ({ ...row, value: row.value || 'Not given' }))
}
