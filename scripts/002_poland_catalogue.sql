-- Add Poland catalogue if missing (safe to re-run).
-- Paste this in the ApplyDesk Supabase SQL editor, then run:
--   python scripts/import_poland.py
-- with SUPABASE_SERVICE_ROLE_KEY in .env.import (gitignored).

insert into public.catalogues (owner_user_id, slug, name, description, is_system)
select *
from (
  values (
    null::uuid,
    'poland',
    'Poland (self-funded)',
    'Public Polish GIS / geodesy master’s in English. Degrees are self-funded (tuition on each card). Banach NAWA is a separate scholarship; Pakistan was not eligible in 2026/27.',
    true
  )
) as v(owner_user_id, slug, name, description, is_system)
where not exists (
  select 1 from public.catalogues c
  where c.slug = v.slug and c.owner_user_id is null
);
