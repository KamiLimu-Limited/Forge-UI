import { Attendance } from '@/views/mentee/Attendance'

interface AttendancePageProps {
  params: Promise<{ sessionId: string }>
}

export default async function AttendancePage({ params }: AttendancePageProps) {
  const { sessionId } = await params
  return <Attendance sessionId={sessionId} />
}
