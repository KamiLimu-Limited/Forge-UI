import { ApiError } from '@/types/auth'

// The API's own message when there is one, otherwise the fallback.
// Network failures get a plain explanation instead of "Failed to fetch".
export function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message
  if (err instanceof TypeError)
    return "We couldn't reach the server. Check your connection and try again."
  return fallback
}
