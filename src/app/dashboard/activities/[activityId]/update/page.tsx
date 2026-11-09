import { UpdateApplication } from '@/views/mentee/UpdateApplication'

interface UpdateApplicationPageProps {
  params: Promise<{ activityId: string }>
}

export default async function UpdateApplicationPage({ params }: UpdateApplicationPageProps) {
  const { activityId } = await params
  return <UpdateApplication activityId={activityId} />
}
