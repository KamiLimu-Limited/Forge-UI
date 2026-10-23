import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AuthLayout } from './AuthLayout'

const meta: Meta<typeof AuthLayout> = {
  title: 'Layout/AuthLayout',
  component: AuthLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof AuthLayout>

export const Default: Story = {
  args: {
    title: 'Reset your password',
    description: "Enter your email and we'll send you a reset link.",
    children: (
      <div className="flex flex-col gap-5">
        <Input label="Email" placeholder="you@example.com" />
        <Button size="lg" fullWidth>
          Send reset link
        </Button>
      </div>
    ),
  },
}

export const TitleOnly: Story = {
  args: {
    title: 'Password updated',
    children: <p className="font-sans text-body text-text-secondary">Taking you to sign in.</p>,
  },
}

export const Mobile: Story = {
  ...Default,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
