import { differenceInDays } from 'date-fns'

type TimeTemplate = 'seconds' | 'minute' | 'minutes' | 'hour' | 'hours' | 'day' | 'days' | 'month' | 'months' | 'year' | 'years'

export function timeAgo (time: number | Date): string {
  function template (t: TimeTemplate, n: number): string {
    const templates: Record<TimeTemplate, string> = {
      seconds: 'Less than a minute',
      minute: 'About 1 minute',
      minutes: '%d minutes',
      hour: 'About 1 hour',
      hours: 'About %d hours',
      day: '1 day',
      days: '%d days',
      month: 'About 1 month',
      months: '%d months',
      year: 'About 1 year',
      years: '%d years',
    }
    return templates[t] && templates[t].replace(/%d/i, String(Math.abs(Math.round(n)))) + ' ago'
  }

  // time components
  const now = new Date()
  const timeValue = typeof time === 'number' ? time : time.getTime()
  const seconds = ((now.getTime() - timeValue) * 0.001) >> 0
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  const years = days / 365

  // return text
  if (seconds < 45) {
    return template('seconds', seconds)
  }
  if (seconds < 90) {
    return template('minute', 1)
  }
  if (minutes < 45) {
    return template('minutes', minutes)
  }
  if (minutes < 90) {
    return template('hour', 1)
  }
  if (hours < 24) {
    return template('hours', hours)
  }
  if (hours < 42) {
    return template('day', 1)
  }
  if (days < 30) {
    return template('days', days)
  }
  if (days < 45) {
    return template('month', 1)
  }
  if (days < 365) {
    return template('months', days / 30)
  }
  if (years < 1) {
    return template('year', 1)
  }
  return template('years', years)
}

export function getVisitTime (timestamp: number, relative: boolean): string {
  return relative
    ? timeAgo(timestamp)
    : new Date(timestamp).toISOString().substring(0, 19).replace(/[TZ]/g, ' ')
}

export function isWithinDays (date: string | Date, days: number = 30): boolean {
  return date
    ? differenceInDays(new Date(), new Date(date)) < days
    : false
}
