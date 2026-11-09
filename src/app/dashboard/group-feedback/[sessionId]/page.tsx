import { GroupFeedback } from '@/views/peerMentor/GroupFeedback'

interface GroupFeedbackPageProps {
  params: Promise<{ sessionId: string }>
}

export default async function GroupFeedbackPage({ params }: GroupFeedbackPageProps) {
  const { sessionId } = await params
  return <GroupFeedback sessionId={sessionId} />
}
