-- Seed quiz questions for existing content

-- Journey steps (23)
insert into content_questions (content_type, content_key, question, options, correct_index) values
('journey_step','install-claude-desktop','Where do you download Claude Desktop?',ARRAY['The Mac App Store','claude.ai/download','A Homebrew cask','GitHub releases'],1),
('journey_step','install-claude-code','Which command installs Claude Code globally?',ARRAY['brew install claude-code','pip install claude-code','npm install -g @anthropic-ai/claude-code','curl claude.ai | sh'],2),
('journey_step','install-wispr-flow','Which key do you hold to dictate with Wispr Flow?',ARRAY['Cmd','Spacebar','Option','Fn'],3),
('journey_step','install-claude-chrome','What can Claude for Chrome see after install?',ARRAY['Only the URL of your current tab','The content of whatever tab you are on','All tabs across all windows','Nothing until you paste a screenshot'],1),
('journey_step','install-starter-skills','Which two starter skills does the journey recommend enabling first?',ARRAY['pdf and xlsx','docx and pptx','frontend-design and skill-creator','code-writer and web-browser'],2),
('journey_step','read-anthropic-research','How does the journey describe anthropic.com/research?',ARRAY['A news aggregator','The highest signal-per-hour in the industry','A marketing-heavy blog','Paywalled content'],1),
('journey_step','walkthrough-attention-paper','What year was Attention Is All You Need published?',ARRAY['2015','2017','2019','2021'],1),
('journey_step','skim-claude-code-docs','Where do the official Claude Code docs live?',ARRAY['github.com/anthropics/claude-code','claude.ai/docs','docs.claude.com','anthropic.com/claude-code'],2),
('journey_step','article-cmu-ai-explained','According to primers like CMU''s, what broadly distinguishes machine learning from older rule-based software?',ARRAY['It needs the internet to function','It learns patterns from data rather than being explicitly programmed','It only runs on GPUs','It is always open-source'],1),
('journey_step','article-atlassian-ai-101','In a "basics of AI" glossary, what is a "model" most accurately described as?',ARRAY['A dataset','A trained function that maps inputs to outputs','A single large file on disk','A type of chatbot interface'],1),
('journey_step','article-mit-chatgpt-primer','MIT Sloan''s non-technical primer explains that ChatGPT-style models are best described as what?',ARRAY['Databases that look things up','Next-token predictors trained on lots of text','Rule-based chatbots','Search engines'],1),
('journey_step','article-claude-getting-started','The official "Get started with Claude" guide is hosted on which domain?',ARRAY['anthropic.com','claude.ai','support.claude.com','docs.anthropic.com'],2),
('journey_step','article-helena-beginner-guide','Who writes the "A beginner''s guide to using Claude" piece recommended in the journey?',ARRAY['Helena Di Biase','Simon Willison','Dan Shipper','Andrej Karpathy'],0),
('journey_step','video-3blue1brown-llms','How long is the 3Blue1Brown "Large Language Models, explained briefly" video?',ARRAY['Around 3 minutes','Around 7 minutes','Around 20 minutes','Around 45 minutes'],1),
('journey_step','video-hubspot-claude-tutorial','The HubSpot full Claude tutorial covers beginner-to-advanced in roughly how long?',ARRAY['5 minutes','19 minutes','45 minutes','Two hours'],1),
('journey_step','article-datacamp-claude-excel','The Claude for Excel add-in lets you do which of these inside a spreadsheet?',ARRAY['Ask Claude to explain why a formula is wrong','Run arbitrary Python','Deploy a website','Record your screen'],0),
('journey_step','article-substack-claude-powerpoint','What is the headline promise of the Claude PowerPoint add-in article?',ARRAY['It replaces PowerPoint entirely','It builds branded slides that respect your template','It only works for Keynote','It requires custom coding'],1),
('journey_step','article-deb-szabo-connectors','Deb Szabo''s connectors post describes connectors with which metaphor?',ARRAY['Plugins','Bridges','Keys','Pipes'],1),
('journey_step','article-mindstudio-gas-claude','MindStudio''s workspace automation post chains actions across which set of Google apps?',ARRAY['Gmail, Calendar, Sheets, Docs','Slides, Meet, Drive only','YouTube, Analytics, Ads','Search Console and Gemini'],0),
('journey_step','podcast-hardfork-chatgpt','Who hosts Hard Fork?',ARRAY['Ezra Klein and Dan Shipper','Kevin Roose and Casey Newton','Lex Fridman','Nathan Labenz and Erik Torenberg'],1),
('journey_step','podcast-examined-life-dan-shipper','Dan Shipper is best known as the founder of which publication?',ARRAY['Every','Stratechery','The Information','Platformer'],0),
('journey_step','podcast-ezra-klein-jack-clark','Jack Clark, the guest on the Ezra Klein episode, co-founded which company?',ARRAY['OpenAI','Anthropic','DeepMind','Cohere'],1),
('journey_step','course-cc-for-pms','Who teaches the Claude Code for Product Managers course?',ARRAY['Lenny Rachitsky','Carl Vellotti','Dan Shipper','Simon Willison'],1);

-- Plugins (5) — lookup by slug
insert into content_questions (content_type, content_key, question, options, correct_index)
select 'plugin', p.id::text, q.question, q.options, q.correct_index
from (values
  ('skill-creator','What file does the Skill Creator skill help you author?', ARRAY['README.md','SKILL.md','plugin.json','CLAUDE.md']::text[], 1),
  ('pdf','The PDF skill can do which of these on scanned pages?', ARRAY['Run OCR to make them searchable','Stream live video','Translate to audio','Re-encode as JPEG only']::text[], 0),
  ('xlsx','Which of these is a typical XLSX-skill task?', ARRAY['Building a forecast from raw numbers','Compiling a binary','Sending SMS','Deploying a website']::text[], 0),
  ('docx','Which Word feature is the DOCX skill specifically good at handling?', ARRAY['Embedding videos','Tables of contents and headings','Voice narration','Real-time co-editing']::text[], 1),
  ('pptx','The PPTX skill is designed primarily for which file type?', ARRAY['PowerPoint decks','Keynote decks','Google Slides only','PDF reports']::text[], 0)
) as q(slug, question, options, correct_index)
join plugins p on p.slug = q.slug;

-- Courses (13) — lookup by title
insert into content_questions (content_type, content_key, question, options, correct_index)
select 'course', c.id::text, q.question, q.options, q.correct_index
from (values
  ('AI Fluency: Framework & Foundations','Who produces the AI Fluency course?', ARRAY['Google','OpenAI','Anthropic','DeepLearning.AI']::text[], 2),
  ('Prompt Engineering Interactive Tutorial','How many hands-on Jupyter notebooks does the Prompt Engineering Interactive Tutorial contain?', ARRAY['Three','Six','Nine','Twelve']::text[], 2),
  ('Claude 101','Claude 101 is Anthropic''s what?', ARRAY['Paid certification programme','Free entry-level course','Developer-only bootcamp','Research fellowship']::text[], 1),
  ('Google AI Essentials','Google AI Essentials sits on which platform?', ARRAY['edX','Coursera','Udemy','Skillshare']::text[], 1),
  ('Elements of AI','Which university produced Elements of AI?', ARRAY['University of Helsinki','MIT','Stanford','Oxford']::text[], 0),
  ('Introduction to Claude Cowork','Who is the Introduction to Claude Cowork course aimed at?', ARRAY['Non-developers','Compiler engineers','Data scientists only','Mobile devs']::text[], 0),
  ('Introduction to Agent Skills','Agent Skills are best described as what?', ARRAY['Reusable packaged workflows','Hosted chatbots','Voice interfaces','Billing plans']::text[], 0),
  ('Claude Code in Action','About how long is the Claude Code in Action course?', ARRAY['Ten minutes','One hour','Four hours','A full day']::text[], 1),
  ('Building with the Claude API','Building with the Claude API is roughly how long?', ARRAY['One hour','Three hours','Eight hours or more','Thirty hours']::text[], 2),
  ('Introduction to Model Context Protocol (MCP)','MCP is short for what?', ARRAY['Managed Cloud Pipeline','Model Context Protocol','Multi-Cluster Proxy','Machine Control Plane']::text[], 1),
  ('Agentic AI with Andrew Ng','Which platform hosts Andrew Ng''s Agentic AI course?', ARRAY['Coursera','Udacity','DeepLearning.AI','edX']::text[], 2),
  ('CS50''s Introduction to Artificial Intelligence with Python','Which institution teaches CS50 AI?', ARRAY['MIT','Harvard','Stanford','Caltech']::text[], 1),
  ('Claude Code for Product Managers','The Claude Code for Product Managers course requires roughly how many hours?', ARRAY['One to two','Four to five','Ten to twelve','Thirty or more']::text[], 2)
) as q(title, question, options, correct_index)
join courses c on c.title = q.title;

-- Articles — lookup by URL (exact match)
insert into content_questions (content_type, content_key, question, options, correct_index)
select 'article', a.id::text, q.question, q.options, q.correct_index
from (values
  -- Original 7 articles
  ('https://karpathy.medium.com/software-2-0-a64152b37c35','Karpathy''s "Software 2.0" argues that programming the next generation of software means what?', ARRAY['Writing more hand-crafted code','Curating datasets and letting models learn','Using only functional languages','Relying on no-code tools']::text[], 1),
  ('https://www.youtube.com/watch?v=zjkBMFhNj_g','Roughly how long is Karpathy''s "Intro to Large Language Models" talk?', ARRAY['Ten minutes','One hour','Three hours','Five hours']::text[], 1),
  ('https://www.youtube.com/watch?v=bZQun8Y4L2A','Karpathy''s "State of GPT" was delivered at which event?', ARRAY['NeurIPS','Microsoft Build','Google I/O','WWDC']::text[], 1),
  ('https://www.youtube.com/watch?v=kCc8FmEb1nY','In Karpathy''s "Let''s build GPT from scratch", what are you actually building?', ARRAY['A transformer in Python','A reinforcement-learning agent','A CNN for image classification','A database']::text[], 0),
  ('https://karpathy.github.io/2019/04/25/recipe/','Karpathy''s "Recipe for Training Neural Networks" is essentially what kind of piece?', ARRAY['A marketing post','A debugging playbook','A product launch','A historical essay']::text[], 1),
  ('https://www.anthropic.com/research/building-effective-agents','Anthropic''s "Building Effective Agents" recommends starting with what?', ARRAY['The simplest approach that works','A multi-agent framework','A custom fine-tuned model','A full vector database stack']::text[], 0),
  ('https://www.anthropic.com/engineering/claude-code-best-practices','"Claude Code Best Practices" is written by teams at which company?', ARRAY['OpenAI','Anthropic','Google DeepMind','Meta AI']::text[], 1),
  -- 9 Agent architecture articles
  ('https://www.anthropic.com/engineering/managed-agents','"Scaling Managed Agents" argues for separating what from what?', ARRAY['Frontend from backend','Planning from execution','Training from inference','Input from output']::text[], 1),
  ('https://www.anthropic.com/research/trustworthy-agents','"Trustworthy agents in practice" primarily addresses what?', ARRAY['Agent UI design','How agents handle ambiguity and failure','Model pricing','GPU procurement']::text[], 1),
  ('https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents','Why does "Demystifying evals" say agents need different evaluation?', ARRAY['Traditional benchmarks don''t capture agent behaviour','Because latency is the only metric','Because tokens are expensive','Because users refuse surveys']::text[], 0),
  ('https://blog.langchain.com/the-anatomy-of-an-agent-harness','"The Anatomy of an Agent Harness" is from which publisher?', ARRAY['OpenAI','LangChain','LlamaIndex','Pinecone']::text[], 1),
  ('https://magazine.sebastianraschka.com/p/components-of-a-coding-agent','Who writes "Components of a Coding Agent"?', ARRAY['Sebastian Raschka','Simon Willison','Andrej Karpathy','Jeremy Howard']::text[], 0),
  ('https://www.hlyr.dev/blog/skill-issue-harness-engineering-for-coding-agents','The core argument of "Skill Issue: Harness Engineering" is that what matters more than the model?', ARRAY['The UI theme','The harness around the model','The company brand','The GPU generation']::text[], 1),
  ('https://www.bassimeledath.com/blog/levels-of-agentic-engineering','"The 8 Levels of Agentic Engineering" is framed as what?', ARRAY['A taxonomy of model sizes','A ladder benchmarking how far an org has gone','A pricing guide','A hardware roadmap']::text[], 1),
  ('https://simonwillison.net/guides/agentic-engineering-patterns/what-is-agentic-engineering/','Who authors "What is agentic engineering?"', ARRAY['Simon Willison','Sebastian De Deyne','Swyx','Dwarkesh Patel']::text[], 0),
  ('https://sebastiandedeyne.com/agent-responsibly/','"Agent Responsibly" is about what?', ARRAY['Legal liability','Giving agents just enough autonomy without catastrophic failures','Fine-tuning for politeness','Pricing agent usage']::text[], 1),
  -- 20 Start Here articles
  ('https://code.claude.com/docs/en/overview','What is the Claude Code Overview page?', ARRAY['A community forum','The official docs landing page','A paid tier description','A GitHub README']::text[], 1),
  ('https://www.nxcode.io/resources/news/claude-code-tutorial-beginners-guide-2026','The NxCode tutorial is pitched at which audience?', ARRAY['Beginners','Only senior engineers','Only data scientists','PhD researchers']::text[], 0),
  ('https://paulgp.substack.com/p/getting-started-with-claude-code','Paul Goldsmith-Pinkham''s Claude Code guide is written from which perspective?', ARRAY['A sales rep','A researcher','A journalist','A lawyer']::text[], 1),
  ('https://www.datacamp.com/tutorial/claude-code','The DataCamp Claude Code tutorial is written by whom?', ARRAY['Bex Tuychiev','Dario Amodei','Swyx','Andrew Ng']::text[], 0),
  ('https://neuraplus-ai.github.io/blog/how-to-use-anthropic-claude-for-blogging.html','The NeuraPulse Claude-for-blogging guide is tagged as which year''s full guide?', ARRAY['2024','2025','2026','2027']::text[], 2),
  ('https://www.anthropic.com/product/claude-cowork','Claude Cowork is what kind of product?', ARRAY['A mobile app','A desktop agent that works with your files','A command-line utility','A cloud IDE']::text[], 1),
  ('https://www.datacamp.com/tutorial/claude-cowork-tutorial','DataCamp''s Cowork tutorial mainly shows what?', ARRAY['Pricing plans','A step-by-step tour with screenshots','Source-code internals','API benchmarks']::text[], 1),
  ('https://venturebeat.com/technology/anthropic-launches-cowork-a-claude-desktop-agent-that-works-in-your-files-no','Which publication covered the Cowork launch as a "Claude Desktop agent that works in your files"?', ARRAY['The Verge','VentureBeat','TechCrunch','Wired']::text[], 1),
  ('https://claude.com/blog/skills','"Introducing Agent Skills" is the official announcement from which company?', ARRAY['OpenAI','Anthropic','Google','Meta']::text[], 1),
  ('https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills','"Equipping Agents for the Real World with Agent Skills" is which kind of post?', ARRAY['Marketing','Engineering','HR','Legal']::text[], 1),
  ('https://simonw.substack.com/p/claude-skills-are-awesome-maybe-a','Simon Willison argues skills might be a bigger deal than what?', ARRAY['Python','MCP','RAG','Fine-tuning']::text[], 1),
  ('https://medium.com/@tort_mario/skills-for-claude-code-the-ultimate-guide-from-an-anthropic-engineer-bcd66faaa2d6','Mario Tort''s long-form skills guide is written by what kind of author?', ARRAY['A marketing lead','An Anthropic engineer','A journalist','A professor']::text[], 1),
  ('https://medium.com/@AdithyaGiridharan/anthropic-just-released-a-32-page-playbook-for-building-claude-skills-heres-what-you-need-to-b86fe0b123ae','How long is the Anthropic playbook for building skills that this article summarises?', ARRAY['8 pages','16 pages','32 pages','64 pages']::text[], 2),
  ('https://code.claude.com/docs/en/discover-plugins','What does the "Discover and install prebuilt plugins" docs page cover?', ARRAY['Browsing and installing from the plugin marketplace','Pricing','API rate limits','Sign-in options']::text[], 0),
  ('https://www.datacamp.com/tutorial/how-to-build-claude-code-plugins','The DataCamp plugin guide walks you through what?', ARRAY['Installing existing plugins','Building your own plugin end-to-end','Removing plugins','Paid plugin marketplaces only']::text[], 1),
  ('https://code.claude.com/docs/en/best-practices','The official Claude Code Best Practices is hosted on which domain?', ARRAY['anthropic.com','claude.ai','code.claude.com','docs.claude.com']::text[], 2),
  ('https://www.anthropic.com/engineering/multi-agent-research-system','Anthropic''s multi-agent research system post focuses on what angle?', ARRAY['The sales pitch','How it was architected, including failure modes','Recruiting','Pricing tiers']::text[], 1),
  ('https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk','The "Building agents with the Claude Agent SDK" post is a deep dive into what?', ARRAY['Marketing strategy','The Claude Agent SDK','Investor relations','Hardware benchmarks']::text[], 1),
  ('https://01.me/en/2025/12/context-engineering-from-claude/','Bojie Li''s context engineering post is based on patterns learned from which company?', ARRAY['OpenAI','Anthropic','Google','Mistral']::text[], 1),
  ('https://www.darioamodei.com/essay/machines-of-loving-grace','"Machines of Loving Grace" is an essay by whom?', ARRAY['Sam Altman','Dario Amodei','Demis Hassabis','Yann LeCun']::text[], 1),
  -- 10 Podcasts (as articles)
  ('https://open.spotify.com/show/3bz8jF49EasFo2YZVOQDUW','AI + a16z is produced by which firm?', ARRAY['Sequoia','Andreessen Horowitz','Benchmark','Kleiner Perkins']::text[], 1),
  ('https://open.spotify.com/show/2IqXAVFR4e0Bmyjsdc8QzF','Which of these is NOT a regular host of All-In?', ARRAY['Chamath Palihapitiya','Jason Calacanis','David Sacks','Kara Swisher']::text[], 3),
  ('https://open.spotify.com/show/4JH4tybY1zX6e5hjCwU6gF','Who hosts the Dwarkesh Podcast?', ARRAY['Dwarkesh Patel','Dan Shipper','Lenny Rachitsky','Lex Fridman']::text[], 0),
  ('https://open.spotify.com/show/2p7zZVwVF6Yk0Zsb4QmT7t','Latent Space is billed as which kind of podcast?', ARRAY['A product-management podcast','The AI Engineer podcast','A VC podcast','A daily news podcast']::text[], 1),
  ('https://open.spotify.com/show/0O65xhqvGVhpgdIrrdlEYk','No Priors is co-hosted by Sarah Guo and who?', ARRAY['Elad Gil','Naval Ravikant','Chamath Palihapitiya','Reid Hoffman']::text[], 0),
  ('https://open.spotify.com/show/2MAi0BvDc6GTFvKFPXnkCL','Lex Fridman''s podcast is best known for which format?', ARRAY['Five-minute clips','Long-form interviews','Panel debates','Audio-only news briefs']::text[], 1),
  ('https://open.spotify.com/show/44fllCS2FTFr2x2kjP9xeT','Hard Fork is produced in partnership with which publication?', ARRAY['The Wall Street Journal','The New York Times','The Guardian','Bloomberg']::text[], 1),
  ('https://open.spotify.com/show/2dR1MUZEHCOnz1LVfNac0j','Lenny''s Podcast is hosted by whom?', ARRAY['Lenny Rachitsky','Lenny Kravitz','Lenny Bruce','Lenny Dykstra']::text[], 0),
  ('https://open.spotify.com/show/7gKwwMLFLc6RmjmRpbMtEO','The AI Daily Brief is hosted by Nathaniel Whittemore, better known online as what?', ARRAY['NLW','NPW','NWL','NWB']::text[], 0),
  ('https://open.spotify.com/show/6yHyok3M3BjqzR0VB5MSyk','The Cognitive Revolution is co-hosted by Nathan Labenz and who?', ARRAY['Erik Torenberg','Tyler Cowen','Patrick Collison','Sriram Krishnan']::text[], 0)
) as q(url, question, options, correct_index)
join articles a on a.url = q.url;
