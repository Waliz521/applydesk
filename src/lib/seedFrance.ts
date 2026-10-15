import { supabase } from '@/lib/supabase'
import { findOrCreateCatalogue, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'

const TUITION =
  '€3,950/year (public non-EU master’s rate, 2026/27) plus CVEC, unless this university waives the extra fee. A Campus France admission note alone is not a waiver.'

const SCHOLARSHIP =
  'No automatic scholarship with the degree. Ask the university’s international office to nominate you for France Excellence Eiffel. Their file to Campus France is due 6 January 2027. Eiffel is a living stipend for 12–24 months, and only if the university places the degree under ecological transition, mathematics and digital sciences, or engineering.'

/** Removed from this catalogue: French-certificate degrees, and the Eiffel scholarship card. */
const RETIRED_SLUGS = [
  'uge-geomatique-m1',
  'unistra-otg-m1',
  'sigma-geomatique-m1',
  'montpellier-geomatique-m1',
  'sigat-geomatique-m1',
  'geonum-m1',
  'paris-cite-frs',
  'france-eiffel',
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
    apply_url: 'https://applicationform.grenoble-inp.fr/FSA2/676?lang=en',
    language: 'English',
    fit_notes:
      'Fully English, one-year master. In the Études en France catalogue as Bac+5, with an additional Grenoble form. The catalogue asks for a science or engineering bachelor in a related field, CGPA at least 3.5/4, and English B2. The school page names data science, computer science, electrical engineering, applied mathematics, or signal and image processing. A GIS bachelor is outside that named list. IELTS 5.5 is the floor printed on the school page.',
    cycle_label: '2027–28 intake',
    opens: '2026-10-15',
    scholarship: null,
    self_funded: '2027-04-15',
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'OPEN. Grenoble form from 15 October 2026 to 15 April 2027, and the same degree must stay in the Études en France cart before 18 November 2026. Both are required.',
      target_start: 'September 2027',
      opens_text: 'Grenoble INP opened the 2027–28 intake on 15 October 2026. The Études en France listing is already open.',
      deadline_text:
        'Grenoble form closes 15 April 2027. The Études en France choice locks on 18 November 2026. Pakistan needs both.',
      tuition_text: '€5,180 for the year, as printed on the IMAGERS page (updated 9 October 2026).',
      self_funded_text:
        'Self-funded. No French certificate is required for this degree. The visa interview still asks for living costs unless a full award is already in the offer.',
      scholarships_text: SCHOLARSHIP,
      prepare:
        'IELTS, TOEFL, or TOEIC at B2. IELTS 5.5 is the floor they print. Degree must be in a data-science or engineering field they list, at least the 4th year of higher education, CGPA 3.5/4 or 4.5/5. HEC-attested degree and transcript.',
      watch_outs:
        'One-year master (signal and image processing), not a two-year GIS M1. Courses are deep learning, SAR, optical remote sensing, lidar, and GNSS. A GIS bachelor meets neither the named degree list nor the image-processing background they describe.',
      last_checked: '15 Oct 2026',
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
    apply_url: 'https://demarches.adullact.org/commencer/nantes-gp-application',
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
      apply: 'Listed in Études en France (Bac+4, additional procedure). The listing says the application cannot be submitted there. File it on the Nantes Adullact form.',
      target_start: 'September 2027',
      opens_text: 'The Études en France listing is open. The Nantes form is the application.',
      deadline_text:
        'The Études en France card shows 18 November 2026. The application itself is the Nantes form; the close used here is 15 March 2027.',
      tuition_text: `${TUITION} Nantes also offers a €1,500 welcome grant for selected international students.`,
      self_funded_text:
        'Self-funded at the public rate unless waived. Language document is the English certificate. A French certificate is not on their document list.',
      scholarships_text:
        'The page points applicants to the Eiffel nomination (university file due 6 January 2027) and to a €1,500 excellence welcome grant. Neither replaces proof of living costs at the visa.',
      prepare:
        'CV and motivation letter in English or French, one recommendation letter, transcripts, English B2 certificate, passport. Bachelor preferentially in earth and planetary science, physics, chemistry, materials science, or mathematics.',
      watch_outs:
        'Geology and planetary science, with GIS and remote-sensing courses inside it. Field camps and a long internship. Updated on the Nantes page 5 October 2026.',
      last_checked: '15 Oct 2026',
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
    duration: '2 years (M1, Bac+4)',
    website: 'https://masters.osupytheas.fr/formations/master-stpe/international-master-in-geosciences-english/',
    apply_url: 'https://etudesenfrance.diplomatie.gouv.fr/mon-espace-etudiant',
    language: 'French and English',
    fit_notes:
      'In Études en France only. The listing says no minimum French level, and scientific English is required. Teaching is in English from semester 2 of year 1; year 2 is fully in English. A completed bachelor applies at Bac+4. The school asks for earth sciences or physical geography.',
    cycle_label: 'Sep 2027 · Études en France',
    opens: '2026-10-01',
    scholarship: null,
    self_funded: '2026-11-18',
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'OPEN. Procedure only on Études en France. Add the Bac+4 choice. There is no second university form.',
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
        'Semester 1 of year 1 is not fully English. The degree is geosciences (palaeoclimate, seismology, geomorphology, planetology). Confirmed in the Études en France catalogue on 15 October 2026.',
      last_checked: '15 Oct 2026',
    },
  },
]

async function removeFrenchRequirementProgrammes(catalogueId: string): Promise<string | null> {
  const { data: rows, error: lookupError } = await supabase
    .from('programmes')
    .select('id')
    .eq('catalogue_id', catalogueId)
    .in('slug', [...RETIRED_SLUGS])
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
      'Three master’s from the Études en France cart: Grenoble IMAGERS (own form to 15 April 2027, cart by 18 November 2026), Nantes Earth and Planetary Sciences (Nantes form), and Aix-Marseille IMG (Études en France only, 18 November 2026).',
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
      'Grenoble IMAGERS, Nantes EPS, Aix-Marseille IMG, confirmed in Études en France, 15 Oct 2026',
  })
}
