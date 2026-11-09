import { Extension } from '@/views/mentee/Extension'

interface ExtensionPageProps {
  params: Promise<{ sessionId: string }>
}

export default async function ExtensionPage({ params }: ExtensionPageProps) {
  const { sessionId } = await params
  return <Extension sessionId={sessionId} />
}
