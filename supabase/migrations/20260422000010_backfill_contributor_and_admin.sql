-- Strip ghost contributor IDs from cloned Calo content (no Calo profiles exist
-- in this database, so any reference would dangle). Fresh attribution will
-- accrue as users contribute new items here.
update articles set contributor_id = null where contributor_id is not null;
update courses  set contributor_id = null where contributor_id is not null;
update plugins  set contributor_id = null where contributor_id is not null;

-- Grant admin to the Temple admin. The profile is auto-created on first
-- magic-link sign-in (via the handle_new_user trigger), so this UPDATE only
-- takes effect after that first sign-in. If you sign in before this migration
-- has run, re-run it; if you sign in after, the flag is set immediately.
update profiles
set is_admin = true
where email = 'casparmrose@gmail.com';
