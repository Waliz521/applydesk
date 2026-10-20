-- Add Denmark catalogue if missing (safe to re-run).
insert into public.catalogues (owner_user_id, slug, name, description, is_system)
select *
from (
  values (
    null::uuid,
    'denmark',
    'Denmark',
    'English-taught Danish master''s with GIS, geoinformatics, or environmental/geoscience angles. Danish Government Scholarship for non-EU (Pakistan eligible) is awarded by each university — not a separate portal.',
    true
  )
) as v(owner_user_id, slug, name, description, is_system)
where not exists (
  select 1 from public.catalogues c
  where c.slug = v.slug and c.owner_user_id is null
);
