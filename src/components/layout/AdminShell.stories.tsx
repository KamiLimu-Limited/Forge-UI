import type { Meta, StoryObj } from '@storybook/react'
import { archivedCohort, sampleCohort } from '../../../.storybook/fixtures'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { AdminShell } from './AdminShell'
import { PageHeader } from './PageHeader'

const meta: Meta<typeof AdminShell> = {
  title: 'Layout/AdminShell',
  component: AdminShell,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', nextjs: { navigation: { pathname: '/admin' } } },
  args: {
    children: (
      <>
        <PageHeader title="Overview" subtitle="Cohort 11, Month 5 of 8." />
        <Card>
          <EmptyState title="Nothing scheduled" />
        </Card>
      </>
    ),
  },
}

export default meta
type Story = StoryObj<typeof AdminShell>

export const OneCohort: Story = {}
export const SeveralCohorts: Story = {
  parameters: {
    activeCohort: { cohorts: [sampleCohort, archivedCohort], cohortId: sampleCohort.id },
  },
}
export const LoadingCohorts: Story = { parameters: { activeCohort: { isLoading: true } } }
export const NoCohorts: Story = { parameters: { activeCohort: { cohorts: [] } } }
export const CohortsFailed: Story = {
  parameters: { activeCohort: { error: "We couldn't load the cohorts." } },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
