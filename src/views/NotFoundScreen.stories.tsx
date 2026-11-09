import type { Meta, StoryObj } from '@storybook/react'
import { NotFoundScreen } from './NotFoundScreen'

const meta: Meta<typeof NotFoundScreen> = {
  title: 'Screens/Auth/NotFound',
  component: NotFoundScreen,
  parameters: { layout: 'fullscreen' },
  args: { isSignedIn: true, homeHref: '/dashboard' },
}

export default meta
type Story = StoryObj<typeof NotFoundScreen>

export const SignedIn: Story = {}
export const SignedOut: Story = { args: { isSignedIn: false } }
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
