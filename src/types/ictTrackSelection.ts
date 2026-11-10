// Choosing an ICT track (PRD 7.12). The API has no track selection routes yet, so the
// description, lead mentor, window and saving are all missing. See docs/api-gaps.md (M4).

export interface TrackOptionView {
  name: string
  // null until the API has track descriptions
  description: string | null
  // null until the API has a lead mentor per track
  leadMentorName: string | null
}

export interface ChooseTrackView {
  tracks: TrackOptionView[]
  // The mentee's track on record, if any
  currentTrack: string | null
  // YYYY-MM-DD, null while the API has no selection window
  closesOn: string | null
}
