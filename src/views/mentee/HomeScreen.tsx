import { ChooseTrackCard } from '@/components/forge/ChooseTrackCard'
import { NextSessionCard } from '@/components/forge/NextSessionCard'
import { OpenNowCard } from '@/components/forge/OpenNowCard'
import { PEER_MENTOR_PENDING, PeerMentorCard } from '@/components/forge/PeerMentorCard'
import { ProgressByMonthCard } from '@/components/forge/ProgressByMonthCard'
import { RanksCard } from '@/components/forge/RanksCard'
import { StandingSummary } from '@/components/forge/StandingSummary'
import { PageHeader } from '@/components/layout/PageHeader'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { TextLink } from '@/components/ui/TextLink'
import { cx } from '@/lib/cx'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import type { MenteeHomeData } from '@/types/home'

interface HomeScreenProps {
  // null until the data loads
  data: MenteeHomeData | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

// The mentee's home. This only draws the screen; the page's hook loads the data and
// passes it in. Single column on phones; from lg, a 2fr and 1fr grid.
export function HomeScreen({ data, isLoading = false, error = null, onRetry }: HomeScreenProps) {
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  if (isLoading || !data) return <LoadingState label="Loading your home" />

  const isFirstMonth = data.programmeMonth === 1
  const monthLine = data.programmeMonth
    ? `Month ${data.programmeMonth}${data.totalMonths ? ` of ${data.totalMonths}` : ''}`
    : null
  const peerMentorLine = data.peerMentorName
    ? `Your peer mentor is ${data.peerMentorName}.`
    : data.hasPeerMentor
      ? null
      : PEER_MENTOR_PENDING

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title={`Hi, ${data.firstName}`}
        subtitle={
          <>
            {monthLine}
            {peerMentorLine && (
              <span className="hidden md:inline">
                {monthLine && '. '}
                {peerMentorLine}
              </span>
            )}
          </>
        }
      />
      {data.trackPrompt && <ChooseTrackCard closesOn={data.trackPrompt.closesOn} />}
      <StandingSummary
        standing={data.standing}
        buckets={data.buckets}
        showProgressLink={!isFirstMonth}
      />
      <div className="grid gap-4 md:gap-5 lg:grid-cols-3 lg:items-start">
        {!isFirstMonth && (
          <div className="hidden min-w-0 flex-col gap-5 md:flex lg:col-span-2">
            <OpenNowCard sessions={data.openSessions} />
            <ProgressByMonthCard
              title="Attendance by KamiLimu month"
              action={
                <TextLink href={MENTEE_ROUTES.progress} layout="inline">
                  By track and month
                </TextLink>
              }
              rows={data.months}
            />
          </div>
        )}
        {/* The first month has no left column, so Next session takes its place */}
        <div className={cx('flex min-w-0 flex-col gap-4 md:gap-5', isFirstMonth && 'lg:contents')}>
          <NextSessionCard
            session={data.nextSession}
            allSessionsInHeader={isFirstMonth}
            className={cx(isFirstMonth && 'lg:col-span-2')}
          />
          <PeerMentorCard
            name={data.peerMentorName}
            isAssigned={data.hasPeerMentor}
            className="md:hidden"
          />
          <RanksCard ranks={data.ranks} showLeaderboardLink={!isFirstMonth} />
        </div>
      </div>
    </div>
  )
}
