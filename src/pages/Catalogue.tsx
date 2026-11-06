import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ChoiceBar } from '@/components/ChoiceBar'
import { ProgrammeCard } from '@/components/ProgrammeCard'
import { FundingBadge, PriorityBadge } from '@/components/Badges'
import { useAuth } from '@/context/AuthContext'
import { fundingScheme, isEposProgramme } from '@/lib/funding'
import type { FundingScheme } from '@/lib/types'
import { priorityRank } from '@/lib/priority'
import { addProgrammeToTracker, removeProgrammeFromTracker } from '@/lib/tracker'
import { seedAustriaCatalogue } from '@/lib/seedAustria'
import { seedErasmusEmjmUpdates } from '@/lib/seedErasmusEmjm'
import { seedDenmarkCatalogue } from '@/lib/seedDenmark'
import { seedFinlandCatalogue } from '@/lib/seedFinland'
import { seedFranceCatalogue } from '@/lib/seedFrance'
import { seedHongKongCatalogue } from '@/lib/seedHongKong'
import { seedNetherlandsCatalogue } from '@/lib/seedNetherlands'
import { seedPolandCatalogue } from '@/lib/seedPoland'
import { supabase } from '@/lib/supabase'
import type { Catalogue, Programme, ProgrammeCycle } from '@/lib/types'

const PRIORITY_FILTERS = ['all', 'A', 'A-', 'B', 'C'] as const

const FUNDING_OPTIONS: Record<string, readonly { id: 'all' | FundingScheme; label: string }[]> = {
  daad: [
    { id: 'all', label: 'All DAAD (shown)' },
    { id: 'study_scholarship', label: 'Not EPOS' },
  ],
  poland: [
    { id: 'all', label: 'All Poland' },
    { id: 'self_funded', label: 'Self-funded (tuition)' },
    { id: 'nawa', label: 'NAWA scholarship' },
  ],
  austria: [
    { id: 'all', label: 'All Austria' },
    { id: 'self_funded', label: 'Self-funded (tuition)' },
    { id: 'oead', label: 'OeAD · Busek' },
    { id: 'partial', label: 'Partial / other' },
  ],
  netherlands: [
    { id: 'all', label: 'All Netherlands' },
    { id: 'self_funded', label: 'Self-funded (tuition)' },
    { id: 'partial', label: 'Partial scholarship' },
    { id: 'full', label: 'Full university grant' },
  ],
  france: [
    { id: 'all', label: 'All France' },
    { id: 'full', label: 'France Excellence Climate' },
    { id: 'self_funded', label: 'Master’s (tuition)' },
  ],
  denmark: [
    { id: 'all', label: 'All Denmark' },
    { id: 'self_funded', label: 'Self-funded (tuition)' },
    { id: 'partial', label: 'Danish gov / partial' },
  ],
  finland: [
    { id: 'all', label: 'All Finland' },
    { id: 'self_funded', label: 'Self-funded (tuition)' },
    { id: 'partial', label: 'Tuition waiver' },
  ],
  'hong-kong': [
    { id: 'all', label: 'All Hong Kong' },
    { id: 'partial', label: 'RPG / PGS / IPFS' },
    { id: 'full', label: 'HKPFS (PhD)' },
    { id: 'self_funded', label: 'Taught MSc (tuition)' },
  ],
  'erasmus-mundus': [
    { id: 'all', label: 'All Erasmus' },
    { id: 'emjm', label: 'EMJM scholarship' },
    { id: 'self_funded', label: 'No EM award (tuition)' },
  ],
}

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
          active?.slug === 'denmark' ||
          active?.slug === 'finland' ||
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

  async function loadDenmarkList() {
    setSeeding(true)
    setError(null)
    setNotice(null)
    const result = await seedDenmarkCatalogue({
      userId: user?.id,
      isAdmin: Boolean(profile?.is_admin),
    })
    setSeeding(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setNotice(`Denmark list updated (${result.count} programmes).`)
    await loadCatalogues()
    const { data } = await supabase
      .from('catalogues')
      .select('id')
      .eq('slug', 'denmark')
      .is('owner_user_id', null)
      .maybeSingle()
    if (data?.id) setActiveId(data.id)
  }

  async function loadFinlandList() {
    setSeeding(true)
    setError(null)
    setNotice(null)
    const result = await seedFinlandCatalogue({
      userId: user?.id,
      isAdmin: Boolean(profile?.is_admin),
    })
    setSeeding(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setNotice(`Finland list updated (${result.count} programmes).`)
    await loadCatalogues()
    const { data } = await supabase
      .from('catalogues')
      .select('id')
      .eq('slug', 'finland')
      .is('owner_user_id', null)
      .maybeSingle()
    if (data?.id) setActiveId(data.id)
  }

  async function refreshEmjm() {
    setSeeding(true)
    setError(null)
    setNotice(null)
    const result = await seedErasmusEmjmUpdates({
      userId: user?.id,
      force: true,
      isAdmin: Boolean(profile?.is_admin),
    })
    setSeeding(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setNotice(
      result.updated
        ? `EMJM details refreshed (${result.count}): GEM, CDE, GroundwatCH.`
        : 'EMJM programmes already up to date.',
    )
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

  async function untrack(programme: Programme) {
    if (!user) return
    setBusyId(programme.id)
    setNotice(null)
    const result = await removeProgrammeFromTracker({
      userId: user.id,
      programmeId: programme.id,
    })
    setBusyId(null)
    if (result.error) {
      setError(result.error)
      return
    }
    if (result.removed) {
      setTracked((prev) => {
        const next = new Set(prev)
        next.delete(programme.id)
        return next
      })
      setNotice(`Removed ${programme.acronym ?? programme.name} from tracker.`)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Catalogues</h1>
        <p className="mt-1 text-sm text-muted">
          Erasmus Mundus is one family. DAAD is two tracks. Country catalogues mix self-funded degrees with named scholarships — including Denmark and Finland (Nordic GIS / geoinformatics). Search, filter, open details, then send a programme to your tracker.
        </p>
      </div>

      <ChoiceBar
        wrap
        options={catalogues.map((c) => ({ id: c.id, label: c.name }))}
        value={activeId ?? ''}
        onChange={(id) => {
          setActiveId(id)
          setFunding('all')
        }}
      />
      <div className="flex flex-wrap gap-2">
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
        {canEdit && !catalogues.some((c) => c.slug === 'denmark') ? (
          <button
            type="button"
            onClick={() => void loadDenmarkList()}
            disabled={seeding}
            className="rounded-full bg-slate-800 px-3 py-1.5 text-sm text-white"
          >
            {seeding ? 'Adding Denmark…' : 'Add Denmark catalogue'}
          </button>
        ) : null}
        {canEdit && !catalogues.some((c) => c.slug === 'finland') ? (
          <button
            type="button"
            onClick={() => void loadFinlandList()}
            disabled={seeding}
            className="rounded-full bg-slate-800 px-3 py-1.5 text-sm text-white"
          >
            {seeding ? 'Adding Finland…' : 'Add Finland catalogue'}
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
                  {active.slug === 'denmark' ? (
                    <button
                      type="button"
                      onClick={() => void loadDenmarkList()}
                      disabled={seeding}
                      className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white"
                    >
                      {seeding ? 'Updating…' : 'Load / refresh Denmark GIS list'}
                    </button>
                  ) : null}
                  {active.slug === 'finland' ? (
                    <button
                      type="button"
                      onClick={() => void loadFinlandList()}
                      disabled={seeding}
                      className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white"
                    >
                      {seeding ? 'Updating…' : 'Load / refresh Finland GIS list'}
                    </button>
                  ) : null}
                  {active.slug === 'erasmus-mundus' ? (
                    <button
                      type="button"
                      onClick={() => void refreshEmjm()}
                      disabled={seeding}
                      className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white"
                    >
                      {seeding ? 'Updating…' : 'Refresh EMJM dates (GEM / CDE / GroundwatCH)'}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setShowForm((v) => !v)}
                    className="rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-white hover:bg-navy/90"
                  >
                    {showForm ? 'Close' : 'Add programme'}
                  </button>
                </div>
              ) : null}
            </div>

            <div className="mt-4 space-y-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search GEM, water, ITC, forest…"
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-navy"
              />
              <ChoiceBar
                label="Priority"
                options={PRIORITY_FILTERS.map((p) => ({ id: p, label: p === 'all' ? 'All' : p }))}
                value={priority}
                onChange={(id) => setPriority(id as (typeof PRIORITY_FILTERS)[number])}
              />
              {FUNDING_OPTIONS[active.slug] ? (
                <ChoiceBar
                  label="Funding type"
                  options={FUNDING_OPTIONS[active.slug]}
                  value={funding}
                  onChange={(id) => setFunding(id as 'all' | FundingScheme)}
                />
              ) : null}
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
            <div className="grid items-stretch gap-3 md:grid-cols-2">
              {visible.map((p) => (
                <ProgrammeCard
                  key={p.id}
                  programme={p}
                  cycle={p.cycles?.[0]}
                  catalogueName={active.name}
                  tracked={tracked.has(p.id)}
                  tracking={busyId === p.id}
                  onTrack={() => void track(p)}
                  onUntrack={() => void untrack(p)}
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
              · <FundingBadge scheme="emjm" /> €1,400/mo + tuition (Pakistan eligible). GEM 15 Jan 2027 · GroundwatCH Partner
              deadline 3 Jan 2027 · GeoTech 7 Jan 2027 · CDE 2 Nov 2026–22 Jan 2027. FloodRISK and WAVES are not listed: GroundwatCH is the IHE application, and GEM is the Twente application. Programmes with no Erasmus Mundus scholarship, including Cartography, MESPOM, and IMRD, are not listed.
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
              call planned). Violet <FundingBadge scheme="partial" /> One World after arrival, or Ernst Mach (not a master’s). CDE is under Erasmus Mundus.
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
              France Excellence Pakistan Climate Change is IMT PM3E and Avignon MAFEN only. Both lock in the Études en France cart on 18 November 2026, and PM3E also needs the IMT form. IMG and the other France cards are not on that scholarship.
            </p>
          ) : null}

          {active.slug === 'hong-kong' ? (
            <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
              Violet <FundingBadge scheme="partial" /> HKU/PolyU MPhil/PhD with PGS, IPFS, or supervisor studentship — email faculty first.
              Green <FundingBadge scheme="full" /> HKPFS (PhD). Grey <FundingBadge scheme="self_funded" /> taught MSc GeoDS (~HK$250k). Planning
              notes: <span className="font-medium">hong-kong-universities.md</span> in the repo.
            </p>
          ) : null}

          {active.slug === 'denmark' ? (
            <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
              Grey <FundingBadge scheme="self_funded" /> KU Geoinformatics / AU Geoscience tuition. Violet{' '}
              <FundingBadge scheme="partial" /> Danish Government Scholarship (auto at KU/AU) or RUC Environmental Science stipend track. Pakistan
              eligible for Danish gov pool — very competitive.
            </p>
          ) : null}

          {active.slug === 'finland' ? (
            <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
              Grey <FundingBadge scheme="self_funded" /> Aalto Geoinformatics / Helsinki Geography fees. Violet{' '}
              <FundingBadge scheme="partial" /> tuition waivers only — Migri still wants ~€9,600 living proof unless living aid is documented.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
