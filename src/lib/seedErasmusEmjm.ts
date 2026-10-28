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
        'Partner-country deadline is earlier (3 Jan) than GEM (15 Jan). Do not miss it if this is a primary target.',
      last_checked: '5 Oct 2026',
    },
  },
  {
    slug: 'floodrisk',
    acronym: 'FloodRISK',
    name: 'Flood Risk Management',
    official_title: 'EMJM Flood Risk Management',
    priority: 'A-',
    coordinator: 'IHE Delft (NL) with TU Dresden (DE), UPC Barcelona (ES), and University of Ljubljana (SI)',
    countries: ['Netherlands', 'Germany', 'Spain', 'Slovenia'],
    duration: '24 months',
    website: 'https://www.floodriskmaster.org/',
    apply_url: 'https://www.floodriskmaster.org/howtoapply',
    fit_notes:
      'Flood risk, water, and spatial planning. Uses GIS and Earth observation. Same IHE Delft application pattern as GroundwatCH.',
    cycle_label: '2027 intake',
    opens: '2026-10-01',
    scholarship: '2027-01-03',
    self_funded: '2027-04-30',
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: true,
    funding_scheme: 'emjm',
    extra: {
      apply:
        'OPEN. Partner Country (Pakistan) scholarship deadline 3 January 2027, 23:59 CET. Apply on the FloodRISK / IHE form and select the Erasmus Mundus scholarship.',
      target_start: 'September 2027',
      opens_text: '2027 scholarship deadlines are published on floodriskmaster.org (apply, how to apply, and scholarships). Rechecked 5 Oct 2026.',
      deadline_text:
        'Confirmed: Partner Countries 3 January 2027, 23:59 CET. Programme Countries and IPA 7 February 2027, 23:59 CET. English test may arrive by 1 February 2027 if the rest of the file was in by 3 January. Results beginning of April 2027.',
      tuition_text: 'EMJM covers the participation fee. Reduced-fee scholarship (€3,000 instead of €18,000 excl. VAT) deadline 15 April 2027.',
      self_funded_text:
        'Files after the scholarship deadline can still be considered for admission if submitted with financial confirmation by 30 April 2027, 23:59 CET. No visa required for Germany: 31 July 2027.',
      scholarships_text:
        'EMJM for 2024–2027 intakes (about 70 scholarships across four years, plus a few targeted-region awards). Pakistan counts as a Partner Country. Same form for admission and scholarship.',
      prepare:
        'Relevant bachelor, grades, English test, CV, motivation, references, passport. Certified diploma can follow; scholarship holders must prove graduation by 15 August of the start year.',
      watch_outs:
        'Use the scholarships and how-to-apply pages. An older line on the site still mentions 5 January in one English-test note; the deadline repeated on the apply page is 3 January 2027.',
      last_checked: '5 Oct 2026',
    },
  },
  {
    slug: 'waves',
    acronym: 'WAVES',
    name: 'Water Vulnerability Engineering in Spatial Sciences',
    official_title: 'EMJM WAVES — Water Vulnerability Engineering in Spatial Sciences',
    priority: 'A-',
    coordinator: 'University of Twente / ITC (NL) with University of Padova (IT) and University of Ljubljana (SI)',
    countries: ['Netherlands', 'Italy', 'Slovenia'],
    duration: '24 months',
    website: 'https://msc-waves.eu/',
    apply_url: 'https://msc-waves.eu/admissions/how-to-apply',
    fit_notes:
      'New EMJM in spatial water science. Call is open. Do not use master-waves.eu — that is a different acoustics degree.',
    cycle_label: '2027 intake',
    opens: '2026-10-13',
    scholarship: '2027-01-15',
    self_funded: null,
    starts: '2027-10-01',
    date_status: 'confirmed',
    scholarships: true,
    funding_scheme: 'emjm',
    extra: {
      apply: 'OPEN. Portal opened 13 October 2026. Erasmus Mundus scholarship deadline 15 January 2027, 23:59 CET.',
      target_start: '1 October 2027',
      opens_text: 'Application portal opened 13 October 2026 (msc-waves.eu admissions page).',
      deadline_text:
        'Confirmed: 15 January 2027, 23:59 CET for the Erasmus Mundus scholarship. Self-funded applications use a later date published on msc-waves.eu.',
      tuition_text: 'No fee to apply. EMJM scholarship amounts are on the funding page.',
      self_funded_text: 'Self-funded and sponsored applicants have a later deadline than the scholarship date. Same academic criteria.',
      scholarships_text:
        'Erasmus Mundus scholarships are open to any nationality. Recorded interviews for shortlisted candidates are in February–March 2027. Tracks: Spatial Water Sciences, Water Vulnerability Engineering, Spatial Water Governance and Policy.',
      prepare:
        'Degree certificate and transcript, CV, motivation letter (one page), English certificate, passport, and one signed reference letter on letterhead. Shared first semester covers Earth observation, geostatistics, programming, and hydrology.',
      watch_outs: 'Scholarship files close on 15 January 2027. A self-funded file uses the later date on the site.',
      last_checked: '15 Oct 2026',
    },
  },
  {
    slug: 'cartography',
    acronym: 'Cartography',
    name: 'Cartography M.Sc.',
    official_title: 'Erasmus Mundus Master of Science in Cartography: Mapping for a Sustainable World',
    priority: 'A',
    coordinator:
      'Technical University of Munich (DE), coordinator — with TU Wien (AT) and TU Dresden (DE). University of Twente / ITC is not in the 2027 thesis rotation.',
    countries: ['Germany', 'Austria'],
    duration: '24 months / 4 semesters / 120 ECTS',
    website: 'https://cartographymaster.eu/',
    apply_url: 'https://cartographymaster.eu/how-to-apply/',
    fit_notes:
      'The degree is still offered. The Erasmus Mundus scholarship is not. Last funded intake started in 2025. 2026 and 2027 students pay their own way.',
    cycle_label: '2027 intake',
    opens: '2027-01-01',
    scholarship: null,
    self_funded: '2027-05-31',
    starts: '2027-10-01',
    date_status: 'expected',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply:
        'WATCH — 2026 intake closed. 2027 portal expected 1 Jan–31 May 2027 via TUMonline. Self-funded only.',
      target_start: '1 October 2027',
      opens_text: 'Application opens 1 January every year via TUMonline. International applicants also need a uni-assist VPD.',
      deadline_text:
        'EXPECTED 31 May 2027 (same window as 2026). Recheck cartographymaster.eu/how-to-apply.',
      tuition_text:
        'No EMJM award. Non-EU fees mainly TUM semester contribution + TU Wien €726.72 + TU Dresden ~€338 · roughly €1,450 total. Munich living + German blocked account dominate cost.',
      self_funded_text:
        'Self-funded only. First semester Germany → blocked account / proof of funds for German visa.',
      scholarships_text:
        'Rechecked 20 Oct 2026. The programme is not cancelled. Scholarships page: they enrol students and offer no scholarships. Handbook: last Erasmus Mundus scholarship intake started in 2025.',
      prepare:
        'uni-assist VPD + TUMonline. IELTS/TOEFL. CV. Motivation (their 5 questions). Two recommendation letters. Map portfolio recommended. Only worth preparing if self-funded study in Germany is possible.',
      watch_outs:
        'No EMJM stipend for 2026 or 2027. First semester is in Germany. ITC/Twente thesis option ends after the 2026 cohort.',
      last_checked: '20 Oct 2026',
    },
  },
]

const FACT_CYCLES: Record<string, Record<string, string | boolean | null>> = {
  geotech: { application_opens_on: '2026-10-01', scholarship_deadline: '2027-01-07', starts_on: '2027-09-01', date_status: 'confirmed', scholarships_available: true },
  sufonama: { application_opens_on: '2026-11-01', scholarship_deadline: '2027-01-15', starts_on: '2027-09-01', date_status: 'confirmed', scholarships_available: true },
  mespom: { application_opens_on: '2026-10-01', scholarship_deadline: '2027-01-07', starts_on: '2027-09-01', date_status: 'confirmed', scholarships_available: true },
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
    opens_text: 'Applicants outside the EU, EEA, and Switzerland apply from November 2026.',
    deadline_text: 'Confirmed: 15 January 2027, 23:59 CET.',
    scholarships_text: 'Erasmus Mundus scholarship. No application fee. Two signed letters on letterhead are required for the scholarship, at least one from a teacher.',
    prepare: 'Europass CV, motivation letter of about 500 words, and two recommendation letters if you apply for the scholarship.',
    last_checked: '28 Oct 2026',
  },
  mespom: {
    funding_scheme: 'emjm',
    opens_text: 'The 2027–2029 CEU application is open.',
    deadline_text: 'Scholarship deadline 7 January 2027. Referees have 7 days after you submit.',
    scholarships_text: 'Erasmus Mundus scholarship. Two recommendation letters through the CEU form. The portal emails the referees.',
    prepare: 'Two referees who can reply within 7 days of submission. Letters are collected by the form, not uploaded as PDFs.',
    last_checked: '28 Oct 2026',
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
  sufonama: 'Confirmed: 15 January 2027, 23:59 CET. Applicants outside the EU apply from November 2026.',
  mespom: 'Scholarship deadline 7 January 2027. Referees have 7 days after you submit.',
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

/** No Erasmus Mundus scholarship for the 2027 intake. Cards are removed, not relabelled. */
const RETIRED_SLUGS = ['merged', 'imete', 'coasthazar'] as const

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
    source: 'Official GEM, CDE, GroundwatCH, FloodRISK, WAVES, and Cartography sites, 28 Oct 2026',
  })
  return { ...result, updated: !result.error && result.count > 0 }
}
