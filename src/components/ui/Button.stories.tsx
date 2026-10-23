import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import { Icon } from './Icon'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { children: 'Sign in', variant: 'primary' } }
export const Secondary: Story = { args: { children: 'Cancel', variant: 'secondary' } }
export const Danger: Story = { args: { children: 'Suspend', variant: 'danger' } }

export const Small: Story = { args: { children: 'Next', size: 'sm', variant: 'secondary' } }
export const Medium: Story = { args: { children: 'Send invite', size: 'md' } }
export const Large: Story = { args: { children: 'Sign in', size: 'lg' } }

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Icon name="plus" className="size-4" />
        Invite user
      </>
    ),
  },
}

export const Loading: Story = { args: { children: 'Signing in', isLoading: true } }
export const Disabled: Story = { args: { children: 'Send invite', disabled: true } }
export const FullWidth: Story = { args: { children: 'Sign in', fullWidth: true, size: 'lg' } }

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-3">
          <Button size={size}>Primary</Button>
          <Button size={size} variant="secondary">
            Secondary
          </Button>
          <Button size={size} variant="danger">
            Danger
          </Button>
          <Button size={size} disabled>
            Disabled
          </Button>
        </div>
      ))}
    </div>
  ),
}
