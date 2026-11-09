import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'

// The committee sees everything and changes nothing, so every page says so in its header
export function ReadOnlyTag() {
  return <Chip>Read only</Chip>
}

export function NoCohortCard() {
  return (
    <Card>
      <EmptyState
        icon="users"
        title="No cohort to show"
        description="Ask the System Admin to add you to a cohort."
      />
    </Card>
  )
}
