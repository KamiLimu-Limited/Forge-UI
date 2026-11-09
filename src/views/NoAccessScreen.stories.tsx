import type { Meta, StoryObj } from '@storybook/react'
import { NoAccessScreen } from './NoAccessScreen'

const meta: Meta<typeof NoAccessScreen> = {
  title: 'Screens/Auth/NoAccess',
  component: NoAccessScreen,
  parameters: { layout: 'fullscreen' },
  args: {
    area: 'the System Admin',
    fullName: 'Faith Mutheu Mutua',
    roleLabel: 'Mentee',
    homeHref: '/dashboard',
  },
}

export default meta
type Story = StoryObj<typeof NoAccessScreen>

export const Default: Story = {}
export const ProgramLeadArea: Story = {
  args: { area: 'the Program Lead', fullName: 'Amina Otieno', roleLabel: 'System Admin' },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
