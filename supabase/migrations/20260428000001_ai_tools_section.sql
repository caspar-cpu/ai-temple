-- AI Tools section: curated reference of the 2026 AI marketing/ops stack.
-- Mirrors the skills_section pattern (table + uses + RLS + trophy trigger).

create table ai_tools (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category_slug text not null check (category_slug in (
    'general-assistants',
    'research-writing',
    'productivity',
    'dev-no-code',
    'content-creation',
    'visuals-audio',
    'automation',
    'coding-development'
  )),
  category_order smallint not null,            -- 1..8 pyramid order
  display_order  smallint not null default 0,  -- order within a category
  summary    text not null,                     -- short card preview
  body_md    text not null,                     -- full markdown body
  founded    text,                              -- "Anthropic, 2021. First released March 2023."
  url        text not null,                     -- homepage link
  created_at timestamptz not null default now()
);

create index ai_tools_category_idx on ai_tools(category_order, display_order);

create table ai_tool_uses (
  id uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  ai_tool_id uuid not null references ai_tools(id) on delete cascade,
  used_at    timestamptz not null default now(),
  unique (user_id, ai_tool_id)
);

create index ai_tool_uses_user_idx on ai_tool_uses(user_id);
create index ai_tool_uses_tool_idx on ai_tool_uses(ai_tool_id);

alter table ai_tools enable row level security;
alter table ai_tool_uses enable row level security;

-- Curated list: only admins manage the catalogue, but everyone can read.
create policy ai_tools_select_auth on ai_tools
  for select to authenticated using (true);
create policy ai_tools_admin_write on ai_tools
  for all to authenticated using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  ) with check (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy ai_tool_uses_select_auth on ai_tool_uses
  for select to authenticated using (true);
create policy ai_tool_uses_insert_self on ai_tool_uses
  for insert to authenticated with check (user_id = auth.uid());
create policy ai_tool_uses_delete_self on ai_tool_uses
  for delete to authenticated using (user_id = auth.uid());

-- Trophy: 20 points the first time a user marks an AI tool as used (mirrors skill_used).
create or replace function public.on_ai_tool_use()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  perform award_trophy(new.user_id, 'ai_tool_used', 20, new.ai_tool_id, 'ai_tool');
  return new;
end;
$$;

create trigger trg_on_ai_tool_use
  after insert on ai_tool_uses
  for each row execute function public.on_ai_tool_use();

-- Extend content_questions to accept 'ai_tool' for quiz gating.
alter table content_questions drop constraint if exists content_questions_content_type_check;
alter table content_questions add constraint content_questions_content_type_check
  check (content_type in ('plugin','article','course','journey_step','skill','ai_tool'));
