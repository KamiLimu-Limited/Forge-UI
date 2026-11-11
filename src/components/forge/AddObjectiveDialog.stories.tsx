import type { Meta, StoryObj } from '@storybook/react'
import { AddObjectiveDialog } from './AddObjectiveDialog'

const meta: Meta<typeof AddObjectiveDialog> = {
  title: 'Forge/AddObjectiveDialog',
  component: AddObjectiveDialog,
  tags: ['autodocs'],
  args: {
    isOpen: true,
    onClose: () => undefined,
    type: 'human',
    onTypeChange: () => undefined,
    text: '',
    onTextChange: () => undefined,
    onSave: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof AddObjectiveDialog>

export const Empty: Story = {}
export const Filled: Story = {
  args: { type: 'technical', text: 'Deploy a small web app to the cloud' },
}
export const Missing: Story = { args: { textError: 'Write the objective' } }
export const Saving: Story = { args: { text: 'Lead a study group', isSaving: true } }
