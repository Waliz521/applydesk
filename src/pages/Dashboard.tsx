import { useEffect, useMemo, useState } from 'react'
import { CatalogueSelect } from '@/components/CatalogueSelect'
import {
  applyCycleFilters,
  CycleFilterBar,
  DEFAULT_CYCLE_FILTERS,
  monthsFromRows,
  type CycleFilters,
} from '@/components/CycleFilterBar'
import { ProgrammeCard } from '@/components/ProgrammeCard'
import { useAuth } from '@/context/AuthContext'
import { cycleState } from '@/lib/dates'
import { isEposProgramme } from '@/lib/funding'
import { austriaSeedNeedsRefresh, seedAustriaCatalogue } from '@/lib/seedAustria'
import { seedErasmusEmjmUpdates } from '@/lib/seedErasmusEmjm'
import { seedDenmarkCatalogue } from '@/lib/seedDenmark'
import { seedFinlandCatalogue } from '@/lib/seedFinland'
import { seedFranceCatalogue } from '@/lib/seedFrance'
import { seedHongKongCatalogue } from '@/lib/seedHongKong'
import { seedNetherlandsCatalogue } from '@/lib/seedNetherlands'
import { seedPolandCatalogue } from '@/lib/seedPoland'
import { addProgrammeToTracker, removeProgrammeFromTracker } from '@/lib/tracker'
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
  const [openFilters, setOpenFilters] = useState<CycleFilters>(DEFAULT_CYCLE_FILTERS)
  const [upcomingFilters, setUpcomingFilters] = useState<CycleFilters>(DEFAULT_CYCLE_FILTERS)
  const hasPoland = catalogues.some((c) => c.slug === 'poland')
  const hasAustria = catalogues.some((c) => c.slug === 'austria')
  const hasNetherlands = catalogues.some((c) => c.slug === 'netherlands')
  const hasHongKong = catalogues.some((c) => c.slug === 'hong-kong')
  const hasFrance = catalogues.some((c) => c.slug === 'france')
  const hasDenmark = catalogues.some((c) => c.slug === 'denmark')
  const hasFinland = catalogues.some((c) => c.slug === 'finland')

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
      // Skip DAAD EPOS (2 yr work) — not eligible for the scholarship track
      if (isEposProgramme(programme, catalogue.name)) return []
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
        .in('slug', [
          'oead-busek',
          'plus-applied-geoinformatics',
          'itc-mgeo',
          'eric-bleumink',
          'polyu-lsgs-rpg',
          'grenoble-imagers',
          'ku-geography-geoinformatics',
          'aalto-geoinformatics',
        ])
      const slugs = new Set((sentinels ?? []).map((row) => row.slug as string))
      const needPoland = !cats.some((c) => c.slug === 'poland')
      const austriaStale = cats.some((c) => c.slug === 'austria') && (await austriaSeedNeedsRefresh())
      const needAustria =
        !cats.some((c) => c.slug === 'austria') ||
        !slugs.has('oead-busek') ||
        !slugs.has('plus-applied-geoinformatics') ||
        austriaStale
      const needNetherlands = !cats.some((c) => c.slug === 'netherlands') || !slugs.has('itc-mgeo') || !slugs.has('eric-bleumink')
      const needHongKong = !cats.some((c) => c.slug === 'hong-kong') || !slugs.has('polyu-lsgs-rpg')
      const needFrance = !cats.some((c) => c.slug === 'france') || !slugs.has('grenoble-imagers')
      const needDenmark = !cats.some((c) => c.slug === 'denmark') || !slugs.has('ku-geography-geoinformatics')
      const needFinland = !cats.some((c) => c.slug === 'finland') || !slugs.has('aalto-geoinformatics')
      if (needPoland || needAustria || needNetherlands || needHongKong || needFrance || needDenmark || needFinland) {
        setSeeding(true)
      }
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
      if (needFrance) {
        const result = await seedFranceCatalogue({
          userId: user.id,
          isAdmin: Boolean(profile?.is_admin),
        })
        if (cancelled) return
        if (result.error) {
          setSeeding(false)
          setError(result.error)
          return
        }
        notes.push(`France catalogue added (${result.count} programmes).`)
      }
      if (needDenmark) {
        const result = await seedDenmarkCatalogue({
          userId: user.id,
          isAdmin: Boolean(profile?.is_admin),
        })
        if (cancelled) return
        if (result.error) {
          setSeeding(false)
          setError(result.error)
          return
        }
        notes.push(`Denmark catalogue added (${result.count} programmes).`)
      }
      if (needFinland) {
        const result = await seedFinlandCatalogue({
          userId: user.id,
          isAdmin: Boolean(profile?.is_admin),
        })
        if (cancelled) return
        if (result.error) {
          setSeeding(false)
          setError(result.error)
          return
        }
        notes.push(`Finland catalogue added (${result.count} programmes).`)
      }
      // EMJM date refresh writes programme_cycles — only admins pass RLS.
      if (profile?.is_admin) {
        const emjm = await seedErasmusEmjmUpdates({ userId: user.id, force: true, isAdmin: true })
        if (cancelled) return
        if (emjm.error) {
          setSeeding(false)
          setError(emjm.error)
          return
        }
        if (emjm.updated) notes.push(`EMJM dates refreshed (${emjm.count} programmes).`)
        const nl = await seedNetherlandsCatalogue({
          userId: user.id,
          isAdmin: true,
        })
        if (cancelled) return
        if (nl.error) {
          setSeeding(false)
          setError(nl.error)
          return
        }
        const hk = await seedHongKongCatalogue({
          userId: user.id,
          isAdmin: true,
        })
        if (cancelled) return
        if (hk.error) {
          setSeeding(false)
          setError(hk.error)
          return
        }
        const fr = await seedFranceCatalogue({
          userId: user.id,
          isAdmin: true,
        })
        if (cancelled) return
        if (fr.error) {
          setSeeding(false)
          setError(fr.error)
          return
        }
        const dk = await seedDenmarkCatalogue({
          userId: user.id,
          isAdmin: true,
        })
        if (cancelled) return
        if (dk.error) {
          setSeeding(false)
          setError(dk.error)
          return
        }
        const fi = await seedFinlandCatalogue({
          userId: user.id,
          isAdmin: true,
        })
        if (cancelled) return
        if (fi.error) {
          setSeeding(false)
          setError(fi.error)
          return
        }
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
    if (!hasFrance) {
      const result = await seedFranceCatalogue({
        userId: user.id,
        isAdmin: Boolean(profile?.is_admin),
      })
      if (result.error) {
        setSeeding(false)
        setError(result.error)
        return
      }
      notes.push(`France catalogue added (${result.count} programmes).`)
    }
    if (!hasDenmark) {
      const result = await seedDenmarkCatalogue({
        userId: user.id,
        isAdmin: Boolean(profile?.is_admin),
      })
      if (result.error) {
        setSeeding(false)
        setError(result.error)
        return
      }
      notes.push(`Denmark catalogue added (${result.count} programmes).`)
    }
    if (!hasFinland) {
      const result = await seedFinlandCatalogue({
        userId: user.id,
        isAdmin: Boolean(profile?.is_admin),
      })
      if (result.error) {
        setSeeding(false)
        setError(result.error)
        return
      }
      notes.push(`Finland catalogue added (${result.count} programmes).`)
    }
    const emjm = await seedErasmusEmjmUpdates({
      userId: user.id,
      force: true,
      isAdmin: Boolean(profile?.is_admin),
    })
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
    const france = cats.find((c) => c.slug === 'france')
    const denmark = cats.find((c) => c.slug === 'denmark')
    const finland = cats.find((c) => c.slug === 'finland')
    if (!hasFinland && finland) setCatalogueId(finland.id)
    else if (!hasDenmark && denmark) setCatalogueId(denmark.id)
    else if (!hasFrance && france) setCatalogueId(france.id)
    else if (!hasHongKong && hongKong) setCatalogueId(hongKong.id)
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

  const openMonths = useMemo(() => monthsFromRows(openRows), [openRows])
  const upcomingMonths = useMemo(() => monthsFromRows(upcoming), [upcoming])
  const filteredOpen = useMemo(() => applyCycleFilters(openRows, openFilters), [openRows, openFilters])
  const filteredUpcoming = useMemo(
    () => applyCycleFilters(upcoming, upcomingFilters),
    [upcoming, upcomingFilters],
  )

  useEffect(() => {
    setOpenFilters(DEFAULT_CYCLE_FILTERS)
    setUpcomingFilters(DEFAULT_CYCLE_FILTERS)
  }, [catalogueId])

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

  async function untrack(row: OpenRow) {
    if (!user) return
    setBusyId(row.programme.id)
    setNotice(null)
    const result = await removeProgrammeFromTracker({
      userId: user.id,
      programmeId: row.programme.id,
    })
    setBusyId(null)
    if (result.error) {
      setError(result.error)
      return
    }
    if (result.removed) {
      setTracked((prev) => {
        const next = new Set(prev)
        next.delete(row.programme.id)
        return next
      })
      setAppCount((n) => Math.max(0, n - 1))
      setNotice(`Removed ${row.programme.acronym ?? row.programme.name} from tracker.`)
    }
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
              EPOS courses (2 years’ work after bachelor) are hidden — you are not eligible for that scholarship track.
              What remains is teal <span className="font-medium">Not EPOS</span> (e.g. EAGLE): no two-year rule; Pakistan’s DAAD master’s list
              does not currently include Study Scholarships for all disciplines for GIS.
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
          {selectedCatalogue?.slug === 'france' ? (
            <p className="mt-2 text-sm text-slate-600">
              The France list is three programmes: Grenoble IMAGERS (own form until 15 April 2027, and the Études en France cart until 18 November 2026), Nantes Earth and Planetary Sciences (Nantes form), and Aix-Marseille IMG (Études en France only, 18 November 2026).
            </p>
          ) : null}
          {selectedCatalogue?.slug === 'hong-kong' ? (
            <p className="mt-2 text-sm text-slate-600">
              Violet <span className="font-medium">Partial</span> is MPhil/PhD with PGS, IPFS, or dept studentship (supervisor-first). Green{' '}
              <span className="font-medium">Full university grant</span> is HKPFS (PhD only, all HK universities). Dark{' '}
              <span className="font-medium">Self-funded · tuition</span> is taught MSc GeoDS (~HK$250k) — not the funded research path.
            </p>
          ) : null}
          {selectedCatalogue?.slug === 'denmark' ? (
            <p className="mt-2 text-sm text-slate-600">
              Dark <span className="font-medium">Self-funded · tuition</span> is non-EU fees (KU ~€17k/year). Violet{' '}
              <span className="font-medium">Partial</span> is Danish Government Scholarship or RUC fee waiver + stipend — Pakistan eligible, few seats.
              No German blocked account; residence permit still needs subsistence unless the grant covers living.
            </p>
          ) : null}
          {selectedCatalogue?.slug === 'finland' ? (
            <p className="mt-2 text-sm text-slate-600">
              Dark <span className="font-medium">Self-funded · tuition</span> is ~€13–17k/year. Violet{' '}
              <span className="font-medium">Partial</span> is university tuition waivers only — no national living grant for Pakistan. Migri expects ~€9,600
              living funds year 1 unless documented living aid.
            </p>
          ) : null}
          {selectedCatalogue?.slug === 'erasmus-mundus' ? (
            <p className="mt-2 text-sm text-slate-600">
              Indigo <span className="font-medium">EMJM scholarship</span> is €1,400/month (up to 24 months) + tuition covered — apply on each programme site.
              Pakistan is eligible. <span className="font-medium">GEM</span> deadline 15 Jan 2027 (no reference letter).{' '}
              <span className="font-medium">GroundwatCH</span> and <span className="font-medium">FloodRISK</span> Partner deadline 3 Jan 2027. GroundwatCH needs two letters dated within six months. Apply to one IHE programme only.{' '}
              <span className="font-medium">WAVES</span> scholarship deadline 15 Jan 2027 (one signed reference).{' '}
              <span className="font-medium">CDE</span> Call 4 is 2 Nov 2026–22 Jan 2027. Programmes with no Erasmus Mundus scholarship are not listed.
            </p>
          ) : null}
        </div>
        <CatalogueSelect catalogues={catalogues} value={catalogueId} onChange={setCatalogueId} />
      </div>

      {(!hasPoland ||
        !hasAustria ||
        !hasNetherlands ||
        !hasHongKong ||
        !hasFrance ||
        !hasDenmark ||
        !hasFinland) &&
      !loading ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-700">
            {[
              !hasPoland && 'Poland',
              !hasAustria && 'Austria',
              !hasNetherlands && 'Netherlands',
              !hasHongKong && 'Hong Kong',
              !hasFrance && 'France',
              !hasDenmark && 'Denmark',
              !hasFinland && 'Finland',
            ]
              .filter(Boolean)
              .join(' and ')}{' '}
            {(!hasPoland ? 1 : 0) +
              (!hasAustria ? 1 : 0) +
              (!hasNetherlands ? 1 : 0) +
              (!hasHongKong ? 1 : 0) +
              (!hasFrance ? 1 : 0) +
              (!hasDenmark ? 1 : 0) +
              (!hasFinland ? 1 : 0) >
            1
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
        <Stat label="Open now" value={loading ? '…' : String(filteredOpen.length)} tone="emerald" />
        <Stat label="Opening soon" value={loading ? '…' : String(filteredUpcoming.length)} tone="amber" />
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
            ? 'Nothing with an open window matches these filters.'
            : 'Nothing open in this catalogue matches these filters.'
        }
        loading={loading}
        rows={filteredOpen}
        tracked={tracked}
        busyId={busyId}
        onTrack={track}
        onUntrack={untrack}
        filters={
          <CycleFilterBar
            filters={openFilters}
            months={openMonths}
            onChange={setOpenFilters}
            onReset={() => setOpenFilters(DEFAULT_CYCLE_FILTERS)}
          />
        }
      />
      <CycleSection
        title="Opening soon"
        empty="No upcoming open dates match these filters."
        loading={false}
        rows={filteredUpcoming}
        tracked={tracked}
        busyId={busyId}
        onTrack={track}
        onUntrack={untrack}
        filters={
          <CycleFilterBar
            filters={upcomingFilters}
            months={upcomingMonths}
            onChange={setUpcomingFilters}
            onReset={() => setUpcomingFilters(DEFAULT_CYCLE_FILTERS)}
          />
        }
      />
      <CycleSection
        title="Watch — dates TBA"
        empty="Every programme in this view has dates."
        loading={false}
        rows={watch}
        tracked={tracked}
        busyId={busyId}
        onTrack={track}
        onUntrack={untrack}
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
  onUntrack,
  filters,
}: {
  title: string
  empty: string
  loading: boolean
  rows: OpenRow[]
  tracked: Set<string>
  busyId: string | null
  onTrack: (row: OpenRow) => void
  onUntrack?: (row: OpenRow) => void
  filters?: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">
        {title} <span className="text-sm font-normal text-muted">({rows.length})</span>
      </h2>
      {filters}
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
              onUntrack={onUntrack ? () => onUntrack(row) : undefined}
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
