import type { Meta, StoryObj } from '@storybook/react'
import type { GraduationResultView } from '@/types/graduation'
import { GraduationResultScreen } from './GraduationResultScreen'

const graduate: GraduationResultView = {
  firstName: 'Faith',
  cohortName: 'Cohort 11',
  graduated: true,
  graduatedOn: '2026-10-31',
  coreRate: 86,
  overallRate: 80,
  totalPoints: 702,
  sessionsAttended: 84,
  threshold: 80,
}

const meta: Meta<typeof GraduationResultScreen> = {
  title: 'Screens/Mentee/GraduationResult',
  component: GraduationResultScreen,
  parameters: { layout: 'padded' },
  args: { data: graduate, recordHref: '/dashboard/alumni/history' },
}

export default meta
type Story = StoryObj<typeof GraduationResultScreen>

export const Graduated: Story = {}
export const NotGraduated: Story = {
  args: {
    data: {
      ...graduate,
      graduated: false,
      coreRate: 74,
      overallRate: 70,
      totalPoints: 590,
      sessionsAttended: 72,
    },
    recordHref: '/dashboard/sessions/history',
  },
}
export const SomeNumbersMissing: Story = {
  args: { data: { ...graduate, overallRate: null, totalPoints: null } },
}
export const NotFinalYet: Story = { args: { data: null } }
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: { data: null, error: "We couldn't load your result. Try again.", onRetry: () => undefined },
}
export const GraduatedMobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
export const NotGraduatedMobile: Story = {
  ...NotGraduated,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
