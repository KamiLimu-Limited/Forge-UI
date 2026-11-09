import { PeerTaskForm } from '@/views/deliveryLead/PeerTaskForm'

interface EditPeerTaskPageProps {
  params: Promise<{ sessionId: string }>
}

export default async function EditPeerTaskPage({ params }: EditPeerTaskPageProps) {
  const { sessionId } = await params
  return <PeerTaskForm sessionId={sessionId} />
}
