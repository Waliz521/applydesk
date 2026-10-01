import { findOrCreateCatalogue, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'

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
  {
    slug: 'nl-scholarship',
    acronym: 'NL',
    name: 'NL Scholarship (Holland Scholarship)',
    official_title: 'NL Scholarship — non-EEA master’s contribution',
    priority: 'B',
    coordinator: 'Dutch Ministry of Education + participating universities (Nuffic / Study in NL)',
    countries: ['Netherlands'],
    duration: 'First year only',
    website: 'https://www.studyinnl.org/finances/nl-scholarship',
    apply_url: 'https://www.utwente.nl/en/education/scholarship-finder/nl-scholarship-university-of-twente/',
    fit_notes:
      'National partial award for Pakistani / non-EEA students. €5,000 once in year 1. Apply through the university after (conditional) admission — not on a single Nuffic form.',
    cycle_label: '2027 intake',
    opens: '2026-10-15',
    scholarship: '2027-04-01',
    self_funded: null,
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: true,
    funding_scheme: 'partial',
    extra: {
      apply: 'Opens 15 Oct 2026 (not today). Twente form: 15 Oct 2026 12:00 CET – 1 Apr 2027 16:00 CET. Need a master’s application / student number first.',
      target_start: 'September 2027',
      opens_text: 'CONFIRMED on utwente.nl NL Scholarship page (1 Oct 2026): form opens 15 October 2026, 12:00 CET.',
      deadline_text:
        'CONFIRMED Twente: 1 April 2027, 16:00 CET. Results first week of May 2027. Other universities (Utrecht, WUR) set their own dates.',
      tuition_text: '€5,000 towards year-1 costs. Does not cover ITC (~€21,700) or WUR (~€21,900) tuition, nor living.',
      self_funded_text: 'You still need the rest of the first-year invoice for IND. Stacking with another UT scholarship is usually not allowed.',
      scholarships_text:
        'Pakistan is eligible. Must not already hold a Dutch degree. Orange Knowledge (OKP) is closed — this is not a replacement for a full OKP award.',
      prepare: 'Admission letter / student number first, then the university scholarship form. IELTS 6.5 typical.',
      watch_outs: 'Orange Tulip is country-specific and not a Pakistan GIS route. Confirm each year whether GIMA / WUR still participate.',
      last_checked: '1 Oct 2026',
    },
  },
  {
    slug: 'itc-excellence',
    acronym: 'ITC-EX',
    name: 'ITC Excellence Scholarship',
    official_title: 'ITC Excellence Scholarship Programme (partial)',
    priority: 'A-',
    coordinator: 'University of Twente — Faculty ITC',
    countries: ['Netherlands'],
    duration: '24 months (partial funding)',
    website: 'https://www.utwente.nl/en/education/scholarship-finder/itc-excellence-scholarship-programme/',
    apply_url: 'https://www.utwente.nl/en/itc/education/study-costs/scholarships/scholarship-finder/',
    fit_notes:
      'Main ITC funding for a Pakistani GIS applicant after OKP ended. Partial: they still require about €17,000 of your own money before 1 May.',
    cycle_label: '2027 intake',
    opens: '2026-12-01',
    scholarship: null,
    self_funded: '2027-05-01',
    starts: '2027-09-01',
    date_status: 'expected',
    scholarships: true,
    funding_scheme: 'partial',
    extra: {
      apply: 'NOT OPEN. 2026 rounds are closed. Official page (1 Oct 2026): a possible next round is expected in December — no Feb/Apr 2027 dates published yet.',
      target_start: '1 September 2027',
      opens_text: 'EXPECTED December 2026 (UT wording: “possible next round”). Do not treat February 2027 as confirmed.',
      deadline_text:
        'Not published for 2027. 2026 pattern was 1 Feb and 1 Apr, payment of own contribution 1 May. Recheck the ITC scholarship finder in December.',
      tuition_text:
        '2026 example: tuition €43,950 over 2 years; ITC scholarship €25,000 allowance + €32,370 fee waiver; you still pay ~€17,000 (remaining tuition + extra living + insurance + permit).',
      self_funded_text: 'Without this award, pay the full institutional fee. UTS cannot be used as a backup — UTS excludes ITC.',
      scholarships_text: 'Limited places, strong academic record. Pakistan is eligible. NL Scholarship is a smaller add-on only if UT rules allow one award.',
      prepare: 'Unconditional or strong admission to M-GEO. Proof you can pay the €17,000 remainder by the payment deadline.',
      watch_outs: 'Partial means partial. Do not budget as if it were Erasmus Mundus.',
      last_checked: '1 Oct 2026',
    },
  },
  {
    slug: 'wur-excellence',
    acronym: 'WUR-EX',
    name: 'Wageningen Excellence Scholarship',
    official_title: 'Wageningen University Excellence Programme (tuition waiver)',
    priority: 'A-',
    coordinator: 'Wageningen University & Research — scholarship selection committee',
    countries: ['Netherlands'],
    duration: '24 months tuition waiver',
    website: 'https://www.wur.nl/en/education/master/study-expenses-masters/scholarships',
    apply_url: 'https://www.wur.nl/en/education/master/study-expenses-masters/scholarships',
    fit_notes:
      'Invitation-only tuition waiver for non-EU MSc including Geo-information Science. GPA ~80% / first class. Living costs stay on you.',
    cycle_label: '2027 intake',
    opens: '2026-10-01',
    scholarship: '2026-12-01',
    self_funded: '2027-07-01',
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: true,
    funding_scheme: 'partial',
    extra: {
      apply: 'YES — complete WUR MSc file before 1 December 2026. No separate Excellence form. Confirmed on wur.nl 1 Oct 2026.',
      target_start: 'September 2027',
      opens_text: 'Same portal as MGI admission. Committee ranks complete files; some candidates are emailed March–April, offers around 7 April 2027.',
      deadline_text: '1 December 2026 for the MSc application (English + diploma in). Payment of remaining year-1 costs: 1 July 2027.',
      tuition_text:
        'If awarded: 24-month tuition waiver. Revised first-year invoice ~€16,500 (living, insurance, residence permit) based on current fees.',
      self_funded_text: 'Africa Scholarship Programme and Anne van den Ban are not the Pakistan route. Excellence is the WUR GIS-relevant one.',
      scholarships_text: 'Non-EU/non-EFTA. Unconditional admission required for the award. Lottery can be used in the final step — not guaranteed at 3.55 CGPA.',
      prepare: 'Full Osiris file, English test, bachelor diploma by 1 Dec 2026. September start only.',
      watch_outs: 'A tuition waiver is not a living scholarship. IND still wants the living amount on the invoice.',
      last_checked: '1 Oct 2026',
    },
  },
  {
    slug: 'eric-bleumink',
    acronym: 'EBF',
    name: 'Eric Bleumink Fellowship',
    official_title: 'Eric Bleumink Fellowship — University of Groningen',
    priority: 'B',
    coordinator: 'University of Groningen — Admission Office / Eric Bleumink Fund',
    countries: ['Netherlands'],
    duration: '1 or 2 years (September start only)',
    website: 'https://www.rug.nl/education/scholarships/eric-bleumink-fellowship?lang=en',
    apply_url: 'https://www.rug.nl/education/master/international-students/application-procedure',
    fit_notes:
      'Pakistan-eligible and actually fully funded (tuition, travel, living, books, insurance). Groningen has no ITC-style GIS master’s — closest are Spatial Sciences / Environmental and Infrastructure Planning. Very few awards (rules mention about four a year).',
    cycle_label: '2027 intake',
    opens: '2026-10-01',
    scholarship: '2026-12-01',
    self_funded: null,
    starts: '2027-09-01',
    date_status: 'expected',
    scholarships: true,
    funding_scheme: 'full',
    extra: {
      apply:
        'YES only if you will apply to a Groningen master’s. There is no Bleumink form. Complete admission by 1 December 2026 so an offer can arrive before February.',
      target_start: 'September 2027',
      opens_text: 'Same as Groningen master’s admission (typically from October). Nomination is by the Admission Office, not by you.',
      deadline_text:
        'Master’s file complete by 1 December 2026. Need a provisional or unconditional offer before February. Recheck rug.nl/education/scholarships/eric-bleumink-fellowship.',
      tuition_text:
        'If awarded: tuition + international travel + subsistence + books + health insurance for the full 1- or 2-year master’s. Not a partial €5,000 NL Scholarship.',
      self_funded_text:
        'This is Groningen only. It does not pay ITC, Wageningen, GIMA, or TU Delft. Without a nomination you pay Groningen’s institutional fee yourself.',
      scholarships_text:
        'Pakistan is on the country list. You must have no other means of financing. Cannot combine with another full grant. Hundreds apply; only a handful are awarded.',
      prepare:
        'Pick a Groningen programme (Spatial Sciences research master, Environmental and Infrastructure Planning, or Energy and Environmental Sciences — not a dedicated GIS MSc). Excellent bachelor grades, recommendation letters, English as the programme requires. Apply in Studielink/OAS early.',
      watch_outs:
        'Do not treat this as an ITC funding route. GIS skill growth here is secondary to getting a rare full award at Groningen.',
      last_checked: '14 Sep 2026',
    },
  },
  {
    slug: 'okp-closed',
    acronym: 'OKP',
    name: 'Orange Knowledge Programme (closed)',
    official_title: 'Orange Knowledge Programme — Nuffic (no new rounds)',
    priority: 'C',
    coordinator: 'Nuffic / Dutch Ministry of Foreign Affairs',
    countries: ['Netherlands'],
    duration: 'Was a full master’s / short course scholarship',
    website: 'https://www.studyinnl.org/finances/nl-scholarship',
    apply_url: 'https://www.utwente.nl/en/itc/education/study-costs/scholarships/scholarship-finder/',
    fit_notes:
      'The old fully funded Dutch development scholarship many GIS pages still mention. Closed 31 December 2024. No 2026 or 2027 round.',
    cycle_label: 'closed',
    opens: null,
    scholarship: null,
    self_funded: null,
    starts: null,
    date_status: 'tba',
    scholarships: false,
    funding_scheme: 'partial',
    extra: {
      apply: 'NO. OKP ended 31 Dec 2024. Use NL Scholarship + ITC Excellence + WUR Excellence, or Erasmus Mundus GEM.',
      target_start: 'None',
      opens_text: 'No new call.',
      deadline_text: 'None. Ignore third-party blogs that still list OKP 2026/27.',
      tuition_text: 'Was often full tuition + living. That package is gone.',
      self_funded_text: 'ITC and WUR are self-funded or partial now. Full packages left: Erasmus Mundus GEM, or Eric Bleumink at Groningen (not a GIS MSc).',
      scholarships_text: 'Not replaced 1:1. StuNed (Indonesia) is also closed. Pakistan never had Orange Tulip as a general GIS fellowship.',
      prepare: 'Do not prepare an OKP file.',
      watch_outs: 'If a page says “Holland Scholarship / OKP / Orange Knowledge” in one breath, read the date.',
      last_checked: '14 Sep 2026',
    },
  },
]

const DESCRIPTION =
  'Dutch GIS / geoinformation master’s (ITC, Wageningen, GIMA, TU Delft) plus scholarships still open to Pakistan. Orange Knowledge is closed. Partial: NL Scholarship, ITC Excellence, Wageningen Excellence. Full: Eric Bleumink at Groningen only (no GIS MSc there; very few awards). GEM is in the Erasmus Mundus catalogue.'

export async function seedNetherlandsCatalogue(opts?: {
  userId?: string
  isAdmin?: boolean
}): Promise<{ error: string | null; count: number }> {
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
    source: 'ITC / UT / WUR / UU / Groningen / Study in NL pages, 14 Sep 2026',
  })
}
