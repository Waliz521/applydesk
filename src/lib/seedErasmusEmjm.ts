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
      'Core GIS / EO joint master. Four tracks: Planner, Analyst, Developer, Modeller — pick one; no track change after admission. Strong match for BS GIS + NESPAK web GIS + RS.',
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
        'First/2nd upper BSc, transcript, IELTS/TOEFL before deadline, passport, official GEM CV template (max 2 pages), financial plan in euros. English test after deadline not accepted.',
      watch_outs:
        'Max 8 students per track. Certified graduation docs by 31 July 2027. Interview invitations normally in February.',
      last_checked: '1 Oct 2026',
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
    opens: '2026-11-01',
    scholarship: '2027-01-15',
    self_funded: '2027-01-15',
    starts: '2027-10-01',
    date_status: 'expected',
    scholarships: true,
    funding_scheme: 'emjm',
    extra: {
      apply:
        'WATCH / PREPARE — next worldwide call opens November 2026 (EMJM + self-funded). European-only rolling window is March–May (no EMJM for that window).',
      target_start: 'October 2027',
      opens_text: 'Official: next call opens in November 2026 (confirmed on master-cde.eu, Aug 2026 news).',
      deadline_text:
        'EXPECTED mid-January 2027 (programme says “until mid-January 2027”). Exact day not published yet — treat mid-Jan as planning date.',
      tuition_text:
        'EMJM: fee waiver + €1,400/month. Best-ranked may get participation fee waiver even without full EMJM.',
      self_funded_text:
        'Worldwide Nov–Jan call also allows self-funded places. High competition for both funded and self-funded seats.',
      scholarships_text:
        'EMJM €1,400/month + fee waiver for best-ranked. Pakistan eligible. Prepare certified / legalised docs early (CDE warns international applicants).',
      prepare:
        'Geospatial or related bachelor, English proof, CV, motivation, refs. EO/GI knowledge, geospatial work experience, and programming strengthen the portfolio.',
      watch_outs:
        'Do not confuse with PLUS MSc Applied Geoinformatics (self-funded Salzburg degree). Different portal and deadlines.',
      last_checked: '1 Oct 2026',
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
      'Closest EMJM to your groundwater WQI thesis. Hydrogeology + global change; not a pure GIS degree, but strong water + spatial science fit.',
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
      prepare: 'BSc in relevant field, English test, CV, motivation, refs via IHE Delft / programme portal.',
      watch_outs:
        'Partner-country deadline is earlier (3 Jan) than GEM (15 Jan). Do not miss it if this is a primary target.',
      last_checked: '1 Oct 2026',
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
      'Joint cartography / geovisualisation master. Still Erasmus Mundus branded, but no EMJM scholarship for 2026 or 2027 intakes.',
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
        'No Erasmus Mundus scholarships after the 2025 intake (student handbook). Programme co-funded until end of 2027 but last EMJM-funded cohort started 2025. External DAAD / foundations only.',
      prepare:
        'uni-assist VPD + TUMonline. IELTS/TOEFL. CV. Motivation (their 5 questions). Two refs. Map portfolio recommended.',
      watch_outs:
        'Do not apply expecting an EMJM stipend. ITC/Twente thesis option ends after the 2026 cohort.',
      last_checked: '28 Sep 2026',
    },
  },
]

export async function seedErasmusEmjmUpdates(opts?: {
  userId?: string
  force?: boolean
}): Promise<{ error: string | null; count: number; updated: boolean }> {
  const found = await findCatalogueBySlug('erasmus-mundus', opts?.userId)
  if (found.error) return { error: found.error, count: 0, updated: false }
  if (!found.catalogueId) return { error: null, count: 0, updated: false }

  const result = await upsertSeedProgrammes({
    catalogueId: found.catalogueId,
    programmes: PROGRAMMES,
    source: 'Official GEM / CDE / GroundwatCH / Cartography sites, 1 Oct 2026',
  })
  return { ...result, updated: !result.error && result.count > 0 }
}
