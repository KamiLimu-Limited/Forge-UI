import type { Meta, StoryObj } from '@storybook/react'
import { menteeUser } from '../../../.storybook/fixtures'
import { sampleHome, sampleHomeFirstMonth } from '../../../.storybook/menteeFixtures'
import { HomeScreen } from './HomeScreen'

const meta: Meta<typeof HomeScreen> = {
  title: 'Screens/Mentee/Home',
  component: HomeScreen,
  parameters: {
    layout: 'padded',
    auth: { user: menteeUser },
    nextjs: { navigation: { pathname: '/dashboard' } },
  },
  args: { data: sampleHome },
}

export default meta
type Story = StoryObj<typeof HomeScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
export const FirstMonth: Story = { args: { data: sampleHomeFirstMonth } }
export const NothingOpen: Story = { args: { data: { ...sampleHome, openSessions: [] } } }
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load your home. Try again.",
    onRetry: () => undefined,
  },
}
