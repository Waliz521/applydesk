export const PRIORITY_ORDER = ['A', 'A-', 'B', 'C'] as const

export function priorityRank(value: string | null | undefined): number {
  const i = PRIORITY_ORDER.indexOf((value ?? '') as (typeof PRIORITY_ORDER)[number])
  return i === -1 ? 99 : i
}

export function priorityClass(value: string | null | undefined): string {
  switch (value) {
    case 'A':
      return 'bg-emerald-600 text-white'
    case 'A-':
      return 'bg-sky text-white'
    case 'B':
      return 'bg-amber-500 text-white'
    case 'C':
      return 'bg-slate-500 text-white'
    default:
      return 'bg-slate-200 text-slate-700'
  }
}

export function openStateClass(state: string): string {
  switch (state) {
    case 'open':
      return 'bg-emerald-100 text-emerald-800'
    case 'upcoming':
      return 'bg-amber-100 text-amber-800'
    case 'closed':
      return 'bg-slate-200 text-slate-600'
    default:
      return 'bg-violet-100 text-violet-800'
  }
}

export function dateStatusClass(status: string | null | undefined): string {
  switch (status) {
    case 'confirmed':
      return 'bg-emerald-100 text-emerald-800'
    case 'expected':
      return 'bg-amber-100 text-amber-900'
    default:
      return 'bg-violet-100 text-violet-800'
  }
}

export function dateStatusLabel(status: string | null | undefined): string {
  if (status === 'confirmed') return 'CONFIRMED'
  if (status === 'expected') return 'EXPECTED'
  if (status === 'tba') return 'TBA'
  return (status || 'TBA').toUpperCase()
}
