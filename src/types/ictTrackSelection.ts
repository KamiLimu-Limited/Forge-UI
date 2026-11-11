// Choosing an ICT track (PRD 7.12)

export interface TrackOptionView {
  name: string
  description: string | null
  // null until the API has a lead mentor per track (gap 20)
  leadMentorName: string | null
}

export interface ChooseTrackView {
  cohortId: string
  tracks: TrackOptionView[]
  // The mentee's track on record, if any
  currentTrack: string | null
  isOpen: boolean
  // YYYY-MM-DD, null when the window has no date set
  opensOn: string | null
  closesOn: string | null
}
