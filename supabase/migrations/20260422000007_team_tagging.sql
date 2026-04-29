-- Team tagging: allow articles and courses to be tagged to a Calo team with sequencing

alter table articles add column team text;
alter table articles add column team_order int;
alter table courses add column team text;
alter table courses add column team_order int;

create index articles_team_idx on articles(team, team_order);
create index courses_team_idx on courses(team, team_order);
