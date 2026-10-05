import { findOrCreateCatalogue, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'

const CF_APPLY =
  'https://www.pakistan.campusfrance.org/apply-to-french-higher-education-institutions-through-etudes-en-france-candidature-campaign'

const TUITION =
  '€3,950/year (public non-EU master’s rate, 2026/27) plus CVEC, unless this university waives the extra fee. A Campus France admission note alone is not a waiver.'

const PREPARE =
  'BS GIS or a close bachelor (geography, geomatics, environmental science, computer science with GIS). Upload HEC-attested degree and transcript, IBCC matric and intermediate, CV, and a motivation letter. These M1 programmes are taught in French: a TCF or DELF/DALF is what the universities read (B2 is the usual floor, C1 is safer). IELTS does not replace that certificate.'

const SCHOLARSHIP =
  'No automatic scholarship with the degree. Ask each university’s international office now to nominate you for France Excellence Eiffel. Their file to Campus France is due 6 January 2027 — after the 30 April admission results is too late for this call. Eiffel is a living stipend for 12–24 months; a geomatics master’s can be filed only if the university places it under ecological transition, mathematics and digital sciences, or engineering.'

const WATCH_BASE =
  'One Études en France file, up to 7 master’s, list locked after 18 November 2026, fee by 30 November 2026. Results 30 April 2027; accept one offer by 31 May 2027. You apply here for M1 (September 2027). M2 is the following year if you pass M1. French-taught: without a French certificate the file is weak even with a GIS bachelor.'

function degree(rec: {
  slug: string
  acronym: string
  name: string
  official_title: string
  priority: string
  coordinator: string
  website: string
  fit_notes: string
  search: string
  places: string
}): SeedRec {
  return {
    slug: rec.slug,
    acronym: rec.acronym,
    name: rec.name,
    official_title: rec.official_title,
    priority: rec.priority,
    coordinator: rec.coordinator,
    countries: ['France'],
    duration: '2 years (apply now for M1)',
    website: rec.website,
    apply_url: CF_APPLY,
    language: 'French',
    fit_notes: rec.fit_notes,
    cycle_label: 'Sep 2027 · Études en France',
    opens: '2026-10-01',
    scholarship: null,
    self_funded: '2026-11-18',
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'OPEN. Choose this M1 inside the Études en France catalogue (Pakistan “I am applying”), not on a separate university form.',
      target_start: 'September 2027',
      opens_text: 'Campus France Pakistan candidature opened 1 October 2026.',
      deadline_text:
        'Submit the Études en France file by 18 November 2026. Pay the file fee by 30 November 2026. The programme list cannot be edited after 18 November.',
      tuition_text: TUITION,
      self_funded_text:
        'You pay the public non-EU master’s fee unless that university grants a waiver. The waiver is not automatic. The visa interview still asks for living costs unless Eiffel (or another full award) is already in the offer.',
      scholarships_text: SCHOLARSHIP,
      prepare: `${PREPARE} In the catalogue, search: ${rec.search}`,
      watch_outs: `${WATCH_BASE} ${rec.places}`,
      last_checked: '5 Oct 2026',
    },
  }
}

const PROGRAMMES: SeedRec[] = [
  degree({
    slug: 'uge-geomatique-m1',
    acronym: 'UGE-GEOM',
    name: 'Geomatics M1 (ENSG)',
    official_title: 'Master Géomatique — Université Gustave Eiffel / ENSG',
    priority: 'A',
    coordinator: 'Université Gustave Eiffel — ENSG, Champs-sur-Marne',
    website: 'https://formations.univ-gustave-eiffel.fr/master/detail/geomatique-278',
    fit_notes:
      'French-taught M1 at ENSG. GIS, cartography, photogrammetry, remote sensing, Python. M2 can be IGAST (optical and radar images) or TSI (GIS systems).',
    search: 'Master Géomatique, Université Gustave Eiffel, Champs-sur-Marne.',
    places: '2025 Mon Master round: about 10 places and 321 applicants. Treat 2027 capacity as unpublished.',
  }),
  degree({
    slug: 'unistra-otg-m1',
    acronym: 'OTG',
    name: 'Earth observation & geomatics M1',
    official_title: 'Master Géomatique, parcours Observation de la Terre et géomatique',
    priority: 'A',
    coordinator: 'Université de Strasbourg — Faculté de géographie, with ENGEES',
    website: 'https://formations.unistra.fr/fr/formations25-26/master-MAS/master-geomatique-ME60.html',
    fit_notes:
      'French-taught M1. Remote sensing (satellite and airborne), image processing, spatial databases, GIS, spatial analysis. Closest to a GIS plus imagery profile. French B2 is stated.',
    search: 'Master Géomatique, Observation de la Terre et géomatique, Université de Strasbourg.',
    places: '2025 Mon Master round: about 20 places and 232 applicants. Treat 2027 capacity as unpublished.',
  }),
  degree({
    slug: 'sigma-geomatique-m1',
    acronym: 'SIGMA',
    name: 'Geomatics M1 (SIGMA)',
    official_title: 'Master Géomatique, parcours SIGMA — Sciences géomatiques en environnement et aménagement',
    priority: 'A',
    coordinator: 'Université Toulouse — Jean Jaurès, with Toulouse INP-ENSAT',
    website: 'https://www.univ-tlse2.fr/accueil/formation-insertion/master-geomatique-parcours-sciences-geomatiques-en-environnement-et-amenagement-sigma',
    fit_notes:
      'French-taught M1. GIS, remote sensing, image processing, Python, web mapping, environment and land planning. Non-EU applicants use Études en France for M1.',
    search: 'Master Géomatique SIGMA, Université Toulouse Jean Jaurès.',
    places:
      'UT2J asks TCF/DELF B2 minimum and recommends C1 for a master’s. 2025 Mon Master round: about 21 places and 395 applicants.',
  }),
  degree({
    slug: 'montpellier-geomatique-m1',
    acronym: 'MTP-GEOM',
    name: 'Geomatics M1 (Montpellier)',
    official_title: 'Master Géomatique — Paul-Valéry Montpellier 3',
    priority: 'A-',
    coordinator: 'Université Paul-Valéry Montpellier 3, with Université de Montpellier and AgroParisTech',
    website: 'https://geom.www.univ-montp3.fr',
    fit_notes:
      'French-taught M1. GIS, cartography, remote sensing, spatial analysis, programming, natural-resource and land-planning uses. Co-accredited with AgroParisTech Montpellier.',
    search: 'Master Géomatique, Université Paul-Valéry Montpellier 3. Do not also pick the AgroParisTech line if it is the same degree.',
    places: '2025 Mon Master round: about 22 places and 422 applicants. Treat 2027 capacity as unpublished.',
  }),
  degree({
    slug: 'sigat-geomatique-m1',
    acronym: 'SIGAT',
    name: 'GIS & territorial analysis M1',
    official_title: 'Master Géomatique, parcours SIGAT — Systèmes d’information géographique et analyse des territoires',
    priority: 'A-',
    coordinator: 'Université Rennes 2',
    website: 'https://sites-formations.univ-rennes2.fr/mastersigat/',
    fit_notes:
      'French-taught M1. Professional GIS: spatial databases, web mapping, programming, project work for planning, environment, and networks. Less remote-sensing than ENSG or Strasbourg.',
    search: 'Master Géomatique SIGAT, Université Rennes 2.',
    places: 'Aimed at a geography or planning bachelor, or an equivalent. 2025 Mon Master round: about 20 places and 295 applicants.',
  }),
  degree({
    slug: 'geonum-m1',
    acronym: 'GEONUM',
    name: 'Digital geographies M1',
    official_title: 'Master Géomatique, parcours Géographies numériques',
    priority: 'A-',
    coordinator: 'Université Jean Monnet Saint-Étienne (M1), then Lyon 2 (M2), with Lyon 3',
    website: 'https://mastergeonum.org/description/',
    fit_notes:
      'French-taught M1 in Saint-Étienne. GIS, spatial analysis, geoinformatics, web and territorial data. M2 classes are mainly at Lyon 2. Fits a web-GIS profile more than radar remote sensing.',
    search: 'Master Géomatique, Géographies numériques, Université Jean Monnet (M1).',
    places: '2025 Mon Master round: about 19 places and 213 applicants. Treat 2027 capacity as unpublished.',
  }),
  {
    slug: 'paris-cite-frs',
    acronym: 'FRS',
    name: 'Fundamentals of Remote Sensing',
    official_title:
      'Master Earth and Planet Sciences, Environment — Fundamentals of Remote Sensing (FRS / SECO)',
    priority: 'C',
    coordinator: 'Université Paris Cité — IPGP, with Sorbonne Université in year 2',
    countries: ['France'],
    duration: '2 years (apply now for M1)',
    website:
      'https://u-paris.fr/language/en/master-in-earth-and-planet-sciences-environment-fundamentals-of-remote-sensing-frs/',
    apply_url: CF_APPLY,
    language: 'French (year 1), English (year 2)',
    fit_notes:
      'Year 1 is entirely in French (shared with the geophysics M1). Year 2 is entirely in English. Trains physicists in satellite remote sensing, not GIS analysts. Stated entry: bachelor in geosciences, physics, or mathematics.',
    cycle_label: 'Sep 2027 · Études en France',
    opens: '2026-10-01',
    scholarship: null,
    self_funded: '2026-11-18',
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'OPEN for Pakistan through Études en France. Search Université Paris Cité, Master Earth and Planet Sciences, Fundamentals of Remote Sensing / SECO.',
      target_start: 'September 2027',
      opens_text: 'Campus France Pakistan candidature opened 1 October 2026.',
      deadline_text:
        'Submit the Études en France file by 18 November 2026. Pay the file fee by 30 November 2026. Université Paris Cité’s own page does not publish a separate Pakistan deadline.',
      tuition_text: TUITION,
      self_funded_text:
        'Public non-EU master’s fee unless Paris Cité waives it. The visa interview still asks for living costs unless a full award is already in the offer.',
      scholarships_text:
        'No automatic scholarship. Eiffel is a university nomination due 6 January 2027. This degree is filed as physics / Earth observation, so a nomination is only possible if Paris Cité places it in an Eiffel science field.',
      prepare:
        'Official entry is a bachelor’s in geosciences, physics, or mathematics, plus English B2 (C1 preferred). Year 1 courses include electromagnetism, seismology, signal processing, tectonics, and satellite observation of the Earth. A GIS bachelor is outside that list. Because year 1 is 100% French, a TCF or DELF is still what a French-taught M1 expects. HEC-attested degree and transcript, IBCC matric and intermediate.',
      watch_outs:
        'Official language line (Université Paris Cité, checked 5 Oct 2026): first year French 100%, second year English 100%. This is not an English-taught GIS master’s. M1 is the common geophysics year. Direct entry to year 2 needs an M1 in geosciences, physics, or mathematics, or the second year of an engineering school.',
      last_checked: '5 Oct 2026',
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
    language: 'French',
    fit_notes:
      'Full living scholarship. You cannot apply on your own. Email each geomatics programme’s international office now and ask them to nominate you.',
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
        'Send a short email plus CV to the international office of each M1 you put in the Études en France file. Do this in October or November 2026, in parallel with the Campus France file.',
      watch_outs:
        'Waiting for the April admission letter misses this call. Erasmus Mundus (GEM, GroundwatCH, FloodRISK) is a different application, on each programme website, not inside the seven Campus France choices.',
      last_checked: '5 Oct 2026',
    },
  },
]

export async function seedFranceCatalogue(opts: {
  userId?: string
  isAdmin?: boolean
}): Promise<{ error: string | null; count: number }> {
  const { error: catError, catalogueId } = await findOrCreateCatalogue({
    slug: 'france',
    name: 'France',
    description:
      'French public GIS and remote-sensing master’s for a September 2027 start, chosen inside Études en France. File deadline 18 November 2026. The Géomatique degrees are French-taught. Paris Cité Fundamentals of Remote Sensing is French in year 1 and English in year 2, and it asks for a geosciences, physics, or mathematics bachelor. Eiffel is a university nomination due 6 January 2027. Public non-EU tuition is €3,950/year unless waived.',
    userId: opts.userId,
    isAdmin: opts.isAdmin,
  })
  if (catError || !catalogueId) return { error: catError ?? 'No catalogue id', count: 0 }

  return upsertSeedProgrammes({
    catalogueId,
    programmes: PROGRAMMES,
    source:
      'Campus France Pakistan candidature calendar, Campus France tuition page 2026/27, programme sites (ENSG, Strasbourg, SIGMA, Montpellier, SIGAT, GéoNum), Eiffel call, 5 Oct 2026',
  })
}
