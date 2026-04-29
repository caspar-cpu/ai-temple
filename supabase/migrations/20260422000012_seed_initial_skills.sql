-- Seed 3 initial skills, tagged to Caspar (update after insert so the trophy trigger doesn't fire)

insert into skills (slug, title, description, url, publisher, category) values
('find-skills',
 'Find Skills',
 'A meta-skill that helps you discover and recommend the right skill for a given task from your installed set. Useful once your skill library starts growing.',
 'https://skills.sh/vercel-labs/skills/find-skills',
 'Vercel Labs',
 'Developer productivity'),
('ui-ux-pro-max',
 'UI/UX Pro Max',
 'A comprehensive UI/UX design assistant. Covers design systems, component libraries, accessibility, and interaction patterns. Useful for product, design, and frontend work.',
 'https://skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max',
 'nextlevelbuilder',
 'Design'),
('seo-audit',
 'SEO Audit',
 'Audits websites and content for SEO best practices: on-page SEO, meta tags, site structure, and technical issues. Useful for marketing, growth, and anyone shipping content.',
 'https://skills.sh/coreyhaines31/marketingskills/seo-audit',
 'coreyhaines31',
 'Marketing');

update skills
set contributor_id = null
where slug in ('find-skills', 'ui-ux-pro-max', 'seo-audit');
