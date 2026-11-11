import type { UserProfileFields } from '@/types/auth'

export interface MenteeProfileData {
  name: string
  email: string
  // "Cohort 11, Mentee"
  cohortLabel: string
  // null until the mentee has a track
  ictTrack: string | null
  // True when a peer mentor is assigned, even if the API can't tell us their name
  hasPeerMentor: boolean
  // What the account has now, for the profile form
  fields: UserProfileFields
}
