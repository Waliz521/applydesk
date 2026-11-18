import { findOrCreateCatalogue, removeProgrammesBySlug, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'

const PROGRAMMES: SeedRec[] = [
  {
    slug: 'itc-mgeo',
    acronym: 'ITC-MGEO',
    name: 'Geo-information Science and Earth Observation',
    official_title: 'MSc Geo-information Science and Earth Observation (ITC)',
    priority: 'A',
    coordinator: 'University of Twente — Faculty ITC, Enschede',
    countries: ['Netherlands'],
    duration: '24 months / 120 ECTS',
    website: 'https://www.utwente.nl/en/itc/education/study-finder/geo-information-science-earth-observation/',
    apply_url: 'https://www.utwente.nl/en/itc/education/how-to-apply/master-admission-and-application-master/',
    fit_notes:
      'Best Netherlands GIS match. Tracks include GeoAI, resources/water, urban/land, hazards. Closest to BS GIS + NESPAK web GIS + Forest Dept RS.',
    cycle_label: '2027 intake',
    opens: '2026-10-01',
    scholarship: null,
    self_funded: '2027-06-01',
    starts: '2027-09-01',
    date_status: 'expected',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'YES for September 2027 — application window expected from 1 October 2026. Use ITC Excellence / NL Scholarship rows for funding.',
      target_start: '1 September 2027',
      opens_text: 'ITC: start the Osiris file from 1 October for the next September intake.',
      deadline_text:
        'EXPECTED 1 June 2027 for a complete non-EEA file (residence-permit nationality). Scholarship deadlines are earlier — see ITC Excellence.',
      tuition_text:
        'Institutional fee ~€21,700 for 2026/27 year 1 (year 2 estimated ~€22,250). Plus living ~€15,000/year, insurance, IND fee. First year is paid up front for the visa.',
      self_funded_text:
        'Self-funded unless ITC Excellence or NL Scholarship lands. Dutch blocked-account style: ITC invoices tuition + living before IND. Orange Knowledge is closed.',
      scholarships_text:
        'UTS (University of Twente Scholarship) is not available for ITC master’s programmes. Use ITC Excellence (partial; ~€17,000 own contribution) and NL Scholarship (€5,000 year 1). GEM is in the Erasmus Mundus catalogue.',
      prepare: 'Related bachelor, IELTS Academic 6.5 (speaking 6.0) / TOEFL iBT 90. Work experience helps but is not a DAAD-style 2-year rule.',
      watch_outs: 'This is the expensive GIS route. Do not treat OKP pages you still see online as open.',
      last_checked: '14 Sep 2026',
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
    apply_url: 'https://www.wur.nl/en/education/master/study-expenses-masters/scholarships',
    fit_notes:
      'Campus GIS + remote sensing inside environmental / life sciences. Strong if you want water, land, agriculture, or climate layers on top of GIS.',
    cycle_label: '2027 intake',
    opens: '2026-10-01',
    scholarship: '2026-12-01',
    self_funded: '2027-04-15',
    starts: '2027-09-01',
    date_status: 'expected',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'YES — file a complete MSc application by 1 December 2026 if you want the Excellence tuition waiver considered.',
      target_start: '1 September 2027 (WUR scholarships are September-only)',
      opens_text: 'Studielink / Osiris typically from October. Scholarship track needs the file complete by 1 December.',
      deadline_text:
        'Excellence / invitation scholarships: EXPECTED 1 December 2026. General non-EU admission for September is often ~15 April — confirm wur.nl. 15 April 2026 for Sept 2026 has passed.',
      tuition_text: 'Non-EU 2026/27 €21,900 / year. 2027/28 estimated €22,500. First-year invoice also includes living, insurance, IND.',
      self_funded_text:
        'Without a waiver, year-1 payment is tuition + ~12.5 months living before visa. Africa Scholarship / Anne van den Ban are not Pakistan routes.',
      scholarships_text:
        'WU Excellence: tuition waived 24 months if invited (GPA ~80%+ / first class). You still pay ~€16,500 year-1 living+insurance+permit by 1 July 2027. NL Scholarship is a separate €5,000 if WUR participates that year.',
      prepare: 'IELTS/TOEFL by the scholarship deadline. CGPA 3.55/4 is in the Excellence conversation — not a guarantee.',
      watch_outs: 'You cannot apply for the Excellence award separately. Incomplete 1 Dec files are not ranked.',
      last_checked: '14 Sep 2026',
    },
  },
  {
    slug: 'uu-gima',
    acronym: 'GIMA',
    name: 'Geographical Information Management and Applications',
    official_title: 'MSc Geographical Information Management and Applications (joint degree)',
    priority: 'A-',
    coordinator: 'Utrecht University with TU Delft, Wageningen, and University of Twente / ITC',
    countries: ['Netherlands'],
    duration: '24 months full-time (or 4 years part-time) / 120 ECTS',
    website: 'https://www.uu.nl/en/masters/geographical-information-management-and-applications-gima',
    apply_url: 'https://www.uu.nl/en/masters/geographical-information-management-and-applications-gima/application-and-admission/degree-from-a-non-dutch-university',
    fit_notes:
      'Blended GIS management + SDI + AI. Four two-week campus blocks, rest remote. More geo-information management than ITC’s sensor/RS core.',
    cycle_label: '2027 intake',
    opens: '2026-10-01',
    scholarship: '2027-02-01',
    self_funded: '2027-04-01',
    starts: '2027-09-01',
    date_status: 'expected',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'Watch — apply via Utrecht Studielink. Scholarship candidates need an earlier file (often 1 February).',
      target_start: 'September 2027',
      opens_text: 'Applications typically open 1 October.',
      deadline_text:
        'EXPECTED 1 February 2027 for scholarship candidates; 1 April 2027 other non-EU. Recheck uu.nl. Part-time is a weaker residence-permit story.',
      tuition_text: 'Non-EU 2026/27 €25,306 (institutional). Dutch/EU ~€2,694.',
      self_funded_text: 'Full-time non-EU still needs IND proof of funds. Blended format is not a cheap online master’s.',
      scholarships_text:
        'Utrecht NL Scholarship / Bright Minds if GIMA is on that year’s participating list — confirm on the UU scholarship page. Not Erasmus Mundus.',
      prepare: 'BSc in GIS / geography / engineering + basic GIS. English as UU requires. Application fee in OSIRIS.',
      watch_outs: 'Joint/blended programmes can be awkward for AAI One World–style grants and for some visas. Prefer ITC or WUR if you need a classic campus permit.',
      last_checked: '14 Sep 2026',
    },
  },
  {
    slug: 'tud-geomatics',
    acronym: 'TUD-GEO',
    name: 'Geomatics',
    official_title: 'MSc Geomatics for the Built Environment',
    priority: 'B',
    coordinator: 'TU Delft — Faculty of Architecture and the Built Environment',
    countries: ['Netherlands'],
    duration: '24 months / 120 ECTS',
    website: 'https://www.tudelft.nl/en/education/programmes/masters/gm/msc-geomatics',
    apply_url: 'https://www.tudelft.nl/en/education/programmes/masters/gm/msc-geomatics/admission-and-application/non-dutch-bsc-degree',
    fit_notes:
      '3D geomatics, spatial data, built environment. Strong tech; weaker environmental GIS than ITC/WUR. TU Delft warns many admits never enrol because of cost.',
    cycle_label: '2027 intake',
    opens: '2026-10-15',
    scholarship: null,
    self_funded: '2027-04-01',
    starts: '2027-09-01',
    date_status: 'expected',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'Optional — only with a realistic funds plan. 2026 non-EU deadline was 1 April 2026 (closed).',
      target_start: 'September 2027',
      opens_text: 'TU Delft MSc portal typically from mid-October.',
      deadline_text: 'EXPECTED 1 April 2027 (23:59 CEST). Rolling assessment within ~12 weeks.',
      tuition_text:
        'Non-EU institutional fee plus Delft living. TU Delft cites ~€50,000 / year all-in (tuition + living + insurance) on older pages — confirm the 2027 table.',
      self_funded_text: 'Residence permit is study-only. Working to fund the degree is a poor visa plan.',
      scholarships_text:
        'Justus & Louise van Effen, NL Scholarship, and faculty awards are limited and competitive. UTS does not apply (that is Twente, and not ITC).',
      prepare: 'Spatial-thinking bachelor (GIS, geography, CS, geodesy). IELTS/TOEFL per TU Delft. Financial plan in the application mindset.',
      watch_outs: 'High study load; part-time work is discouraged. Prefer ITC if the goal is RS/GIS rather than 3D built-environment geomatics.',
      last_checked: '14 Sep 2026',
    },
  },
]
const DESCRIPTION =
  "Dutch GIS / geoinformation master's: ITC, Wageningen, GIMA, and TU Delft. GEM is in the Erasmus Mundus catalogue."

const RETIRED = ['nl-scholarship', 'itc-excellence', 'wur-excellence', 'eric-bleumink', 'okp-closed']

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
    source: 'ITC / UT / WUR / UU / TU Delft pages, 14 Sep 2026',
  })
}
