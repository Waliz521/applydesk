import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ProgrammeCard } from '@/components/ProgrammeCard'
import { FundingBadge, PriorityBadge } from '@/components/Badges'
import { useAuth } from '@/context/AuthContext'
import { fundingScheme, isEposProgramme } from '@/lib/funding'
import type { FundingScheme } from '@/lib/types'
import { priorityRank } from '@/lib/priority'
import { addProgrammeToTracker } from '@/lib/tracker'
import { seedAustriaCatalogue } from '@/lib/seedAustria'
import { seedCartographyProgramme } from '@/lib/seedCartography'
import { seedErasmusEmjmUpdates } from '@/lib/seedErasmusEmjm'
import { seedFranceCatalogue } from '@/lib/seedFrance'
import { seedHongKongCatalogue } from '@/lib/seedHongKong'
import { seedNetherlandsCatalogue } from '@/lib/seedNetherlands'
import { seedPolandCatalogue } from '@/lib/seedPoland'
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
  const [funding, setFunding] = useState<'all' | FundingScheme>('all')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)
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
      if (isEposProgramme(p, active?.name)) return false
      if (priority !== 'all' && p.priority !== priority) return false
      if (
        (active?.slug === 'daad' ||
          active?.slug === 'poland' ||
          active?.slug === 'austria' ||
          active?.slug === 'netherlands' ||
          active?.slug === 'hong-kong' ||
          active?.slug === 'france' ||
          active?.slug === 'erasmus-mundus') &&
        funding !== 'all' &&
        fundingScheme(p, active?.name) !== funding
      ) {
        return false
      }
      if (!q) return true
      const blob = [p.acronym, p.name, p.official_title, p.coordinator, p.fit_notes].join(' ').toLowerCase()
      return blob.includes(q)
    })
  }, [programmes, query, priority, funding, active?.name, active?.slug])

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

  async function loadPolandList() {
    setSeeding(true)
    setError(null)
    setNotice(null)
    const result = await seedPolandCatalogue({
      userId: user?.id,
      isAdmin: Boolean(profile?.is_admin),
    })
    setSeeding(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setNotice(`Poland list updated (${result.count} programmes).`)
    await loadCatalogues()
    const { data } = await supabase
      .from('catalogues')
      .select('id')
      .eq('slug', 'poland')
      .is('owner_user_id', null)
      .maybeSingle()
    if (data?.id) setActiveId(data.id)
  }

  async function loadAustriaList() {
    setSeeding(true)
    setError(null)
    setNotice(null)
    const result = await seedAustriaCatalogue({
      userId: user?.id,
      isAdmin: Boolean(profile?.is_admin),
    })
    setSeeding(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setNotice(`Austria list updated (${result.count} programmes).`)
    await loadCatalogues()
    const { data } = await supabase
      .from('catalogues')
      .select('id')
      .eq('slug', 'austria')
      .is('owner_user_id', null)
      .maybeSingle()
    if (data?.id) setActiveId(data.id)
  }

  async function loadNetherlandsList() {
    setSeeding(true)
    setError(null)
    setNotice(null)
    const result = await seedNetherlandsCatalogue({
      userId: user?.id,
      isAdmin: Boolean(profile?.is_admin),
    })
    setSeeding(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setNotice(`Netherlands list updated (${result.count} programmes).`)
    await loadCatalogues()
    const { data } = await supabase
      .from('catalogues')
      .select('id')
      .eq('slug', 'netherlands')
      .is('owner_user_id', null)
      .maybeSingle()
    if (data?.id) setActiveId(data.id)
  }

  async function loadHongKongList() {
    setSeeding(true)
    setError(null)
    setNotice(null)
    const result = await seedHongKongCatalogue({
      userId: user?.id,
      isAdmin: Boolean(profile?.is_admin),
    })
    setSeeding(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setNotice(`Hong Kong list updated (${result.count} programmes).`)
    await loadCatalogues()
    const { data } = await supabase
      .from('catalogues')
      .select('id')
      .eq('slug', 'hong-kong')
      .is('owner_user_id', null)
      .maybeSingle()
    if (data?.id) setActiveId(data.id)
  }

  async function loadFranceList() {
    setSeeding(true)
    setError(null)
    setNotice(null)
    const result = await seedFranceCatalogue({
      userId: user?.id,
      isAdmin: Boolean(profile?.is_admin),
    })
    setSeeding(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setNotice(`France list updated (${result.count} programmes).`)
    await loadCatalogues()
    const { data } = await supabase
      .from('catalogues')
      .select('id')
      .eq('slug', 'france')
      .is('owner_user_id', null)
      .maybeSingle()
    if (data?.id) setActiveId(data.id)
  }

  async function loadCartography() {
    setSeeding(true)
    setError(null)
    setNotice(null)
    const result = await seedErasmusEmjmUpdates({
      userId: user?.id,
      force: true,
    })
    // Keep legacy Cartography-only seed as fallback if Erasmus catalogue exists but slugs differ
    if (result.error) {
      const carto = await seedCartographyProgramme({ userId: user?.id, force: true })
      setSeeding(false)
      if (carto.error) {
        setError(carto.error)
        return
      }
      setNotice(carto.added ? 'Cartography M.Sc. added to Erasmus Mundus.' : 'Cartography M.Sc. refreshed.')
    } else {
      setSeeding(false)
      setNotice(
        result.updated
          ? `EMJM details refreshed (${result.count}): GEM, CDE, GroundwatCH, Cartography.`
          : 'EMJM programmes already up to date.',
      )
    }
    if (!activeId) return
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
          Erasmus Mundus is one family. DAAD is two tracks. Poland, Austria, the Netherlands, Hong Kong, and France mix self-funded degrees with named scholarships. Search, filter, open details, then send a programme to your tracker.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {catalogues.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setActiveId(c.id)
              setFunding('all')
            }}
            className={`rounded-full px-3 py-1.5 text-sm ${
              c.id === activeId ? 'bg-navy text-white' : 'bg-white text-slate-600 ring-1 ring-line hover:bg-slate-50'
            }`}
          >
            {c.name}
          </button>
        ))}
        {canEdit && !catalogues.some((c) => c.slug === 'poland') ? (
          <button
            type="button"
            onClick={() => void loadPolandList()}
            disabled={seeding}
            className="rounded-full bg-slate-800 px-3 py-1.5 text-sm text-white"
          >
            {seeding ? 'Adding Poland…' : 'Add Poland catalogue'}
          </button>
        ) : null}
        {canEdit && !catalogues.some((c) => c.slug === 'austria') ? (
          <button
            type="button"
            onClick={() => void loadAustriaList()}
            disabled={seeding}
            className="rounded-full bg-slate-800 px-3 py-1.5 text-sm text-white"
          >
            {seeding ? 'Adding Austria…' : 'Add Austria catalogue'}
          </button>
        ) : null}
        {canEdit && !catalogues.some((c) => c.slug === 'netherlands') ? (
          <button
            type="button"
            onClick={() => void loadNetherlandsList()}
            disabled={seeding}
            className="rounded-full bg-slate-800 px-3 py-1.5 text-sm text-white"
          >
            {seeding ? 'Adding Netherlands…' : 'Add Netherlands catalogue'}
          </button>
        ) : null}
        {canEdit && !catalogues.some((c) => c.slug === 'hong-kong') ? (
          <button
            type="button"
            onClick={() => void loadHongKongList()}
            disabled={seeding}
            className="rounded-full bg-slate-800 px-3 py-1.5 text-sm text-white"
          >
            {seeding ? 'Adding Hong Kong…' : 'Add Hong Kong catalogue'}
          </button>
        ) : null}
        {canEdit && !catalogues.some((c) => c.slug === 'france') ? (
          <button
            type="button"
            onClick={() => void loadFranceList()}
            disabled={seeding}
            className="rounded-full bg-slate-800 px-3 py-1.5 text-sm text-white"
          >
            {seeding ? 'Adding France…' : 'Add France catalogue'}
          </button>
        ) : null}
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
                <div className="flex flex-wrap gap-2">
                  {active.slug === 'poland' ? (
                    <button
                      type="button"
                      onClick={() => void loadPolandList()}
                      disabled={seeding}
                      className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white"
                    >
                      {seeding ? 'Updating…' : 'Load / refresh Poland GIS list'}
                    </button>
                  ) : null}
                  {active.slug === 'austria' ? (
                    <button
                      type="button"
                      onClick={() => void loadAustriaList()}
                      disabled={seeding}
                      className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white"
                    >
                      {seeding ? 'Updating…' : 'Load / refresh Austria GIS list'}
                    </button>
                  ) : null}
                  {active.slug === 'netherlands' ? (
                    <button
                      type="button"
                      onClick={() => void loadNetherlandsList()}
                      disabled={seeding}
                      className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white"
                    >
                      {seeding ? 'Updating…' : 'Load / refresh Netherlands GIS list'}
                    </button>
                  ) : null}
                  {active.slug === 'hong-kong' ? (
                    <button
                      type="button"
                      onClick={() => void loadHongKongList()}
                      disabled={seeding}
                      className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white"
                    >
                      {seeding ? 'Updating…' : 'Load / refresh Hong Kong list'}
                    </button>
                  ) : null}
                  {active.slug === 'france' ? (
                    <button
                      type="button"
                      onClick={() => void loadFranceList()}
                      disabled={seeding}
                      className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white"
                    >
                      {seeding ? 'Updating…' : 'Load / refresh France list'}
                    </button>
                  ) : null}
                  {active.slug === 'erasmus-mundus' ? (
                    <button
                      type="button"
                      onClick={() => void loadCartography()}
                      disabled={seeding}
                      className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white"
                    >
                      {seeding ? 'Updating…' : 'Refresh EMJM dates (GEM / CDE / GroundwatCH / Cartography)'}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setShowForm((v) => !v)}
                    className="rounded-lg bg-sky px-3 py-2 text-sm font-semibold text-white"
                  >
                    {showForm ? 'Close' : 'Add programme'}
                  </button>
                </div>
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

            {active.slug === 'daad' ? (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-muted">Funding type</span>
                {(
                  [
                    ['all', 'All DAAD (shown)'],
                    ['study_scholarship', 'Not EPOS'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFunding(id)}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      funding === id ? 'bg-ink text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}

            {active.slug === 'poland' ? (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-muted">Funding type</span>
                {(
                  [
                    ['all', 'All Poland'],
                    ['self_funded', 'Self-funded (tuition)'],
                    ['nawa', 'NAWA scholarship'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFunding(id)}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      funding === id ? 'bg-ink text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}

            {active.slug === 'austria' ? (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-muted">Funding type</span>
                {(
                  [
                    ['all', 'All Austria'],
                    ['self_funded', 'Self-funded (tuition)'],
                    ['oead', 'OeAD · Busek'],
                    ['partial', 'Partial / other'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFunding(id)}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      funding === id ? 'bg-ink text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}

            {active.slug === 'netherlands' ? (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-muted">Funding type</span>
                {(
                  [
                    ['all', 'All Netherlands'],
                    ['self_funded', 'Self-funded (tuition)'],
                    ['partial', 'Partial scholarship'],
                    ['full', 'Full university grant'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFunding(id)}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      funding === id ? 'bg-ink text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}

            {active.slug === 'france' ? (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-muted">Funding type</span>
                {(
                  [
                    ['all', 'All France'],
                    ['self_funded', 'Master’s (tuition)'],
                    ['full', 'Eiffel nomination'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFunding(id)}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      funding === id ? 'bg-ink text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}

            {active.slug === 'hong-kong' ? (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-muted">Funding type</span>
                {(
                  [
                    ['all', 'All Hong Kong'],
                    ['partial', 'RPG / PGS / IPFS'],
                    ['full', 'HKPFS (PhD)'],
                    ['self_funded', 'Taught MSc (tuition)'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFunding(id)}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      funding === id ? 'bg-ink text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}

            {active.slug === 'erasmus-mundus' ? (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-muted">Funding type</span>
                {(
                  [
                    ['all', 'All Erasmus'],
                    ['emjm', 'EMJM scholarship'],
                    ['self_funded', 'No EM award (tuition)'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFunding(id)}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      funding === id ? 'bg-ink text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}

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
                  catalogueName={active.name}
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
              · <FundingBadge scheme="emjm" /> €1,400/mo + tuition (Pakistan eligible). GEM opens 1 Oct 2026 · GroundwatCH Partner
              deadline 3 Jan 2027 · CDE Nov 2026–mid Jan 2027. Grey <FundingBadge scheme="self_funded" /> Cartography — no EMJM after 2025.
            </p>
          ) : null}

          {active.slug === 'daad' ? (
            <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
              EPOS courses (2 years’ work) are hidden — not eligible.
              <FundingBadge scheme="study_scholarship" /> remains (e.g. EAGLE). No 2-year rule. Pakistan’s DAAD master’s list does not
              currently include Study Scholarships for all disciplines for GIS.
            </p>
          ) : null}

          {active.slug === 'poland' ? (
            <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
              Grey <FundingBadge scheme="self_funded" /> you pay tuition (cost on the card). Rose{' '}
              <FundingBadge scheme="nawa" /> is the Polish government scholarship — Pakistan was not eligible in 2026/27.
            </p>
          ) : null}

          {active.slug === 'austria' ? (
            <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
              Grey <FundingBadge scheme="self_funded" /> statutory tuition. Rose <FundingBadge scheme="oead" /> Erhard Busek (no new
              call planned). Violet <FundingBadge scheme="partial" /> One World after arrival, or Ernst Mach (not a master’s). CDE /
              Cartography are under Erasmus Mundus.
            </p>
          ) : null}

          {active.slug === 'netherlands' ? (
            <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
              Grey <FundingBadge scheme="self_funded" /> ITC / WUR / GIMA / Delft fees. Violet <FundingBadge scheme="partial" /> NL
              Scholarship, ITC Excellence, Wageningen Excellence. Green <FundingBadge scheme="full" /> Eric Bleumink (Groningen only).
              Orange Knowledge is closed. GEM is under Erasmus Mundus.
            </p>
          ) : null}

          {active.slug === 'france' ? (
            <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
              Grey <FundingBadge scheme="self_funded" /> is an English-taught master’s that accepts IELTS and does not ask for a French certificate. Grenoble IMAGERS closes 15 April 2027, Nantes EPS closes 15 March 2027, and Aix-Marseille IMG is inside Études en France (18 November 2026).
              Public non-EU tuition is €3,950/year unless waived. Green <FundingBadge scheme="full" /> is France Excellence Eiffel — the university
              nominates you by 6 January 2027. You cannot apply to Eiffel yourself.
            </p>
          ) : null}

          {active.slug === 'hong-kong' ? (
            <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
              Violet <FundingBadge scheme="partial" /> HKU/PolyU MPhil/PhD with PGS, IPFS, or supervisor studentship — email faculty first.
              Green <FundingBadge scheme="full" /> HKPFS (PhD). Grey <FundingBadge scheme="self_funded" /> taught MSc GeoDS (~HK$250k). Planning
              notes: <span className="font-medium">hong-kong-universities.md</span> in the repo.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
