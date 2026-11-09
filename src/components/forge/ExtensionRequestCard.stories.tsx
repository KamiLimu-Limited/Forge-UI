import type { Meta, StoryObj } from '@storybook/react'
import {
  sampleExtensionApproved,
  sampleExtensionDenied,
  sampleExtensionPending,
} from '../../../.storybook/menteeFixtures'
import { ExtensionRequestCard } from './ExtensionRequestCard'

const meta: Meta<typeof ExtensionRequestCard> = {
  title: 'Forge/ExtensionRequestCard',
  component: ExtensionRequestCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ExtensionRequestCard>

export const Pending: Story = {
  args: {
    session: sampleExtensionPending.session,
    request: sampleExtensionPending.request ?? undefined,
  },
}
export const Approved: Story = {
  args: {
    session: sampleExtensionApproved.session,
    request: sampleExtensionApproved.request ?? undefined,
  },
}
export const Denied: Story = {
  args: {
    session: sampleExtensionDenied.session,
    request: sampleExtensionDenied.request ?? undefined,
  },
}
