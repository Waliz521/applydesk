-- Add France catalogue if missing (safe to re-run).
-- The app also writes this on first dashboard load via seedFranceCatalogue().

insert into public.catalogues (owner_user_id, slug, name, description, is_system)
select *
from (
  values (
    null::uuid,
    'france',
    'France',
    'Three master’s from the Études en France cart: Grenoble IMAGERS (own form to 15 April 2027, cart by 18 November 2026), Nantes Earth and Planetary Sciences (Nantes form), and Aix-Marseille IMG (Études en France only, 18 November 2026).',
    true
  )
) as v(owner_user_id, slug, name, description, is_system)
where not exists (
  select 1 from public.catalogues c
  where c.slug = v.slug and c.owner_user_id is null
);
