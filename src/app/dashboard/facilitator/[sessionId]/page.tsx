import { SessionRatings } from '@/views/peerMentor/SessionRatings'

interface SessionRatingsPageProps {
  params: Promise<{ sessionId: string }>
}

export default async function SessionRatingsPage({ params }: SessionRatingsPageProps) {
  const { sessionId } = await params
  return <SessionRatings sessionId={sessionId} />
}
