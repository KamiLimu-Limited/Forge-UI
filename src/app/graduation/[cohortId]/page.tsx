import { Sequence } from '@/views/graduation/Sequence'

interface GraduationSequencePageProps {
  params: Promise<{ cohortId: string }>
}

export default async function GraduationSequencePage({ params }: GraduationSequencePageProps) {
  const { cohortId } = await params
  return <Sequence cohortId={cohortId} />
}
