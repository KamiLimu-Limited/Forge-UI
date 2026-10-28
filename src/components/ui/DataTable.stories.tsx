import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'
import { DataTable, type DataTableColumn } from './DataTable'

interface Person {
  id: string
  name: string
  email: string
  sessions: number
}

const people: Person[] = Array.from({ length: 34 }, (_, i) => ({
  id: `p-${i}`,
  name: ['Wanjiku Kamau', 'Brian Otieno', 'Amina Hassan', 'Kevin Mutua'][i % 4] + ` ${i + 1}`,
  email: `person${i + 1}@example.com`,
  sessions: (i * 7) % 11,
}))

const columns: DataTableColumn<Person>[] = [
  { key: 'name', header: 'Name', render: (p) => p.name, sortValue: (p) => p.name },
  { key: 'email', header: 'Email', render: (p) => p.email },
  {
    key: 'sessions',
    header: 'Sessions',
    num: true,
    render: (p) => p.sessions,
    sortValue: (p) => p.sessions,
  },
]

const meta: Meta<typeof DataTable<Person>> = {
  title: 'UI/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  decorators: [(Story) => <Card flush>{Story()}</Card>],
  args: {
    label: 'People',
    columns,
    rows: people,
    rowKey: (p: Person) => p.id,
    empty: { title: 'No people yet', description: 'People you add show up here.' },
  },
}

export default meta
type Story = StoryObj<typeof DataTable<Person>>

export const ClientPaging: Story = { args: { pageSize: 10 } }
export const ServerPaging: Story = {
  args: {
    rows: people.slice(0, 20),
    pagination: { page: 1, pageSize: 20, total: 134, onPageChange: () => undefined },
  },
}
export const Loading: Story = { args: { isLoading: true } }
export const Empty: Story = { args: { rows: [] } }
export const WithError: Story = {
  args: { error: "We couldn't load the users.", onRetry: () => undefined },
}
