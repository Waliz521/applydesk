import { findOrCreateCatalogue, removeProgrammesBySlug, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'

const PROGRAMMES: SeedRec[] = []

const DESCRIPTION =
  'No Finland application is open. Aalto and Helsinki are not in this file.'

export async function seedFinlandCatalogue(opts?: {
  userId?: string
  isAdmin?: boolean
}): Promise<{ error: string | null; count: number }> {
  const removed = await removeProgrammesBySlug([
    'finland-tuition-waivers',
    'aalto-geoinformatics',
    'helsinki-geography',
  ])
  if (removed) return { error: removed, count: 0 }
  const created = await findOrCreateCatalogue({
    slug: 'finland',
    name: 'Finland',
    description: DESCRIPTION,
    userId: opts?.userId,
    isAdmin: opts?.isAdmin,
  })
  if (created.error || !created.catalogueId) {
    return { error: created.error ?? 'Could not create Finland catalogue', count: 0 }
  }

  return upsertSeedProgrammes({
    catalogueId: created.catalogueId,
    programmes: PROGRAMMES,
    source: 'Aalto / Helsinki / Study in Finland / Migri, 21 Oct 2026',
  })
}
