import { findOrCreateCatalogue, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'

const PROGRAMMES: SeedRec[] = [
  {
    slug: 'sydney-mphil-science',
    acronym: 'USYD-MPHIL',
    name: 'Master of Philosophy (Science)',
    official_title: 'Master of Philosophy (Science) — University of Sydney',
    priority: 'A',
    coordinator: 'University of Sydney — Faculty of Science',
    countries: ['Australia'],
    duration: 'Up to 2 years full time',
    website: 'https://www.sydney.edu.au/courses/courses/pr/master-of-philosophy-science0.html',
    apply_url: 'https://www.sydney.edu.au/study/applying/how-to-apply/postgraduate-research.html',
    fit_notes:
      'Research master’s, not a PhD. Pitch is GIS and remote sensing. RTP stipend includes the tuition offset; the university stipend (USYDIS) is the same package if RTP places are full. Do not lodge until a supervisor has agreed.',
    cycle_label: 'Research Periods 3 and 4, 2027',
    opens: null,
    scholarship: '2026-12-18',
    self_funded: null,
    starts: null,
    date_status: 'confirmed',
    scholarships: true,
    funding_scheme: 'full',
    extra: {
      funding_label: 'RTP stipend',
      apply: 'YES for Research Periods 3 and 4, 2027, only after a supervisor agrees. The supervisor email is not the application. One A$150 fee covers applications for a year and is not refunded.',
      target_start: 'Research Periods 3 and 4, 2027',
      opens_text: 'No separate published open date. Write the proposal, then email a supervisor, then lodge.',
      deadline_text:
        '18 December 2026. Outcomes from 26 February 2027. Sydney’s estimate for offshore applicants is 18 May 2027.',
      tuition_text:
        'RTP, or USYDIS if RTP places are full: full tuition, living allowance A$44,293 a year, plus relocation and thesis allowances. On a research master’s the stipend runs for up to two years.',
      self_funded_text: 'Not pursued without the stipend. Admission alone leaves tuition and living unpaid.',
      scholarships_text:
        'Australian Government Research Training Program (international). The tuition offset is awarded with the stipend. Scholarship page: sydney.edu.au/scholarships/australian-government-research-training-program/rtp-international.html',
      prepare:
        'Proposal first (Faculty of Science: up to 2,000 words), then email a supervisor with background, the topic, and the fit, attaching a CV, transcripts, and that proposal. After they agree: final proposal, the agreement email, two referee reports on Sydney’s forms, transcripts plus an English translation, proof of English, CV, passport biodata, and the scholarship form in the same application. Pay A$150. First GIS / remote-sensing contact who lists research supervision: Eleanor Bruce (Geosciences).',
      watch_outs:
        'Bachelor with first or second-class honours, or an equivalent with enough research. Do not apply for the PhD on the bachelor alone. Coursework fee cuts are not this award.',
      last_checked: '13 Nov 2026',
    },
  },
  {
    slug: 'monash-mres-eae',
    acronym: 'MONASH-MRES',
    name: 'Master’s by Research',
    official_title: 'Master’s by Research — School of Earth, Atmosphere and Environment',
    priority: 'A',
    coordinator: 'Monash University — School of Earth, Atmosphere and Environment',
    countries: ['Australia'],
    duration: 'Up to 2 years full time',
    website: 'https://www.monash.edu/graduate-research/study/apply',
    apply_url: 'https://www.monash.edu/graduate-research/study/apply',
    fit_notes:
      'Research master’s in earth, atmosphere, and environment: GIS, remote sensing, earth observation, spatial data science. Not the coursework Master of Geographical Information Science and Technology (S6007).',
    cycle_label: 'International Round 1, 2027',
    opens: null,
    scholarship: '2027-02-28',
    self_funded: null,
    starts: '2027-07-01',
    date_status: 'confirmed',
    scholarships: true,
    funding_scheme: 'full',
    extra: {
      funding_label: 'RTP stipend',
      apply: 'YES — International Round 1. One application per round. Name the faculty, the research degree, and the supervisor before submitting. No application fee on the graduate research page.',
      target_start: 'July–December 2027',
      opens_text: 'No separate published open date. A supervisor has to be named on the form.',
      deadline_text: '28 February 2027 (International Round 1).',
      tuition_text:
        'RTP stipend packaged with a tuition scholarship for international students. Living allowance A$41,100 a year. On a research master’s the stipend runs for up to two years.',
      self_funded_text: 'Not pursued without the stipend. The coursework GIS master’s (S6007) does not pay a living allowance.',
      scholarships_text: 'RTP international stipend plus tuition. Assessed with the graduate research application.',
      prepare: 'Faculty, research degree, and supervisor named before submit. Proof of English and transcripts as Monash graduate research requires.',
      watch_outs: 'Do not file S6007. A coursework fee cut is not this card.',
      last_checked: '13 Nov 2026',
    },
  },
  {
    slug: 'anu-mphil-fenner',
    acronym: 'ANU-MPHIL',
    name: 'Master of Philosophy (Fenner)',
    official_title: 'Master of Philosophy — Fenner School (8065XMPHIL)',
    priority: 'A',
    coordinator: 'Australian National University — Fenner School of Environment and Society',
    countries: ['Australia'],
    duration: 'Up to 2 years full time',
    website: 'https://programsandcourses.anu.edu.au/program/8065xmphil',
    apply_url: 'https://fennerschool.anu.edu.au/study/phd-mphil',
    fit_notes:
      'Research master’s in environment, geography, water, and spatial analysis. Not a GIS-technology degree. RTP is assessed automatically with the admission application. No HDR application fee.',
    cycle_label: 'Round 2, 2027',
    opens: null,
    scholarship: '2027-04-15',
    self_funded: null,
    starts: '2027-08-31',
    date_status: 'confirmed',
    scholarships: true,
    funding_scheme: 'full',
    extra: {
      funding_label: 'RTP stipend',
      apply: 'YES — Round 2. Lodge about two to three weeks before the deadline so referee reports arrive in time. No separate scholarship form.',
      target_start: 'By the end of August 2027',
      opens_text: 'No separate published open date. Referees are emailed from the application.',
      deadline_text:
        '15 April 2027 (Round 2). Referee reports must arrive before this date, so lodge about two to three weeks earlier.',
      tuition_text:
        'RTP stipend with the fee offset. Living allowance A$40,475 a year. On a research master’s the stipend runs for up to two years.',
      self_funded_text: 'Not pursued without the stipend. Admission alone leaves tuition and living unpaid.',
      scholarships_text: 'RTP is assessed automatically with the HDR admission application. No application fee for an HDR application.',
      prepare:
        'MPhil admission asks for a bachelor at distinction level, or an equivalent, or a mix of qualifications and experience. The PhD asks for honours — this card is the MPhil. Line up two referees before you lodge.',
      watch_outs: 'A late lodge can miss the scholarship because the referees have not replied yet.',
      last_checked: '13 Nov 2026',
    },
  },
]

const DESCRIPTION =
  'Australian research master’s that pay full tuition and a living stipend (RTP). Sydney MPhil (Science), Monash Master’s by Research, and ANU Fenner MPhil. A supervisor has to agree before you lodge. Coursework GIS degrees and fee cuts with no living allowance are not listed.'

export async function seedAustraliaCatalogue(opts?: {
  userId?: string
  isAdmin?: boolean
}): Promise<{ error: string | null; count: number }> {
  const created = await findOrCreateCatalogue({
    slug: 'australia',
    name: 'Australia',
    description: DESCRIPTION,
    userId: opts?.userId,
    isAdmin: opts?.isAdmin,
  })
  if (created.error || !created.catalogueId) {
    return { error: created.error ?? 'Could not create Australia catalogue', count: 0 }
  }

  return upsertSeedProgrammes({
    catalogueId: created.catalogueId,
    programmes: PROGRAMMES,
    source: 'Sydney / Monash / ANU RTP pages, 13 Nov 2026',
  })
}
