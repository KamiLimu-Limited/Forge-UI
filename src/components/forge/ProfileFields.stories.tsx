import type { Meta, StoryObj } from '@storybook/react'
import { useProfileForm } from '@/hooks/useProfileForm'
import { ProfileFields } from './ProfileFields'

const meta: Meta<typeof ProfileFields> = {
  title: 'Forge/ProfileFields',
  component: ProfileFields,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ProfileFields>

// Sample details for stories. Not a real person.
function Filled({ disabled }: { disabled?: boolean }) {
  const form = useProfileForm({
    university: 'University of Nairobi',
    programme_of_study: 'Computer Science',
    degree_level: 'bachelors',
    gender: 'female',
    phone: '+254 700 000 000',
    birthday: '2004-05-14',
    social_links: { github: 'https://github.com/example' },
  })
  return <ProfileFields form={form} disabled={disabled} />
}

function Blank() {
  const form = useProfileForm(null)
  return <ProfileFields form={form} />
}

export const WithDetails: Story = { render: () => <Filled /> }
export const Empty: Story = { render: () => <Blank /> }
export const Saving: Story = { render: () => <Filled disabled /> }
