import { SessionAttendancePage } from '@/views/admin/sessions/SessionAttendance'

interface AdminSessionAttendancePageProps {
  params: Promise<{ sessionId: string }>
}

export default async function AdminSessionAttendancePage({
  params,
}: AdminSessionAttendancePageProps) {
  const { sessionId } = await params
  return <SessionAttendancePage sessionId={sessionId} />
}
