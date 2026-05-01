-- Add Simon Willison's agent-definitions tag page to the reading room.

insert into articles (title, url, description, author, source) values
('Simon Willison on agent-definitions',
 'https://simonwillison.net/tags/agent-definitions/',
 'A running collection of how people define an AI ''agent'' — from academic framings to modern LLM-based takes. Useful when you''re trying to ground a fuzzy team conversation.',
 'Simon Willison',
 'simonwillison.net');
