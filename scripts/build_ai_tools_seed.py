#!/usr/bin/env python3
"""
Build the AI Tools seed migrations from the Notion field guide.

Inputs:
  - The cached Notion fetch (a JSON file from notion-fetch MCP tool)
    Default path is the cache produced when this feature was built; pass
    --notion <path> to point at a fresh fetch.

Outputs:
  - supabase/migrations/20260428000002_seed_ai_tools.sql
  - supabase/migrations/20260428000003_seed_ai_tool_quiz_questions.sql

Run:
  python3 scripts/build_ai_tools_seed.py
  python3 scripts/build_ai_tools_seed.py --notion /path/to/cache.txt
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_NOTION_CACHE = Path(
    "/Users/cr/.claude/projects/-Users-cr-Desktop-Ai-Skills-Warehouse/"
    "059c4e42-1f46-4d3a-9a81-83f236bb364e/tool-results/"
    "mcp-a06fde73-7471-4ef2-b6bf-5ca711d445ca-notion-fetch-1777300539871.txt"
)
OUT_TOOLS = REPO_ROOT / "supabase/migrations/20260428000002_seed_ai_tools.sql"
OUT_QUIZ = REPO_ROOT / "supabase/migrations/20260428000003_seed_ai_tool_quiz_questions.sql"

# ---------------------------------------------------------------------------
# Catalogue: order, category, slug, and the matching heading text in Notion.
# `heading_match` is what comes after `## ` (or `### `) in the source.
# ---------------------------------------------------------------------------

CATEGORIES = [
    ("general-assistants", "General Assistants", 1),
    ("research-writing", "Research & Writing", 2),
    ("productivity", "Productivity", 3),
    ("dev-no-code", "Dev & No-Code", 4),
    ("content-creation", "Content Creation", 5),
    ("visuals-audio", "Visuals & Audio", 6),
    ("automation", "Automation", 7),
    ("coding-development", "Coding & Development", 8),
]

# Tool catalogue (slug, display_title, category_slug, display_order, heading_match, level)
# `heading_match` is matched as a prefix of the heading line.
# `level` is 2 for `##` and 3 for `###`.
TOOLS: list[dict[str, Any]] = [
    # 1. General Assistants
    {"slug": "claude", "title": "Claude", "cat": "general-assistants", "order": 1,
     "match": "Claude", "level": 2},

    # 2. Research & Writing
    {"slug": "chatgpt", "title": "ChatGPT", "cat": "research-writing", "order": 1,
     "match": "ChatGPT", "level": 2},
    {"slug": "perplexity", "title": "Perplexity", "cat": "research-writing", "order": 2,
     "match": "Perplexity", "level": 2},
    {"slug": "gemini", "title": "Gemini", "cat": "research-writing", "order": 3,
     "match": "Gemini", "level": 2},
    {"slug": "notebooklm", "title": "NotebookLM", "cat": "research-writing", "order": 4,
     "match": "NotebookLM", "level": 2},
    {"slug": "grammarly", "title": "Grammarly", "cat": "research-writing", "order": 5,
     "match": "Grammarly", "level": 2},

    # 3. Productivity
    {"slug": "notion", "title": "Notion", "cat": "productivity", "order": 1,
     "match": "Notion", "level": 2},
    {"slug": "otio", "title": "Otio", "cat": "productivity", "order": 2,
     "match": "Otio", "level": 2},
    {"slug": "wispr-flow", "title": "Wispr Flow", "cat": "productivity", "order": 3,
     "match": "Wispr (Wispr Flow)", "level": 2},
    {"slug": "manus", "title": "Manus", "cat": "productivity", "order": 4,
     "match": "Manus", "level": 2},

    # 4. Dev & No-Code
    {"slug": "cursor", "title": "Cursor", "cat": "dev-no-code", "order": 1,
     "match": "Cursor", "level": 2},
    {"slug": "lovable", "title": "Lovable", "cat": "dev-no-code", "order": 2,
     "match": "Lovable", "level": 2},
    {"slug": "replit", "title": "Replit", "cat": "dev-no-code", "order": 3,
     "match": "Replit", "level": 2},
    {"slug": "base44", "title": "Base44", "cat": "dev-no-code", "order": 4,
     "match": "Base44", "level": 2},
    {"slug": "emergent", "title": "Emergent", "cat": "dev-no-code", "order": 5,
     "match": "Emergent", "level": 2},

    # 5. Content Creation
    {"slug": "heygen", "title": "HeyGen", "cat": "content-creation", "order": 1,
     "match": "HeyGen", "level": 2},
    {"slug": "synthesia", "title": "Synthesia", "cat": "content-creation", "order": 2,
     "match": "Synthesia", "level": 2},
    {"slug": "descript", "title": "Descript", "cat": "content-creation", "order": 3,
     "match": "Descript", "level": 2},
    {"slug": "opus-clip", "title": "Opus Clip", "cat": "content-creation", "order": 4,
     "match": "Opus Clip", "level": 2},
    {"slug": "beehiiv", "title": "Beehiiv", "cat": "content-creation", "order": 5,
     "match": "Beehiiv", "level": 2},
    {"slug": "gamma", "title": "Gamma", "cat": "content-creation", "order": 6,
     "match": "Gamma", "level": 2},
    {"slug": "chatbase", "title": "Chatbase", "cat": "content-creation", "order": 7,
     "match": "Chatbase", "level": 2},

    # 6. Visuals & Audio
    {"slug": "midjourney", "title": "Midjourney", "cat": "visuals-audio", "order": 1,
     "match": "Midjourney", "level": 2},
    {"slug": "runway", "title": "Runway", "cat": "visuals-audio", "order": 2,
     "match": "Runway", "level": 2},
    {"slug": "kling", "title": "Kling", "cat": "visuals-audio", "order": 3,
     "match": "Kling", "level": 2},
    {"slug": "flora", "title": "Flora", "cat": "visuals-audio", "order": 4,
     "match": "Flora", "level": 2},
    {"slug": "higgsfield", "title": "Higgsfield", "cat": "visuals-audio", "order": 5,
     "match": "Higgsfield", "level": 2},
    {"slug": "veo", "title": "Veo", "cat": "visuals-audio", "order": 6,
     "match": "Veo", "level": 2},
    {"slug": "elevenlabs", "title": "ElevenLabs", "cat": "visuals-audio", "order": 7,
     "match": "ElevenLabs", "level": 2},
    {"slug": "suno", "title": "Suno", "cat": "visuals-audio", "order": 8,
     "match": "Suno", "level": 2},
    {"slug": "artlist", "title": "Artlist", "cat": "visuals-audio", "order": 9,
     "match": "Artlist", "level": 2},

    # 7. Automation
    {"slug": "canva", "title": "Canva", "cat": "automation", "order": 1,
     "match": "Canva", "level": 2},
    {"slug": "figma", "title": "Figma", "cat": "automation", "order": 2,
     "match": "Figma", "level": 2},
    {"slug": "designs-ai", "title": "Designs.ai", "cat": "automation", "order": 3,
     "match": "[Designs.ai]", "level": 2},
    {"slug": "lindy", "title": "Lindy", "cat": "automation", "order": 4,
     "match": "Lindy", "level": 2},
    {"slug": "n8n", "title": "n8n", "cat": "automation", "order": 5,
     "match": "n8n", "level": 2},
    {"slug": "make", "title": "Make", "cat": "automation", "order": 6,
     "match": "Make", "level": 2},
    {"slug": "zapier", "title": "Zapier", "cat": "automation", "order": 7,
     "match": "Zapier", "level": 2},
    {"slug": "apollo", "title": "Apollo", "cat": "automation", "order": 8,
     "match": "Apollo (", "level": 2},
    {"slug": "clay", "title": "Clay", "cat": "automation", "order": 9,
     "match": "Clay", "level": 2},
    {"slug": "apify", "title": "Apify", "cat": "automation", "order": 10,
     "match": "Apify", "level": 2},

    # 8. Coding & Development
    {"slug": "vs-code", "title": "Visual Studio Code", "cat": "coding-development", "order": 1,
     "match": "Visual Studio Code (VS Code)", "level": 2},
    {"slug": "claude-code", "title": "Claude Code", "cat": "coding-development", "order": 2,
     "match": "Claude Code", "level": 2},
    {"slug": "awesome-claude-plugins", "title": "awesome-claude-plugins",
     "cat": "coding-development", "order": 3,
     "match": "awesome-claude-plugins", "level": 3},
    {"slug": "skills-sh", "title": "skills.sh", "cat": "coding-development", "order": 4,
     "match": "[skills.sh]", "level": 3},
]

# ---------------------------------------------------------------------------
# Hand-authored quiz questions, usage-focused per the user's brief: every
# question tests "what does it do / how would you use it", not founding trivia.
# ---------------------------------------------------------------------------

QUIZZES: dict[str, dict[str, Any]] = {
    "claude": {
        "q": "You need to read a 100-page deal contract and surface the riskiest clauses for legal. Which Claude strength is doing the heavy lifting?",
        "opts": [
            "Real-time image generation from the contract pages",
            "Long-context document analysis with nuanced reasoning",
            "Live web search across legal databases",
            "Voice transcription of the negotiation calls",
        ],
        "correct": 1,
    },
    "chatgpt": {
        "q": "What's the right ChatGPT feature to keep your brand voice consistent across many separate chats?",
        "opts": [
            "Re-paste the brand guide into every new conversation",
            "Use Custom Instructions or a Project so context auto-loads",
            "Train a private fine-tuned model from the dashboard",
            "Switch to a different model for each chat",
        ],
        "correct": 1,
    },
    "perplexity": {
        "q": "When would you reach for Perplexity instead of a generic chatbot?",
        "opts": [
            "When you need an answer with cited, verifiable sources",
            "When you want to generate brand photography",
            "When you need to draft legal contracts offline",
            "When you need to render a 3D product mockup",
        ],
        "correct": 0,
    },
    "gemini": {
        "q": "Which workflow plays to Gemini's strengths inside Google Workspace?",
        "opts": [
            "Compiling iOS apps in the cloud",
            "Replacing your CRM database",
            "Drafting in Docs, summarising Gmail threads, and analysing Sheets",
            "Hosting podcasts as audio files",
        ],
        "correct": 2,
    },
    "notebooklm": {
        "q": "What is NotebookLM uniquely good at?",
        "opts": [
            "Generating product photos from a brief",
            "Grounding answers in only the documents you upload, with citations",
            "Running paid ad campaigns end-to-end",
            "Building Notion databases for you",
        ],
        "correct": 1,
    },
    "grammarly": {
        "q": "Beyond fixing typos, what does the modern Grammarly help marketing teams with?",
        "opts": [
            "Tone, clarity and on-brand rewrites across email, docs and Slack",
            "Generating Midjourney prompts",
            "Auto-translating videos into 30 languages",
            "Spinning up Supabase databases",
        ],
        "correct": 0,
    },
    "notion": {
        "q": "What is Notion AI Q&A best at?",
        "opts": [
            "Editing video clips in the browser",
            "Answering plain-English questions across your entire workspace and connected apps",
            "Running paid Meta ad campaigns",
            "Generating brand photoshoots",
        ],
        "correct": 1,
    },
    "otio": {
        "q": "Which problem does Otio specifically solve?",
        "opts": [
            "Sending bulk cold emails",
            "Building landing pages",
            "Speeding up research by ingesting PDFs, links and videos and producing notes you can cite",
            "Running multi-step Zapier flows",
        ],
        "correct": 2,
    },
    "wispr-flow": {
        "q": "How do you actually use Wispr Flow during work?",
        "opts": [
            "Speak naturally and it transcribes plus auto-formats clean text into whatever app you're in",
            "Drag video files in to get a script",
            "Type prompts to render images",
            "Connect it to ad accounts to push budgets",
        ],
        "correct": 0,
    },
    "manus": {
        "q": "What kind of task is Manus designed to take off your plate?",
        "opts": [
            "Writing a single tweet",
            "Running multi-step agentic workflows that browse, fill forms and produce artefacts",
            "Editing raw camera RAW files",
            "Hosting your company wiki",
        ],
        "correct": 1,
    },
    "cursor": {
        "q": "What is Cursor, in one sentence?",
        "opts": [
            "A no-code site builder",
            "An AI-native fork of VS Code where you can prompt edits across multiple files",
            "A Figma plugin that exports React",
            "A serverless database",
        ],
        "correct": 1,
    },
    "lovable": {
        "q": "Who is Lovable mainly built for?",
        "opts": [
            "Senior backend engineers writing distributed systems",
            "Hardware engineers designing chips",
            "Non-engineers (PMs, marketers, founders) shipping working web apps from a prompt",
            "Game studios making AAA titles",
        ],
        "correct": 2,
    },
    "replit": {
        "q": "What does Replit Agent let you do that a normal IDE doesn't?",
        "opts": [
            "Describe an app in plain English and have it scaffold, code and deploy it in the browser",
            "Send marketing emails",
            "Generate radio ads",
            "Manage your CRM pipeline",
        ],
        "correct": 0,
    },
    "base44": {
        "q": "Where does Base44 sit in the stack?",
        "opts": [
            "It's a video editor",
            "It's a no-code AI app builder for internal tools, where you describe a tool and get a working app with auth and a database",
            "It's a GPU-rental marketplace",
            "It's an SEO crawler",
        ],
        "correct": 1,
    },
    "emergent": {
        "q": "Which problem does Emergent target?",
        "opts": [
            "Pure prompt-to-app generation aimed at non-technical operators who want full-stack apps without touching code",
            "Translating subtitles for streaming platforms",
            "Rendering 3D product shots",
            "Mixing music masters",
        ],
        "correct": 0,
    },
    "heygen": {
        "q": "What does HeyGen let a marketing team produce quickly?",
        "opts": [
            "Spreadsheet macros",
            "AI-avatar videos and translated lip-synced versions of existing footage at scale",
            "Lo-fi music tracks",
            "Cold-email sequences",
        ],
        "correct": 1,
    },
    "synthesia": {
        "q": "What's the typical Synthesia use case in an enterprise?",
        "opts": [
            "Studio-quality avatar videos for training, internal comms and localised explainers — without filming",
            "Procedural generation of game levels",
            "Designing print magazine layouts",
            "Running A/B tests on landing pages",
        ],
        "correct": 0,
    },
    "descript": {
        "q": "What's Descript's signature trick?",
        "opts": [
            "Edit audio and video by editing the transcript like a Word doc, including 'um' removal",
            "Compile Swift code in the browser",
            "Run Meta Ads at scale",
            "Send transactional emails",
        ],
        "correct": 0,
    },
    "opus-clip": {
        "q": "What does Opus Clip do for long-form video?",
        "opts": [
            "Hosts your video files for free",
            "Watches it and auto-cuts the most engaging short-form clips with captions and reframing",
            "Translates the script into 50 languages",
            "Adds royalty-free music masters",
        ],
        "correct": 1,
    },
    "beehiiv": {
        "q": "Beyond sending emails, what does Beehiiv add for newsletter operators?",
        "opts": [
            "Built-in monetisation, growth tools and audience analytics tailored to creator newsletters",
            "Procedural 3D modelling",
            "Cold outbound sales sequences",
            "Replaces your CRM",
        ],
        "correct": 0,
    },
    "gamma": {
        "q": "What's Gamma best for?",
        "opts": [
            "Running webinar broadcasts",
            "Drafting decks, docs and webpages from a prompt with on-brand styling baked in",
            "Editing podcasts",
            "Sending bulk SMS",
        ],
        "correct": 1,
    },
    "chatbase": {
        "q": "Where would you deploy Chatbase?",
        "opts": [
            "As a CI/CD runner for your repo",
            "As a custom AI chatbot trained on your docs/site, embedded for support or lead-gen",
            "As a video editor for shorts",
            "As a payment processor",
        ],
        "correct": 1,
    },
    "midjourney": {
        "q": "What is Midjourney best known for in 2026?",
        "opts": [
            "Compiling iOS apps",
            "Aesthetically strong, brand-quality still images from natural-language prompts",
            "Running paid ad placements",
            "Hosting your assets on a CDN",
        ],
        "correct": 1,
    },
    "runway": {
        "q": "What category does Runway own?",
        "opts": [
            "Generative video — text-to-video, video-to-video, and AI-driven editing tools",
            "ESLint plugins for TypeScript",
            "Database migrations",
            "Email deliverability",
        ],
        "correct": 0,
    },
    "kling": {
        "q": "When would you choose Kling for a campaign?",
        "opts": [
            "When you need realistic AI video clips with good motion and physics for product or ad work",
            "When you need to debug Python",
            "When you need to send a newsletter",
            "When you need to score a podcast",
        ],
        "correct": 0,
    },
    "flora": {
        "q": "What makes Flora different from a normal generation tool?",
        "opts": [
            "It's a CRM",
            "It's a node-based, infinite canvas where image, video and text models compose into a creative workflow",
            "It's a podcast host",
            "It's a no-code form builder",
        ],
        "correct": 1,
    },
    "higgsfield": {
        "q": "What does Higgsfield specialise in?",
        "opts": [
            "Cinematic AI video with strong camera control (motion, lenses, character consistency)",
            "Bookkeeping",
            "PDF parsing",
            "Slack notifications",
        ],
        "correct": 0,
    },
    "veo": {
        "q": "What is Google's Veo built for?",
        "opts": [
            "Compressing files in the cloud",
            "High-fidelity, longer-form generative video with strong prompt adherence and audio",
            "Editing spreadsheets",
            "Reading scientific papers",
        ],
        "correct": 1,
    },
    "elevenlabs": {
        "q": "What's the canonical ElevenLabs use case for marketing?",
        "opts": [
            "Designing logos",
            "Cloning voices and producing on-brand voiceovers and dubs across languages",
            "Routing inbound phone calls",
            "Fine-tuning LLMs",
        ],
        "correct": 1,
    },
    "suno": {
        "q": "What does Suno generate?",
        "opts": [
            "Full original songs, with vocals and lyrics, from a text prompt",
            "Marketing dashboards",
            "PDF reports",
            "Customer support tickets",
        ],
        "correct": 0,
    },
    "artlist": {
        "q": "What is Artlist primarily a source of?",
        "opts": [
            "Royalty-free music, SFX, footage and AI tools licensed for commercial use",
            "Influencer outreach contacts",
            "Print-on-demand fulfilment",
            "Stock options for startups",
        ],
        "correct": 0,
    },
    "canva": {
        "q": "Why is Canva listed as an AI tool, not just a design tool?",
        "opts": [
            "It only does AI image generation now",
            "Magic Studio adds AI generation, resizing, on-brand templates and bulk-create across formats inside one workspace",
            "It's a code IDE",
            "It hosts your domains",
        ],
        "correct": 1,
    },
    "figma": {
        "q": "Which Figma capability best matches an AI workflow?",
        "opts": [
            "Generating brand-aware UI mockups, variants and copy via Figma AI inside the design file",
            "Running paid social",
            "Sending invoices",
            "Encoding video for streaming",
        ],
        "correct": 0,
    },
    "designs-ai": {
        "q": "What does Designs.ai try to be?",
        "opts": [
            "A SQL editor",
            "An all-in-one creative suite — logos, video, voice, copy, mockups — generated from a prompt",
            "A monitoring tool for servers",
            "An online whiteboard for engineering",
        ],
        "correct": 1,
    },
    "lindy": {
        "q": "What is Lindy?",
        "opts": [
            "A video host",
            "An AI-employee builder where each Lindy is a persistent agent that handles a job (inbox triage, scheduling, sales follow-up)",
            "A pixel art editor",
            "A storage CDN",
        ],
        "correct": 1,
    },
    "n8n": {
        "q": "Why pick n8n over Zapier for an AI-heavy workflow?",
        "opts": [
            "It's open-source and self-hostable, with native AI/LLM nodes and far more control over logic",
            "It runs on your phone only",
            "It's a database, not a workflow tool",
            "It's a video editor",
        ],
        "correct": 0,
    },
    "make": {
        "q": "What's the Make sweet spot?",
        "opts": [
            "Running iOS app builds",
            "Visual, scenario-based automations with branching logic and rich data transformations between hundreds of apps",
            "Hosting podcasts",
            "Encrypting files at rest",
        ],
        "correct": 1,
    },
    "zapier": {
        "q": "When is Zapier still the right pick?",
        "opts": [
            "When you need the broadest catalogue of app integrations and the simplest trigger-action flows for non-technical operators",
            "When you need a code IDE",
            "When you need to render 3D scenes",
            "When you need to hand-edit DNS records",
        ],
        "correct": 0,
    },
    "apollo": {
        "q": "What is Apollo.io for?",
        "opts": [
            "A B2B sales platform — find prospects from a giant contact database and run multi-channel outbound sequences",
            "Encoding video for OTT",
            "Building dashboards from CSV files",
            "A drawing app for whiteboards",
        ],
        "correct": 0,
    },
    "clay": {
        "q": "What does Clay let GTM teams do that a CRM doesn't?",
        "opts": [
            "Enrich any list of accounts/contacts from 100+ sources and run AI research per row at scale",
            "Edit marketing videos",
            "Replace your data warehouse",
            "Host a customer-facing chatbot",
        ],
        "correct": 0,
    },
    "apify": {
        "q": "What is Apify?",
        "opts": [
            "A music generator",
            "A platform of pre-built and custom web scrapers (Actors) for extracting structured data at scale",
            "A CRM",
            "A WYSIWYG site builder",
        ],
        "correct": 1,
    },
    "vs-code": {
        "q": "Why does VS Code still belong on a 2026 AI-tools list?",
        "opts": [
            "It bundles a CRM",
            "It's the default host for Copilot, Continue, Cursor-style extensions and remote AI assistants — the IDE most AI dev tooling targets first",
            "It only runs on Linux servers",
            "It comes with a built-in design tool",
        ],
        "correct": 1,
    },
    "claude-code": {
        "q": "What is Claude Code, specifically?",
        "opts": [
            "A web-based no-code app builder",
            "Anthropic's terminal-native agentic coding CLI that can read your repo, run commands and write code across many files",
            "A SaaS analytics tool",
            "A video editor",
        ],
        "correct": 1,
    },
    "awesome-claude-plugins": {
        "q": "What is awesome-claude-plugins?",
        "opts": [
            "A curated community list of plugins / skills that extend Claude Code and Claude Cowork",
            "Anthropic's billing dashboard",
            "A model-training framework",
            "A design system",
        ],
        "correct": 0,
    },
    "skills-sh": {
        "q": "What does skills.sh distribute?",
        "opts": [
            "Stock video clips",
            "Installable, packaged skills (pre-built workflows) you can drop into Claude / Claude Code",
            "Cold-email templates",
            "Voiceover talent",
        ],
        "correct": 1,
    },
}

# Sanity: every tool has a quiz.
_missing = [t["slug"] for t in TOOLS if t["slug"] not in QUIZZES]
if _missing:
    raise SystemExit(f"Missing quizzes for: {_missing}")
assert len(QUIZZES) == len(TOOLS) == 45, (len(QUIZZES), len(TOOLS))


# ---------------------------------------------------------------------------
# Notion extraction
# ---------------------------------------------------------------------------

def load_notion_markdown(cache_path: Path) -> str:
    """The cache is a JSON array with one item: {type, text}. The `text`
    is itself a JSON-encoded blob whose `text` field is the actual markdown."""
    raw = json.loads(cache_path.read_text())
    inner = json.loads(raw[0]["text"])
    return inner["text"]


def extract_section(md: str, heading_match: str, level: int) -> str:
    """Return the body content of `## heading_match` (or `###`) up to the
    next heading at the same-or-higher level (or `---` page break)."""
    prefix = "#" * level + " "
    pattern = re.compile(
        r"^" + re.escape(prefix + heading_match) + r".*?$",
        re.MULTILINE,
    )
    m = pattern.search(md)
    if not m:
        raise SystemExit(f"Could not find heading: {prefix + heading_match!r}")
    start = m.end()

    # Find next heading at same or higher level, or `---`.
    higher_or_same = re.compile(
        r"^(?:" + r"|".join("#" * lv + " " for lv in range(1, level + 1)) + r"|---\s*$)",
        re.MULTILINE,
    )
    nxt = higher_or_same.search(md, start)
    end = nxt.start() if nxt else len(md)
    return md[start:end].strip("\n").strip()


_FOUNDED_RE = re.compile(r"^\s*[-*]\s*\*\*Founded:\*\*\s*(.+)$", re.MULTILINE)
_LINK_RE = re.compile(r"^\s*[-*]\s*\*\*Link:\*\*\s*\[([^\]]+)\]\(([^)]+)\).*$", re.MULTILINE)
# Some entries have plain text after **Link:** instead of a markdown link.
_LINK_RE_PLAIN = re.compile(r"^\s*[-*]\s*\*\*Link:\*\*\s*(.+)$", re.MULTILINE)


def parse_meta(body: str) -> tuple[str | None, str, str]:
    """Return (founded, url, body_without_meta_lines)."""
    founded_m = _FOUNDED_RE.search(body)
    founded = founded_m.group(1).strip() if founded_m else None

    url_m = _LINK_RE.search(body)
    if url_m:
        url = url_m.group(2).strip()
    else:
        url_m = _LINK_RE_PLAIN.search(body)
        if not url_m:
            raise SystemExit(f"No Link: in body:\n{body[:200]}")
        # Strip surrounding markdown if present.
        candidate = url_m.group(1).strip()
        # Pull URL out if wrapped in plain text.
        url_extract = re.search(r"https?://\S+", candidate)
        url = url_extract.group(0).rstrip(".,)") if url_extract else candidate

    cleaned_lines: list[str] = []
    for line in body.splitlines():
        if _FOUNDED_RE.match(line) or _LINK_RE.match(line) or _LINK_RE_PLAIN.match(line):
            continue
        cleaned_lines.append(line)
    cleaned = "\n".join(cleaned_lines).strip()
    return founded, url, cleaned


def make_summary(body_without_meta: str) -> str:
    """Take the first paragraph and trim to a card-sized preview (~280 chars)."""
    first_para = body_without_meta.split("\n\n", 1)[0].strip()
    # Strip trailing fragments after the first 1-2 sentences if too long.
    if len(first_para) <= 280:
        return first_para
    # Cut to last sentence boundary under 280.
    cut = first_para[:280]
    last_period = max(cut.rfind(". "), cut.rfind("? "), cut.rfind("! "))
    if last_period > 120:
        return cut[: last_period + 1]
    # Fallback: hard cut on word boundary.
    space = cut.rfind(" ")
    return (cut[:space] if space > 0 else cut).rstrip(",;:") + "…"


# ---------------------------------------------------------------------------
# SQL emission
# ---------------------------------------------------------------------------

def sql_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def dollar_quote(value: str, tag: str = "md") -> str:
    """Postgres dollar-quoting; auto-uppercase tag if value contains the literal."""
    used_tag = tag
    while f"${used_tag}$" in value:
        used_tag += "X"
    return f"${used_tag}${value}${used_tag}$"


def sql_array(strings: list[str]) -> str:
    inner = ",".join(sql_quote(s) for s in strings)
    return f"array[{inner}]"


def emit_tools_migration(tools: list[dict[str, Any]]) -> str:
    cat_order = {slug: order for slug, _name, order in CATEGORIES}
    out: list[str] = []
    out.append("-- Seed: 45 curated AI tools from the 2026 Field Guide.")
    out.append("-- Generated by scripts/build_ai_tools_seed.py — do not edit by hand.")
    out.append("")
    out.append("insert into ai_tools")
    out.append(
        "  (slug, title, category_slug, category_order, display_order, summary, body_md, founded, url)"
    )
    out.append("values")
    rows: list[str] = []
    for t in tools:
        founded_sql = sql_quote(t["founded"]) if t["founded"] else "null"
        rows.append(
            "  ("
            + ", ".join(
                [
                    sql_quote(t["slug"]),
                    sql_quote(t["title"]),
                    sql_quote(t["cat"]),
                    str(cat_order[t["cat"]]),
                    str(t["order"]),
                    sql_quote(t["summary"]),
                    dollar_quote(t["body_md"]),
                    founded_sql,
                    sql_quote(t["url"]),
                ]
            )
            + ")"
        )
    out.append(",\n".join(rows) + ";")
    out.append("")
    return "\n".join(out)


def emit_quiz_migration(tools: list[dict[str, Any]]) -> str:
    out: list[str] = []
    out.append("-- Seed: one usage-focused multiple-choice question per AI tool.")
    out.append("-- Generated by scripts/build_ai_tools_seed.py — do not edit by hand.")
    out.append("--")
    out.append("-- We look up each ai_tools.id by slug so the content_key matches what")
    out.append("-- the app passes to MarkDoneButton (the row's UUID, as text).")
    out.append("")
    out.append(
        "insert into content_questions (content_type, content_key, question, options, correct_index)"
    )
    out.append("select 'ai_tool', t.id::text, q.question, q.options, q.correct_index")
    out.append("from ai_tools t")
    out.append("join (")
    out.append("  values")
    rows: list[str] = []
    for t in tools:
        quiz = QUIZZES[t["slug"]]
        if len(quiz["opts"]) != 4:
            raise SystemExit(f"Quiz for {t['slug']} must have 4 options")
        if not 0 <= quiz["correct"] < 4:
            raise SystemExit(f"Quiz for {t['slug']} has bad correct index")
        rows.append(
            "    ("
            + ", ".join(
                [
                    sql_quote(t["slug"]),
                    sql_quote(quiz["q"]),
                    sql_array(quiz["opts"]),
                    str(quiz["correct"]),
                ]
            )
            + ")"
        )
    out.append(",\n".join(rows))
    out.append(") as q(slug, question, options, correct_index)")
    out.append("on t.slug = q.slug;")
    out.append("")
    return "\n".join(out)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--notion",
        type=Path,
        default=DEFAULT_NOTION_CACHE,
        help="Path to the cached notion-fetch result (JSON).",
    )
    args = parser.parse_args()

    if not args.notion.exists():
        raise SystemExit(f"Notion cache not found: {args.notion}")

    md = load_notion_markdown(args.notion)

    enriched: list[dict[str, Any]] = []
    for t in TOOLS:
        body = extract_section(md, t["match"], t["level"])
        founded, url, cleaned = parse_meta(body)
        enriched.append(
            {
                **t,
                "founded": founded,
                "url": url,
                "summary": make_summary(cleaned),
                "body_md": cleaned,
            }
        )

    OUT_TOOLS.parent.mkdir(parents=True, exist_ok=True)
    OUT_TOOLS.write_text(emit_tools_migration(enriched))
    OUT_QUIZ.write_text(emit_quiz_migration(enriched))

    print(f"Wrote {OUT_TOOLS.relative_to(REPO_ROOT)}  ({OUT_TOOLS.stat().st_size:>6} bytes)")
    print(f"Wrote {OUT_QUIZ.relative_to(REPO_ROOT)}  ({OUT_QUIZ.stat().st_size:>6} bytes)")
    print(f"Tools: {len(enriched)}, quizzes: {len(QUIZZES)}")


if __name__ == "__main__":
    main()
