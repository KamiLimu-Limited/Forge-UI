import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import { Select } from '@/components/ui/Select'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { MenteeProfileData } from '@/types/menteeProfile'

const NOT_AVAILABLE = 'Not available yet'

interface ProfileScreenProps {
  // null until the data loads
  data: MenteeProfileData | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  onSignOut: () => void
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-0.5 md:grid-cols-4 md:gap-4">
      <dt className="font-sans text-small text-text-secondary">{label}</dt>
      <dd className="font-sans text-small text-text-primary md:col-span-3">{value}</dd>
    </div>
  )
}

// The mentee's profile. The API stores none of the profile details and has no way to change
// a password, so those two cards are built as designed but disabled. See docs/api-gaps.md.
export function ProfileScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  onSignOut,
}: ProfileScreenProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title="Your profile"
        subtitle={<span className="hidden md:inline">Keep your details up to date.</span>}
      />
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading your profile" />
      ) : (
        <>
          <Card title="About you">
            <div className="flex flex-col gap-3">
              <dl className="flex flex-col gap-2">
                <Detail label="Name" value={data.name} />
                <Detail label="Email" value={data.email} />
                <Detail label="Cohort" value={data.cohortLabel} />
                <Detail label="ICT track" value={data.ictTrack ?? 'Not chosen yet'} />
                <Detail
                  label="Peer mentor"
                  value={data.hasPeerMentor ? NOT_AVAILABLE : 'Not assigned yet'}
                />
              </dl>
              {data.ictTrack && (
                <p className="font-sans text-caption text-text-muted">
                  Your track was set in track selection. Ask the System Admin if it needs to change.
                </p>
              )}
            </div>
          </Card>

          <Card title="Profile details">
            <div className="flex flex-col gap-4">
              <Notice>Not available yet. You&apos;ll be able to fill these in soon.</Notice>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="University" disabled />
                <Input label="Programme of study" disabled />
                <Select
                  label="Degree level"
                  options={[]}
                  placeholder="Choose one"
                  value=""
                  disabled
                />
                <Select label="Gender" options={[]} placeholder="Choose one" value="" disabled />
                <Input label="Phone number" type="tel" disabled />
                <Input label="Birthday" placeholder="Day and month" disabled />
              </div>
              <p className="font-sans text-caption text-text-muted">
                Only you and the System Admin can see your phone number and birthday.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <Input label="LinkedIn" placeholder="Optional" disabled />
                <Input label="GitHub" placeholder="Optional" disabled />
                <Input label="Instagram" placeholder="Optional" disabled />
              </div>
              <Button disabled fullWidth className="md:w-auto md:self-start">
                Save profile
              </Button>
            </div>
          </Card>

          <Card title="Change password">
            <div className="flex flex-col gap-4">
              <Notice>Not available yet.</Notice>
              <Input label="Current password" type="password" disabled />
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="New password"
                  type="password"
                  hint="At least 8 characters, with an uppercase letter, a lowercase letter and a number"
                  disabled
                />
                <Input label="Confirm new password" type="password" disabled />
              </div>
              <Button variant="secondary" disabled fullWidth className="md:w-auto md:self-start">
                Update password
              </Button>
            </div>
          </Card>

          {/* The sidebar has these from md up */}
          <div className="flex flex-col gap-4 md:hidden">
            <ThemeToggle className="self-start" />
            <Button variant="danger" fullWidth onClick={onSignOut}>
              Sign out
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
