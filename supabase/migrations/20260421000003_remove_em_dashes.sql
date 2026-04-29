-- Remove em dashes from seeded content copy

update plugins
set description = 'Read, extract, and create PDFs: forms, tables, OCR on scanned pages, merging, splitting, rotating, watermarks.'
where slug = 'pdf';

update plugins
set description = 'Create, read, and edit Word documents: tables of contents, headings, page numbers, letterheads, tracked changes, find-and-replace.'
where slug = 'docx';

update courses
set description = 'The core vocabulary and mental models for working with AI. Anthropic''s official intro course. Worth it even if you think you already know the basics.'
where title = 'AI Fluency: Framework & Foundations';

update articles
set title = 'State of GPT (Microsoft Build 2023)'
where title = 'State of GPT — Microsoft Build 2023';

update articles
set description = 'If you watch one thing about LLMs, watch this. Karpathy walks through training, inference, RLHF, system prompts, the whole stack.'
where title = 'Intro to Large Language Models (1-hour talk)';

update articles
set description = 'Build a transformer in Python, line by line. You don''t need an ML background to follow, just patience.'
where title = 'Let''s build GPT: from scratch, in code, spelled out';
