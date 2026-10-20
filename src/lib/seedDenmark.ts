import { findOrCreateCatalogue, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'

const PROGRAMMES: SeedRec[] = [
  {
    slug: 'ku-geography-geoinformatics',
    acronym: 'KU-GG',
    name: 'Geography and Geoinformatics',
    official_title: 'MSc Geography and Geoinformatics (Geoinformatics specialisation)',
    priority: 'A',
    coordinator: 'University of Copenhagen — Department of Geosciences and Natural Resource Management',
    countries: ['Denmark'],
    duration: '24 months / 120 ECTS',
    website: 'https://www.ku.dk/studies/masters/geography-and-geoinformatics',
    apply_url: 'https://www.ku.dk/studies/masters/geography-and-geoinformatics',
    fit_notes:
      'Strongest Danish GIS match: GIS/EO specialisation, spatial analysis, environmental monitoring. BS GIS fits if admission board accepts ~60 ECTS geography/GIS equivalence — not guaranteed; pre-assessment not offered.',
    cycle_label: '2027 September intake',
    opens: '2026-11-15',
    scholarship: null,
    self_funded: '2027-01-15',
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'YES — non-EU deadline 15 Jan 2027, 23:59 CET. Portal opens 15 Nov 2026. DKK 1,120 application deposit.',
      target_start: '1 September 2027',
      opens_text: 'Non-EU/EEA: apply 15 Nov 2026 – 15 Jan 2027 via KU application portal.',
      deadline_text:
        '15 January 2027 (non-EU). Reply ~13 March 2027. Pay tuition per term after admission — ~€8,700/term (Study in Denmark figure).',
      tuition_text: 'Non-EU ~€17,400/year (two terms). Living Copenhagen is expensive (~DKK 8k+/month planning).',
      self_funded_text:
        'No German blocked account. Danish residence permit still needs means of subsistence unless a full Danish Government Scholarship letter covers living.',
      scholarships_text:
        'All non-EU admits are auto-considered for the Danish Government Scholarship (tuition waiver and/or living grant — limited seats, merit only). Pakistan eligible. Separate from tuition payment deadlines.',
      prepare:
        'IELTS 6.5 overall / 6.0 each (English B). Transcript mapping to KU geography content. Motivation in portal. Thesis WQI + NESPAK GIS strengthen geoinformatics track.',
      watch_outs:
        'Admission is selective on bachelor content (60 ECTS geography/GIS-like courses). Scholarship is not automatic with admission.',
      last_checked: '21 Oct 2026',
    },
  },
  {
    slug: 'ruc-environmental-science',
    acronym: 'RUC-ENV',
    name: 'Environmental Science (scholarship track)',
    official_title: 'Master in Environmental Science — Danish state tuition waiver + stipend',
    priority: 'A-',
    coordinator: 'Roskilde University — Environmental Science',
    countries: ['Denmark'],
    duration: '22 months (September entry scholarship window)',
    website: 'https://ruc.dk/en/study-programmes/environmental-science',
    apply_url: 'https://ruc.dk/en/study-programmes/environmental-science',
    fit_notes:
      'GIS/RS usable in environmental research track. One of few programmes that publishes a **fee waiver + DKK 7,800/month** Danish state package — upload CV + motivation with admission file.',
    cycle_label: '2027 September intake',
    opens: '2026-12-15',
    scholarship: '2027-03-01',
    self_funded: '2027-03-01',
    starts: '2027-09-01',
    date_status: 'expected',
    scholarships: true,
    funding_scheme: 'partial',
    extra: {
      apply: 'YES if Environmental Science fits — apply for admission **and** scholarship documents together when the non-EU round opens.',
      target_start: '1 September 2027 (scholarship max 22 months)',
      opens_text: 'Non-EU round typically opens mid-December before September start — confirm ruc.dk Step 5 for Sept 2027 list.',
      deadline_text:
        'EXPECTED March 2027 for non-EU admission + scholarship file (check ruc.dk; prior years use December–March window). Programme list for scholarships updates each round.',
      tuition_text:
        'Award: full tuition waiver + DKK 7,800/month living (~22 months). Without award: non-EU tuition applies — budget as self-funded.',
      self_funded_text:
        'Apply with scholarship motivation even if unsure — ranking uses grades + motivation + experience. No blocked account if full package granted.',
      scholarships_text:
        'Danish state tuition waiver + monthly stipend on selected RUC masters (Sept 2026 entry included Environmental Science). Very limited places. Pakistan eligible via Danish Government Scholarship rules.',
      prepare:
        'CV + motivational letter in **same** application as admission. Link GIS thesis (groundwater WQI) to environmental monitoring / sustainability angles.',
      watch_outs:
        'Not a pure GIS degree — environmental science with spatial methods. Scholarship programme list changes yearly.',
      last_checked: '21 Oct 2026',
    },
  },
  {
    slug: 'aarhus-geoscience',
    acronym: 'AU-GEO',
    name: 'Geoscience',
    official_title: 'MSc Geoscience',
    priority: 'B+',
    coordinator: 'Aarhus University — Department of Geoscience',
    countries: ['Denmark'],
    duration: '24 months / 120 ECTS',
    website: 'https://masters.au.dk/geoscience',
    apply_url: 'https://masters.au.dk/geoscience',
    fit_notes:
      'Water (groundwater), climate, modelling, field methods — adjacent to GIS rather than web-GIS. Danish state scholarship auto-considered with admission like other AU fee programmes.',
    cycle_label: '2027 September intake',
    opens: '2026-11-01',
    scholarship: null,
    self_funded: '2027-01-15',
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'YES — non-EU deadline 15 January 2027 (midnight CET) for September start.',
      target_start: '1 September 2027',
      opens_text: 'Application system opens ~November for following September (also February intake on some programmes — Geoscience mainly September).',
      deadline_text: '15 January 2027 non-EU. Tuition €17,300/academic year (120 ECTS programmes, 2026/27 rate on masters.au.dk).',
      tuition_text: '€17,300/year tuition (2026/27 NAT faculty rate) + Copenhagen-area living.',
      self_funded_text:
        'Pay tuition by semester after admission. Visa: show funds or Danish Government Scholarship award.',
      scholarships_text:
        'Aarhus auto-assesses Danish state scholarships for non-EU admits (same national pool as KU). Competitive; requires work/leadership for SI-style grants does **not** apply — that is Sweden.',
      prepare: 'English B/Ielts per AU. Bachelor in geoscience, geography, or related with quantitative courses.',
      watch_outs: 'Heavier geology/hydro than Applied Geoinformatics. February start has separate deadlines if listed on masters.au.dk.',
      last_checked: '21 Oct 2026',
    },
  },
  {
    slug: 'dk-government-scholarship',
    acronym: 'DK-GOV',
    name: 'Danish Government Scholarship (non-EU)',
    official_title: 'Danish Government Scholarships — administered by each university',
    priority: 'B',
    coordinator: 'Danish Ministry of Higher Education / universities (Study in Denmark)',
    countries: ['Denmark'],
    duration: 'Covers full master’s (when awarded)',
    website: 'https://studyindenmark.dk/study-options/scholarships',
    apply_url: 'https://studyindenmark.dk/study-options/scholarships',
    fit_notes:
      'Pakistan eligible. Not a separate portal — KU, AU, RUC, etc. nominate a few non-EU admits for tuition waiver and/or living grant. Strongest visa story when living costs are in the offer.',
    cycle_label: 'With university admission',
    opens: null,
    scholarship: null,
    self_funded: null,
    starts: '2027-09-01',
    date_status: 'tba',
    scholarships: true,
    funding_scheme: 'partial',
    extra: {
      apply: 'NO separate form — apply to the master’s; RUC needs extra motivation for listed programmes.',
      target_start: 'Aligned with your programme start',
      opens_text: 'Follow the master’s application window (typically Nov–Jan for September).',
      deadline_text: 'Same as admission deadline for that programme. Award notice comes with or after admission.',
      tuition_text: 'Can be full tuition waiver ± monthly stipend (programme-dependent). Not all admits receive it.',
      self_funded_text:
        'Without award: tuition + proof of means for residence permit (no German Sperrkonto, but bank proof).',
      scholarships_text:
        'Citizens outside EU/EEA/Switzerland, admitted full-time master’s, residence permit for education. Merit-based at each university. Pakistan included.',
      prepare: 'High grades, clear motivation, strong English. Prioritize programmes that explicitly list scholarship slots (e.g. RUC Environmental Science).',
      watch_outs: 'Do not confuse with Swedish Institute (Pakistan not on SI list). Limited quotas per university.',
      last_checked: '21 Oct 2026',
    },
  },
]

const DESCRIPTION =
  'English-taught Danish master’s with GIS, geoinformatics, or environmental/geoscience angles. Non-EU tuition unless you win the Danish Government Scholarship (Pakistan eligible — awarded by the university, not a central form). No German blocked account; residence permit still needs subsistence unless the grant letter covers living. Erasmus Mundus routes stay in the Erasmus catalogue.'

export async function seedDenmarkCatalogue(opts?: {
  userId?: string
  isAdmin?: boolean
}): Promise<{ error: string | null; count: number }> {
  const created = await findOrCreateCatalogue({
    slug: 'denmark',
    name: 'Denmark',
    description: DESCRIPTION,
    userId: opts?.userId,
    isAdmin: opts?.isAdmin,
  })
  if (created.error || !created.catalogueId) {
    return { error: created.error ?? 'Could not create Denmark catalogue', count: 0 }
  }

  return upsertSeedProgrammes({
    catalogueId: created.catalogueId,
    programmes: PROGRAMMES,
    source: 'KU / RUC / AU / Study in Denmark, 21 Oct 2026',
  })
}
