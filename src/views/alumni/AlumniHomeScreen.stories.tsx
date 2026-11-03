import type { Meta, StoryObj } from '@storybook/react'
import { sampleAlumniHome } from '../../../.storybook/alumniFixtures'
import { AlumniHomeScreen } from './AlumniHomeScreen'

const meta: Meta<typeof AlumniHomeScreen> = {
  title: 'Screens/Alumni/Home',
  component: AlumniHomeScreen,
  parameters: { layout: 'padded' },
  args: { data: sampleAlumniHome },
}

export default meta
type Story = StoryObj<typeof AlumniHomeScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
export const NumbersMissing: Story = {
  args: {
    data: {
      ...sampleAlumniHome,
      coreRate: null,
      overallRate: null,
      totalPoints: null,
      sessionsAttended: null,
    },
  },
}
export const NotFinalYet: Story = { args: { data: { ...sampleAlumniHome, graduated: false } } }
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't find your past cohort. Ask the System Admin to check your alumni role.",
    onRetry: () => undefined,
  },
}
