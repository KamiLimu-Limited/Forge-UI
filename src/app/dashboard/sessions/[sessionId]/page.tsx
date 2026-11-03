import { SessionDetail } from '@/views/mentee/SessionDetail'

interface SessionDetailPageProps {
  params: Promise<{ sessionId: string }>
}

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { sessionId } = await params
  return <SessionDetail sessionId={sessionId} />
}
