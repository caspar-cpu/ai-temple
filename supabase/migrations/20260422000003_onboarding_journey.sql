-- Onboarding journey: per-user step completion + trophies
-- Each step awards +5, completing all (currently 22) awards a one-time +100

create table journey_step_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  step_key text not null,
  completed_at timestamptz not null default now(),
  unique (user_id, step_key)
);

create index journey_step_completions_user_idx on journey_step_completions(user_id);

alter table journey_step_completions enable row level security;

create policy journey_step_completions_select_auth on journey_step_completions
  for select to authenticated using (true);
create policy journey_step_completions_insert_self on journey_step_completions
  for insert to authenticated with check (user_id = auth.uid());
create policy journey_step_completions_delete_self on journey_step_completions
  for delete to authenticated using (user_id = auth.uid());

create or replace function public.on_journey_step()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_count int;
  v_total constant int := 22;
begin
  perform award_trophy(new.user_id, 'journey_step', 5, null, 'journey');

  select count(*) into v_count
  from journey_step_completions
  where user_id = new.user_id;

  if v_count >= v_total and not exists (
    select 1 from user_trophies
    where user_id = new.user_id and kind = 'journey_completed'
  ) then
    perform award_trophy(new.user_id, 'journey_completed', 100);
  end if;

  return new;
end;
$$;

create trigger trg_on_journey_step
  after insert on journey_step_completions
  for each row execute function public.on_journey_step();
