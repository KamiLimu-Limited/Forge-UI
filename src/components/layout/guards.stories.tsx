import type { Meta, StoryObj } from '@storybook/react'
import { adminUser, menteeUser } from '../../../.storybook/fixtures'
import { RedirectIfAuthed, RequireAdmin, RequireAuth } from './guards'

// Each guard shows its children when allowed and a spinner while it redirects
const meta: Meta<typeof RequireAuth> = {
  title: 'Layout/Guards',
  component: RequireAuth,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof RequireAuth>

const content = <p className="p-6 font-sans text-body text-text-primary">Protected content</p>

export const RequireAuthSignedIn: Story = {
  render: () => <RequireAuth>{content}</RequireAuth>,
  parameters: { auth: { user: menteeUser } },
}

export const RequireAuthSignedOut: Story = {
  render: () => <RequireAuth>{content}</RequireAuth>,
  parameters: { auth: { user: null } },
}

export const RequireAdminAsAdmin: Story = {
  render: () => <RequireAdmin>{content}</RequireAdmin>,
  parameters: { auth: { user: adminUser } },
}

export const RequireAdminAsMentee: Story = {
  render: () => <RequireAdmin>{content}</RequireAdmin>,
  parameters: { auth: { user: menteeUser } },
}

export const RedirectIfAuthedSignedOut: Story = {
  render: () => <RedirectIfAuthed>{content}</RedirectIfAuthed>,
  parameters: { auth: { user: null } },
}
