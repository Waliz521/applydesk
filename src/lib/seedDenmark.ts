import { findOrCreateCatalogue, removeProgrammesBySlug, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'

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
]

const DESCRIPTION =
  'University of Copenhagen, MSc Geography and Geoinformatics, Geoinformatics track, September 2027. Aarhus, Roskilde, Aalborg, DTU, and Southern Denmark are not in this file.'

export async function seedDenmarkCatalogue(opts?: {
  userId?: string
  isAdmin?: boolean
}): Promise<{ error: string | null; count: number }> {
  const removed = await removeProgrammesBySlug([
    'dk-government-scholarship',
    'ruc-environmental-science',
    'aarhus-geoscience',
  ])
  if (removed) return { error: removed, count: 0 }
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
