import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input } from './Input'

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Invite user',
    onClose: () => {},
    children: <Input label="Email" placeholder="you@example.com" />,
    footer: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button>Send invite</Button>
      </>
    ),
  },
}

export const WithoutFooter: Story = {
  args: {
    isOpen: true,
    title: 'Your account',
    onClose: () => {},
    children: <p className="font-sans text-body text-text-secondary">Nothing to change yet.</p>,
  },
}

export const Narrow: Story = { args: { ...Default.args, title: 'Suspend user', width: 'sm' } }
export const Wide: Story = { args: { ...Default.args, title: 'Invite users', width: 'lg' } }
