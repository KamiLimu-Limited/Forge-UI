import type { Meta, StoryObj } from '@storybook/react'
import { LoginScreen } from './LoginScreen'

const meta: Meta<typeof LoginScreen> = {
  title: 'Screens/Auth/Login',
  component: LoginScreen,
  parameters: { layout: 'fullscreen' },
  args: {
    email: '',
    password: '',
    emailError: null,
    passwordError: null,
    isSuspended: false,
    isSubmitting: false,
    onEmailChange: () => undefined,
    onPasswordChange: () => undefined,
    onSubmit: (e) => e.preventDefault(),
  },
}

export default meta
type Story = StoryObj<typeof LoginScreen>

export const Default: Story = {}
export const Suspended: Story = {
  args: { email: 'mentee.k@example.com', isSuspended: true },
}
export const WrongPassword: Story = {
  args: { email: 'mentee.k@example.com', passwordError: 'Invalid email or password' },
}
export const Submitting: Story = {
  args: { email: 'mentee.k@example.com', password: 'secret', isSubmitting: true },
}
export const SuspendedMobile: Story = {
  ...Suspended,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
