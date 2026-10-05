-- Add France catalogue if missing (safe to re-run).
-- The app also writes this on first dashboard load via seedFranceCatalogue().

insert into public.catalogues (owner_user_id, slug, name, description, is_system)
select *
from (
  values (
    null::uuid,
    'france',
    'France',
    'French public GIS and remote-sensing master’s for a September 2027 start, chosen inside Études en France. File deadline 18 November 2026. Géomatique degrees are French-taught. Paris Cité Fundamentals of Remote Sensing is French in year 1 and English in year 2. Eiffel is a university nomination due 6 January 2027. Public non-EU tuition is €3,950/year unless waived.',
    true
  )
) as v(owner_user_id, slug, name, description, is_system)
where not exists (
  select 1 from public.catalogues c
  where c.slug = v.slug and c.owner_user_id is null
);
