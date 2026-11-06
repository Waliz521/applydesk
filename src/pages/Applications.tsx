import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { daysUntil, deadlineUrgency, formatDate, urgencyClass } from '@/lib/dates'
import type { Application, ApplicationStatus, Catalogue } from '@/lib/types'

type SortKey = 'university' | 'programme' | 'deadline' | 'status' | 'link'
type Sort = { key: SortKey; dir: 'asc' | 'desc' }

export function ApplicationsPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<Application[]>([])
  const [statuses, setStatuses] = useState<ApplicationStatus[]>([])
  const [catalogues, setCatalogues] = useState<Catalogue[]>([])
  const [filter, setFilter] = useState('all')
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
  const visible = useMemo(() => {
    const filtered = rows.filter((r) => {
      if (filter === 'all') return true
      return statusById.get(r.status_id ?? '')?.slug === filter
    })
    const dir = sort.dir === 'asc' ? 1 : -1
    return filtered.sort((a, b) => compareRows(a, b, sort.key, dir, statusById))
  }, [rows, filter, sort, statusById])

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
    const { error: insertError } = await supabase.from('applications').insert({
      user_id: user.id,
      university: String(form.get('university') || ''),
      program_name: String(form.get('program_name') || ''),
      scholarship_name: String(form.get('scholarship_name') || ''),
      country: String(form.get('country') || ''),
      portal_url: String(form.get('portal_url') || '') || null,
      deadline: String(form.get('deadline') || '') || null,
      catalogue_id: String(form.get('catalogue_id') || '') || null,
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
          <p className="mt-1 text-sm text-muted">Applications you are actually working on — not the full catalogue.</p>
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
          <Field name="country" label="Country" />
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
        <FilterChip active={filter === 'all'} color="var(--color-gold)" onClick={() => setFilter('all')}>
          All
        </FilterChip>
        {statuses.map((s) => (
          <FilterChip key={s.id} active={filter === s.slug} color={s.color} onClick={() => setFilter(s.slug)}>
            {s.label}
          </FilterChip>
        ))}
      </div>

      <p className="text-xs text-muted">
        The bar on the left is the status colour. Deadline text is red within 21 days, or already past, and amber from 22 to 45 days.
      </p>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
          {rows.length === 0
            ? 'Nothing in the tracker yet. Add an application, or start from a catalogue programme later.'
            : 'No applications with this status.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-[inset_3px_0_0_0_var(--color-gold)]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line text-[11px] font-semibold uppercase tracking-wider text-navy/70">
              <tr>
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
                const due = daysUntil(row.deadline)
                return (
                  <tr
                    key={row.id}
                    className="border-b border-line last:border-0"
                    style={st?.color ? { boxShadow: `inset 4px 0 0 ${st.color}` } : undefined}
                  >
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
                      <select
                        value={row.status_id ?? ''}
                        onChange={(e) => void setStatus(row.id, e.target.value)}
                        className="rounded-lg border border-line px-2 py-1 text-sm"
                      >
                        {statuses.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
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
): number {
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

function FilterChip({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean
  color?: string | null
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
      {children}
    </button>
  )
}
