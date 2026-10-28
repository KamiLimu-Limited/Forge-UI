import { EditSessionPage } from '@/views/admin/sessions/EditSession'

interface AdminSessionPageProps {
  params: Promise<{ sessionId: string }>
}

export default async function AdminSessionPage({ params }: AdminSessionPageProps) {
  const { sessionId } = await params
  return <EditSessionPage sessionId={sessionId} />
}
