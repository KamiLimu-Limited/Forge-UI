import { MeetUnmatched } from '@/views/admin/integrations/MeetUnmatched'

interface MeetPageProps {
  params: Promise<{ sessionId: string }>
}

export default async function MeetPage({ params }: MeetPageProps) {
  const { sessionId } = await params
  return <MeetUnmatched sessionId={sessionId} />
}
