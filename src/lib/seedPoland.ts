import { removeProgrammesBySlug } from '@/lib/seedShared'
import { supabase } from '@/lib/supabase'

type SeedRec = {
  slug: string
  acronym: string
  name: string
  official_title: string
  priority: string
  coordinator: string
  duration: string
  website: string
  apply_url: string
  fit_notes: string
  opens: string | null
  scholarship: string | null
  self_funded: string | null
  starts: string | null
  date_status: string
  scholarships: boolean
  funding_scheme: 'self_funded' | 'nawa'
  extra: Record<string, string | boolean | null>
}

const CYCLE_LABEL = '2026/27 intake'

const PROGRAMMES: SeedRec[] = [
{
    slug: 'puls-geoinformation-spatial-management',
    acronym: 'PULS-GEO',
    name: 'Geoinformation and Spatial Management',
    official_title: 'MSc Geoinformation and Spatial Management',
    priority: 'A-',
    coordinator: 'Poznań University of Life Sciences — Faculty of Environmental and Mechanical Engineering',
    duration: '24 months / 4 semesters',
    website: 'https://wisim.up.poznan.pl/wydzial/study-english/msc/msc-geo',
    apply_url: 'https://wisim.up.poznan.pl/wydzial/study-english/msc/msc-geo',
    fit_notes:
      'GIS + Earth observation for environment, UAV, spatial planning. Cheapest English GIS-shaped master’s. Fits Forest Dept / water-environment.',
    opens: null,
    scholarship: null,
    self_funded: null,
    starts: '2026-10-01',
    date_status: 'tba',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'This is the current degree. The October 2026 intake has started.',
      target_start: 'October 2026',
      opens_text: 'Lectures for this intake began in October 2026.',
      deadline_text: 'October 2026 recruitment is the current degree. The next foreign-student deadline is not published.',
      tuition_text: '€4,200 total (~Rs 13.6 lac). €1,100 × 3 + €900. Enrolment fee €65 (non-EU).',
      self_funded_text: 'Self-funded. Year 1 is about €2,200 (~Rs 7 lac) plus visa show-money.',
      scholarships_text: 'No built-in EM scholarship. Banach NAWA 2026 did not include Pakistan.',
      prepare: 'BSc GIS / geography / environment. English B2.',
      watch_outs: 'Lighter on remote sensing and photogrammetry than a specialist RS master’s. Poznań living is cheaper than Kraków.',
      last_checked: '15 Oct 2026',
    },
  },
]

const DESCRIPTION =
  'Poznań University of Life Sciences, MSc Geoinformation and Spatial Management. This is the current degree. AGH was not pursued.'

export async function seedPolandCatalogue(opts?: {
  userId?: string
  isAdmin?: boolean
}): Promise<{ error: string | null; count: number }> {
  const removed = await removeProgrammesBySlug([
    'nawa-banach',
    'wut-mobile-mapping-navigation',
    'agh-remote-sensing-geo-informatics',
    'uwm-geodesy-geoinformatics',
    'pwr-geodesy-cartography',
  ])
  if (removed) return { error: removed, count: 0 }
  const userId = opts?.userId
  const isAdmin = Boolean(opts?.isAdmin)

  let existingQuery = supabase.from('catalogues').select('id, owner_user_id').eq('slug', 'poland')
  if (userId) {
    existingQuery = existingQuery.or(`owner_user_id.is.null,owner_user_id.eq.${userId}`)
  } else {
    existingQuery = existingQuery.is('owner_user_id', null)
  }
  const { data: existingCats, error: catLookupError } = await existingQuery
  if (catLookupError) return { error: catLookupError.message, count: 0 }

  const systemCat = existingCats?.find((c) => c.owner_user_id == null)
  const ownCat = existingCats?.find((c) => c.owner_user_id === userId)
  let catalogueId = (systemCat?.id ?? ownCat?.id) as string | undefined

  if (!catalogueId) {
    const { data: created, error: createError } = await supabase
      .from('catalogues')
      .insert({
        owner_user_id: isAdmin || !userId ? null : userId,
        slug: 'poland',
        name: 'Poland (self-funded)',
        description: DESCRIPTION,
        is_system: isAdmin || !userId,
      })
      .select('id')
      .single()
    if (createError) return { error: createError.message, count: 0 }
    catalogueId = created.id
  } else {
    await supabase
      .from('catalogues')
      .update({ name: 'Poland (self-funded)', description: DESCRIPTION })
      .eq('id', catalogueId)
  }

  const { data: existingRows } = await supabase
    .from('programmes')
    .select('id, slug')
    .eq('catalogue_id', catalogueId)
  const bySlug = new Map((existingRows ?? []).map((row) => [row.slug as string, row.id as string]))

  let count = 0
  for (const rec of PROGRAMMES) {
    const extra = {
      ...rec.extra,
      funding_scheme: rec.funding_scheme,
      work_years_required: false,
      source: 'AGH 2027/28 resolution, NAWA 2026 list, 15 Oct 2026. PULS, UWM, and PWr next deadlines not published.',
    }
    const payload = {
      catalogue_id: catalogueId,
      slug: rec.slug,
      acronym: rec.acronym,
      name: rec.name,
      official_title: rec.official_title,
      coordinator: rec.coordinator,
      consortium: rec.coordinator,
      countries: ['Poland'],
      duration: rec.duration,
      language: 'English',
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
      .eq('label', CYCLE_LABEL)
    const cyclePayload = {
      programme_id: programmeId,
      label: CYCLE_LABEL,
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
    if (cycles && cycles.length > 0) {
      const { error } = await supabase.from('programme_cycles').update(cyclePayload).eq('id', cycles[0].id)
      if (error) return { error: error.message, count }
    } else {
      const { error } = await supabase.from('programme_cycles').insert(cyclePayload)
      if (error) return { error: error.message, count }
    }
    count += 1
  }
  return { error: null, count }
}
