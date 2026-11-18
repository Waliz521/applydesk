import { findOrCreateCatalogue, removeProgrammesBySlug, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'

const PROGRAMMES: SeedRec[] = [
  {
    slug: 'rug-eip',
    acronym: 'RUG-EIP',
    name: 'Environmental and Infrastructure Planning',
    official_title: 'MSc Environmental and Infrastructure Planning',
    priority: 'A',
    coordinator: 'University of Groningen — Faculty of Spatial Sciences',
    countries: ['Netherlands'],
    duration: '12 months',
    website: 'https://www.rug.nl/masters/environmental-and-infrastructure-planning/?lang=en',
    apply_url: 'https://www.rug.nl/masters/environmental-and-infrastructure-planning/?lang=en',
    fit_notes:
      'The Groningen programme on the Eric Bleumink route. Taught planning degree, assessed from a GIS bachelor. Not a GIS or remote-sensing master’s.',
    cycle_label: '2027 intake',
    opens: '2026-10-01',
    scholarship: '2026-12-01',
    self_funded: '2027-05-01',
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: true,
    funding_scheme: 'full',
    extra: {
      funding_label: 'Bleumink, if nominated',
      apply: 'The master’s file has to be complete before 1 December 2026. There is no separate Bleumink form. The Admission Office nominates.',
      target_start: '1 September 2027. A February start is not a Bleumink route.',
      opens_text: 'Studielink for September 2027 is open.',
      deadline_text:
        'Confirmed by study@rug.nl, 3 November 2026: the master’s file should be complete before 1 December 2026. A conditional offer before February is required for Bleumink. The ordinary non-EU deadline of 1 May 2027 is too late for the fellowship.',
      tuition_text:
        'If nominated and awarded, the fellowship covers tuition, flights, books, insurance, and a living allowance. About four awards a year, university-wide.',
      self_funded_text:
        'Without the fellowship, the visa file needs the living amount transferred to Groningen, currently about €1,180 a month up to €14,160, plus tuition.',
      scholarships_text:
        'Eric Bleumink is a nomination, not a form. NL Scholarship (€5,000 in year 1) is a separate Groningen award and does not replace the living-cost transfer.',
      prepare:
        'Degree, full transcript, IELTS, and a list of relevant course descriptions, including statistics and research methods. English is Admissions Level 2.',
      watch_outs:
        'Nominees are told. If the Admission Office has not written by 1 February 2027, treat that as no nomination. Results are due before 1 March 2027.',
      last_checked: '16 Nov 2026',
    },
  },
  {
    slug: 'wur-mgi',
    acronym: 'WUR-MGI',
    name: 'Geo-information Science',
    official_title: 'MSc Geo-information Science (Wageningen)',
    priority: 'A',
    coordinator: 'Wageningen University & Research',
    countries: ['Netherlands'],
    duration: '24 months / 120 ECTS',
    website: 'https://www.wur.nl/en/education-programmes/master/msc-programmes/msc-geo-information-science.htm',
    apply_url: 'https://www.wur.nl/en/education/master/masters-geo-information-science',
    fit_notes:
      'Campus GIS + remote sensing inside environmental / life sciences. Strong if you want water, land, agriculture, or climate layers on top of GIS.',
    cycle_label: '2027 intake',
    opens: '2026-10-01',
    scholarship: '2026-12-01',
    self_funded: '2027-04-15',
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: true,
    funding_scheme: 'partial',
    extra: {
      funding_label: 'Anne van den Ban',
      apply: 'The fund reads a complete MSc file. There is no separate scholarship form. Studielink enrolment is not enough — the Osiris file has to be submitted before 1 December 2026.',
      target_start: '1 September 2027. Wageningen scholarships are September-only.',
      opens_text: 'Studielink and Osiris are open for September 2027.',
      deadline_text:
        'Confirmed for this file: submit the Osiris application before 1 December 2026. The ordinary non-EU date, documents by 1 May 2027, is too late for the fund.',
      tuition_text:
        'Non-EU 2026/27 €21,900 / year. A full Anne van den Ban award can cover tuition, a living allowance, travel, the visa, and insurance for 24 months. A partial award leaves a gap.',
      self_funded_text:
        'Without an award, the first-year invoice is tuition plus living, insurance, and the IND fee.',
      scholarships_text:
        'Anne van den Ban Fund. Pakistan is on the country list. The award can be partial or full. Results go only to selected candidates, in May 2027. Wageningen Excellence is a different, invitation-only waiver.',
      prepare:
        'Degree, stamped transcript, IELTS, and a CV of at most two pages. The published norm is at least 6 ECTS in two of GIS, remote sensing, and programming.',
      watch_outs: 'A pre-master’s place is not eligible for the fund. The portal’s 1 May date is the ordinary deadline, not the fund deadline.',
      last_checked: '16 Nov 2026',
    },
  },
]
const DESCRIPTION =
  'Two Netherlands programmes: Groningen Environmental and Infrastructure Planning, and Wageningen Geo-information Science. GEM is in the Erasmus Mundus catalogue.'

const RETIRED = [
  'nl-scholarship',
  'itc-excellence',
  'wur-excellence',
  'eric-bleumink',
  'okp-closed',
  'itc-mgeo',
  'uu-gima',
  'tud-geomatics',
]

export async function seedNetherlandsCatalogue(opts?: {
  userId?: string
  isAdmin?: boolean
}): Promise<{ error: string | null; count: number }> {
  const removed = await removeProgrammesBySlug(RETIRED)
  if (removed) return { error: removed, count: 0 }
  const created = await findOrCreateCatalogue({
    slug: 'netherlands',
    name: 'Netherlands',
    description: DESCRIPTION,
    userId: opts?.userId,
    isAdmin: opts?.isAdmin,
  })
  if (created.error || !created.catalogueId) {
    return { error: created.error ?? 'Could not create Netherlands catalogue', count: 0 }
  }

  return upsertSeedProgrammes({
    catalogueId: created.catalogueId,
    programmes: PROGRAMMES,
    source: 'University of Groningen EIP and Wageningen Geo-information Science pages, 16 Nov 2026',
  })
}
