-- Calo Skills Warehouse — initial schema

-- Profiles mirror auth.users with Calo-specific fields
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  avatar_url text,
  department text,
  username text unique not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_base text := split_part(new.email, '@', 1);
  v_username text := v_base;
  v_suffix int := 1;
  v_name text;
begin
  while exists (select 1 from public.profiles where username = v_username) loop
    v_username := v_base || '-' || v_suffix::text;
    v_suffix := v_suffix + 1;
  end loop;

  v_name := coalesce(
    nullif(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'name', ''),
    v_base
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Plugins are references to GitHub-hosted Claude skills
create table plugins (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  github_url text not null,
  install_command text not null,
  invocation_prompt text not null,
  example_search text,
  department text,
  contributor_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index plugins_department_idx on plugins(department);
create index plugins_contributor_idx on plugins(contributor_id);

create table plugin_uses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  plugin_id uuid not null references plugins(id) on delete cascade,
  used_at timestamptz not null default now(),
  unique (user_id, plugin_id)
);

create index plugin_uses_user_idx on plugin_uses(user_id);
create index plugin_uses_plugin_idx on plugin_uses(plugin_id);

-- Articles (AI reading library, Stripe-Press style)
create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  description text,
  author text,
  source text,
  contributor_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table article_reads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  article_id uuid not null references articles(id) on delete cascade,
  read_at timestamptz not null default now(),
  unique (user_id, article_id)
);

-- Courses
create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  description text,
  provider text,
  estimated_hours numeric,
  contributor_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table course_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, course_id)
);

-- Trophies: one row per earned trophy, with its point value snapshotted
create table user_trophies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  kind text not null,
  points integer not null,
  ref_id uuid,
  ref_type text,
  earned_at timestamptz not null default now()
);

create index user_trophies_user_idx on user_trophies(user_id);
create index user_trophies_kind_idx on user_trophies(kind);

create unique index user_trophies_dedup_idx
  on user_trophies(user_id, kind, ref_id)
  where ref_id is not null;

-- Trophy awarding: runs as definer so RLS on user_trophies stays locked from clients
create or replace function public.award_trophy(
  p_user_id uuid,
  p_kind text,
  p_points int,
  p_ref_id uuid default null,
  p_ref_type text default null
) returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into user_trophies (user_id, kind, points, ref_id, ref_type)
  values (p_user_id, p_kind, p_points, p_ref_id, p_ref_type)
  on conflict do nothing;
end;
$$;

create or replace function public.on_plugin_use()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_author uuid;
  v_plugin_use_count int;
  v_user_use_count int;
begin
  perform award_trophy(new.user_id, 'plugin_used', 25, new.plugin_id, 'plugin');

  select count(*) into v_user_use_count from plugin_uses where user_id = new.user_id;
  if v_user_use_count = 1 then
    perform award_trophy(new.user_id, 'first_plugin', 20);
  elsif v_user_use_count = 5 then
    perform award_trophy(new.user_id, 'plugins_5', 50);
  elsif v_user_use_count = 10 then
    perform award_trophy(new.user_id, 'plugins_10', 100);
  elsif v_user_use_count = 25 then
    perform award_trophy(new.user_id, 'plugins_25', 200);
  end if;

  select contributor_id into v_author from plugins where id = new.plugin_id;
  if v_author is not null and v_author <> new.user_id then
    select count(*) into v_plugin_use_count from plugin_uses where plugin_id = new.plugin_id;
    if v_plugin_use_count = 10 then
      perform award_trophy(v_author, 'plugin_widely_used', 150, new.plugin_id, 'plugin');
    end if;
  end if;

  return new;
end;
$$;

create trigger trg_on_plugin_use
  after insert on plugin_uses
  for each row execute function public.on_plugin_use();

create or replace function public.on_plugin_create()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.contributor_id is not null then
    perform award_trophy(new.contributor_id, 'plugin_contributed', 50, new.id, 'plugin');
  end if;
  return new;
end;
$$;

create trigger trg_on_plugin_create
  after insert on plugins
  for each row execute function public.on_plugin_create();

create or replace function public.on_article_read()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  perform award_trophy(new.user_id, 'article_read', 10, new.article_id, 'article');
  return new;
end;
$$;

create trigger trg_on_article_read
  after insert on article_reads
  for each row execute function public.on_article_read();

create or replace function public.on_article_create()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.contributor_id is not null then
    perform award_trophy(new.contributor_id, 'article_contributed', 5, new.id, 'article');
  end if;
  return new;
end;
$$;

create trigger trg_on_article_create
  after insert on articles
  for each row execute function public.on_article_create();

create or replace function public.on_course_complete()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  perform award_trophy(new.user_id, 'course_completed', 100, new.course_id, 'course');
  return new;
end;
$$;

create trigger trg_on_course_complete
  after insert on course_completions
  for each row execute function public.on_course_complete();

create or replace function public.on_course_create()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.contributor_id is not null then
    perform award_trophy(new.contributor_id, 'course_contributed', 5, new.id, 'course');
  end if;
  return new;
end;
$$;

create trigger trg_on_course_create
  after insert on courses
  for each row execute function public.on_course_create();

-- Leaderboard view
create view public.leaderboard
with (security_invoker = true)
as
select
  p.id,
  p.full_name,
  p.email,
  p.avatar_url,
  p.department,
  p.username,
  coalesce(sum(ut.points), 0)::int as total_points,
  count(ut.id)::int as trophy_count
from profiles p
left join user_trophies ut on ut.user_id = p.id
group by p.id;

-- Row-level security: any @calo.app-authenticated user can read all;
-- writes are restricted to own records or moderated tables
alter table profiles enable row level security;
alter table plugins enable row level security;
alter table plugin_uses enable row level security;
alter table articles enable row level security;
alter table article_reads enable row level security;
alter table courses enable row level security;
alter table course_completions enable row level security;
alter table user_trophies enable row level security;

create policy profiles_select_auth on profiles
  for select to authenticated using (true);
create policy profiles_update_self on profiles
  for update to authenticated using (id = auth.uid());

create policy plugins_select_auth on plugins
  for select to authenticated using (true);
create policy plugins_insert_auth on plugins
  for insert to authenticated with check (contributor_id = auth.uid());
create policy plugins_update_own on plugins
  for update to authenticated using (contributor_id = auth.uid());

create policy plugin_uses_select_auth on plugin_uses
  for select to authenticated using (true);
create policy plugin_uses_insert_self on plugin_uses
  for insert to authenticated with check (user_id = auth.uid());
create policy plugin_uses_delete_self on plugin_uses
  for delete to authenticated using (user_id = auth.uid());

create policy articles_select_auth on articles
  for select to authenticated using (true);
create policy articles_insert_auth on articles
  for insert to authenticated with check (contributor_id = auth.uid());
create policy articles_update_own on articles
  for update to authenticated using (contributor_id = auth.uid());

create policy article_reads_select_auth on article_reads
  for select to authenticated using (true);
create policy article_reads_insert_self on article_reads
  for insert to authenticated with check (user_id = auth.uid());
create policy article_reads_delete_self on article_reads
  for delete to authenticated using (user_id = auth.uid());

create policy courses_select_auth on courses
  for select to authenticated using (true);
create policy courses_insert_auth on courses
  for insert to authenticated with check (contributor_id = auth.uid());
create policy courses_update_own on courses
  for update to authenticated using (contributor_id = auth.uid());

create policy course_completions_select_auth on course_completions
  for select to authenticated using (true);
create policy course_completions_insert_self on course_completions
  for insert to authenticated with check (user_id = auth.uid());
create policy course_completions_delete_self on course_completions
  for delete to authenticated using (user_id = auth.uid());

-- user_trophies: readable by authenticated users, but writable only via
-- the SECURITY DEFINER trigger functions (no insert/update/delete policy)
create policy user_trophies_select_auth on user_trophies
  for select to authenticated using (true);

-- Leaderboard view inherits RLS via security_invoker
grant select on public.leaderboard to authenticated;
