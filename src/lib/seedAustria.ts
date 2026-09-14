import { findOrCreateCatalogue, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'

const PROGRAMMES: SeedRec[] = [
  {
    slug: 'plus-applied-geoinformatics',
    acronym: 'PLUS-AGI',
    name: 'Applied Geoinformatics',
    official_title: 'MSc Applied Geoinformatics',
    priority: 'A',
    coordinator: 'Paris Lodron University of Salzburg (PLUS) — Department of Geoinformatics Z_GIS',
    countries: ['Austria'],
    duration: '24 months / 4 semesters / 120 ECTS',
    website: 'https://www.plus.ac.at/studium/studienangebot/masterstudien/applied-geoinformatics/?lang=en',
    apply_url: 'https://www.plus.ac.at/geoinformatik/education/agi/students/admission/?lang=en',
    fit_notes:
      'Best English GIS master’s in Austria. Z_GIS: spatial analysis, geo-application development, SDI, modelling. BS GIS / cartography / geomatics is admitted without extra coursework.',
    cycle_label: '2027/28 intake',
    opens: '2027-05-01',
    scholarship: null,
    self_funded: '2027-08-10',
    starts: '2027-10-01',
    date_status: 'expected',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'Watch — next clean start is October 2027. Non-EU winter 2026/27 docs were due 10 Aug 2026.',
      target_start: '1 October 2027 (winter). Summer start is possible if you can legalise documents by 10 January.',
      opens_text: 'PLUS master’s applications run each semester. Winter pre-registration usually from early summer.',
      deadline_text:
        'EXPECTED 10 August 2027 for non-EU complete legalised documents (winter 2027/28). Summer 2027: 10 January 2027. Recheck plus.ac.at dates.',
      tuition_text: '€726.72 / semester + ÖH ~€25 · ~€3,000 total (~Rs 9.6 lac). Living in Salzburg is the real cost.',
      self_funded_text:
        'Self-funded. Austrian student visa wants proof of funds (monthly rate on oead.at) and often tuition shown. No German blocked account.',
      scholarships_text:
        'No EMJM on this degree. Watch OeAD Erhard Busek (university nomination, no 2026/27 call planned). After you hold a Salzburg student residence permit, AAI One World is €500/month during the semester. CDE is the Salzburg Erasmus course — Erasmus Mundus catalogue.',
      prepare:
        'English C1 (IELTS Academic 6.5 / TOEFL iBT 95). Legalised degree + transcript + passport (Pakistan: HEC/MOFA + Austrian mission). Internship is compulsory in the curriculum.',
      watch_outs:
        'Document legalisation is the bottleneck, not the fee. CDE (Erasmus) is a different application from this residential AGI degree.',
      last_checked: '14 Sep 2026',
    },
  },
  {
    slug: 'tuw-geodesy-geoinformation',
    acronym: 'TUW-GEO',
    name: 'Geodesy and Geoinformation',
    official_title: 'Dipl.-Ing. Geodesy and Geoinformation (MSc-equivalent)',
    priority: 'A-',
    coordinator: 'TU Wien — Department of Geodesy and Geoinformation',
    countries: ['Austria'],
    duration: '24 months / 4 semesters / 120 ECTS',
    website: 'https://www.tuwien.at/en/studies/studies/master-programmes/mathematics-and-geoinformation/geodesy-and-geoinformation',
    apply_url: 'https://geo-master.at/how-to-apply/',
    fit_notes:
      'New English geodesy + geoinformation master’s in Vienna. Stronger surveying/Earth-system than web GIS. No entrance exam; dean may add up to 30 ECTS bridging courses.',
    cycle_label: '2027 summer intake',
    opens: '2026-07-16',
    scholarship: null,
    self_funded: '2027-01-15',
    starts: '2027-03-01',
    date_status: 'expected',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'YES for March 2027 if TISS + legalised docs can go in now — processing takes 10–12 weeks.',
      target_start: 'March 2027 (summer). Next winter window: 16 Jan–15 Jul 2027 for October 2027.',
      opens_text: 'Non-EU summer window: 16 July–15 January. Winter: 16 January–15 July.',
      deadline_text:
        'EXPECTED 15 January 2027 for March 2027 start. October 2027: 15 July 2027. Confirm on tuwien.at admission pages.',
      tuition_text:
        'Usually €726.72 / semester for third-country students. Some developing-country waivers exist — confirm whether Pakistan is listed. Vienna living is expensive.',
      self_funded_text:
        'Self-funded. Residence permit needs proof of funds. No German blocked account. Enrol in person after the admission letter.',
      scholarships_text:
        'No EMJM. Cartography M.Sc. (semester 2 at TU Wien) is in the Erasmus catalogue and has no EM award after 2025. Watch OeAD Busek if a new call appears. Pakistan is not on the automatic least-developed-country tuition waiver; confirm any developing-country fee rule in writing.',
      prepare:
        'TISS guest account + admission documents. English proof (rectorate rules). BS GIS may get bridging math/physics/geodesy exams (max 30 ECTS). No German required.',
      watch_outs:
        'This is not a classic web-GIS course. Start the file early — 10–12 weeks processing, then visa.',
      last_checked: '14 Sep 2026',
    },
  },
  {
    slug: 'oead-busek',
    acronym: 'BUSEK',
    name: 'Erhard Busek Grant (OeAD)',
    official_title: 'Erhard Busek Grant — two-year master’s in Austria',
    priority: 'C',
    coordinator: 'OeAD — Austrian Agency for Education and Internationalisation',
    countries: ['Austria'],
    duration: '24 months (full master’s)',
    website: 'https://oead.at/en/study-research-teaching/overview-grants-and-scholarships/erhard-busek-grant',
    apply_url: 'https://grants.at/',
    fit_notes:
      'The only Austrian government full master’s grant that listed Pakistan. STEM / English programmes. You cannot apply to OeAD yourself — PLUS or TU Wien must nominate you after unconditional admission.',
    cycle_label: '2027/28 watch',
    opens: null,
    scholarship: null,
    self_funded: null,
    starts: '2027-10-01',
    date_status: 'tba',
    scholarships: true,
    funding_scheme: 'oead',
    extra: {
      apply: 'NO for now. OeAD says no further call is planned after the 2025/26 round. Watch oead.at / grants.at.',
      target_start: 'October 2027 only if a new call appears',
      opens_text: '2025/26: universities expressed interest by 15 Dec 2024; nominated students applied from Feb 2025.',
      deadline_text: 'No 2026/27 or 2027/28 deadline published. Treat as closed until OeAD announces a new round.',
      tuition_text:
        'When awarded: €1,300 / month + up to €1,200 travel. Tuition waived by the host university (the grant itself does not pay tuition).',
      self_funded_text:
        'This row is the scholarship, not a degree. Still apply to PLUS-AGI or TUW-GEO. Without Busek you pay statutory tuition.',
      scholarships_text:
        'Pakistan is on the country list. Age limit 35. Direct OeAD applications are not accepted. Recheck busek-stipendium@oead.at before planning around it.',
      prepare:
        'Unconditional admission to a 2-year English master’s at a participating Austrian university, then wait for that university’s nomination.',
      watch_outs:
        'Do not confuse this with Ernst Mach (short research stay, not a master’s). CDE / Cartography are separate Erasmus applications.',
      last_checked: '14 Sep 2026',
    },
  },
  {
    slug: 'aai-one-world',
    acronym: 'AAI',
    name: 'One World Scholarship (Salzburg)',
    official_title: 'One World Scholarship — Afro-Asiatic Institute Salzburg',
    priority: 'B',
    coordinator: 'Afro-Asiatic Institute (AAI) Salzburg',
    countries: ['Austria'],
    duration: 'During the master’s in Salzburg (semester months)',
    website: 'https://aai-salzburg.at/en/studies/one-world-scholarship',
    apply_url: 'https://aai-salzburg.at/en/studies/one-world-scholarship',
    fit_notes:
      'Partial living stipend if you are already a degree student in Salzburg. Fits PLUS Applied Geoinformatics. Not a visa scholarship — you must already hold a student residence permit.',
    cycle_label: 'After arrival in Salzburg',
    opens: null,
    scholarship: null,
    self_funded: null,
    starts: '2027-10-01',
    date_status: 'tba',
    scholarships: true,
    funding_scheme: 'partial',
    extra: {
      apply: 'Watch — apply after PLUS admission + student residence permit. One completed Austrian semester is a strong advantage.',
      target_start: 'While enrolled at PLUS (October–June payments)',
      opens_text: 'AAI selects students already in Salzburg. Recheck aai-salzburg.at for the next form window.',
      deadline_text: 'Not a pre-departure deadline. Confirm the current call on the AAI site before you travel.',
      tuition_text: '€500 / month in semester months (Oct–Jun). PLUS may waive the €726.72 tuition while this stipend is paid.',
      self_funded_text:
        'You still need year-1 proof of funds and usually first tuition for the visa. This grant starts after you are in Salzburg.',
      scholarships_text:
        'Pakistan (Global South) is eligible. Master’s age limit 30 (35 for mothers). Development / sustainability interest expected. Joint masters only by arrangement — CDE is not guaranteed.',
      prepare: 'PLUS admission, student visa/residence, financial-need evidence, transcript, development-interest statement.',
      watch_outs:
        'Not for distance/UNIGIS. Monthly AAI meetings are compulsory. Female applicants are prioritised when equally qualified.',
      last_checked: '14 Sep 2026',
    },
  },
  {
    slug: 'oead-ernst-mach',
    acronym: 'MACH',
    name: 'Ernst Mach Grant (short stay)',
    official_title: 'Ernst Mach Grant worldwide — research / exchange stay',
    priority: 'C',
    coordinator: 'OeAD — Ernst Mach Grant',
    countries: ['Austria'],
    duration: '1–9 months (not a degree)',
    website: 'https://oead.at/en/study-research-teaching/overview-grants-and-scholarships/ernst-mach-grant',
    apply_url: 'https://grants.at/',
    fit_notes:
      'Not a GIS master’s scholarship. Short incoming research stay. Listed so you do not spend a cycle treating it as a 2-year funded degree.',
    cycle_label: '2027/28 stay',
    opens: null,
    scholarship: '2026-12-01',
    self_funded: null,
    starts: '2027-09-01',
    date_status: 'expected',
    scholarships: true,
    funding_scheme: 'partial',
    extra: {
      apply: 'NO as a master’s route. OeAD FAQ: it does not finance a complete Master’s programme.',
      target_start: 'Not a degree start',
      opens_text: 'Worldwide call for academic year 2027/28: deadline 1 December 2026 (confirm on grants.at).',
      deadline_text: 'EXPECTED 1 December 2026 for 2027/28 short stays. Needs an Austrian supervisor’s consent.',
      tuition_text: 'Monthly grant for a visit, not 24 months of PLUS/TU Wien tuition.',
      self_funded_text: 'If you want a master’s, use PLUS-AGI / TUW-GEO (self-funded) or watch Busek.',
      scholarships_text: 'Pakistan can be eligible for a research stay. This is not a substitute for EMJM, DAAD EPOS, or Busek.',
      prepare: 'Only if you already have a PhD track or a visiting-researcher invitation — not for BS GIS → MSc admission.',
      watch_outs: 'ASEA-UNINET Mach is SE Asia only. Fachhochschule Mach is a 1–2 semester exchange, not ITC-style GIS.',
      last_checked: '14 Sep 2026',
    },
  },
]

const DESCRIPTION =
  'Austrian GIS / geoinformation master’s in English, plus the scholarships that actually exist for Pakistan. Statutory tuition is on the degree cards. Erhard Busek (OeAD) is the full master’s grant — no new call planned. One World is a Salzburg living stipend after arrival. Ernst Mach is a short stay, not a degree. CDE and Cartography M.Sc. sit in the Erasmus Mundus catalogue.'

export async function seedAustriaCatalogue(opts?: {
  userId?: string
  isAdmin?: boolean
}): Promise<{ error: string | null; count: number }> {
  const created = await findOrCreateCatalogue({
    slug: 'austria',
    name: 'Austria',
    description: DESCRIPTION,
    userId: opts?.userId,
    isAdmin: opts?.isAdmin,
  })
  if (created.error || !created.catalogueId) return { error: created.error ?? 'Could not create Austria catalogue', count: 0 }

  return upsertSeedProgrammes({
    catalogueId: created.catalogueId,
    programmes: PROGRAMMES,
    source: 'PLUS / Z_GIS / TU Wien / OeAD / AAI Salzburg pages, 14 Sep 2026',
  })
}
