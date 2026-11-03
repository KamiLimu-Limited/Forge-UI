// =============================================================================
// Where each notification takes the person who taps it
// =============================================================================

import { MENTEE_ROUTES, menteeSessionRoute } from '@/lib/menteeRoutes'
import type { NotificationResponse } from '@/types/notification'

export function notificationHref(notification: NotificationResponse): string {
  if (notification.related_resource_type === 'session' && notification.related_resource_id) {
    return menteeSessionRoute(notification.related_resource_id)
  }
  if (notification.notification_type.startsWith('extra_activity')) return MENTEE_ROUTES.activities
  if (notification.notification_type.startsWith('override')) return MENTEE_ROUTES.sessionHistory
  return MENTEE_ROUTES.sessions
}
