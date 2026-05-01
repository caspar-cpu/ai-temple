-- Add five podcast episodes for the new /pods-videos listening room.
-- Categorisation is by URL host, so source labels are descriptive only.

insert into articles (title, url, description, author, source) values
('#863: Elad Gil, Consigliere to Empire Builders',
 'https://share.snipd.com/episode/153a6c3a-4c82-4d50-8c0c-5de141ec67fd',
 'How to spot billion-dollar companies before everyone else, the misty AI frontier, how Coke beat Pepsi, when consensus pays, and much more.',
 'Tim Ferriss',
 'The Tim Ferriss Show'),
('AI Lab Power Rankings',
 'https://share.snipd.com/episode/19fc9a2d-8c4a-4a63-99f6-584a017f3eb7',
 'A ranking of the leading AI labs and how the competitive landscape is shifting between them.',
 'Nathaniel Whittemore',
 'The AI Daily Brief'),
('AI Inside the Enterprise',
 'https://open.spotify.com/episode/683aQwRH7iWIoPUAy5LVq0',
 'The reality of AI inside enterprises: why initiatives fail in large organisations and how agents, infrastructure and workflows are advancing.',
 'a16z',
 'The a16z Podcast'),
('TBPN',
 'https://share.snipd.com/show/9e09ee28-e90d-490c-82a0-431559019a83',
 'A live tech talk show hosted by John Coogan and Jordi Hays, weekdays 11–2 PT on X and YouTube, with full episodes on Spotify.',
 'John Coogan & Jordi Hays',
 'TBPN'),
('Inside Meta''s Big AI Pivot',
 'https://open.spotify.com/episode/3lTwOp17mRXtMY7Twja9Ys',
 'Meta accelerates its AI transformation through aggressive talent recruitment, workforce integration and the development of an AI agent for Mark Zuckerberg.',
 'The Wall Street Journal',
 'The Journal.');
