import type { Meta, StoryObj } from '@storybook/react'
import { InviteExpiredScreen } from './InviteExpiredScreen'

const meta: Meta<typeof InviteExpiredScreen> = {
  title: 'Screens/Auth/InviteExpired',
  component: InviteExpiredScreen,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof InviteExpiredScreen>

export const Default: Story = {}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
