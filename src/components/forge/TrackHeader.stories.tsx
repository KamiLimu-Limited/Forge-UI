import type { Meta, StoryObj } from '@storybook/react'
import { TrackHeader } from './TrackHeader'

const meta: Meta<typeof TrackHeader> = {
  title: 'Forge/TrackHeader',
  component: TrackHeader,
  tags: ['autodocs'],
  parameters: { nextjs: { navigation: { pathname: '/dashboard' } } },
  args: { title: 'Cybersecurity', subtitle: '14 mentees chose this track.' },
}

export default meta
type Story = StoryObj<typeof TrackHeader>

// The Mentees and ICT sessions switch only shows at phone width
export const Default: Story = {}
