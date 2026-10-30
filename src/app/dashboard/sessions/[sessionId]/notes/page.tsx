import { Notes } from '@/views/mentee/Notes'

interface NotesPageProps {
  params: Promise<{ sessionId: string }>
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { sessionId } = await params
  return <Notes sessionId={sessionId} />
}
