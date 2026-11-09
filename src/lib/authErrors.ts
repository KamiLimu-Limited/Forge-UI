// =============================================================================
// Which auth failures get their own screen. The API sends only readable messages (the
// `error` code is a generic bad_request), so these match the message text. That breaks
// if the wording changes, so docs/api-gaps.md asks for stable error codes.
// =============================================================================

import { ApiError } from '@/types/auth'

const DEAD_INVITATION = [
  'invitation has expired',
  'invitation has already been used',
  'invalid invitation token',
]

const DEAD_RESET = [
  'reset token has expired',
  'reset token has already been used',
  'invalid reset token',
]

const SUSPENDED = ['account is suspended']

function matches(err: unknown, messages: string[]): boolean {
  if (!(err instanceof ApiError)) return false
  const text = err.message.toLowerCase()
  return messages.some((message) => text.includes(message))
}

// The invitation link has expired, was used, or was never valid
export function isDeadInvitation(err: unknown): boolean {
  return matches(err, DEAD_INVITATION)
}

// The reset link has expired, was used, or was never valid
export function isDeadResetLink(err: unknown): boolean {
  return matches(err, DEAD_RESET)
}

export function isSuspendedAccount(err: unknown): boolean {
  return matches(err, SUSPENDED)
}
