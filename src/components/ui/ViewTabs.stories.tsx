import type { Meta, StoryObj } from '@storybook/react'
import { ViewTabs } from './ViewTabs'

const meta: Meta<typeof ViewTabs> = {
  title: 'UI/ViewTabs',
  component: ViewTabs,
  tags: ['autodocs'],
  parameters: { nextjs: { navigation: { pathname: '/one' } } },
  args: {
    label: 'Views',
    items: [
      { label: 'First view', href: '/one' },
      { label: 'Second view', href: '/two' },
    ],
  },
}

export default meta
type Story = StoryObj<typeof ViewTabs>

// Use the viewport toolbar: phones get the switch, md and up the underlined tabs
export const Default: Story = {}
export const PhoneOnly: Story = { args: { desktop: 'phone-only' } }
