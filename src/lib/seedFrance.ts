import { supabase } from '@/lib/supabase'
import { findOrCreateCatalogue, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'

const TUITION =
  '€3,950/year (public non-EU master’s rate, 2026/27) plus CVEC, unless this university waives the extra fee. A Campus France admission note alone is not a waiver.'

const SCHOLARSHIP =
  'No automatic scholarship with the degree. Ask the university’s international office to nominate you for France Excellence Eiffel. Their file to Campus France is due 6 January 2027. Eiffel is a living stipend for 12–24 months, and only if the university places the degree under ecological transition, mathematics and digital sciences, or engineering.'

/** Degrees that ask for TCF, DELF, or DALF. Dropped from this catalogue. */
const FRENCH_REQUIREMENT_SLUGS = [
  'uge-geomatique-m1',
  'unistra-otg-m1',
  'sigma-geomatique-m1',
  'montpellier-geomatique-m1',
  'sigat-geomatique-m1',
  'geonum-m1',
  'paris-cite-frs',
] as const

const PROGRAMMES: SeedRec[] = [
  {
    slug: 'grenoble-imagers',
    acronym: 'IMAGERS',
    name: 'Geoscience & remote sensing (IMAGERS)',
    official_title: 'International Master in Geoscience and Remote Sensing',
    priority: 'C',
    coordinator: 'Grenoble INP — Ense3, Université Grenoble Alpes',
    countries: ['France'],
    duration: '1 year',
    website: 'https://ense3.grenoble-inp.fr/en/study-at-ense3/master-in-geoscience-and-remote-sensing-imagers-1',
    apply_url: 'https://ense3.grenoble-inp.fr/en/study-at-ense3/master-in-geoscience-and-remote-sensing-imagers-1',
    language: 'English',
    fit_notes:
      'Fully English, one-year master in AI, image processing, and optical/radar remote sensing. The page says no French is required; IELTS 5.5 is the stated floor. Entry is a bachelor in data science, computer science, electrical engineering, applied mathematics, or signal and image processing, with CGPA at least 3.5/4. A GIS bachelor is outside that list.',
    cycle_label: '2027–28 intake',
    opens: '2026-10-15',
    scholarship: null,
    self_funded: '2027-04-15',
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'OPEN on the Grenoble page from 15 October 2026 to 15 April 2027. This is their own window, not the 18 November Études en France lock.',
      target_start: 'September 2027',
      opens_text: 'Grenoble INP opened the 2027–28 intake on 15 October 2026.',
      deadline_text:
        'Grenoble’s published close is 15 April 2027. If IMAGERS also appears inside Études en France, a Pakistan file still has to choose it before 18 November 2026. Check the catalogue before relying on the April date.',
      tuition_text:
        '€5,180 for the year, as printed on the IMAGERS page (updated 9 October 2026). This is not the €3,950 public non-EU rate used by the géomatique M1s.',
      self_funded_text:
        'Self-funded. No French certificate is required for this degree. The visa interview still asks for living costs unless a full award is already in the offer.',
      scholarships_text: SCHOLARSHIP,
      prepare:
        'IELTS, TOEFL, or TOEIC at B2. IELTS 5.5 is the floor they print. Degree must be in a data-science or engineering field they list, at least the 4th year of higher education, CGPA 3.5/4 or 4.5/5. HEC-attested degree and transcript.',
      watch_outs:
        'One-year master (signal and image processing), not a two-year GIS M1. Courses are deep learning, SAR, optical remote sensing, lidar, and GNSS. A GIS bachelor meets neither the named degree list nor the image-processing background they describe.',
      last_checked: '13 Oct 2026',
    },
  },
  {
    slug: 'nantes-eps',
    acronym: 'EPS',
    name: 'Earth and planetary sciences',
    official_title: 'Master Earth and Planetary Sciences — Graduate Programme',
    priority: 'C',
    coordinator: 'Nantes Université — Laboratoire de Planétologie et Géosciences',
    countries: ['France'],
    duration: '2 years',
    website:
      'https://sciences-techniques.univ-nantes.fr/formations/masters/graduate-programme-earth-and-planetary-sciences-master-level',
    apply_url:
      'https://sciences-techniques.univ-nantes.fr/formations/masters/graduate-programme-earth-and-planetary-sciences-master-level',
    language: 'English',
    fit_notes:
      'Taught entirely in English. Asks for English B2 (IELTS, TOEFL, TOEIC, or Cambridge). French is recommended for daily life and is not a required certificate. Entry is a bachelor in earth and planetary science, or in physics, chemistry, materials, or mathematics. A GIS bachelor is outside that list. Year 1 includes a GIS course and remote sensing.',
    cycle_label: '2027–28 intake',
    opens: '2026-10-01',
    scholarship: null,
    self_funded: '2027-03-15',
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'OPEN on the Nantes graduate-programme platform (Adullact account) from 1 October 2026 to 15 March 2027. The page tells Campus France countries to use that platform, not a separate Études en France choice.',
      target_start: 'September 2027',
      opens_text: 'Graduate programme applications opened 1 October 2026.',
      deadline_text: 'Close 15 March 2027 on the Nantes graduate-programme platform.',
      tuition_text: `${TUITION} Nantes also offers a €1,500 welcome grant for selected international students.`,
      self_funded_text:
        'Self-funded at the public rate unless waived. Language document is the English certificate. A French certificate is not on their document list.',
      scholarships_text:
        'The page points applicants to the Eiffel nomination (university file due 6 January 2027) and to a €1,500 excellence welcome grant. Neither replaces proof of living costs at the visa.',
      prepare:
        'CV and motivation letter in English or French, one recommendation letter, transcripts, English B2 certificate, passport. Bachelor preferentially in earth and planetary science, physics, chemistry, materials science, or mathematics.',
      watch_outs:
        'Geology and planetary science, with GIS and remote-sensing courses inside it. Field camps and a long internship. Updated on the Nantes page 5 October 2026.',
      last_checked: '13 Oct 2026',
    },
  },
  {
    slug: 'amu-img',
    acronym: 'IMG',
    name: 'International master in geosciences',
    official_title: 'Master Sciences de la Terre et des planètes, environnement — International Master in Geosciences',
    priority: 'C',
    coordinator: 'Aix-Marseille Université — CEREGE / OSU Pythéas',
    countries: ['France'],
    duration: '2 years (apply now for M1)',
    website: 'https://masters.osupytheas.fr/formations/master-stpe/international-master-in-geosciences-english/',
    apply_url: 'https://people.cerege.fr/~vgodard/flyer_img/posts/5-application/',
    language: 'English (from semester 2)',
    fit_notes:
      'English fluency is mandatory and no French certificate is listed. Teaching is in English from the second semester of year 1; year 2 is fully in English. M1 entry is a bachelor in earth sciences or physical geography. A GIS bachelor is outside that list.',
    cycle_label: 'Sep 2027 · Études en France',
    opens: '2026-10-01',
    scholarship: null,
    self_funded: '2026-11-18',
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'OPEN for Pakistan through Études en France. The IMG page says first-time non-EU students use that procedure. Search the STPE master, International Master in Geosciences.',
      target_start: 'September 2027',
      opens_text: 'Campus France Pakistan candidature opened 1 October 2026.',
      deadline_text:
        'Submit the Études en France file by 18 November 2026. Pay the file fee by 30 November 2026. The programme list cannot be edited after 18 November.',
      tuition_text: TUITION,
      self_funded_text:
        'Public non-EU master’s fee unless Aix-Marseille waives it. The language proof they state is English, not TCF/DELF.',
      scholarships_text: SCHOLARSHIP,
      prepare:
        'Bachelor in earth sciences or physical geography (a natural-sciences, physics, or chemistry bachelor only after the teaching team agrees). English fluency. HEC-attested degree and transcript, IBCC matric and intermediate, CV, motivation letter.',
      watch_outs:
        'Semester 1 of year 1 is not fully English. The degree is geosciences (palaeoclimate, seismology, geomorphology, planetology), not a GIS master’s. Checked 13 October 2026.',
      last_checked: '13 Oct 2026',
    },
  },
  {
    slug: 'france-eiffel',
    acronym: 'EIFFEL',
    name: 'France Excellence Eiffel',
    official_title: 'Bourse France Excellence Eiffel — master’s nomination',
    priority: 'A',
    coordinator: 'Campus France, nominated by the French institution',
    countries: ['France'],
    duration: '12–24 months of a master’s',
    website: 'https://www.campusfrance.org/fr/le-programme-de-bourses-france-excellence-eiffel',
    apply_url: 'https://www.campusfrance.org/fr/le-programme-de-bourses-france-excellence-eiffel',
    language: 'Depends on the degree',
    fit_notes:
      'Full living scholarship. You cannot apply on your own. Ask Grenoble, Nantes, or Aix-Marseille to nominate you for the English-taught master’s you choose.',
    cycle_label: '2027 call · institution deadline',
    opens: '2026-10-01',
    scholarship: '2027-01-06',
    self_funded: null,
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: true,
    funding_scheme: 'full',
    extra: {
      apply: 'No student portal. A file you send yourself is rejected. The French university nominates you.',
      target_start: 'September 2027',
      opens_text: 'Ask universities during the Campus France window. Their internal deadline is before 6 January 2027.',
      deadline_text:
        'Institutions must submit nominations to Campus France by 6 January 2027. Results expected in the week of 12 April 2027. Campus France admission results (30 April) are after this deadline.',
      tuition_text: 'Eiffel is a stipend, travel, insurance, and housing help. Tuition waiver depends on the university; do not assume the €3,950 fee disappears unless the offer says so.',
      self_funded_text: 'If you are not nominated, the master’s stays self-funded at the public non-EU rate.',
      scholarships_text:
        'Fields include ecological transition, mathematics and digital sciences, and engineering, plus law, political science, and economics. A GIS master’s fits only when the university files it in one of those science fields. Master’s nominees are often 29 or under — confirm the 2027 age rule before you rely on it.',
      prepare:
        'Send a short email plus CV to the international office of IMAGERS, Nantes EPS, or Aix-Marseille IMG. Do this while that degree’s application is still open.',
      watch_outs:
        'Waiting for the April admission letter misses this call. Erasmus Mundus (GEM, GroundwatCH, FloodRISK) is a different application, on each programme website, not inside the seven Campus France choices.',
      last_checked: '5 Oct 2026',
    },
  },
]

async function removeFrenchRequirementProgrammes(catalogueId: string): Promise<string | null> {
  const { data: rows, error: lookupError } = await supabase
    .from('programmes')
    .select('id')
    .eq('catalogue_id', catalogueId)
    .in('slug', [...FRENCH_REQUIREMENT_SLUGS])
  if (lookupError) return lookupError.message
  const ids = (rows ?? []).map((row) => row.id as string)
  if (ids.length === 0) return null

  const { error: appError } = await supabase
    .from('applications')
    .update({ programme_id: null, cycle_id: null })
    .in('programme_id', ids)
  if (appError) return appError.message

  const { error: cycleError } = await supabase.from('programme_cycles').delete().in('programme_id', ids)
  if (cycleError) return cycleError.message

  const { error: programmeError } = await supabase.from('programmes').delete().in('id', ids)
  return programmeError?.message ?? null
}

export async function seedFranceCatalogue(opts: {
  userId?: string
  isAdmin?: boolean
}): Promise<{ error: string | null; count: number }> {
  const { error: catError, catalogueId } = await findOrCreateCatalogue({
    slug: 'france',
    name: 'France',
    description:
      'English-taught French master’s that accept IELTS and do not ask for a French certificate: Grenoble IMAGERS (15 April 2027), Nantes Earth and Planetary Sciences (15 March 2027), and Aix-Marseille IMG (Études en France, 18 November 2026). Their stated bachelor subjects are not a GIS degree. Eiffel nomination is 6 January 2027.',
    userId: opts.userId,
    isAdmin: opts.isAdmin,
  })
  if (catError || !catalogueId) return { error: catError ?? 'No catalogue id', count: 0 }

  if (opts.isAdmin) {
    const removed = await removeFrenchRequirementProgrammes(catalogueId)
    if (removed) return { error: removed, count: 0 }
  }

  return upsertSeedProgrammes({
    catalogueId,
    programmes: PROGRAMMES,
    source:
      'Grenoble IMAGERS, Nantes Earth and Planetary Sciences, Aix-Marseille IMG, Campus France Eiffel call, 13 Oct 2026',
  })
}
