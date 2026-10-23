import type { Meta, StoryObj } from '@storybook/react'
import { Icon, type IconName } from './Icon'

const names: IconName[] = [
  'alert',
  'check',
  'chevron-down',
  'close',
  'eye',
  'eye-off',
  'home',
  'inbox',
  'plus',
  'swap',
  'user',
  'users',
]

const meta: Meta<typeof Icon> = {
  title: 'UI/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: { name: { control: 'select', options: names } },
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = { args: { name: 'users' } }

export const Large: Story = { args: { name: 'users', className: 'size-tab-icon' } }

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 text-text-primary md:grid-cols-6">
      {names.map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Icon name={name} />
          <span className="font-sans text-caption text-text-secondary">{name}</span>
        </div>
      ))}
    </div>
  ),
}
