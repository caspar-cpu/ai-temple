-- When no full_name is supplied at signup, default to a title-cased version
-- of the email-prefix (e.g. caspar@gmail.com -> "Caspar") so the leaderboard
-- doesn't show lowercase handles as if they were names.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_email_base text := lower(split_part(new.email, '@', 1));
  v_meta_username text := lower(coalesce(nullif(new.raw_user_meta_data->>'username', ''), ''));
  v_username text;
  v_suffix int := 1;
  v_name text;
begin
  v_meta_username := regexp_replace(v_meta_username, '[^a-z0-9-]', '', 'g');
  v_meta_username := trim(both '-' from v_meta_username);

  if length(v_meta_username) >= 2 then
    v_username := v_meta_username;
  else
    v_username := regexp_replace(v_email_base, '[^a-z0-9-]', '', 'g');
    if length(v_username) = 0 then v_username := 'miner'; end if;
  end if;

  while exists (select 1 from public.profiles where username = v_username) loop
    v_username := split_part(v_username, '-', 1) || '-' || v_suffix::text;
    v_suffix := v_suffix + 1;
  end loop;

  v_name := coalesce(
    nullif(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'name', ''),
    initcap(replace(v_email_base, '.', ' '))
  );

  insert into public.profiles (id, email, full_name, avatar_url, username)
  values (
    new.id,
    new.email,
    v_name,
    new.raw_user_meta_data->>'avatar_url',
    v_username
  );
  return new;
end;
$$;
