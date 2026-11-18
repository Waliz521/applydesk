import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { daysUntil, deadlineUrgency, formatDate, urgencyClass } from '@/lib/dates'
import { regionFilterId, regionFromCatalogue, trackerRegionForRow } from '@/lib/trackerRegion'
import type { Application, ApplicationStatus, Catalogue } from '@/lib/types'

const REGION_ORDER = [
  'Erasmus Mundus',
  'France',
  'Netherlands',
  'Poland',
  'Austria',
  'Hong Kong',
  'Denmark',
  'Finland',
  'Australia',
  'Germany (DAAD)',
  'Other',
]

type SortKey = 'university' | 'programme' | 'country' | 'deadline' | 'status' | 'link'
type Sort = { key: SortKey; dir: 'asc' | 'desc' }

export function ApplicationsPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<Application[]>([])
  const [statuses, setStatuses] = useState<ApplicationStatus[]>([])
  const [catalogues, setCatalogues] = useState<Catalogue[]>([])
  const [filter, setFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState('all')
  const [sort, setSort] = useState<Sort>({ key: 'deadline', dir: 'asc' })
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  async function reload() {
    const [apps, st, cats] = await Promise.all([
      supabase.from('applications').select('*').order('deadline', { ascending: true, nullsFirst: false }),
      supabase.from('application_statuses').select('*').order('sort_order'),
      supabase.from('catalogues').select('*').order('name'),
    ])
    if (apps.error) setError(apps.error.message)
    setRows((apps.data ?? []) as Application[])
    setStatuses((st.data ?? []) as ApplicationStatus[])
    setCatalogues((cats.data ?? []) as Catalogue[])
  }

  useEffect(() => {
    void reload()
  }, [])

  const statusById = useMemo(() => new Map(statuses.map((s) => [s.id, s])), [statuses])
  const cataloguesById = useMemo(() => new Map(catalogues.map((c) => [c.id, c])), [catalogues])

  const regionOptions = useMemo(() => {
    const present = new Set(rows.map((r) => trackerRegionForRow(r, cataloguesById)))
    return REGION_ORDER.filter((name) => present.has(name)).concat(
      [...present].filter((name) => !REGION_ORDER.includes(name)).sort((a, b) => a.localeCompare(b)),
    )
  }, [rows, cataloguesById])

  const statusCounts = useMemo(() => {
    const scoped = rows.filter(
      (r) => regionFilter === 'all' || regionFilterId(trackerRegionForRow(r, cataloguesById)) === regionFilter,
    )
    const bySlug = new Map<string, number>()
    for (const row of scoped) {
      const slug = statusById.get(row.status_id ?? '')?.slug
      if (!slug) continue
      bySlug.set(slug, (bySlug.get(slug) ?? 0) + 1)
    }
    return { total: scoped.length, bySlug }
  }, [rows, regionFilter, cataloguesById, statusById])

  const regionCounts = useMemo(() => {
    const scoped = rows.filter((r) => filter === 'all' || statusById.get(r.status_id ?? '')?.slug === filter)
    const byName = new Map<string, number>()
    for (const row of scoped) {
      const name = trackerRegionForRow(row, cataloguesById)
      byName.set(name, (byName.get(name) ?? 0) + 1)
    }
    return { total: scoped.length, byName }
  }, [rows, filter, cataloguesById, statusById])

  const visible = useMemo(() => {
    const filtered = rows.filter((r) => {
      if (filter !== 'all' && statusById.get(r.status_id ?? '')?.slug !== filter) return false
      if (regionFilter === 'all') return true
      return regionFilterId(trackerRegionForRow(r, cataloguesById)) === regionFilter
    })
    const dir = sort.dir === 'asc' ? 1 : -1
    return filtered.sort((a, b) => compareRows(a, b, sort.key, dir, statusById, cataloguesById))
  }, [rows, filter, regionFilter, sort, statusById, cataloguesById])

  function toggleSort(key: SortKey) {
    setSort((current) =>
      current.key === key ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
    )
  }

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return
    const form = new FormData(e.currentTarget)
    const status = statuses.find((s) => s.slug === 'in_progress') ?? statuses[0]
    const catalogueId = String(form.get('catalogue_id') || '') || null
    const cat = catalogueId ? catalogues.find((c) => c.id === catalogueId) : undefined
    let country = String(form.get('country') || '').trim()
    if (!country && cat) country = regionFromCatalogue(cat)
    const { error: insertError } = await supabase.from('applications').insert({
      user_id: user.id,
      university: String(form.get('university') || ''),
      program_name: String(form.get('program_name') || ''),
      scholarship_name: String(form.get('scholarship_name') || ''),
      country: country || null,
      portal_url: String(form.get('portal_url') || '') || null,
      deadline: String(form.get('deadline') || '') || null,
      catalogue_id: catalogueId,
      status_id: status?.id ?? null,
      notes: String(form.get('notes') || '') || null,
    })
    if (insertError) {
      setError(insertError.message)
      return
    }
    setShowForm(false)
    e.currentTarget.reset()
    await reload()
  }

  async function setStatus(id: string, statusId: string) {
    const { error: updateError } = await supabase.from('applications').update({ status_id: statusId }).eq('id', id)
    if (updateError) setError(updateError.message)
    else await reload()
  }

  async function removeRow(id: string) {
    const { error: deleteError } = await supabase.from('applications').delete().eq('id', id)
    if (deleteError) setError(deleteError.message)
    else await reload()
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Tracker</h1>
          <p className="mt-1 text-sm text-muted">
            Applications you are working on. Filter by status or by country catalogue (France, Erasmus Mundus, and the rest).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy/90"
        >
          {showForm ? 'Close' : 'Add application'}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={(e) => void onCreate(e)} className="grid gap-3 rounded-2xl border border-line bg-white p-5 md:grid-cols-2">
          <Field name="university" label="University" required />
          <Field name="program_name" label="Programme" required />
          <Field name="scholarship_name" label="Scholarship / funding" />
          <Field name="country" label="Country (optional if catalogue is set)" />
          <Field name="portal_url" label="Portal URL" />
          <label className="text-sm font-medium">
            Deadline
            <input name="deadline" type="date" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
          </label>
          <label className="text-sm font-medium md:col-span-2">
            Catalogue
            <select name="catalogue_id" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm">
              <option value="">None / other</option>
              {catalogues.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium md:col-span-2">
            Notes
            <textarea name="notes" rows={2} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
          </label>
          <button type="submit" className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy/90 md:col-span-2">
            Save to tracker
          </button>
        </form>
      ) : null}

      <div
        className="grid grid-cols-3 gap-1.5 rounded-xl border border-line bg-white p-1.5 shadow-[inset_3px_0_0_0_var(--color-gold)] min-[1100px]:grid-cols-[repeat(var(--filter-cols),minmax(0,1fr))]"
        style={{ '--filter-cols': Math.max(statuses.length + 1, 1) } as CSSProperties}
      >
        <FilterChip
          active={filter === 'all'}
          color="var(--color-gold)"
          count={statusCounts.total}
          onClick={() => setFilter('all')}
        >
          All
        </FilterChip>
        {statuses.map((s) => (
          <FilterChip
            key={s.id}
            active={filter === s.slug}
            color={s.color}
            count={statusCounts.bySlug.get(s.slug) ?? 0}
            onClick={() => setFilter(s.slug)}
          >
            {s.label}
          </FilterChip>
        ))}
      </div>

      {regionOptions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          <span className="w-full text-xs font-medium text-muted">Country catalogue</span>
          <RegionChip active={regionFilter === 'all'} count={regionCounts.total} onClick={() => setRegionFilter('all')}>
            All countries
          </RegionChip>
          {regionOptions.map((name) => {
            const id = regionFilterId(name)
            return (
              <RegionChip
                key={id}
                active={regionFilter === id}
                count={regionCounts.byName.get(name) ?? 0}
                onClick={() => setRegionFilter(id)}
              >
                {name}
              </RegionChip>
            )
          })}
        </div>
      ) : null}

      <p className="text-xs text-muted">
        The bar on the left is the status colour. Deadline text is red within 21 days, or already past, and amber from 22 to 45 days.
      </p>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
          {rows.length === 0
            ? 'Nothing in the tracker yet. Add an application, or start from a catalogue programme later.'
            : filter !== 'all' || regionFilter !== 'all'
              ? 'No applications match these filters.'
              : 'No applications with this status.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-[inset_3px_0_0_0_var(--color-gold)]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line text-[11px] font-semibold uppercase tracking-wider text-navy/70">
              <tr>
                <SortHeader label="Country" sortKey="country" sort={sort} onSort={toggleSort} />
                <SortHeader label="University" sortKey="university" sort={sort} onSort={toggleSort} />
                <SortHeader label="Programme" sortKey="programme" sort={sort} onSort={toggleSort} />
                <SortHeader label="Deadline" sortKey="deadline" sort={sort} onSort={toggleSort} />
                <SortHeader label="Status" sortKey="status" sort={sort} onSort={toggleSort} />
                <SortHeader label="Link" sortKey="link" sort={sort} onSort={toggleSort} />
                <th className="w-24 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => {
                const st = statusById.get(row.status_id ?? '')
                const region = trackerRegionForRow(row, cataloguesById)
                const due = daysUntil(row.deadline)
                return (
                  <tr
                    key={row.id}
                    className="border-b border-line last:border-0"
                    style={st?.color ? { boxShadow: `inset 4px 0 0 ${st.color}` } : undefined}
                  >
                    <td className="px-4 py-3 text-slate-700">{region}</td>
                    <td className="px-4 py-3 font-medium">{row.university || '—'}</td>
                    <td className="px-4 py-3">
                      {row.program_name || '—'}
                      {row.scholarship_name ? (
                        <span className="mt-0.5 block text-xs text-muted">{row.scholarship_name}</span>
                      ) : null}
                    </td>
                    <td className={`px-4 py-3 ${urgencyClass(deadlineUrgency(row.deadline))}`}>
                      {formatDate(row.deadline)}
                      {due !== null && due >= 0 ? (
                        <span className="mt-0.5 block text-xs text-muted">{due}d left</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <StatusMenu
                        value={row.status_id ?? ''}
                        options={statuses.map((s) => ({ id: s.id, label: s.label, color: s.color }))}
                        onChange={(statusId) => void setStatus(row.id, statusId)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      {row.portal_url ? (
                        <a href={row.portal_url} target="_blank" rel="noreferrer" className="font-medium text-navy hover:underline">
                          Open
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => void removeRow(row.id)}
                        className="text-sm font-medium text-red-700 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function compareRows(
  a: Application,
  b: Application,
  key: SortKey,
  dir: number,
  statusById: Map<string, ApplicationStatus>,
  cataloguesById: Map<string, Catalogue>,
): number {
  if (key === 'country') {
    return compareText(
      trackerRegionForRow(a, cataloguesById),
      trackerRegionForRow(b, cataloguesById),
      dir,
    )
  }
  if (key === 'university') return compareText(a.university, b.university, dir)
  if (key === 'programme') return compareText(a.program_name, b.program_name, dir)
  if (key === 'link') return compareText(a.portal_url, b.portal_url, dir)
  if (key === 'status') {
    const order = (row: Application) => statusById.get(row.status_id ?? '')?.sort_order ?? 999
    return (order(a) - order(b)) * dir
  }
  return compareText(a.deadline, b.deadline, dir)
}

function compareText(a: string | null, b: string | null, dir: number): number {
  const left = (a ?? '').trim()
  const right = (b ?? '').trim()
  if (!left && !right) return 0
  if (!left) return 1
  if (!right) return -1
  return left.localeCompare(right, undefined, { sensitivity: 'base' }) * dir
}

function SortHeader({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string
  sortKey: SortKey
  sort: Sort
  onSort: (key: SortKey) => void
}) {
  const active = sort.key === sortKey
  return (
    <th className="p-0" aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex w-full items-center gap-1 px-4 py-3 text-left uppercase tracking-wider hover:text-navy"
      >
        {label}
        <span className={active ? 'text-gold' : 'text-navy/25'} aria-hidden="true">
          {active ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </button>
    </th>
  )
}

function Field({ name, label, required }: { name: string; label: string; required?: boolean }) {
  return (
    <label className="text-sm font-medium">
      {label}
      <input
        name={name}
        required={required}
        className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm"
      />
    </label>
  )
}

function RegionChip({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean
  count: number
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ${
        active ? 'bg-sky text-white' : 'bg-white text-slate-600 ring-1 ring-line hover:bg-slate-50'
      }`}
    >
      {children}
      <span className={`tabular-nums ${active ? 'text-white/80' : 'text-muted'}`}>{count}</span>
    </button>
  )
}

function FilterChip({
  active,
  color,
  count,
  onClick,
  children,
}: {
  active: boolean
  color?: string | null
  count: number
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-center text-xs leading-snug ${
        active ? 'bg-navy font-medium text-white' : 'text-navy/80 hover:bg-navy/5'
      }`}
    >
      <span
        className={`size-2 shrink-0 rounded-full ${active ? 'ring-2 ring-white/40' : ''}`}
        style={{ background: color || 'var(--color-navy)' }}
        aria-hidden="true"
      />
      <span>{children}</span>
      <span className={`tabular-nums ${active ? 'text-white/70' : 'text-muted'}`}>{count}</span>
    </button>
  )
}

function StatusMenu({
  value,
  options,
  onChange,
}: {
  value: string
  options: { id: string; label: string; color: string | null }[]
  onChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({})
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listId = useId()
  const selected = options.find((option) => option.id === value)

  function placeMenu() {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    const below = window.innerHeight - rect.bottom
    const openUp = below < 220 && rect.top > below
    setMenuStyle({
      position: 'fixed',
      left: rect.left,
      width: Math.max(rect.width, 176),
      top: openUp ? undefined : rect.bottom + 6,
      bottom: openUp ? window.innerHeight - rect.top + 6 : undefined,
      zIndex: 40,
    })
  }

  useEffect(() => {
    if (!open) return
    placeMenu()
    function onDoc(e: MouseEvent) {
      const target = e.target as Node
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', placeMenu)
    window.addEventListener('scroll', placeMenu, true)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', placeMenu)
      window.removeEventListener('scroll', placeMenu, true)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative min-w-[11rem]">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2 text-left text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky/30 ${
          open ? 'border-sky text-ink' : 'border-line text-ink hover:border-sky/40'
        }`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ background: selected?.color || 'var(--color-navy)' }}
            aria-hidden="true"
          />
          <span className="truncate">{selected?.label ?? 'Status'}</span>
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open
        ? createPortal(
        <ul
          ref={menuRef}
          id={listId}
          role="listbox"
          style={menuStyle}
          className="max-h-64 overflow-auto rounded-xl border border-line bg-white py-1 shadow-lg"
        >
          {options.map((option) => {
            const active = option.id === value
            return (
              <li key={option.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.id)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm ${
                    active ? 'bg-navy font-medium text-white' : 'text-ink hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`size-2 shrink-0 rounded-full ${active ? 'ring-2 ring-white/40' : ''}`}
                    style={{ background: option.color || 'var(--color-navy)' }}
                    aria-hidden="true"
                  />
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>,
        document.body,
      )
        : null}
    </div>
  )
}
