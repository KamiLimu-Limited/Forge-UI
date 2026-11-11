// GET /sessions/{id}/feedback: what everyone who attended a session said about it, for
// staff and the session's own mentors. Respondents are anonymous for mentors.

export type RatingGroup = 'reaction' | 'learning' | 'intended_behaviour'

// One of the cohort's nine rating questions
export interface RatingQuestion {
  // 1 to 9, the order ratings arrive in
  number: number
  group: RatingGroup
  text: string
}

export interface QuestionAverage extends RatingQuestion {
  average: number | null
}

export interface FeedbackEntry {
  // A per-session pseudonym such as "Mentee-3fa9c2d1"
  respondent: string
  // Null when `anonymous` is true
  mentee_id: string | null
  ratings: (number | null)[] | null
  feedback: string | null
}

export interface SessionFeedbackResponse {
  session_id: string
  responses: number
  anonymous: boolean
  questions: QuestionAverage[]
  entries: FeedbackEntry[]
}
