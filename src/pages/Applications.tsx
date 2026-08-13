import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { daysUntil, deadlineUrgency, formatDate, urgencyClass } from '@/lib/dates'
import type { Application, ApplicationStatus, Catalogue } from '@/lib/types'

export function ApplicationsPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<Application[]>([])
  const [statuses, setStatuses] = useState<ApplicationStatus[]>([])
  const [catalogues, setCatalogues] = useState<Catalogue[]>([])
  const [filter, setFilter] = useState('all')
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
  const visible = rows.filter((r) => {
    if (filter === 'all') return true
    return statusById.get(r.status_id ?? '')?.slug === filter
  })

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
          className="rounded-lg bg-sky px-4 py-2 text-sm font-semibold text-white hover:bg-sky-dark"
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
          <button type="submit" className="rounded-lg bg-sky px-4 py-2 text-sm font-semibold text-white md:col-span-2">
            Save to tracker
          </button>
        </form>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
          All
        </FilterChip>
        {statuses.map((s) => (
          <FilterChip key={s.id} active={filter === s.slug} onClick={() => setFilter(s.slug)}>
            {s.label}
          </FilterChip>
        ))}
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
          Nothing in the tracker yet. Add an application, or start from a catalogue programme later.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-slate-50 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">University</th>
                <th className="px-4 py-3">Programme</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Link</th>
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
                        <a href={row.portal_url} target="_blank" rel="noreferrer" className="text-sky hover:underline">
                          Open
                        </a>
                      ) : (
                        '—'
                      )}
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
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm ${active ? 'bg-sky text-white' : 'bg-white text-slate-600 ring-1 ring-line'}`}
    >
      {children}
    </button>
  )
}
