import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ProgrammeCard } from '@/components/ProgrammeCard'
import { PriorityBadge } from '@/components/Badges'
import { useAuth } from '@/context/AuthContext'
import { priorityRank } from '@/lib/priority'
import { addProgrammeToTracker } from '@/lib/tracker'
import { supabase } from '@/lib/supabase'
import type { Catalogue, Programme, ProgrammeCycle } from '@/lib/types'

const PRIORITY_FILTERS = ['all', 'A', 'A-', 'B', 'C'] as const

export function CataloguePage() {
  const { user, profile } = useAuth()
  const [catalogues, setCatalogues] = useState<Catalogue[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [tracked, setTracked] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState('')
  const [priority, setPriority] = useState<(typeof PRIORITY_FILTERS)[number]>('all')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const canEdit = Boolean(profile?.is_admin)

  async function loadCatalogues() {
    const { data, error: loadError } = await supabase.from('catalogues').select('*').order('name')
    if (loadError) setError(loadError.message)
    const list = (data ?? []) as Catalogue[]
    setCatalogues(list)
    setActiveId((current) => {
      if (current) return current
      return list.find((c) => c.slug === 'erasmus-mundus')?.id ?? list[0]?.id ?? null
    })
  }

  useEffect(() => {
    void loadCatalogues()
    void supabase
      .from('applications')
      .select('programme_id')
      .then(({ data }) => {
        setTracked(new Set((data ?? []).map((a) => a.programme_id).filter(Boolean) as string[]))
      })
  }, [])

  useEffect(() => {
    if (!activeId) {
      setProgrammes([])
      return
    }
    let cancelled = false
    supabase
      .from('programmes')
      .select('*, cycles:programme_cycles(*)')
      .eq('catalogue_id', activeId)
      .order('name')
      .then(({ data, error: loadError }) => {
        if (cancelled) return
        if (loadError) setError(loadError.message)
        const list = ((data ?? []) as Programme[]).map((p) => ({
          ...p,
          cycles: [...(p.cycles ?? [])].sort((a, b) => (a.label < b.label ? 1 : -1)),
        }))
        list.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || a.name.localeCompare(b.name))
        setProgrammes(list)
      })
    return () => {
      cancelled = true
    }
  }, [activeId])

  const active = catalogues.find((c) => c.id === activeId)
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return programmes.filter((p) => {
      if (priority !== 'all' && p.priority !== priority) return false
      if (!q) return true
      const blob = [p.acronym, p.name, p.official_title, p.coordinator, p.fit_notes].join(' ').toLowerCase()
      return blob.includes(q)
    })
  }, [programmes, query, priority])

  async function addProgramme(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!activeId) return
    const form = new FormData(e.currentTarget)
    const { error: insertError } = await supabase.from('programmes').insert({
      catalogue_id: activeId,
      acronym: String(form.get('acronym') || '') || null,
      name: String(form.get('name') || ''),
      website: String(form.get('website') || '') || null,
      apply_url: String(form.get('apply_url') || '') || null,
      coordinator: String(form.get('coordinator') || '') || null,
      fit_notes: String(form.get('fit_notes') || '') || null,
      priority: String(form.get('priority') || '') || null,
    })
    if (insertError) {
      setError(insertError.message)
      return
    }
    setShowForm(false)
    e.currentTarget.reset()
    const { data } = await supabase
      .from('programmes')
      .select('*, cycles:programme_cycles(*)')
      .eq('catalogue_id', activeId)
      .order('name')
    setProgrammes((data ?? []) as Programme[])
  }

  async function track(programme: Programme) {
    if (!user) return
    setBusyId(programme.id)
    setNotice(null)
    const cycle: ProgrammeCycle | undefined = programme.cycles?.[0]
    const result = await addProgrammeToTracker({
      userId: user.id,
      programme,
      cycle,
      catalogueId: activeId,
    })
    setBusyId(null)
    if (result.error) {
      setError(result.error)
      return
    }
    setTracked((prev) => new Set(prev).add(programme.id))
    setNotice(result.already ? 'Already in your tracker.' : `Added ${programme.acronym ?? programme.name} to tracker.`)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Catalogues</h1>
        <p className="mt-1 text-sm text-muted">
          Erasmus Mundus is one family. Search, filter by priority, open details, then send a programme to your tracker.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {catalogues.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveId(c.id)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              c.id === activeId ? 'bg-navy text-white' : 'bg-white text-slate-600 ring-1 ring-line hover:bg-slate-50'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {active ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{active.name}</h2>
                <p className="mt-1 text-sm text-muted">{active.description}</p>
                <p className="mt-2 text-xs text-muted">{programmes.length} programmes · {visible.length} shown</p>
              </div>
              {canEdit ? (
                <button
                  type="button"
                  onClick={() => setShowForm((v) => !v)}
                  className="rounded-lg bg-sky px-3 py-2 text-sm font-semibold text-white"
                >
                  {showForm ? 'Close' : 'Add programme'}
                </button>
              ) : null}
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search GEM, water, ITC, forest…"
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-sky"
              />
              <div className="flex flex-wrap gap-1.5">
                {PRIORITY_FILTERS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      priority === p ? 'bg-ink text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {p === 'all' ? 'All' : p}
                  </button>
                ))}
              </div>
            </div>

            {showForm && canEdit ? (
              <form onSubmit={(e) => void addProgramme(e)} className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="text-sm font-medium">
                  Acronym
                  <input name="acronym" placeholder="GEM" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
                </label>
                <label className="text-sm font-medium">
                  Name
                  <input name="name" required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
                </label>
                <label className="text-sm font-medium">
                  Priority
                  <select name="priority" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm">
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </label>
                <label className="text-sm font-medium">
                  Website
                  <input name="website" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
                </label>
                <label className="text-sm font-medium md:col-span-2">
                  Coordinator
                  <input name="coordinator" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
                </label>
                <label className="text-sm font-medium md:col-span-2">
                  Notes
                  <textarea name="fit_notes" rows={2} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
                </label>
                <button type="submit" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white md:col-span-2">
                  Save programme
                </button>
              </form>
            ) : null}
          </div>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          {notice ? <p className="text-sm text-emerald-800">{notice}</p> : null}

          {visible.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
              No programmes match this filter.
            </p>
          ) : (
            <div className="grid items-start gap-3 md:grid-cols-2">
              {visible.map((p) => (
                <ProgrammeCard
                  key={p.id}
                  programme={p}
                  cycle={p.cycles?.[0]}
                  tracked={tracked.has(p.id)}
                  tracking={busyId === p.id}
                  onTrack={() => void track(p)}
                />
              ))}
            </div>
          )}

          {active.slug === 'erasmus-mundus' ? (
            <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
              Priority key:
              <PriorityBadge value="A" /> core GIS
              <PriorityBadge value="A-" /> water + spatial
              <PriorityBadge value="B" /> secondary
              <PriorityBadge value="C" /> weak GIS / watch
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
