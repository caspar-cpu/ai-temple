-- Quiz gating: multiple-choice question per piece of content, 24h cooldown on wrong answers

create table content_questions (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('plugin','article','course','journey_step')),
  content_key text not null,
  question text not null,
  options text[] not null check (array_length(options, 1) = 4),
  correct_index int not null check (correct_index >= 0 and correct_index < 4),
  created_at timestamptz not null default now(),
  created_by uuid references profiles(id) on delete set null,
  unique (content_type, content_key)
);

create index content_questions_lookup_idx on content_questions(content_type, content_key);

create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  content_type text not null,
  content_key text not null,
  correct boolean not null,
  attempted_at timestamptz not null default now()
);

create index quiz_attempts_lookup_idx on quiz_attempts(user_id, content_type, content_key, attempted_at desc);

alter table content_questions enable row level security;
alter table quiz_attempts enable row level security;

create policy questions_select_auth on content_questions
  for select to authenticated using (true);
create policy questions_insert_auth on content_questions
  for insert to authenticated with check (true);
create policy questions_update_admin on content_questions
  for update to authenticated using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy attempts_select_self on quiz_attempts
  for select to authenticated using (user_id = auth.uid());
create policy attempts_insert_self on quiz_attempts
  for insert to authenticated with check (user_id = auth.uid());
