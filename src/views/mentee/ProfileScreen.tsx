import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import { ProfileFields } from '@/components/forge/ProfileFields'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { UseProfileFormReturn } from '@/hooks/useProfileForm'
import type { MenteeProfileData } from '@/types/menteeProfile'

const NOT_AVAILABLE = 'Not available yet'

interface ProfileScreenProps {
  // null until the data loads
  data: MenteeProfileData | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  onSignOut: () => void
  profile: UseProfileFormReturn
  onSaveProfile: () => void
  isSavingProfile?: boolean
  profileError?: string | null
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-0.5 md:grid-cols-4 md:gap-4">
      <dt className="font-sans text-small text-text-secondary">{label}</dt>
      <dd className="font-sans text-small text-text-primary md:col-span-3">{value}</dd>
    </div>
  )
}

// The mentee's profile. The API has no way to change a password while signed in or to get a
// calendar feed, so those cards are built as designed but disabled. See docs/api-gaps.md.
export function ProfileScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  onSignOut,
  profile,
  onSaveProfile,
  isSavingProfile = false,
  profileError = null,
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

          <Card>
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault()
                onSaveProfile()
              }}
              className="flex flex-col gap-4"
            >
              <ProfileFields form={profile} disabled={isSavingProfile} />
              {profileError && <Notice variant="danger">{profileError}</Notice>}
              <Button
                type="submit"
                isLoading={isSavingProfile}
                disabled={!profile.isDirty}
                fullWidth
                className="md:w-auto md:self-start"
              >
                Save profile
              </Button>
            </form>
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

          <Card title="Your calendar">
            <div className="flex flex-col gap-4">
              <p className="font-sans text-small text-text-secondary">
                Add your KamiLimu sessions to Google Calendar, Apple Calendar or Outlook. Changes to
                a session show up there on their own.
              </p>
              <Notice>Not available yet.</Notice>
              <Input
                label="Calendar link"
                hint="Anyone with this link can see your sessions. Get a new link if you shared it by mistake."
                readOnly
                disabled
              />
              <div className="flex flex-col gap-3 md:flex-row">
                <Button variant="secondary" disabled fullWidth className="md:w-auto">
                  Copy link
                </Button>
                <Button variant="ghost" disabled fullWidth className="md:w-auto">
                  Get a new link
                </Button>
              </div>
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
