import type { ReactNode } from 'react'
import { fundingClass, fundingLabel } from '@/lib/funding'
import type { FundingScheme } from '@/lib/types'
import { dateStatusClass, dateStatusLabel, openStateClass, priorityClass } from '@/lib/priority'

export function Badge({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {children}
    </span>
  )
}

export function PriorityBadge({ value }: { value: string | null | undefined }) {
  if (!value) return null
  return <Badge className={priorityClass(value)}>{value}</Badge>
}

export function OpenBadge({ state }: { state: string }) {
  const label = state === 'unknown' ? 'Watch / TBA' : state
  return <Badge className={openStateClass(state)}>{label}</Badge>
}

export function FundingBadge({ scheme }: { scheme: FundingScheme | null }) {
  if (!scheme || scheme === 'none') return null
  return <Badge className={fundingClass(scheme)}>{fundingLabel(scheme)}</Badge>
}

export function DateStatusBadge({ status }: { status: string | null | undefined }) {
  return <Badge className={dateStatusClass(status)}>{dateStatusLabel(status)}</Badge>
}

export function TrackerStatusBadge({ status }: { status: string | null | undefined }) {
  if (!status) return null
  const slug = status.toLowerCase()
  if (slug === 'submitted' || slug === 'applied') {
    return <Badge className="bg-violet-100 text-violet-900 ring-1 ring-violet-200">Applied</Badge>
  }
  if (slug === 'accepted' || slug === 'offer' || slug === 'enrolled' || slug === 'won') {
    return <Badge className="bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200">Offer</Badge>
  }
  if (slug === 'in_progress') {
    return <Badge className="bg-amber-100 text-amber-900 ring-1 ring-amber-200">In progress</Badge>
  }
  if (slug === 'watching') {
    return <Badge className="bg-slate-100 text-slate-700 ring-1 ring-slate-200">Watching</Badge>
  }
  return <Badge className="bg-slate-100 text-slate-700 ring-1 ring-slate-200">{status.replace(/_/g, ' ')}</Badge>
}
