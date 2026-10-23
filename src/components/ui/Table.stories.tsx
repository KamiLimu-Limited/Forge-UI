import type { Meta, StoryObj } from '@storybook/react'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './Table'

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Table>

const rows = [
  { name: 'Amina Otieno', sessions: 18, points: 240 },
  { name: 'Brian Kamau', sessions: 15, points: 198 },
  { name: 'Wanjiru Mwangi', sessions: 12, points: 150 },
]

export const Default: Story = {
  render: () => (
    <Table label="Leaderboard">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell num>Sessions</TableHeaderCell>
          <TableHeaderCell num>Points</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={row.name} highlight={i === 1}>
            <TableCell>{row.name}</TableCell>
            <TableCell num>{row.sessions}</TableCell>
            <TableCell num>{row.points}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const Empty: Story = {
  render: () => (
    <Table label="Leaderboard">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell num>Points</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell colSpan={2} className="text-center text-text-muted">
            No one has points yet
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const NarrowScreen: Story = {
  ...Default,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
