// =============================================================================
// Date, time and name formatting for the admin screens.
// Dates read like "Thu 27 Aug" and times like "5:30 PM", in the viewer's time zone.
// =============================================================================

const dayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

const longDateFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const shortDateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const timeFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' })

// "YYYY-MM-DD" as a local date, so it never shifts a day across time zones
export function parseDateOnly(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day)
}

// "Thu 27 Aug"
export function formatDay(value: string | Date): string {
  return dayFormat.format(typeof value === 'string' ? new Date(value) : value).replace(',', '')
}

// "Thu 26 March 2026" from a date-only value
export function formatLongDate(value: string): string {
  return longDateFormat.format(parseDateOnly(value)).replace(',', '')
}

// "26 Mar 2026" from a date-only value
export function formatShortDate(value: string): string {
  return shortDateFormat.format(parseDateOnly(value))
}

// "5:30 PM"
export function formatTime(value: string | Date): string {
  return timeFormat.format(typeof value === 'string' ? new Date(value) : value)
}

// "5:30 PM to 8:00 PM"
export function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)} to ${formatTime(end)}`
}

// "Thu 27 Aug, 5:30 PM"
export function formatDateTime(value: string): string {
  return `${formatDay(value)}, ${formatTime(value)}`
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// "Today, 9:14 AM", "Yesterday, 4:02 PM" or "Mon 25 Aug, 2:15 PM"
export function formatRelativeDateTime(value: string, now: Date = new Date()): string {
  const date = new Date(value)
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (sameDay(date, now)) return `Today, ${formatTime(date)}`
  if (sameDay(date, yesterday)) return `Yesterday, ${formatTime(date)}`
  return `${formatDay(date)}, ${formatTime(date)}`
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

// Value for <input type="datetime-local"> in the viewer's time zone
export function toDateTimeLocal(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// ISO string from a datetime-local value, or null when empty or not a date
export function fromDateTimeLocal(value: string): string | null {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

// Monday 00:00 to the next Monday 00:00 around `now`
export function currentWeek(now: Date = new Date()): { start: Date; end: Date } {
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  const end = new Date(start)
  end.setDate(start.getDate() + 7)
  return { start, end }
}

export function fullName(person: { first_name: string | null; last_name: string | null }): string {
  return `${person.first_name ?? ''} ${person.last_name ?? ''}`.trim()
}

// "1 point", "3 points"
export function plural(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`
}
