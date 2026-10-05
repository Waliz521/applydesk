import { supabase } from '@/lib/supabase'
import type { FundingScheme } from '@/lib/types'

export type SeedRec = {
  slug: string
  acronym: string
  name: string
  official_title: string
  priority: string
  coordinator: string
  countries: string[]
  duration: string
  website: string
  apply_url: string
  fit_notes: string
  /** Defaults to English. Set this for French-taught degrees. */
  language?: string
  cycle_label: string
  opens: string | null
  scholarship: string | null
  self_funded: string | null
  starts: string | null
  date_status: string
  scholarships: boolean
  funding_scheme: FundingScheme
  extra: Record<string, string | boolean | null>
}

export async function findOrCreateCatalogue(opts: {
  slug: string
  name: string
  description: string
  userId?: string
  isAdmin?: boolean
}): Promise<{ error: string | null; catalogueId: string | null }> {
  const userId = opts.userId
  const isAdmin = Boolean(opts.isAdmin)

  let existingQuery = supabase.from('catalogues').select('id, owner_user_id').eq('slug', opts.slug)
  if (userId) {
    existingQuery = existingQuery.or(`owner_user_id.is.null,owner_user_id.eq.${userId}`)
  } else {
    existingQuery = existingQuery.is('owner_user_id', null)
  }
  const { data: existingCats, error: catLookupError } = await existingQuery
  if (catLookupError) return { error: catLookupError.message, catalogueId: null }

  const systemCat = existingCats?.find((c) => c.owner_user_id == null)
  const ownCat = existingCats?.find((c) => c.owner_user_id === userId)
  let catalogueId = (systemCat?.id ?? ownCat?.id) as string | undefined

  if (!catalogueId) {
    const { data: created, error: createError } = await supabase
      .from('catalogues')
      .insert({
        owner_user_id: isAdmin || !userId ? null : userId,
        slug: opts.slug,
        name: opts.name,
        description: opts.description,
        is_system: isAdmin || !userId,
      })
      .select('id')
      .single()
    if (createError) return { error: createError.message, catalogueId: null }
    catalogueId = created.id
  } else {
    await supabase.from('catalogues').update({ name: opts.name, description: opts.description }).eq('id', catalogueId)
  }
  return { error: null, catalogueId: catalogueId ?? null }
}

export async function findCatalogueBySlug(
  slug: string,
  userId?: string,
): Promise<{ error: string | null; catalogueId: string | null }> {
  let query = supabase.from('catalogues').select('id, owner_user_id').eq('slug', slug)
  if (userId) {
    query = query.or(`owner_user_id.is.null,owner_user_id.eq.${userId}`)
  } else {
    query = query.is('owner_user_id', null)
  }
  const { data, error } = await query
  if (error) return { error: error.message, catalogueId: null }
  const systemCat = data?.find((c) => c.owner_user_id == null)
  const ownCat = data?.find((c) => c.owner_user_id === userId)
  return { error: null, catalogueId: (systemCat?.id ?? ownCat?.id) ?? null }
}

export async function upsertSeedProgrammes(opts: {
  catalogueId: string
  programmes: SeedRec[]
  source: string
}): Promise<{ error: string | null; count: number }> {
  const { data: existingRows } = await supabase
    .from('programmes')
    .select('id, slug')
    .eq('catalogue_id', opts.catalogueId)
  const bySlug = new Map((existingRows ?? []).map((row) => [row.slug as string, row.id as string]))

  let count = 0
  for (const rec of opts.programmes) {
    const extra = {
      ...rec.extra,
      funding_scheme: rec.funding_scheme,
      work_years_required: false,
      source: opts.source,
    }
    const payload = {
      catalogue_id: opts.catalogueId,
      slug: rec.slug,
      acronym: rec.acronym,
      name: rec.name,
      official_title: rec.official_title,
      coordinator: rec.coordinator,
      consortium: rec.coordinator,
      countries: rec.countries,
      duration: rec.duration,
      language: rec.language ?? 'English',
      website: rec.website,
      apply_url: rec.apply_url,
      degree_level: 'masters',
      priority: rec.priority,
      fit_notes: rec.fit_notes,
      extra,
    }
    let programmeId = bySlug.get(rec.slug)
    if (programmeId) {
      const { error } = await supabase.from('programmes').update(payload).eq('id', programmeId)
      if (error) return { error: error.message, count }
    } else {
      const { data, error } = await supabase.from('programmes').insert(payload).select('id').single()
      if (error) return { error: error.message, count }
      programmeId = data.id
    }

    const { data: cycles } = await supabase
      .from('programme_cycles')
      .select('id')
      .eq('programme_id', programmeId)
      .eq('label', rec.cycle_label)
    const cyclePayload = {
      programme_id: programmeId,
      label: rec.cycle_label,
      starts_on: rec.starts,
      application_opens_on: rec.opens,
      scholarship_deadline: rec.scholarship,
      self_funded_deadline: rec.self_funded,
      date_status: rec.date_status,
      scholarships_available: rec.scholarships,
      extra_dates: {
        opens_text: rec.extra.opens_text,
        deadline_text: rec.extra.deadline_text,
        self_funded_text: rec.extra.self_funded_text,
        target_start: rec.extra.target_start,
      },
    }
    let cycleId = cycles?.[0]?.id as string | undefined
    if (!cycleId) {
      // Label may have changed (e.g. "2027 intake" → "2027–2029 intake"). Update the
      // existing cycle instead of inserting — inserts fail RLS for non-admin users.
      const { data: existing } = await supabase
        .from('programme_cycles')
        .select('id')
        .eq('programme_id', programmeId)
        .limit(1)
      cycleId = existing?.[0]?.id as string | undefined
    }
    if (cycleId) {
      const { error } = await supabase.from('programme_cycles').update(cyclePayload).eq('id', cycleId)
      if (error) return { error: error.message, count }
    } else {
      const { error } = await supabase.from('programme_cycles').insert(cyclePayload)
      if (error) return { error: error.message, count }
    }
    count += 1
  }
  return { error: null, count }
}
