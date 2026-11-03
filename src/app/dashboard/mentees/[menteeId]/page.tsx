import { MenteeDetail } from '@/views/peerMentor/MenteeDetail'

interface MenteeDetailPageProps {
  params: Promise<{ menteeId: string }>
}

export default async function MenteeDetailPage({ params }: MenteeDetailPageProps) {
  const { menteeId } = await params
  return <MenteeDetail menteeId={menteeId} />
}
