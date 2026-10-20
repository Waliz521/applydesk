-- Add Finland catalogue if missing (safe to re-run).
insert into public.catalogues (owner_user_id, slug, name, description, is_system)
select *
from (
  values (
    null::uuid,
    'finland',
    'Finland',
    'Finnish English master''s in geoinformatics and geography. University tuition waivers only — no national full master''s grant for Pakistan. Migri living funds apply.',
    true
  )
) as v(owner_user_id, slug, name, description, is_system)
where not exists (
  select 1 from public.catalogues c
  where c.slug = v.slug and c.owner_user_id is null
);
