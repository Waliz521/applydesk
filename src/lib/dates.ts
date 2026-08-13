export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const d = new Date(`${value}T00:00:00`)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function daysUntil(value: string | null | undefined): number | null {
  if (!value) return null
  const due = new Date(`${value}T00:00:00`).getTime()
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.round((due - now.getTime()) / 86_400_000)
}

export function deadlineUrgency(value: string | null | undefined): 'overdue' | 'urgent' | 'soon' | 'ok' | 'none' {
  const due = daysUntil(value)
  if (due === null) return 'none'
  if (due < 0) return 'overdue'
  if (due <= 21) return 'urgent'
  if (due <= 45) return 'soon'
  return 'ok'
}

export function urgencyClass(kind: ReturnType<typeof deadlineUrgency>): string {
  switch (kind) {
    case 'overdue':
      return 'text-red-700'
    case 'urgent':
      return 'text-red-700 font-semibold'
    case 'soon':
      return 'text-amber-700 font-medium'
    default:
      return 'text-ink'
  }
}

export function cycleState(cycle: {
  application_opens_on: string | null
  scholarship_deadline: string | null
  date_status?: string | null
}): 'open' | 'upcoming' | 'closed' | 'unknown' {
  const today = todayIso()
  const opens = cycle.application_opens_on
  const due = cycle.scholarship_deadline
  const confirmed = (cycle.date_status || '').toLowerCase() === 'confirmed'
  if (opens && opens > today) return 'upcoming'
  if (due && due < today) return 'closed'
  if (opens && opens <= today && (!due || due >= today)) return 'open'
  // Deadline only, no open date: treat as open solely when the window is confirmed
  // (DAAD “send the pack by this date”). An EXPECTED January Erasmus deadline is
  // not an open portal — MUrCS 2026 is closed until the 2027 round.
  if (!opens && due && due >= today) return confirmed ? 'open' : 'unknown'
  if (!opens && !due) return 'unknown'
  return 'unknown'
}
