import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Icon } from '@/components/ui/Icon'
import {
  adminUser,
  graduateUser,
  menteeUser,
  peerMentorUser,
  twoCohortUser,
} from '../../../.storybook/fixtures'
import { AppShell } from './AppShell'
import { PageHeader } from './PageHeader'

const meta: Meta<typeof AppShell> = {
  title: 'Layout/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', nextjs: { navigation: { pathname: '/admin/users' } } },
  args: {
    children: (
      <>
        <PageHeader
          title="Users"
          action={
            <Button>
              <Icon name="plus" className="size-4" />
              Invite user
            </Button>
          }
        />
        <Card>
          <EmptyState title="No users found" />
        </Card>
      </>
    ),
  },
}

export default meta
type Story = StoryObj<typeof AppShell>

export const Admin: Story = { parameters: { auth: { user: adminUser } } }

export const SingleRole: Story = {
  parameters: {
    auth: { user: menteeUser },
    nextjs: { navigation: { pathname: '/dashboard' } },
  },
  args: {
    children: (
      <>
        <PageHeader title="Dashboard" />
        <Card>
          <EmptyState title="Nothing here yet" description="Your dashboard is on its way." />
        </Card>
      </>
    ),
  },
}

export const TwoCohorts: Story = {
  parameters: {
    auth: { user: twoCohortUser },
    nextjs: { navigation: { pathname: '/dashboard' } },
  },
  args: SingleRole.args,
}

export const AdminMobile: Story = {
  parameters: { ...Admin.parameters, viewport: { defaultViewport: 'mobile1' } },
}

export const TwoCohortsMobile: Story = {
  ...TwoCohorts,
  parameters: { ...TwoCohorts.parameters, viewport: { defaultViewport: 'mobile1' } },
}

export const AdminDesktop: Story = {
  parameters: { ...Admin.parameters, viewport: { defaultViewport: 'responsive' } },
}
// Seven links: phones show a menu button that opens the Menu dialog, as in the admin shell
export const PeerMentorMobile: Story = {
  parameters: {
    auth: { user: peerMentorUser },
    nextjs: { navigation: { pathname: '/dashboard' } },
    viewport: { defaultViewport: 'mobile1' },
  },
  args: SingleRole.args,
}

// Mentee and alumni in one cohort: only the alumni links show
export const Graduate: Story = {
  parameters: {
    auth: { user: graduateUser },
    nextjs: { navigation: { pathname: '/dashboard/alumni' } },
  },
  args: SingleRole.args,
}
