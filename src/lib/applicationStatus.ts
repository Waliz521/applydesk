/** Status slugs that mean the form is already filed. */
const APPLIED_SLUGS = new Set(['submitted', 'applied', 'accepted', 'offer', 'enrolled', 'won'])

export function isAppliedStatus(slug: string | null | undefined): boolean {
  if (!slug) return false
  return APPLIED_SLUGS.has(slug.toLowerCase())
}

/** Prefer these when marking a tracker row as filed. */
export function pickAppliedStatusId(
  statuses: { id: string; slug: string }[],
): string | null {
  const preferred = ['submitted', 'applied']
  for (const slug of preferred) {
    const hit = statuses.find((s) => s.slug.toLowerCase() === slug)
    if (hit) return hit.id
  }
  return null
}
