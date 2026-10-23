import type { Meta, StoryObj } from '@storybook/react'
import { Field, controlClasses } from './Field'

const meta: Meta<typeof Field> = {
  title: 'UI/Field',
  component: Field,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Field>

const control = (hasError = false) => (
  <input id="field-demo" className={`${controlClasses(hasError)} h-control`} />
)

export const Default: Story = {
  args: { id: 'field-demo', label: 'Cohort name', children: control() },
}

export const WithHint: Story = {
  args: {
    id: 'field-demo',
    label: 'Cohort name',
    hint: 'Shown to everyone in the cohort.',
    children: control(),
  },
}

export const WithError: Story = {
  args: {
    id: 'field-demo',
    label: 'Cohort name',
    error: 'Enter a cohort name.',
    children: control(true),
  },
}

export const WithLabelAside: Story = {
  args: {
    id: 'field-demo',
    label: 'Password',
    labelAside: <span className="font-sans text-caption text-link">Forgot password?</span>,
    children: control(),
  },
}
