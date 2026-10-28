import type { Meta, StoryObj } from '@storybook/react'
import { NoCohortNotice } from './NoCohortNotice'

const meta: Meta<typeof NoCohortNotice> = {
  title: 'Layout/NoCohortNotice',
  component: NoCohortNotice,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NoCohortNotice>

export const NoCohortYet: Story = { parameters: { activeCohort: { cohorts: [] } } }
export const LoadFailed: Story = {
  parameters: { activeCohort: { error: "We couldn't load the cohorts." } },
}
