import type { Meta, StoryObj } from '@storybook/react'
import { menteeUser } from '../../../.storybook/fixtures'
import { sampleSessionRecord, sampleSubmittedRecord } from '../../../.storybook/menteeFixtures'
import { NotesScreen } from './NotesScreen'

const meta: Meta<typeof NotesScreen> = {
  title: 'Screens/Mentee/Notes',
  component: NotesScreen,
  parameters: {
    layout: 'padded',
    auth: { user: menteeUser },
    nextjs: { appDirectory: true, navigation: { pathname: '/dashboard/sessions/s-open-1/notes' } },
  },
  args: {
    session: sampleSubmittedRecord,
    notes: sampleSubmittedRecord.notes ?? '',
    savedAt: sampleSubmittedRecord.savedAt,
    onNotesChange: () => undefined,
    onSave: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof NotesScreen>

export const Default: Story = {}
// No attendance record yet, so the API has nowhere to store notes
export const NoRecordYet: Story = {
  args: { session: sampleSessionRecord, notes: '', savedAt: null },
}
// The API only edits a record while its window is open
export const WindowClosed: Story = {
  args: { session: { ...sampleSubmittedRecord, windowState: 'closed' } },
}
export const SaveFailed: Story = { args: { saveError: "We couldn't save your notes. Try again." } }
export const Loading: Story = { args: { session: null, isLoading: true } }
export const WithError: Story = {
  args: {
    session: null,
    error: "We couldn't load this session. Try again.",
    onRetry: () => undefined,
  },
}
// A 1:1 peer mentor using the same screen: everything shows, saving is switched off
