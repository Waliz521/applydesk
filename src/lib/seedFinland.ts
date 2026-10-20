import { findOrCreateCatalogue, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'

const PROGRAMMES: SeedRec[] = [
  {
    slug: 'aalto-geoinformatics',
    acronym: 'AALTO-GIS',
    name: 'Geoinformatics',
    official_title: 'Master of Science (Technology) in Geoinformatics',
    priority: 'A',
    coordinator: 'Aalto University — School of Engineering',
    countries: ['Finland'],
    duration: '24 months / 120 ECTS',
    website: 'https://www.aalto.fi/en/programmes/masters-programme-in-geoinformatics',
    apply_url: 'https://www.aalto.fi/en/study-options/masters-programme-in-geoinformatics',
    fit_notes:
      'Best Finland GIS match: RS, photogrammetry, laser scanning, GIS dev, spatial data science. BS GIS / geomatics is the intended background.',
    cycle_label: '2027 autumn intake',
    opens: '2026-12-07',
    scholarship: null,
    self_funded: '2027-01-05',
    starts: '2027-08-01',
    date_status: 'confirmed',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'YES — Studyinfo.fi window 7 Dec 2026 – 5 Jan 2027, 15:00 UTC+2 (Aalto published dates). €100 national application fee (non-EU).',
      target_start: 'August/September 2027 (Aalto autumn)',
      opens_text: 'Joint Finnish application period on Studyinfo — same dates for all Aalto MSc programmes.',
      deadline_text: '5 January 2027, 15:00 (UTC+2). Results spring 2027.',
      tuition_text: '€17,000/academic year (fee-paying students). Competitive 100% tuition waivers — limited, merit-ranked with admission.',
      self_funded_text:
        'Migri residence permit: €9,600/year living in bank unless scholarship reduces it; tuition paid or waiver certificate attached.',
      scholarships_text:
        'Aalto tuition-fee waivers (up to 100%) for top applicants — **not** living costs. No Finnish government master’s grant for Pakistan. GEM/SECCLO etc. stay in Erasmus catalogue.',
      prepare: 'Relevant BSc, maths + programming. IELTS/TOEFL per Aalto. Portfolio/GitHub helps for GIS dev angle.',
      watch_outs: 'Waivers are scarce. 100% tuition waiver still leaves ~€9,600 living proof for first-year permit unless other funds.',
      last_checked: '21 Oct 2026',
    },
  },
  {
    slug: 'helsinki-geography',
    acronym: 'UH-GEO',
    name: 'Geography (geoinformatics track)',
    official_title: 'Master’s Programme in Geography',
    priority: 'A-',
    coordinator: 'University of Helsinki — Faculty of Science',
    countries: ['Finland'],
    duration: '24 months / 120 ECTS',
    website: 'https://www.helsinki.fi/en/degree-programmes/geography-masters-programme',
    apply_url: 'https://www.helsinki.fi/en/degree-programmes/geography-masters-programme',
    fit_notes:
      'Geoinformatics model path: spatial analytics, drone/hyperspectral RS, urban/environmental GIS — flexible with physical or human geography courses.',
    cycle_label: '2027 autumn intake',
    opens: '2027-01-05',
    scholarship: null,
    self_funded: '2027-01-19',
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'YES — 5–19 Jan 2027, 08:00–15:00 (Helsinki time). Apply tuition waiver (50% or 100%) on the same form.',
      target_start: '1 September 2027',
      opens_text: 'Single international master’s window 5–19 January 2027 (Studyinfo).',
      deadline_text: '19 January 2027, 15:00. €13,000/year tuition if fee-liable; waivers mostly 50%, few 100%.',
      tuition_text: '€13,000/year. Waivers do not cover living — Helsinki living ~€800+/month Migri guideline.',
      self_funded_text:
        'Even with 100% tuition waiver you must show living funds (~€9,600) unless a living scholarship (rare at UH).',
      scholarships_text:
        'University of Helsinki tuition-fee waiver programme — competitive, tied to admission ranking. No national living scholarship for Pakistan.',
      prepare: 'Strong GPA (3.55 competitive). Motivation + geoinformatics interest. IELTS per programme.',
      watch_outs: 'Not a standalone “MSc GIS” title — geography degree with geoinformatics timetable models.',
      last_checked: '21 Oct 2026',
    },
  },
  {
    slug: 'finland-tuition-waivers',
    acronym: 'FI-WAIVER',
    name: 'Finnish university tuition waivers',
    official_title: 'University tuition-fee waivers (no national master’s grant)',
    priority: 'C',
    coordinator: 'Finnish universities via Studyinfo.fi',
    countries: ['Finland'],
    duration: 'During master’s studies',
    website: 'https://www.studyinfinland.fi/funding-your-studies/bachelors-and-masters-scholarships',
    apply_url: 'https://www.studyinfinland.fi/funding-your-studies/bachelors-and-masters-scholarships',
    fit_notes:
      'Reminder row: Finland has **no government full master’s scholarship** for Pakistan — only partial/full **tuition** waivers per university. Living always Migri unless EU grant elsewhere.',
    cycle_label: 'With Studyinfo application',
    opens: null,
    scholarship: null,
    self_funded: null,
    starts: '2027-09-01',
    date_status: 'tba',
    scholarships: true,
    funding_scheme: 'partial',
    extra: {
      apply: 'Apply waivers on each master’s Studyinfo application (Aalto, Helsinki, etc.).',
      target_start: 'Autumn 2027 intakes',
      opens_text: 'Dec–Jan application season for most English master’s.',
      deadline_text: 'Programme-specific — typically early January.',
      tuition_text: 'Waivers reduce tuition only; they are not cash to the student.',
      self_funded_text: 'Plan €9,600+ living for first residence permit year (Migri) minus any **living** scholarship documented.',
      scholarships_text: 'studyinfinland.fi: scholarships are university-managed, competitive, tuition-only unless stated otherwise.',
      prepare: 'Rank programmes by GIS fit (Aalto first, Helsinki geography second).',
      watch_outs: 'Agents promising “full Finland scholarship” usually mean tuition discount, not living + visa-proof package.',
      last_checked: '21 Oct 2026',
    },
  },
]

const DESCRIPTION =
  'Finnish English master’s in geoinformatics and geography. Non-EU pay tuition (~€13k–17k/year) unless you win a university waiver. No national full master’s grant for Pakistan — Migri still expects ~€9,600 living funds year 1 unless documented living aid. Application via Studyinfo.fi (€100 fee). Erasmus Mundus (e.g. GEM, SECCLO) stays in the Erasmus catalogue.'

export async function seedFinlandCatalogue(opts?: {
  userId?: string
  isAdmin?: boolean
}): Promise<{ error: string | null; count: number }> {
  const created = await findOrCreateCatalogue({
    slug: 'finland',
    name: 'Finland',
    description: DESCRIPTION,
    userId: opts?.userId,
    isAdmin: opts?.isAdmin,
  })
  if (created.error || !created.catalogueId) {
    return { error: created.error ?? 'Could not create Finland catalogue', count: 0 }
  }

  return upsertSeedProgrammes({
    catalogueId: created.catalogueId,
    programmes: PROGRAMMES,
    source: 'Aalto / Helsinki / Study in Finland / Migri, 21 Oct 2026',
  })
}
