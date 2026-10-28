import { UserDetailPage } from '@/views/admin/UserDetail'

interface AdminUserPageProps {
  params: Promise<{ userId: string }>
}

export default async function AdminUserPage({ params }: AdminUserPageProps) {
  const { userId } = await params
  return <UserDetailPage userId={userId} />
}
