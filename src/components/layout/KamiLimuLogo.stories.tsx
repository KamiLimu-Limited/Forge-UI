import type { Meta, StoryObj } from '@storybook/react'
import { KamiLimuLogo } from './KamiLimuLogo'

const meta: Meta<typeof KamiLimuLogo> = {
  title: 'Layout/KamiLimuLogo',
  component: KamiLimuLogo,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof KamiLimuLogo>

export const Default: Story = {}

export const Small: Story = {
  args: { className: 'w-32' },
}
