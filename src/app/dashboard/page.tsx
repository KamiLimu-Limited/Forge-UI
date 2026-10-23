import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <Card>
        <EmptyState
          icon="home"
          title="Nothing here yet"
          description="Your dashboard is on its way."
        />
      </Card>
    </>
  )
}
