import type { RatingGroup, RatingQuestion } from '@/types/sessionFeedback'

export interface RatingGroupView {
  title: string
  questions: RatingQuestion[]
}

const GROUP_TITLES: Record<RatingGroup, string> = {
  reaction: 'Reaction',
  learning: 'Learning',
  intended_behaviour: 'Intended behaviour',
}

const GROUP_ORDER: RatingGroup[] = ['reaction', 'learning', 'intended_behaviour']

// The cohort's questions under their group headings, each group in question order
export function ratingGroups(questions: RatingQuestion[]): RatingGroupView[] {
  return GROUP_ORDER.flatMap((group) => {
    const inGroup = questions
      .filter((question) => question.group === group)
      .sort((a, b) => a.number - b.number)
    return inGroup.length > 0 ? [{ title: GROUP_TITLES[group], questions: inGroup }] : []
  })
}

// The API sends ratings as a list in question order, so position i answers question i + 1
export function ratingsOf(
  ratings: (number | null)[] | null | undefined,
  questions: RatingQuestion[]
): { label: string; value: number }[] {
  return (ratings ?? []).flatMap((value, index) => {
    if (value === null || value === undefined) return []
    const question = questions.find((item) => item.number === index + 1)
    return [{ label: question?.text ?? `Question ${index + 1}`, value }]
  })
}
