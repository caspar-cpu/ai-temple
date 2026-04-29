-- Skills section: links to skills.sh (or similar marketplaces) with info

create table skills (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  url text not null,
  publisher text,
  category text,
  department text,
  contributor_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index skills_category_idx on skills(category);
create index skills_contributor_idx on skills(contributor_id);

create table skill_uses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  skill_id uuid not null references skills(id) on delete cascade,
  used_at timestamptz not null default now(),
  unique (user_id, skill_id)
);

create index skill_uses_user_idx on skill_uses(user_id);
create index skill_uses_skill_idx on skill_uses(skill_id);

alter table skills enable row level security;
alter table skill_uses enable row level security;

create policy skills_select_auth on skills
  for select to authenticated using (true);
create policy skills_insert_auth on skills
  for insert to authenticated with check (contributor_id = auth.uid());
create policy skills_update_own on skills
  for update to authenticated using (contributor_id = auth.uid());

create policy skill_uses_select_auth on skill_uses
  for select to authenticated using (true);
create policy skill_uses_insert_self on skill_uses
  for insert to authenticated with check (user_id = auth.uid());
create policy skill_uses_delete_self on skill_uses
  for delete to authenticated using (user_id = auth.uid());

-- Trophy triggers
create or replace function public.on_skill_use()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  perform award_trophy(new.user_id, 'skill_used', 20, new.skill_id, 'skill');
  return new;
end;
$$;

create trigger trg_on_skill_use
  after insert on skill_uses
  for each row execute function public.on_skill_use();

create or replace function public.on_skill_create()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.contributor_id is not null then
    perform award_trophy(new.contributor_id, 'skill_contributed', 30, new.id, 'skill');
  end if;
  return new;
end;
$$;

create trigger trg_on_skill_create
  after insert on skills
  for each row execute function public.on_skill_create();

-- Extend content_questions to accept 'skill' for quiz gating
alter table content_questions drop constraint if exists content_questions_content_type_check;
alter table content_questions add constraint content_questions_content_type_check
  check (content_type in ('plugin','article','course','journey_step','skill'));
