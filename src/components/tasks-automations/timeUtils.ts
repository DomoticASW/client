/**
 * Format a Typescript Date to a Datetime local for html datetime-local input
 * @param date
 * @returns
 */
export function formatDateForDatetimeLocalInput(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1) // Months are 0-based
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Get a human readable date from a Typescript date
 * @param date
 * @returns dd/mm/yy hh:mm where yy are the last 2 digits of the year
 */
export function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const yy = String(date.getFullYear()).slice(-2) // Get last two digits of year
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')

  return `${dd}/${mm}/${yy} ${hh}:${min}`
}

/**
 * Return a string of a human readable duration, going from seconds to seconds, minutes, hours and days
 * e.g.
 * 200 seconds -> 3 minutes and 20 seconds
 * 3600 seconds -> 1 hour
 * 3665 seconds -> 1 hour, 1 minute and 5 seconds
 * 7201 seconds -> 2 hours and 1 second
 * @param seconds
 * @returns
 */
export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts: string[] = []

  if (days > 0) {
    parts.push(`${days} day${days !== 1 ? 's' : ''}`)
  }
  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`)
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`)
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs} second${secs !== 1 ? 's' : ''}`)
  }

  return parts.join(' ')
}

/**
 * Given a value and a time unit (so, a time, e.g. 2 hours), return the seconds that are present in that time
 * @param value
 * @param unit
 * @returns
 */
export function convertToSeconds(
  value: number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days'
): number {
  switch (unit) {
    case 'seconds':
      return value
    case 'minutes':
      return value * 60
    case 'hours':
      return value * 3600
    case 'days':
      return value * 86400
    default:
      throw new Error(`Unsupported time unit: ${unit}`)
  }
}

/**
 * Given the seconds, returns the largest time unit (seconds, minutes, hours, days) in which they can be fully and exactly decomposed
 * along with the value of that time unit, without remainder
 * e.g.
 * 3600 seconds -> 2 hours
 * 3602 seconds -> 3602 seconds
 * 3660 seconds -> 61 minutes
 * 60 seconds -> 1 minute
 * 119 seconds -> 119 seconds
 * @param seconds
 * @returns
 */
export function decomposeToLargestUnit(seconds: number): {
  value: number
  unit: 'seconds' | 'minutes' | 'hours' | 'days'
} {
  if (seconds % 86400 === 0) {
    return { value: seconds / 86400, unit: 'days' }
  } else if (seconds % 3600 === 0) {
    return { value: seconds / 3600, unit: 'hours' }
  } else if (seconds % 60 === 0) {
    return { value: seconds / 60, unit: 'minutes' }
  } else {
    return { value: seconds, unit: 'seconds' }
  }
}
