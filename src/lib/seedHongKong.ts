import { findOrCreateCatalogue, removeProgrammesBySlug, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'

const PROGRAMMES: SeedRec[] = [
  {
    slug: 'polyu-lsgs-rpg',
    acronym: 'POLY-LSGS',
    name: 'PhD Land Surveying and Geospatial Science',
    official_title: 'PhD — Land Surveying and Geospatial Science',
    priority: 'A',
    coordinator: 'PolyU — Department of Land Surveying and Geospatial Sciences',
    countries: ['Hong Kong'],
    duration: '4 years, full-time, from a bachelor',
    website: 'https://www.polyu.edu.hk/lsgs/',
    apply_url: 'https://rpgadmission.polyu.edu.hk/',
    fit_notes:
      'The PhD on the Hong Kong PhD Fellowship file. Research area Geomatics. Proposed chief supervisor Sr Prof. Charles Man Sing Wong, second supervisor Prof. Guoqiang Shi.',
    cycle_label: 'Sep 2027 intake',
    opens: '2026-09-01',
    scholarship: '2026-12-01',
    self_funded: null,
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: true,
    funding_scheme: 'partial',
    extra: {
      funding_label: 'HKPFS / studentship',
      apply: 'Full-time PhD, 2027/28 Semester 1. The fellowship file is due with the university application.',
      target_start: 'September 2027',
      opens_text: 'RGC initial application opened 1 September 2026.',
      deadline_text:
        'Confirmed: university full application 1 December 2026, 23:59 Hong Kong time. RGC choices lock at 12:00 noon the same day.',
      tuition_text:
        'With a studentship or the fellowship, tuition is covered. The ordinary research studentship is the realistic award if the Council fellowship is not offered.',
      self_funded_text: 'An offer with no research studentship is a separate decision. Hong Kong living costs stay on you in that case.',
      scholarships_text:
        'Hong Kong PhD Fellowship Scheme, plus PolyU’s Presidential fellowship, International PhD Fellowship, and the ordinary studentship. Only one can be held. Council results are announced in May 2027.',
      prepare:
        'Degree, transcript, research plan, CV, passport, and two academic referees. A professor does not have to accept the file before it is submitted.',
      watch_outs: 'The department’s regular RPG date of 31 May 2027 is later than the fellowship file. The fellowship file is still 1 December 2026.',
      last_checked: '29 Oct 2026',
    },
  },
  {
    slug: 'cuhk-esgs-phd',
    acronym: 'CUHK-ESGS',
    name: 'Earth System and GeoInformation Science',
    official_title: 'PhD — Earth System and GeoInformation Science',
    priority: 'A',
    coordinator: 'CUHK — Earth System and GeoInformation Science',
    countries: ['Hong Kong'],
    duration: '4 years, full-time, from a bachelor',
    website: 'https://www.gradsch.cuhk.edu.hk/',
    apply_url: 'https://www.gradsch.cuhk.edu.hk/OnlineApp/login_email.aspx',
    fit_notes:
      'Second university on the Hong Kong PhD Fellowship file. Field of study: Geographic Information System. Inter-faculty PhD.',
    cycle_label: 'Sep 2027 intake',
    opens: '2026-09-01',
    scholarship: '2026-12-01',
    self_funded: null,
    starts: '2027-09-01',
    date_status: 'confirmed',
    scholarships: true,
    funding_scheme: 'partial',
    extra: {
      funding_label: 'HKPFS / studentship',
      apply: 'Full-time PhD. If both universities nominate, the Council processes PolyU only.',
      target_start: 'September 2027',
      opens_text: 'The graduate-school application is open for September 2027.',
      deadline_text:
        'Confirmed: 1 December 2026, 23:59 Hong Kong time, including the research-plan questions. Saving the form is not a submission.',
      tuition_text: 'With the fellowship or a studentship, tuition is covered. The Council pays the fellowship for up to three years.',
      self_funded_text: 'An offer without a studentship leaves tuition and Hong Kong living costs unpaid.',
      scholarships_text:
        'Hong Kong PhD Fellowship Scheme, registered as the second choice. Council results are announced in May 2027.',
      prepare: 'Degree, transcript, passport, research plan, and referees after the fee is paid. English was the medium of instruction.',
      watch_outs: 'Declining PolyU does not move the fellowship to CUHK. Part G has to be submitted, not only saved.',
      last_checked: '17 Nov 2026',
    },
  },
]

export async function seedHongKongCatalogue(opts: {
  userId?: string
  isAdmin?: boolean
}): Promise<{ error: string | null; count: number }> {
  const removed = await removeProgrammesBySlug(['hk-hkpfs', 'hku-geog-rpg', 'hku-geods-msc'])
  if (removed) return { error: removed, count: 0 }
  const { error: catError, catalogueId } = await findOrCreateCatalogue({
    slug: 'hong-kong',
    name: 'Hong Kong',
    description:
      'PolyU and CUHK PhDs on the Hong Kong PhD Fellowship file. September 2027.',
    userId: opts.userId,
    isAdmin: opts.isAdmin,
  })
  if (catError || !catalogueId) return { error: catError ?? 'No catalogue id', count: 0 }

  return upsertSeedProgrammes({
    catalogueId,
    programmes: PROGRAMMES,
    source: 'PolyU LSGS and CUHK Graduate School pages, 17 Nov 2026',
  })
}
