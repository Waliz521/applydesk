-- Add France catalogue if missing (safe to re-run).
-- The app also writes this on first dashboard load via seedFranceCatalogue().

insert into public.catalogues (owner_user_id, slug, name, description, is_system)
select *
from (
  values (
    null::uuid,
    'france',
    'France',
    'English-taught French master’s that accept IELTS and do not ask for a French certificate: Grenoble IMAGERS (15 April 2027), Nantes Earth and Planetary Sciences (15 March 2027), and Aix-Marseille IMG (Études en France, 18 November 2026). Their stated bachelor subjects are not a GIS degree. Eiffel nomination is 6 January 2027.',
    true
  )
) as v(owner_user_id, slug, name, description, is_system)
where not exists (
  select 1 from public.catalogues c
  where c.slug = v.slug and c.owner_user_id is null
);
