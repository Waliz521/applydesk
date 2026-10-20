import { useEffect, useId, useRef, useState } from 'react'
import { fundingScheme } from '@/lib/funding'
import { priorityRank } from '@/lib/priority'
import type { OpenRow } from '@/lib/types'

export type CycleSort = 'deadline' | 'opens' | 'priority'
export type CycleFamily =
  | 'all'
  | 'erasmus-mundus'
  | 'daad'
  | 'austria'
  | 'netherlands'
  | 'poland'
  | 'hong-kong'
  | 'france'
  | 'denmark'
  | 'finland'
  | 'other'

/** Coarse funding filter for dashboard sections. */
export type CycleFunding = 'all' | 'scholarship' | 'partial' | 'self_funded'

export type CycleFilters = {
  family: CycleFamily
  funding: CycleFunding
  month: string
  sort: CycleSort
}

export const DEFAULT_CYCLE_FILTERS: CycleFilters = {
  family: 'all',
  funding: 'all',
  month: 'all',
  sort: 'deadline',
}

const FAMILY_OPTIONS: { id: CycleFamily; label: string }[] = [
  { id: 'all', label: 'All catalogues' },
  { id: 'erasmus-mundus', label: 'EMJM / Erasmus Mundus' },
  { id: 'daad', label: 'DAAD (non-EPOS)' },
  { id: 'austria', label: 'Austria' },
  { id: 'netherlands', label: 'Netherlands' },
  { id: 'poland', label: 'Poland' },
  { id: 'hong-kong', label: 'Hong Kong' },
  { id: 'france', label: 'France' },
  { id: 'denmark', label: 'Denmark' },
  { id: 'finland', label: 'Finland' },
  { id: 'other', label: 'Other' },
]

const FUNDING_OPTIONS: { id: CycleFunding; label: string }[] = [
  { id: 'all', label: 'All funding' },
  { id: 'scholarship', label: 'Scholarship (full)' },
  { id: 'partial', label: 'Partial scholarship' },
  { id: 'self_funded', label: 'Self-funded' },
]

const SORT_OPTIONS: { id: CycleSort; label: string }[] = [
  { id: 'deadline', label: 'Deadline (soonest)' },
  { id: 'opens', label: 'Opens (soonest)' },
  { id: 'priority', label: 'Priority (A first)' },
]

export function cycleMonthKey(row: OpenRow): string | null {
  const raw = row.scholarship_deadline || row.self_funded_deadline || row.application_opens_on
  if (!raw || raw.length < 7) return null
  return raw.slice(0, 7)
}

/** All YYYY-MM keys that matter for filtering (opens + deadlines). */
export function cycleMonthKeys(row: OpenRow): string[] {
  const keys = new Set<string>()
  for (const raw of [row.application_opens_on, row.scholarship_deadline, row.self_funded_deadline]) {
    if (raw && raw.length >= 7) keys.add(raw.slice(0, 7))
  }
  return [...keys]
}

export function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number)
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${names[(m ?? 1) - 1] ?? m} ${y}`
}

export function familyOf(row: OpenRow): CycleFamily {
  const slug = row.catalogue.slug
  if (
    slug === 'erasmus-mundus' ||
    slug === 'daad' ||
    slug === 'austria' ||
    slug === 'netherlands' ||
    slug === 'poland' ||
    slug === 'hong-kong' ||
    slug === 'france' ||
    slug === 'denmark' ||
    slug === 'finland'
  ) {
    return slug
  }
  return 'other'
}

/** Map detailed schemes → Scholarship / Partial / Self-funded. */
export function fundingBucket(row: OpenRow): CycleFunding {
  const scheme = fundingScheme(row.programme, row.catalogue.name)
  switch (scheme) {
    case 'partial':
      return 'partial'
    case 'self_funded':
    case 'none':
      return 'self_funded'
    case 'emjm':
    case 'full':
    case 'nawa':
    case 'oead':
    case 'epos':
    case 'study_scholarship':
      return 'scholarship'
    default:
      return 'self_funded'
  }
}

export function monthsFromRows(rows: OpenRow[]): string[] {
  const keys = new Set<string>()
  for (const row of rows) {
    for (const key of cycleMonthKeys(row)) keys.add(key)
  }
  return [...keys].sort()
}

export function applyCycleFilters(rows: OpenRow[], filters: CycleFilters): OpenRow[] {
  let list = rows
  if (filters.family !== 'all') {
    list = list.filter((r) => familyOf(r) === filters.family)
  }
  if (filters.funding !== 'all') {
    list = list.filter((r) => fundingBucket(r) === filters.funding)
  }
  if (filters.month !== 'all') {
    // Match opens OR any deadline in that month (not deadline-only — that hid GEM/GroundwatCH in Oct).
    list = list.filter((r) => cycleMonthKeys(r).includes(filters.month))
  }
  const sorted = [...list]
  sorted.sort((a, b) => {
    if (filters.sort === 'priority') {
      const pr = priorityRank(a.programme.priority) - priorityRank(b.programme.priority)
      if (pr !== 0) return pr
    }
    if (filters.sort === 'opens') {
      const oa = a.application_opens_on || '9999'
      const ob = b.application_opens_on || '9999'
      if (oa !== ob) return oa.localeCompare(ob)
    }
    const da = a.scholarship_deadline || a.self_funded_deadline || '9999'
    const db = b.scholarship_deadline || b.self_funded_deadline || '9999'
    return da.localeCompare(db)
  })
  return sorted
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { id: string; label: string }[]
  onChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = options.find((o) => o.id === value)?.label ?? options[0]?.label ?? ''

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1 sm:min-w-[10.5rem] sm:flex-none sm:basis-[11.5rem]">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2.5 text-left text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky/30 ${
          open ? 'border-sky text-ink' : 'border-line text-ink hover:border-sky/40'
        }`}
      >
        <span className="truncate">{selected}</span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1.5 max-h-64 w-full min-w-[12rem] overflow-auto rounded-xl border border-line bg-white py-1 shadow-lg sm:w-max sm:min-w-full"
        >
          {options.map((opt) => {
            const active = opt.id === value
            return (
              <li key={opt.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.id)
                    setOpen(false)
                  }}
                  className={`flex w-full px-3.5 py-2 text-left text-sm ${
                    active ? 'bg-navy font-medium text-white' : 'text-ink hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

export function CycleFilterBar({
  filters,
  months,
  onChange,
  onReset,
}: {
  filters: CycleFilters
  months: string[]
  onChange: (next: CycleFilters) => void
  onReset: () => void
}) {
  const dirty =
    filters.family !== 'all' ||
    filters.funding !== 'all' ||
    filters.month !== 'all' ||
    filters.sort !== DEFAULT_CYCLE_FILTERS.sort

  const monthOptions = [
    { id: 'all', label: 'All months' },
    ...months.map((key) => ({ id: key, label: monthLabel(key) })),
  ]

  return (
    <div className="mb-4 rounded-2xl border border-line bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <FilterSelect
          label="Catalogue"
          value={filters.family}
          options={FAMILY_OPTIONS}
          onChange={(id) => onChange({ ...filters, family: id as CycleFamily, month: 'all' })}
        />
        <FilterSelect
          label="Funding"
          value={filters.funding}
          options={FUNDING_OPTIONS}
          onChange={(id) => onChange({ ...filters, funding: id as CycleFunding })}
        />
        <FilterSelect
          label="Month"
          value={filters.month}
          options={monthOptions}
          onChange={(id) => onChange({ ...filters, month: id })}
        />
        <FilterSelect
          label="Sort"
          value={filters.sort}
          options={SORT_OPTIONS}
          onChange={(id) => onChange({ ...filters, sort: id as CycleSort })}
        />
        {dirty ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-[42px] items-center justify-center rounded-xl border border-line bg-slate-50 px-3.5 text-sm font-medium text-sky-dark transition-colors hover:border-sky/40 hover:bg-sky/10 sm:ml-auto"
          >
            Reset filters
          </button>
        ) : null}
      </div>
    </div>
  )
}
