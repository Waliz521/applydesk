import { supabase } from '@/lib/supabase'
import { findCatalogueBySlug, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'

/** Confirmed or officially announced EMJM details for the 2027 intake (checked 28 Sep 2026). */
const PROGRAMMES: SeedRec[] = [
  {
    slug: 'gem',
    acronym: 'GEM',
    name: 'Geo-Information Science and Earth Observation for Environmental Modelling and Management',
    official_title: 'EMJM GEM — Geo-Information Science and Earth Observation for Environmental Modelling and Management',
    priority: 'A',
    coordinator: 'University of Twente / ITC (NL) with Lund (SE), UCLouvain (BE), University of Tartu (EE)',
    countries: ['Netherlands', 'Sweden', 'Belgium', 'Estonia'],
    duration: '24 months / 120 ECTS',
    website: 'https://www.gem-msc.eu/',
    apply_url: 'https://www.gem-msc.eu/apply-to-gem/',
    fit_notes:
      'Core GIS / Earth-observation joint master. Four tracks: Planner, Analyst, Developer, Modeller — one track only.',
    cycle_label: '2027–2029 intake',
    opens: '2026-10-01',
    scholarship: '2027-01-15',
    self_funded: '2027-05-01',
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: true,
    funding_scheme: 'emjm',
    extra: {
      apply:
        'OPEN NOW (1 Oct 2026) for the 2027–2029 intake. One track only. Complete file by 15 Jan 2027 is auto-considered for EMJM.',
      target_start: 'September 2027',
      opens_text: 'OPEN: DreamApply opened 1 October 2026. Rechecked gem-msc.eu/apply-to-gem on 1 Oct 2026 — deadline still 15 Jan 2027.',
      deadline_text:
        'Confirmed: 15 January 2027, 23:59 CET. Complete applications by this date are automatically considered for EMJM — no separate scholarship form.',
      tuition_text:
        'EMJM scholars: participation costs / tuition covered. Self-funded: check gem-msc.eu Finance page; payment deadline for confirmation 1 May 2027.',
      self_funded_text:
        'Possible if not ranked for EMJM. Up to 8 students per track ultimately enrol (all funding types). Reserve list can get scholarships until programme start.',
      scholarships_text:
        'EMJM: €1,400/month up to 24 months + tuition/participation covered. Top ~25 per track invited to a recorded interview (Feb–Mar 2027) — interview required to stay in scholarship contention. Results: 31 March 2027. Pakistan = Partner Country (eligible). Geographic balance applies.',
      prepare:
        'First/2nd upper BSc, transcript, IELTS/TOEFL before deadline, passport, official GEM CV template (max 2 pages), financial plan in euros. No motivation letter and no reference letter. Do not upload documents the form did not request.',
      watch_outs:
        'Max 8 students per track. Certified graduation docs by 31 July 2027. Interview invitations normally in February. A reference letter is not part of this file.',
      last_checked: '20 Oct 2026',
    },
  },
  {
    slug: 'cde',
    acronym: 'CDE',
    name: 'Copernicus Master in Digital Earth',
    official_title: 'EMJM Copernicus Master in Digital Earth',
    priority: 'A',
    coordinator: 'University of Salzburg (AT) with partners in France and Czechia',
    countries: ['Austria', 'France', 'Czechia'],
    duration: '24 months / 120 ECTS',
    website: 'https://master-cde.eu/',
    apply_url: 'https://master-cde.eu/admission/procedures-deadlines/calls/',
    fit_notes:
      'EO + GI / Digital Earth. Geospatial bachelor fits. Salzburg semester links to your Austria track, but this is a separate Erasmus application from PLUS AGI.',
    cycle_label: '2027 intake (Call 4)',
    opens: '2026-11-02',
    scholarship: '2027-01-22',
    self_funded: '2027-01-22',
    starts: '2027-10-01',
    date_status: 'confirmed',
    scholarships: true,
    funding_scheme: 'emjm',
    extra: {
      apply:
        'Call 4 opens 2 November 2026 and closes 22 January 2027, 23:59 CET. Worldwide call covers EMJM and self-funded places.',
      target_start: 'October 2027',
      opens_text: 'Confirmed on master-cde.eu: Call 4 opens 2 November 2026.',
      deadline_text:
        'Confirmed: 22 January 2027, 23:59 CET. European-only rolling window in March–May has no EMJM scholarship.',
      tuition_text:
        'EMJM: fee waiver + €1,400/month. Best-ranked may get participation fee waiver even without full EMJM.',
      self_funded_text:
        'Worldwide Nov–Jan call also allows self-funded places. High competition for both funded and self-funded seats.',
      scholarships_text:
        'EMJM €1,400/month + fee waiver for best-ranked. Pakistan eligible. Prepare certified / legalised docs early (CDE warns international applicants).',
      prepare:
        'Geospatial bachelor, IELTS, Europass CV, motivation questions. Two referee contacts are required. Uploading letters is optional, and only one letter per institution is accepted.',
      watch_outs:
        'Do not confuse with PLUS MSc Applied Geoinformatics (self-funded Salzburg degree). Different portal and deadlines. Hamid and Sawaid are the same university, so upload only one of their letters.',
      last_checked: '20 Oct 2026',
    },
  },
  {
    slug: 'groundwatch',
    acronym: 'GroundwatCH',
    name: 'Groundwater and Global Change',
    official_title: 'EMJM GroundwatCH — Groundwater and Global Change',
    priority: 'A',
    coordinator: 'IHE Delft (NL) with IST Lisbon (PT) and TU Dresden (DE)',
    countries: ['Netherlands', 'Portugal', 'Germany'],
    duration: '24 months',
    website: 'https://www.groundwatermaster.eu/',
    apply_url: 'https://www.groundwatermaster.eu/how-to-apply',
    fit_notes:
      'Groundwater and climate joint master. Hydrogeology plus spatial analysis. Not a pure GIS degree.',
    cycle_label: '2027–2029 intake',
    opens: '2026-10-01',
    scholarship: '2027-01-03',
    self_funded: '2027-04-30',
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: true,
    funding_scheme: 'emjm',
    extra: {
      apply:
        'OPEN NOW (1 Oct 2026) for Sep 2027. Select Erasmus Mundus scholarship in the funding question. Pakistan (Partner Country) deadline 3 Jan 2027.',
      target_start: 'September 2027',
      opens_text: 'Stated open date 1 October 2026. Deadlines on how-to-apply still 3 Jan 2027 (Partner) / 7 Feb 2027 (Programme). Rechecked 1 Oct 2026.',
      deadline_text:
        'Confirmed: Partner Countries (Pakistan) 3 January 2027, 23:59 CET. Programme Countries 7 February 2027. English test may upload by 1 Feb 2027 if the rest of the file was in by 3 Jan.',
      tuition_text:
        'EMJM covers tuition/participation. Self-funded: confirm funding by 15 Apr 2027 (visa cases) / later if no visa.',
      self_funded_text:
        'After scholarship deadlines, admission-only possible. Reduced tuition scholarships may open if seats remain — confirm funding by 15 April 2027.',
      scholarships_text:
        '~15 EMJM awards per year (~60 across 2024–2027 intakes). Pakistan = Partner Country. Results usually April 2027. Same online form for admission + scholarship.',
      prepare:
        'BSc in a relevant field, English test, CV, five motivation answers, passport. Two recommendation letters, dated within six months, from two teachers or one teacher and one employer. Referee contact details must be on the letter.',
      watch_outs:
        'Partner-country deadline is earlier (3 Jan) than GEM (15 Jan). IHE asks applicants to choose one Erasmus Mundus programme in a year, so FloodRISK is not listed.',
      last_checked: '6 Nov 2026',
    },
  },
]

const FACT_CYCLES: Record<string, Record<string, string | boolean | null>> = {
  geotech: { application_opens_on: '2026-10-01', scholarship_deadline: '2027-01-07', starts_on: '2027-09-01', date_status: 'confirmed', scholarships_available: true },
  sufonama: { application_opens_on: '2026-11-15', scholarship_deadline: '2027-01-15', starts_on: '2027-09-01', date_status: 'confirmed', scholarships_available: true },
  'msc-ef': { application_opens_on: '2026-12-02', scholarship_deadline: '2027-01-13', starts_on: '2027-08-01', date_status: 'confirmed', scholarships_available: true },
}

const FACT_EXTRAS: Record<string, Record<string, string>> = {
  geotech: {
    funding_scheme: 'emjm',
    opens_text: 'Scholarship applications are open.',
    deadline_text: 'Confirmed: 7 January 2027, 18:00 CET, for the Erasmus Mundus scholarship.',
    scholarships_text: 'Erasmus Mundus scholarships are open. The programme page lists about 19 partner-country awards and about 2 programme-country awards per edition.',
    prepare: 'Two recommenders. The portal emails them and they must upload before 7 January 2027, 18:00 CET. Public motivation video of at most 2 minutes. European CV with no gaps over the last 5.5 years.',
    last_checked: '28 Oct 2026',
  },
  sufonama: {
    funding_scheme: 'emjm',
    opens_text: 'Outside EU/EEA/Switzerland: portal opens 15 November 2026, 23:59 CET. EU/EEA/Switzerland: 16 January 2027.',
    deadline_text: 'Outside EU/EEA/Switzerland: 15 January 2027, 23:59 CET. EU/EEA/Switzerland: 1 March 2027, 23:59 CET.',
    scholarships_text: 'Erasmus Mundus scholarship. No application fee. Two signed letters on letterhead are required for the scholarship, at least one from a teacher.',
    prepare: 'Europass CV, motivation letter of about 500 words, and two recommendation letters if you apply for the scholarship.',
    last_checked: '5 Nov 2026',
  },
  'msc-ef': {
    funding_scheme: 'emjm',
    opens_text: 'Confirmed: the call opens 2 December 2026.',
    deadline_text: 'Confirmed: 13 January 2027. Motivation video by 20 January 2027, 23:59 Helsinki time.',
    scholarships_text: 'Erasmus Mundus scholarship. The admission file does not ask for a recommendation letter.',
    prepare: 'Degree, transcript, English certificate, CV, passport, and a 3-minute motivation video. No recommendation letter.',
    last_checked: '28 Oct 2026',
  },
  'hk-hkpfs': {
    scholarships_text: '400 awards for 2027/28. Stipend HK$344,400 per year plus HK$14,400 travel, for up to 3 years. Results May 2027. PhD only.',
    last_checked: '28 Oct 2026',
  },
}

const FACT_NOTES: Record<string, string> = {
  geotech: 'Confirmed: 7 January 2027, 18:00 CET, for the Erasmus Mundus scholarship.',
  sufonama: 'Confirmed: non-EU portal opens 15 November 2026; scholarship deadline 15 January 2027, 23:59 CET (sufonama-em.eu).',
  'msc-ef': 'Confirmed: 13 January 2027. Motivation video by 20 January 2027, 23:59 Helsinki time.',
}

async function patchCheckedFacts(): Promise<string | null> {
  const slugs = [...new Set([...Object.keys(FACT_CYCLES), ...Object.keys(FACT_EXTRAS)])]
  const { data: rows, error } = await supabase.from('programmes').select('id, slug, extra').in('slug', slugs)
  if (error) return error.message
  for (const row of rows ?? []) {
    const slug = row.slug as string
    const cyclePatch = FACT_CYCLES[slug]
    const extraPatch = FACT_EXTRAS[slug]
    if (cyclePatch) {
      const { data: cycles, error: cycleError } = await supabase
        .from('programme_cycles')
        .select('id, extra_dates')
        .eq('programme_id', row.id)
      if (cycleError) return cycleError.message
      for (const cycle of cycles ?? []) {
        const previous = (cycle.extra_dates ?? {}) as Record<string, string | null>
        const { error: updateError } = await supabase
          .from('programme_cycles')
          .update({
            ...cyclePatch,
            extra_dates: {
              ...previous,
              deadline_text: FACT_NOTES[slug] ?? previous.deadline_text ?? null,
              opens_text: extraPatch?.opens_text ?? previous.opens_text ?? null,
            },
          })
          .eq('id', cycle.id)
        if (updateError) return updateError.message
      }
    }
    if (extraPatch) {
      const previous = (row.extra ?? {}) as Record<string, unknown>
      const { error: updateError } = await supabase
        .from('programmes')
        .update({ extra: { ...previous, ...extraPatch } })
        .eq('id', row.id)
      if (updateError) return updateError.message
    }
  }
  return null
}

/** Cards removed from this catalogue, not relabelled.
 *  No 2027 EMJM scholarship: merged, imete, coasthazar, cartography, mespom, imrd.
 *  Closed for this applicant: floodrisk (IHE asks for one EM programme; GroundwatCH is submitted),
 *  waves (GEM is the submitted Twente application). */
const RETIRED_SLUGS = ['merged', 'imete', 'coasthazar', 'cartography', 'mespom', 'imrd', 'floodrisk', 'waves'] as const

async function retireProgrammesWithoutScholarship(catalogueId: string): Promise<string | null> {
  const { data: rows, error: lookupError } = await supabase
    .from('programmes')
    .select('id, slug')
    .eq('catalogue_id', catalogueId)
    .in('slug', [...RETIRED_SLUGS])
  if (lookupError) return lookupError.message
  const ids = (rows ?? []).map((row) => row.id as string)
  if (ids.length === 0) return null

  const { error: appError } = await supabase.from('applications').delete().in('programme_id', ids)
  if (appError) return appError.message
  const { error: cycleError } = await supabase.from('programme_cycles').delete().in('programme_id', ids)
  if (cycleError) return cycleError.message
  const { error: programmeError } = await supabase.from('programmes').delete().in('id', ids)
  return programmeError?.message ?? null
}

export async function seedErasmusEmjmUpdates(opts?: {
  userId?: string
  force?: boolean
  isAdmin?: boolean
}): Promise<{ error: string | null; count: number; updated: boolean }> {
  const found = await findCatalogueBySlug('erasmus-mundus', opts?.userId)
  if (found.error) return { error: found.error, count: 0, updated: false }
  if (!found.catalogueId) return { error: null, count: 0, updated: false }

  if (opts?.isAdmin) {
    const removed = await retireProgrammesWithoutScholarship(found.catalogueId)
    if (removed) return { error: removed, count: 0, updated: false }
    const patched = await patchCheckedFacts()
    if (patched) return { error: patched, count: 0, updated: false }
  }

  const result = await upsertSeedProgrammes({
    catalogueId: found.catalogueId,
    programmes: PROGRAMMES,
    source: 'Official GEM, CDE, and GroundwatCH sites, 6 Nov 2026',
  })
  return { ...result, updated: !result.error && result.count > 0 }
}
