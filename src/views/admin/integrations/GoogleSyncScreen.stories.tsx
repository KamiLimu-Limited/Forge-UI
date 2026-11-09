import type { Meta, StoryObj } from '@storybook/react'
import { GoogleSyncScreen } from './GoogleSyncScreen'

// The API has no sync data yet, so the screen has one state: built as designed, disabled
const meta: Meta<typeof GoogleSyncScreen> = {
  title: 'Screens/Admin/GoogleSync',
  component: GoogleSyncScreen,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof GoogleSyncScreen>

export const NotAvailableYet: Story = {}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
