import type { Meta, StoryObj } from '@storybook/react'
import { sampleProgramLeadHome } from '../../../.storybook/graduationFixtures'
import { ProgramLeadHomeScreen } from './ProgramLeadHomeScreen'

const meta: Meta<typeof ProgramLeadHomeScreen> = {
  title: 'Screens/ProgramLead/Home',
  component: ProgramLeadHomeScreen,
  parameters: { layout: 'padded' },
  args: { data: sampleProgramLeadHome },
}

export default meta
type Story = StoryObj<typeof ProgramLeadHomeScreen>

export const DuringTheCohort: Story = {}
export const CohortEnded: Story = {
  args: {
    data: {
      ...sampleProgramLeadHome,
      home: {
        ...sampleProgramLeadHome.home,
        graduation: { endDate: '2026-10-31', hasEnded: true, isGraduated: false },
      },
    },
  },
}
export const NothingWaiting: Story = {
  args: {
    data: {
      ...sampleProgramLeadHome,
      home: { ...sampleProgramLeadHome.home, pendingRequests: [], pendingTotal: 0, upcoming: [] },
    },
  },
}
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load the overview. Try again.",
    onRetry: () => undefined,
  },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
