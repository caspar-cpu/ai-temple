-- Clear existing plugins and reseed with Anthropic's officially-published top 5

delete from content_questions where content_type = 'plugin';
delete from plugins;

insert into plugins (slug, name, description, github_url, install_command, invocation_prompt, example_search, department) values
('pdf',
 'PDF',
 'Anthropic''s official PDF skill. Read, extract, and create PDFs: forms, tables, OCR on scanned pages, merging, splitting, rotating, watermarks. The most-installed plugin on Cowork and the first one most teams will want.',
 'https://github.com/anthropics/skills/blob/main/skills/pdf/SKILL.md',
 '/plugin marketplace add anthropics/skills',
 'Ask Claude to "extract the tables from this PDF" or "turn this markdown into a branded PDF".',
 'Extract the line items from this supplier invoice PDF',
 'Productivity'),
('xlsx',
 'XLSX',
 'Anthropic''s official Excel skill. Read, edit, and create xlsx files: formulas, formatting, charts, pivot tables, cleaning messy tabular data. Essential for Finance, Ops, Supply Chain, and Growth.',
 'https://github.com/anthropics/skills/blob/main/skills/xlsx/SKILL.md',
 '/plugin marketplace add anthropics/skills',
 'Ask Claude to "clean this spreadsheet" or "build a P&L model from these numbers".',
 'Clean this messy CSV and fix the date column',
 'Productivity'),
('docx',
 'DOCX',
 'Anthropic''s official Word skill. Create, read, and edit Word documents: tables of contents, headings, page numbers, letterheads, tracked changes, find-and-replace. Useful for Legal, People, and any team producing formal documents.',
 'https://github.com/anthropics/skills/blob/main/skills/docx/SKILL.md',
 '/plugin marketplace add anthropics/skills',
 'Ask Claude to "turn this into a formatted Word doc" or "fix the styles in this .docx".',
 'Turn this proposal into a polished Word document',
 'Productivity'),
('pptx',
 'PPTX',
 'Anthropic''s official PowerPoint skill. Build slide decks, read existing ones, extract text. Templates, layouts, speaker notes, combining and splitting files. Useful for any team that pitches internally or externally.',
 'https://github.com/anthropics/skills/blob/main/skills/pptx/SKILL.md',
 '/plugin marketplace add anthropics/skills',
 'Ask Claude to "build me a pitch deck" or "pull the text out of this presentation".',
 'Build an investor deck from this Notion page',
 'Productivity'),
('skill-creator',
 'Skill Creator',
 'Anthropic''s meta-skill for building new skills. Start here when you want to turn a repeatable workflow into a reusable plugin that everyone can install. The cleanest way to build a plugin without reading the full spec.',
 'https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md',
 '/plugin marketplace add anthropics/skills',
 'Ask Claude to "use the skill-creator skill to build a skill that does X".',
 'Create a skill that writes weekly supplier emails for me',
 'Meta');

update plugins
set contributor_id = null
where slug in ('pdf', 'xlsx', 'docx', 'pptx', 'skill-creator');
