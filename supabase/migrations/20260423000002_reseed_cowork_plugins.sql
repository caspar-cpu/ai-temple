-- Make github_url nullable (Cowork-directory plugins have no public URL)
alter table plugins alter column github_url drop not null;

-- Clear current plugin entries and reseed with the actual 8 Anthropic Cowork plugins
delete from content_questions where content_type = 'plugin';
delete from plugins;

insert into plugins (slug, name, description, github_url, install_command, invocation_prompt, example_search, department) values
('marketing',
 'Marketing',
 'Create content, plan campaigns, and analyse performance across marketing channels. Maintains brand voice, coordinates multi-channel launches, and produces copy that matches your guidelines. One of Anthropic''s official Cowork plugins.',
 null,
 'Open Claude Cowork. Plugins. Anthropic & Partners. Search "Marketing". Install.',
 'Ask Claude to draft an ad, plan a campaign, or analyse last week''s Meta results.',
 'Draft three Meta ad variants for the new product launch',
 'Marketing & Design'),
('productivity',
 'Productivity',
 'Manage tasks, plan your day, and build up memory of important context about your work. Syncs with your calendar, inbox, and docs so Claude stays aware of what matters. Anthropic''s most-installed plugin.',
 null,
 'Open Claude Cowork. Plugins. Anthropic & Partners. Search "Productivity". Install.',
 'Ask Claude to plan your week, triage your inbox, or remember context about an ongoing project.',
 'Plan my week based on my calendar and the three open projects',
 'General Management'),
('design',
 'Design',
 'Accelerate design workflows: critique, design system management, UX writing, accessibility audits, research synthesis. Built for product designers and UX writers who want a fast, thoughtful second pair of eyes.',
 null,
 'Open Claude Cowork. Plugins. Anthropic & Partners. Search "Design". Install.',
 'Ask Claude to critique a Figma frame, suggest UX copy, or audit accessibility.',
 'Critique this landing page design for clarity and accessibility',
 'Marketing & Design'),
('data',
 'Data',
 'Write SQL, explore datasets, and generate insights faster. Build visualisations and dashboards, and turn raw data into charts you can drop into a meeting. Useful for Finance, Growth, Ops, and anyone querying Snowflake or BigQuery.',
 null,
 'Open Claude Cowork. Plugins. Anthropic & Partners. Search "Data". Install.',
 'Ask Claude to write a SQL query, build a chart, or explain what a dataset contains.',
 'Write a SQL query to show weekly active users by city for the last quarter',
 'Growth'),
('engineering',
 'Engineering',
 'Streamline engineering workflows: standups, code review, architecture decisions, incident response, and technical writing. A second pair of eyes on the daily work and a patient explainer of unfamiliar codebases.',
 null,
 'Open Claude Cowork. Plugins. Anthropic & Partners. Search "Engineering". Install.',
 'Ask Claude to review a PR, draft an RFC, or write up an incident post-mortem.',
 'Review this pull request and flag anything that might break in production',
 'Engineering'),
('finance',
 'Finance',
 'Streamline finance and accounting workflows, from journal entries and reconciliation to financial statements. Useful for month-end close, budgeting, and board reporting.',
 null,
 'Open Claude Cowork. Plugins. Anthropic & Partners. Search "Finance". Install.',
 'Ask Claude to build a budget, reconcile a ledger, or summarise a set of invoices.',
 'Build a Q3 budget forecast from last quarter''s actuals',
 'Finance'),
('product-management',
 'Product management',
 'Write feature specs, plan roadmaps, and synthesise user research faster. Keep stakeholders updated and stay close to the actual customer problem rather than the internal noise.',
 null,
 'Open Claude Cowork. Plugins. Anthropic & Partners. Search "Product management". Install.',
 'Ask Claude to draft a PRD, synthesise user interviews, or write a stakeholder update.',
 'Draft a PRD for a new supplier dashboard feature, based on these interview notes',
 'Product'),
('operations',
 'Operations',
 'Optimise business operations: vendor management, process documentation, change management, capacity planning. Useful for any ops team coordinating across functions.',
 null,
 'Open Claude Cowork. Plugins. Anthropic & Partners. Search "Operations". Install.',
 'Ask Claude to document a process, audit a vendor contract, or plan capacity for next quarter.',
 'Document our supplier onboarding process end to end',
 'Operations');

update plugins
set contributor_id = null
where slug in (
  'marketing','productivity','design','data','engineering','finance','product-management','operations'
);
