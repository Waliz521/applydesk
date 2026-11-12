import type { Application, Catalogue } from '@/lib/types'

/** Short labels for the Tracker country / catalogue filter. */
export const TRACKER_REGION_BY_CATALOGUE: Record<string, string> = {
  'erasmus-mundus': 'Erasmus Mundus',
  france: 'France',
  netherlands: 'Netherlands',
  austria: 'Austria',
  poland: 'Poland',
  'hong-kong': 'Hong Kong',
  denmark: 'Denmark',
  finland: 'Finland',
  daad: 'Germany (DAAD)',
}

export function regionFromCatalogue(catalogue: Pick<Catalogue, 'slug' | 'name'> | null | undefined): string {
  if (!catalogue) return 'Other'
  return TRACKER_REGION_BY_CATALOGUE[catalogue.slug] ?? catalogue.name
}

export function trackerRegionForRow(
  row: Application,
  cataloguesById: Map<string, Catalogue>,
): string {
  const saved = row.country?.trim()
  if (saved) return saved
  const cat = row.catalogue_id ? cataloguesById.get(row.catalogue_id) : undefined
  return regionFromCatalogue(cat)
}

export function regionFilterId(region: string): string {
  return region.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}
