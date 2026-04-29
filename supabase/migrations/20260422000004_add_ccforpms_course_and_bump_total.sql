-- Add CC for PMs course + bump onboarding journey total from 22 to 23

insert into courses (title, url, description, provider, estimated_hours) values
('Claude Code for Product Managers',
 'https://ccforpms.com/#about-this-course',
 'Carl Vellotti''s free, hands-on course for PMs using Claude Code. Covers file operations, parallel agents, PRD writing, and data analysis. No coding background needed, but you''ll need a Claude Pro or Max subscription to complete the exercises.',
 'Carl Vellotti',
 11);

create or replace function public.on_journey_step()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_count int;
  v_total constant int := 23;
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
