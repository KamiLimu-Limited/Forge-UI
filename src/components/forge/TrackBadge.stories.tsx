import type { Meta, StoryObj } from '@storybook/react'
import { ALL_PILLARS } from '@/lib/labels'
import { TrackBadge } from './TrackBadge'

const meta: Meta<typeof TrackBadge> = {
  title: 'Forge/TrackBadge',
  component: TrackBadge,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TrackBadge>

export const AllPillars: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {ALL_PILLARS.map((p) => (
        <TrackBadge key={p} pillar={p} />
      ))}
    </div>
  ),
}
export const IctTrackName: Story = { args: { pillar: 'ict', label: 'Cybersecurity' } }
