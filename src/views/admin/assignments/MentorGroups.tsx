'use client'

import { useState, type DragEvent, type ReactNode } from 'react'
import { MenteeCard, MENTEE_DRAG_TYPE, type AssignOption } from '@/components/forge/MenteeCard'
import { ASSIGNMENT_TABS } from '@/components/layout/navConfig'
import { NoCohortNotice } from '@/components/layout/NoCohortNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import { Tabs } from '@/components/ui/Tabs'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { MAX_GROUP_SIZE, useMentorGroups } from '@/hooks/useMentorGroups'
import { useToast } from '@/hooks/useToast'
import { cx } from '@/lib/cx'
import { fullName, plural } from '@/lib/format'
import type { EnrollmentResponse } from '@/types/enrollment'

const UNASSIGNED = ''

interface DropZoneProps {
  label: string
  canDrop: boolean
  onDropMentee: (menteeId: string) => void
  children: ReactNode
  className?: string
}

// Accepts a dragged mentee. Full groups refuse the drop.
function DropZone({ label, canDrop, onDropMentee, children, className }: DropZoneProps) {
  const [isOver, setIsOver] = useState(false)
  const accepts = (e: DragEvent) => e.dataTransfer.types.includes(MENTEE_DRAG_TYPE)

  return (
    <div
      aria-label={label}
      onDragOver={(e) => {
        if (!accepts(e)) return
        e.preventDefault()
        e.dataTransfer.dropEffect = canDrop ? 'move' : 'none'
        setIsOver(true)
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsOver(false)
        const id = e.dataTransfer.getData(MENTEE_DRAG_TYPE)
        if (id) onDropMentee(id)
      }}
      className={cx(
        'flex flex-col gap-2 rounded-control transition-colors duration-fast',
        isOver && (canDrop ? 'bg-accent-bg' : 'bg-danger-bg'),
        className
      )}
    >
      {children}
    </div>
  )
}

interface DropHintProps {
  children: string
}

function DropHint({ children }: DropHintProps) {
  return (
    <div className="rounded-control border border-dashed border-border-strong p-4 text-center font-sans text-small text-text-muted">
      {children}
    </div>
  )
}

export function MentorGroupsPage() {
  const { showToast } = useToast()
  const { cohort, cohortId, isLoading: cohortLoading } = useActiveCohort()
  const data = useMentorGroups(cohortId)
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState<string | null>(null)

  const savedMentorOf = (m: EnrollmentResponse) => m.peer_mentor_id ?? UNASSIGNED

  const options = (current: string): AssignOption[] => [
    { value: UNASSIGNED, label: 'Assign to' },
    ...data.groups.map((g) => ({
      value: g.mentor.user.id,
      label: `${fullName(g.mentor.user)} (${g.mentees.length} of ${MAX_GROUP_SIZE})`,
      disabled: g.mentor.user.id !== current && g.mentees.length >= MAX_GROUP_SIZE,
    })),
  ]

  const move = (menteeId: string, mentorId: string) => {
    if (!data.assign(menteeId, mentorId || null)) {
      setNotice(`That group already has ${MAX_GROUP_SIZE} mentees. Move someone out first.`)
      return
    }
    setNotice(null)
  }

  const save = async () => {
    const result = await data.save()
    if (result.failed.length === 0) {
      showToast(`${plural(result.saved, 'assignment')} saved. Peer mentors can see their groups.`)
      setNotice(null)
    } else {
      setNotice(`${result.saved} saved. These didn't save: ${result.failed.join('. ')}`)
    }
  }

  const term = search.trim().toLowerCase()
  const unassigned = data.unassigned.filter(
    (m) => !term || `${fullName(m.user)} ${m.user.email}`.toLowerCase().includes(term)
  )

  const card = (m: EnrollmentResponse, current: string) => (
    <MenteeCard
      key={m.id}
      id={m.id}
      name={fullName(m.user)}
      detail={m.user.email}
      options={options(current)}
      value={current}
      onAssign={(value) => move(m.id, value)}
      isChanged={current !== savedMentorOf(m)}
      disabled={data.isSaving}
    />
  )

  if (!cohortLoading && !cohortId) {
    return (
      <>
        <PageHeader title="Mentor assignments" />
        <NoCohortNotice />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Mentor assignments"
        subtitle="1:1 peer mentors are assigned about a month into the cohort, in groups of two to three mentees. Drag a mentee into a group, or use Assign to."
        action={
          <div className="flex flex-wrap gap-3">
            {data.changeCount > 0 && (
              <Button variant="secondary" onClick={data.discard} disabled={data.isSaving}>
                Discard changes
              </Button>
            )}
            <Button
              onClick={() => void save()}
              isLoading={data.isSaving}
              disabled={data.changeCount === 0}
            >
              Save assignments
            </Button>
          </div>
        }
      />
      <Tabs label="Assignment type" items={ASSIGNMENT_TABS} />

      {data.changeCount > 0 && (
        <Notice variant="info">
          {plural(data.changeCount, 'change')} not saved yet. Press Save assignments to keep them.
        </Notice>
      )}
      {notice && <Notice variant="warning">{notice}</Notice>}

      {data.isLoading ? (
        <LoadingState label="Loading groups" />
      ) : data.error ? (
        <ErrorState message={data.error} onRetry={data.refetch} />
      ) : data.groups.length === 0 && data.unassigned.length === 0 ? (
        <Card>
          <EmptyState
            icon="users"
            title={`No mentees or 1:1 peer mentors in ${cohort?.name ?? 'this cohort'} yet`}
            description="People appear here once they accept their invitation to the cohort."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
          <Card title={`Unassigned (${data.unassigned.length})`}>
            <DropZone
              label="Unassigned mentees"
              canDrop
              onDropMentee={(id) => move(id, UNASSIGNED)}
            >
              <Input
                type="search"
                aria-label="Search unassigned mentees"
                placeholder="Search mentees"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {unassigned.map((m) => card(m, UNASSIGNED))}
              {data.unassigned.length === 0 && <DropHint>Everyone is in a group</DropHint>}
              {data.unassigned.length > 0 && unassigned.length === 0 && (
                <DropHint>No one matches that search</DropHint>
              )}
            </DropZone>
          </Card>

          <div className="grid grid-cols-1 gap-5 lg:col-span-2 xl:grid-cols-2">
            {data.groups.length === 0 && (
              <Card>
                <EmptyState
                  icon="users"
                  title="No 1:1 peer mentors yet"
                  description="Invite peer mentors to this cohort, then group mentees here."
                />
              </Card>
            )}
            {data.groups.map((group) => {
              const mentorId = group.mentor.user.id
              const isFull = group.mentees.length >= MAX_GROUP_SIZE
              return (
                <Card
                  key={group.mentor.id}
                  title={fullName(group.mentor.user)}
                  action={
                    <Chip variant={isFull ? 'ok' : 'default'}>
                      {group.mentees.length} of {MAX_GROUP_SIZE}
                    </Chip>
                  }
                >
                  <DropZone
                    label={`Group for ${fullName(group.mentor.user)}`}
                    canDrop={!isFull}
                    onDropMentee={(id) => move(id, mentorId)}
                  >
                    {group.mentees.map((m) => card(m, mentorId))}
                    {Array.from({ length: MAX_GROUP_SIZE - group.mentees.length }, (_, i) => (
                      <DropHint key={i}>Drag a mentee here</DropHint>
                    ))}
                  </DropZone>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
