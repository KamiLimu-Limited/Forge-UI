import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from './PageHeader'

const meta: Meta<typeof PageHeader> = {
  title: 'Layout/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = { args: { title: 'Users' } }

export const WithSubtitle: Story = {
  args: { title: 'Users', subtitle: 'Everyone with a KamiLimu account.' },
}

export const WithAction: Story = {
  args: {
    title: 'Users',
    action: (
      <Button>
        <Icon name="plus" className="size-4" />
        Invite user
      </Button>
    ),
  },
}

export const Mobile: Story = {
  ...WithAction,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
