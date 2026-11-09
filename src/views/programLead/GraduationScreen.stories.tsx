import type { Meta, StoryObj } from '@storybook/react'
import { samplePreview } from '../../../.storybook/graduationFixtures'
import { GraduationScreen } from './GraduationScreen'

const meta: Meta<typeof GraduationScreen> = {
  title: 'Screens/ProgramLead/Graduation',
  component: GraduationScreen,
  parameters: { layout: 'padded' },
  args: {
    data: samplePreview,
    isProgramLead: true,
    search: '',
    onSearch: () => undefined,
    graduates: samplePreview.graduates,
    canGraduate: true,
    onRefresh: () => undefined,
    confirmFields: { cohortName: '', password: '' },
    onConfirmFieldsChange: () => undefined,
    onResetConfirm: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof GraduationScreen>

export const Preview: Story = {}
export const BeforeTheEndDate: Story = {
  args: { data: { ...samplePreview, hasEnded: false }, canGraduate: false },
}
export const AsSystemAdmin: Story = { args: { isProgramLead: false } }
export const NobodyGraduating: Story = {
  args: {
    data: {
      ...samplePreview,
      graduates: [],
      nonGraduates: [...samplePreview.nonGraduates, ...samplePreview.graduates],
    },
    graduates: [],
  },
}
export const Graduated: Story = { args: { data: { ...samplePreview, isGraduated: true } } }
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load the graduation preview. Try again.",
    onRetry: () => undefined,
  },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
