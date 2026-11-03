import type { Meta, StoryObj } from '@storybook/react'
import { AppPreview } from './AppPreview'

const meta: Meta<typeof AppPreview> = {
  title: 'Forge/AppPreview',
  component: AppPreview,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="h-screen overflow-hidden bg-surface p-6">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AppPreview>

export const Default: Story = {}
