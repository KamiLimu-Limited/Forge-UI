import { ArchiveImportPage } from '@/views/admin/cohorts/ArchiveImport'

interface AdminArchiveImportPageProps {
  params: Promise<{ cohortId: string }>
}

export default async function AdminArchiveImportPage({ params }: AdminArchiveImportPageProps) {
  const { cohortId } = await params
  return <ArchiveImportPage cohortId={cohortId} />
}
