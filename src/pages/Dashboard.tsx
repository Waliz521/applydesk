import { useEffect, useMemo, useState } from 'react'
import { CatalogueSelect } from '@/components/CatalogueSelect'
import { ProgrammeCard } from '@/components/ProgrammeCard'
import { useAuth } from '@/context/AuthContext'
import { cycleState } from '@/lib/dates'
import { addProgrammeToTracker } from '@/lib/tracker'
import { supabase } from '@/lib/supabase'
import type { Application, Catalogue, OpenRow, Programme, ProgrammeCycle } from '@/lib/types'

export function DashboardPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<OpenRow[]>([])
  const [catalogues, setCatalogues] = useState<Catalogue[]>([])
  const [catalogueId, setCatalogueId] = useState('all')
  const [tracked, setTracked] = useState<Set<string>>(new Set())
  const [appCount, setAppCount] = useState(0)
  const [inProgress, setInProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const [cyclesRes, appsRes, statusesRes, catsRes] = await Promise.all([
        supabase
          .from('programme_cycles')
          .select('*, programme:programmes(*, catalogue:catalogues(*))')
          .order('scholarship_deadline', { ascending: true, nullsFirst: false }),
        supabase.from('applications').select('id, status_id, programme_id'),
        supabase.from('application_statuses').select('id, slug'),
        supabase.from('catalogues').select('*').eq('is_archived', false).order('name'),
      ])
      if (cancelled) return
      if (cyclesRes.error) setError(cyclesRes.error.message)
      const mapped: OpenRow[] = (cyclesRes.data ?? []).flatMap((row) => {
        const cycle = row as ProgrammeCycle & {
          programme: (Programme & { catalogue: Catalogue | Catalogue[] | null }) | null
        }
        const programme = cycle.programme
        if (!programme || Array.isArray(programme)) return []
        const catalogue = Array.isArray(programme.catalogue)
          ? programme.catalogue[0]
          : programme.catalogue
        if (!catalogue) return []
        return [
          {
            ...cycle,
            programme,
            catalogue,
            open_state: cycleState(cycle),
          },
        ]
      })
      setRows(mapped)
      setCatalogues((catsRes.data ?? []) as Catalogue[])
      const apps = (appsRes.data ?? []) as Pick<Application, 'id' | 'status_id' | 'programme_id'>[]
      setAppCount(apps.length)
      setTracked(new Set(apps.map((a) => a.programme_id).filter(Boolean) as string[]))
      const progressIds = new Set(
        (statusesRes.data ?? [])
          .filter((s) => s.slug === 'in_progress' || s.slug === 'watching')
          .map((s) => s.id),
      )
      setInProgress(apps.filter((a) => a.status_id && progressIds.has(a.status_id)).length)
      setLoading(false)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const visibleRows = useMemo(
    () => (catalogueId === 'all' ? rows : rows.filter((r) => r.catalogue.id === catalogueId)),
    [rows, catalogueId],
  )
  const openRows = useMemo(() => visibleRows.filter((r) => r.open_state === 'open'), [visibleRows])
  const upcoming = useMemo(() => visibleRows.filter((r) => r.open_state === 'upcoming'), [visibleRows])
  const watch = useMemo(() => visibleRows.filter((r) => r.open_state === 'unknown'), [visibleRows])
  const selectedCatalogue = catalogues.find((c) => c.id === catalogueId)

  async function track(row: OpenRow) {
    if (!user) return
    setBusyId(row.programme.id)
    setNotice(null)
    const result = await addProgrammeToTracker({
      userId: user.id,
      programme: row.programme,
      cycle: row,
      catalogueId: row.catalogue.id,
    })
    setBusyId(null)
    if (result.error) {
      setError(result.error)
      return
    }
    setTracked((prev) => new Set(prev).add(row.programme.id))
    setAppCount((n) => n + (result.already ? 0 : 1))
    setNotice(result.already ? `${row.programme.acronym} is already in your tracker.` : `Added ${row.programme.acronym} to tracker.`)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            {selectedCatalogue
              ? `${selectedCatalogue.name}. Open calls first, then TBA. Re-check EXPECTED dates on the official site.`
              : 'All catalogues. Open calls first, then TBA. Re-check EXPECTED dates on the official site.'}
          </p>
          {selectedCatalogue?.slug === 'daad' ? (
            <p className="mt-2 text-sm text-slate-600">
              Orange <span className="font-medium">EPOS · 2 yr work</span> is a named development course (apply to the university).
              Teal <span className="font-medium">Not EPOS</span> is not on that list (e.g. EAGLE) — no two-year rule, and Pakistan’s DAAD master’s list does not currently include Study Scholarships for all disciplines.
            </p>
          ) : null}
        </div>
        <CatalogueSelect catalogues={catalogues} value={catalogueId} onChange={setCatalogueId} />
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Open now" value={loading ? '…' : String(openRows.length)} tone="emerald" />
        <Stat label="Opening soon" value={loading ? '…' : String(upcoming.length)} tone="amber" />
        <Stat
          label="In your tracker"
          value={loading ? '…' : String(appCount)}
          hint={inProgress ? `${inProgress} watching / in progress` : 'Add from a card'}
          tone="sky"
        />
      </section>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-800">{notice}</p> : null}

      <CycleSection
        title="Open now"
        empty={
          catalogueId === 'all'
            ? 'Nothing with an open window in the catalogue yet.'
            : 'Nothing open in this catalogue right now.'
        }
        loading={loading}
        rows={openRows}
        tracked={tracked}
        busyId={busyId}
        onTrack={track}
      />
      <CycleSection
        title="Opening soon"
        empty="No upcoming open dates stored yet."
        loading={false}
        rows={upcoming}
        tracked={tracked}
        busyId={busyId}
        onTrack={track}
      />
      <CycleSection
        title="Watch — dates TBA"
        empty="Every programme in this view has dates."
        loading={false}
        rows={watch}
        tracked={tracked}
        busyId={busyId}
        onTrack={track}
      />
    </div>
  )
}

function CycleSection({
  title,
  empty,
  loading,
  rows,
  tracked,
  busyId,
  onTrack,
}: {
  title: string
  empty: string
  loading: boolean
  rows: OpenRow[]
  tracked: Set<string>
  busyId: string | null
  onTrack: (row: OpenRow) => void
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">
        {title} <span className="text-sm font-normal text-muted">({rows.length})</span>
      </h2>
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-white p-6 text-sm text-muted">{empty}</p>
      ) : (
        <div className="grid items-start gap-3 md:grid-cols-2">
          {rows.map((row) => (
            <ProgrammeCard
              key={row.id}
              programme={row.programme}
              cycle={row}
              catalogueName={row.catalogue.name}
              openState={row.open_state}
              tracked={tracked.has(row.programme.id)}
              tracking={busyId === row.programme.id}
              onTrack={() => onTrack(row)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: string
  hint?: string
  tone: 'emerald' | 'amber' | 'sky'
}) {
  const ring =
    tone === 'emerald' ? 'border-emerald-200 bg-emerald-50' : tone === 'amber' ? 'border-amber-200 bg-amber-50' : 'border-sky/30 bg-sky/10'
  const num = tone === 'emerald' ? 'text-emerald-800' : tone === 'amber' ? 'text-amber-800' : 'text-sky-dark'
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${ring}`}>
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 text-3xl font-semibold ${num}`}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  )
}
