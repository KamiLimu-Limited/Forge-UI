import type { Meta, StoryObj } from '@storybook/react'
import { ResetExpiredScreen } from './ResetExpiredScreen'

const meta: Meta<typeof ResetExpiredScreen> = {
  title: 'Screens/Auth/ResetExpired',
  component: ResetExpiredScreen,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof ResetExpiredScreen>

export const Default: Story = {}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
