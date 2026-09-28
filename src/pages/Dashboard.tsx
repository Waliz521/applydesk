import { useEffect, useMemo, useState } from 'react'
import { CatalogueSelect } from '@/components/CatalogueSelect'
import { ProgrammeCard } from '@/components/ProgrammeCard'
import { useAuth } from '@/context/AuthContext'
import { cycleState } from '@/lib/dates'
import { seedAustriaCatalogue } from '@/lib/seedAustria'
import { seedCartographyProgramme } from '@/lib/seedCartography'
import { seedErasmusEmjmUpdates } from '@/lib/seedErasmusEmjm'
import { seedHongKongCatalogue } from '@/lib/seedHongKong'
import { seedNetherlandsCatalogue } from '@/lib/seedNetherlands'
import { seedPolandCatalogue } from '@/lib/seedPoland'
import { addProgrammeToTracker } from '@/lib/tracker'
import { supabase } from '@/lib/supabase'
import type { Application, Catalogue, OpenRow, Programme, ProgrammeCycle } from '@/lib/types'

export function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth()
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
  const [seeding, setSeeding] = useState(false)
  const hasPoland = catalogues.some((c) => c.slug === 'poland')
  const hasAustria = catalogues.some((c) => c.slug === 'austria')
  const hasNetherlands = catalogues.some((c) => c.slug === 'netherlands')
  const hasHongKong = catalogues.some((c) => c.slug === 'hong-kong')

  async function loadDashboard() {
    const [cyclesRes, appsRes, statusesRes, catsRes] = await Promise.all([
      supabase
        .from('programme_cycles')
        .select('*, programme:programmes(*, catalogue:catalogues(*))')
        .order('scholarship_deadline', { ascending: true, nullsFirst: false }),
      supabase.from('applications').select('id, status_id, programme_id'),
      supabase.from('application_statuses').select('id, slug'),
      supabase.from('catalogues').select('*').eq('is_archived', false).order('name'),
    ])
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
    mapped.sort((a, b) => {
      const da = a.scholarship_deadline || a.self_funded_deadline || '9999'
      const db = b.scholarship_deadline || b.self_funded_deadline || '9999'
      return da.localeCompare(db)
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
    return (catsRes.data ?? []) as Catalogue[]
  }

  useEffect(() => {
    if (authLoading || (user && !profile)) return
    let cancelled = false
    async function load() {
      const cats = await loadDashboard()
      if (cancelled || !user) return
      const notes: string[] = []
      const { data: sentinels } = await supabase
        .from('programmes')
        .select('slug')
        .in('slug', ['oead-busek', 'itc-mgeo', 'eric-bleumink', 'polyu-lsgs-rpg'])
      const slugs = new Set((sentinels ?? []).map((row) => row.slug as string))
      const needPoland = !cats.some((c) => c.slug === 'poland')
      const needAustria = !cats.some((c) => c.slug === 'austria') || !slugs.has('oead-busek')
      const needNetherlands = !cats.some((c) => c.slug === 'netherlands') || !slugs.has('itc-mgeo') || !slugs.has('eric-bleumink')
      const needHongKong = !cats.some((c) => c.slug === 'hong-kong') || !slugs.has('polyu-lsgs-rpg')
      if (needPoland || needAustria || needNetherlands || needHongKong) setSeeding(true)
      if (needPoland) {
        const result = await seedPolandCatalogue({
          userId: user.id,
          isAdmin: Boolean(profile?.is_admin),
        })
        if (cancelled) return
        if (result.error) {
          setSeeding(false)
          setError(result.error)
          return
        }
        notes.push(`Poland catalogue added (${result.count} programmes).`)
      }
      if (needAustria) {
        const result = await seedAustriaCatalogue({
          userId: user.id,
          isAdmin: Boolean(profile?.is_admin),
        })
        if (cancelled) return
        if (result.error) {
          setSeeding(false)
          setError(result.error)
          return
        }
        notes.push(`Austria catalogue added (${result.count} programmes).`)
      }
      if (needNetherlands) {
        const result = await seedNetherlandsCatalogue({
          userId: user.id,
          isAdmin: Boolean(profile?.is_admin),
        })
        if (cancelled) return
        if (result.error) {
          setSeeding(false)
          setError(result.error)
          return
        }
        notes.push(`Netherlands catalogue added (${result.count} programmes).`)
      }
      if (needHongKong) {
        const result = await seedHongKongCatalogue({
          userId: user.id,
          isAdmin: Boolean(profile?.is_admin),
        })
        if (cancelled) return
        if (result.error) {
          setSeeding(false)
          setError(result.error)
          return
        }
        notes.push(`Hong Kong catalogue added (${result.count} programmes).`)
      }
      const cartography = await seedCartographyProgramme({ userId: user.id })
      if (cancelled) return
      if (cartography.error) {
        setSeeding(false)
        setError(cartography.error)
        return
      }
      if (cartography.added) notes.push('Cartography M.Sc. added to Erasmus Mundus.')
      // Quietly refresh confirmed EMJM deadlines (GEM / CDE / GroundwatCH / Cartography)
      const emjm = await seedErasmusEmjmUpdates({ userId: user.id })
      if (cancelled) return
      if (emjm.error) {
        setSeeding(false)
        setError(emjm.error)
        return
      }
      setSeeding(false)
      if (notes.length === 0) return
      setNotice(notes.join(' '))
      await loadDashboard()
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [authLoading, user?.id, profile?.is_admin, profile])

  async function addMissingCatalogues() {
    if (!user) return
    setSeeding(true)
    setError(null)
    const notes: string[] = []
    if (!hasPoland) {
      const result = await seedPolandCatalogue({
        userId: user.id,
        isAdmin: Boolean(profile?.is_admin),
      })
      if (result.error) {
        setSeeding(false)
        setError(result.error)
        return
      }
      notes.push(`Poland catalogue added (${result.count} programmes).`)
    }
    if (!hasAustria) {
      const result = await seedAustriaCatalogue({
        userId: user.id,
        isAdmin: Boolean(profile?.is_admin),
      })
      if (result.error) {
        setSeeding(false)
        setError(result.error)
        return
      }
      notes.push(`Austria catalogue added (${result.count} programmes).`)
    }
    if (!hasNetherlands) {
      const result = await seedNetherlandsCatalogue({
        userId: user.id,
        isAdmin: Boolean(profile?.is_admin),
      })
      if (result.error) {
        setSeeding(false)
        setError(result.error)
        return
      }
      notes.push(`Netherlands catalogue added (${result.count} programmes).`)
    }
    if (!hasHongKong) {
      const result = await seedHongKongCatalogue({
        userId: user.id,
        isAdmin: Boolean(profile?.is_admin),
      })
      if (result.error) {
        setSeeding(false)
        setError(result.error)
        return
      }
      notes.push(`Hong Kong catalogue added (${result.count} programmes).`)
    }
    const cartography = await seedCartographyProgramme({ userId: user.id, force: true })
    if (cartography.error) {
      setSeeding(false)
      setError(cartography.error)
      return
    }
    if (cartography.added) notes.push('Cartography M.Sc. added to Erasmus Mundus.')
    const emjm = await seedErasmusEmjmUpdates({ userId: user.id, force: true })
    if (emjm.error) {
      setSeeding(false)
      setError(emjm.error)
      return
    }
    if (emjm.updated) notes.push(`EMJM dates refreshed (${emjm.count} programmes).`)
    setSeeding(false)
    setNotice(notes.join(' ') || 'Catalogues are up to date.')
    const cats = await loadDashboard()
    const austria = cats.find((c) => c.slug === 'austria')
    const netherlands = cats.find((c) => c.slug === 'netherlands')
    const hongKong = cats.find((c) => c.slug === 'hong-kong')
    if (!hasHongKong && hongKong) setCatalogueId(hongKong.id)
    else if (!hasNetherlands && netherlands) setCatalogueId(netherlands.id)
    else if (!hasAustria && austria) setCatalogueId(austria.id)
  }

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
          {selectedCatalogue?.slug === 'poland' ? (
            <p className="mt-2 text-sm text-slate-600">
              Dark <span className="font-medium">Self-funded · tuition</span> means you pay the university (cost on the card). Rose{' '}
              <span className="font-medium">NAWA scholarship</span> is a separate government grant — Pakistan was not on the 2026/27 Banach list.
            </p>
          ) : null}
          {selectedCatalogue?.slug === 'austria' ? (
            <p className="mt-2 text-sm text-slate-600">
              Dark <span className="font-medium">Self-funded · tuition</span> is statutory Austrian tuition. Rose{' '}
              <span className="font-medium">OeAD · Busek</span> is the full master’s grant (no new call planned). Violet{' '}
              <span className="font-medium">Partial</span> is One World (Salzburg living stipend) or Ernst Mach (short stay, not a degree).
            </p>
          ) : null}
          {selectedCatalogue?.slug === 'netherlands' ? (
            <p className="mt-2 text-sm text-slate-600">
              Dark <span className="font-medium">Self-funded · tuition</span> is ITC / WUR / GIMA / Delft fees (~€22k/year). Violet{' '}
              <span className="font-medium">Partial</span> is NL Scholarship (€5,000), ITC Excellence, or Wageningen Excellence. Green{' '}
              <span className="font-medium">Full university grant</span> is Eric Bleumink at Groningen only — not an ITC GIS scholarship.
              GEM sits in Erasmus Mundus.
            </p>
          ) : null}
          {selectedCatalogue?.slug === 'hong-kong' ? (
            <p className="mt-2 text-sm text-slate-600">
              Violet <span className="font-medium">Partial</span> is MPhil/PhD with PGS, IPFS, or dept studentship (supervisor-first). Green{' '}
              <span className="font-medium">Full university grant</span> is HKPFS (PhD only, all HK universities). Dark{' '}
              <span className="font-medium">Self-funded · tuition</span> is taught MSc GeoDS (~HK$250k) — not the funded research path.
            </p>
          ) : null}
          {selectedCatalogue?.slug === 'erasmus-mundus' ? (
            <p className="mt-2 text-sm text-slate-600">
              Indigo <span className="font-medium">EMJM scholarship</span> is €1,400/month (up to 24 months) + tuition covered — apply on each programme site.
              Pakistan is eligible. <span className="font-medium">GEM</span> opens 1 Oct 2026 (deadline 15 Jan 2027).{' '}
              <span className="font-medium">GroundwatCH</span> Partner deadline 3 Jan 2027. <span className="font-medium">CDE</span> worldwide call Nov 2026–mid Jan 2027.{' '}
              Grey <span className="font-medium">Self-funded</span> includes Cartography (no EMJM after 2025).
            </p>
          ) : null}
        </div>
        <CatalogueSelect catalogues={catalogues} value={catalogueId} onChange={setCatalogueId} />
      </div>

      {(!hasPoland || !hasAustria || !hasNetherlands || !hasHongKong) && !loading ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-700">
            {[!hasPoland && 'Poland', !hasAustria && 'Austria', !hasNetherlands && 'Netherlands', !hasHongKong && 'Hong Kong']
              .filter(Boolean)
              .join(' and ')}{' '}
            {(!hasPoland ? 1 : 0) + (!hasAustria ? 1 : 0) + (!hasNetherlands ? 1 : 0) + (!hasHongKong ? 1 : 0) > 1
              ? 'are not in this dropdown yet.'
              : 'is not in this dropdown yet.'}{' '}
            They have to be written into the database once (deploy only updates the app).
          </p>
          <button
            type="button"
            onClick={() => void addMissingCatalogues()}
            disabled={seeding || !user}
            className="shrink-0 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {seeding ? 'Adding catalogues…' : 'Add missing catalogues'}
          </button>
        </div>
      ) : null}

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
