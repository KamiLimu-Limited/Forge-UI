import { notFound } from 'next/navigation'
import { ACTIVITY_FORMS, isActivityKind } from '@/lib/activityForms'
import { ActivityFormScreen } from '@/views/mentee/ActivityFormScreen'

interface ActivityFormPageProps {
  params: Promise<{ kind: string }>
}

export default async function ActivityFormPage({ params }: ActivityFormPageProps) {
  const { kind } = await params
  if (!isActivityKind(kind)) notFound()
  return <ActivityFormScreen config={ACTIVITY_FORMS[kind]} />
}
