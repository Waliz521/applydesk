const NAME_BY_CODE: Record<string, string> = {
  NL: 'Netherlands',
  SE: 'Sweden',
  EE: 'Estonia',
  BE: 'Belgium',
  AT: 'Austria',
  FR: 'France',
  CZ: 'Czechia',
  DE: 'Germany',
  ES: 'Spain',
  PT: 'Portugal',
  SI: 'Slovenia',
  UK: 'United Kingdom',
  FI: 'Finland',
  DK: 'Denmark',
  IT: 'Italy',
  GR: 'Greece',
  PL: 'Poland',
}

export function countriesInvolved(input: {
  countries?: string[] | null
  coordinator?: string | null
  consortium?: string | null
}): string[] {
  const found: string[] = []
  for (const name of input.countries ?? []) {
    if (name && !found.includes(name)) found.push(name)
  }
  const blob = `${input.coordinator ?? ''} ${input.consortium ?? ''}`
  for (const [code, name] of Object.entries(NAME_BY_CODE)) {
    if (new RegExp(`\\(${code}\\)`).test(blob) && !found.includes(name)) found.push(name)
  }
  for (const name of Object.values(NAME_BY_CODE)) {
    if (blob.includes(name) && !found.includes(name)) found.push(name)
  }
  return found
}
