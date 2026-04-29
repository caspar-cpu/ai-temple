-- Range-scoped leaderboard function for monthly rankings

create or replace function public.leaderboard_in_range(
  p_start timestamptz,
  p_end timestamptz
)
returns table (
  id uuid,
  full_name text,
  username text,
  avatar_url text,
  department text,
  total_points int,
  trophy_count int
)
language sql
stable
security invoker
as $$
  select
    p.id,
    p.full_name,
    p.username,
    p.avatar_url,
    p.department,
    coalesce(sum(ut.points), 0)::int as total_points,
    count(ut.id)::int as trophy_count
  from profiles p
  left join user_trophies ut
    on ut.user_id = p.id
    and ut.earned_at >= p_start
    and ut.earned_at < p_end
  group by p.id, p.full_name, p.username, p.avatar_url, p.department
  having coalesce(sum(ut.points), 0) > 0
  order by coalesce(sum(ut.points), 0) desc, p.full_name;
$$;

grant execute on function public.leaderboard_in_range(timestamptz, timestamptz) to authenticated;
