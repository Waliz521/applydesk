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
