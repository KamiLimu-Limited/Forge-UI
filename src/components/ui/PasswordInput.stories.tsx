import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PASSWORD_RULES } from '@/lib/password'
import { PasswordInput } from './PasswordInput'

const meta: Meta<typeof PasswordInput> = {
  title: 'UI/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PasswordInput>

function Controlled(props: Partial<Parameters<typeof PasswordInput>[0]>) {
  const [value, setValue] = useState(props.value ?? '')
  return (
    <PasswordInput
      label="Password"
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

export const Default: Story = { render: () => <Controlled /> }

export const WithRules: Story = { render: () => <Controlled rules={PASSWORD_RULES} /> }

export const RulesPartlyMet: Story = {
  render: () => <Controlled rules={PASSWORD_RULES} value="forge2026" />,
}

export const RulesAllMet: Story = {
  render: () => <Controlled rules={PASSWORD_RULES} value="Forge2026" />,
}

export const WithError: Story = {
  render: () => <Controlled value="secret" error="That password is not right." />,
}

export const WithLabelAside: Story = {
  render: () => (
    <Controlled
      labelAside={<span className="font-sans text-caption text-link">Forgot password?</span>}
    />
  ),
}

export const Disabled: Story = { render: () => <Controlled value="Forge2026" disabled /> }
