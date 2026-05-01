import {
  BookOpen,
  ExternalLink,
  FolderOpen,
  GraduationCap,
  Headphones,
  MessageCircle,
  Puzzle,
  Rocket,
  Sparkles,
  Terminal,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";
import { Card, SectionLabel } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrophyIcon } from "@/components/trophy-icon";
import { SunProgress } from "@/components/sun-progress";
import { cn } from "@/lib/utils";
import { MarkDoneButton } from "@/components/mark-done-button";

type Step = {
  key: string;
  title: string;
  body: string;
  url?: string;
};

type Lesson = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  steps: Step[];
};

const LESSONS: Lesson[] = [
  {
    id: "level-1-chat",
    title: "Lesson 1. Level 1 — Claude Chat",
    description:
      "Five moves to get the basics right. Most people stop here and miss 90% of what Claude can do — don't be most people.",
    icon: MessageCircle,
    steps: [
      {
        key: "install-claude-desktop",
        title: "Install the Claude app",
        body: "Go to claude.com/download, drag it to Applications, sign in with your work account.",
        url: "https://claude.com/download",
      },
      {
        key: "subscribe-claude-pro",
        title: "Pay the $20",
        body: "Get Pro. Without it you'll bump into limits before lunch.",
      },
      {
        key: "select-opus-extended-thinking",
        title: "Pick Opus 4.6 + Extended Thinking",
        body: "In the model picker at the top of the chat, choose Opus 4.6 with Extended Thinking on. The smart, slow setting. What you want for real work.",
      },
      {
        key: "connect-connectors",
        title: "Connect Slack, Drive and Notion",
        body: "Settings, Connectors. Hook up the apps you live in. Once they're on, Claude can read them and act on them — no more copy-paste.",
      },
      {
        key: "askuserquestion-prompt",
        title: "Stop writing long prompts",
        body: "Use this template instead: 'I want to [TASK] for [SUCCESS CRITERIA]. Use AskUserQuestion before you start.' Claude interviews you instead of guessing. One line replaces most of the prompting you've ever done.",
        url: "https://how-to-claude.ai",
      },
    ],
  },
  {
    id: "level-2-cowork",
    title: "Lesson 2. Level 2 — Claude Cowork",
    description:
      "You're about to kill prompting. From here on, your prompt is two lines plus a folder.",
    icon: FolderOpen,
    steps: [
      {
        key: "cowork-folder-structure",
        title: "Set up your Cowork folder",
        body: "Open Cowork. Create a folder called Claude-Cowork. Inside it, four subfolders: about-me, templates, projects and outputs.",
      },
      {
        key: "create-about-me",
        title: "Write your about-me.md",
        body: "Inside about-me, create about-me.md. A short file: what you do, how you do it, what good looks like to you.",
      },
      {
        key: "create-anti-ai-style",
        title: "Write your anti-ai-style.md",
        body: "Same folder. anti-ai-style.md. Words you'd never say. Phrases that sound like a chatbot. Claude reads this and avoids them.",
      },
      {
        key: "set-global-instructions",
        title: "Lock in Global Instructions",
        body: "Settings, Cowork, Edit Instructions. Paste: 'Always read my files first, never edit my originals, deliver everything to CLAUDE OUTPUTS.' That's it. From now on, your prompt is two lines plus your folder.",
      },
    ],
  },
  {
    id: "level-3-skills",
    title: "Lesson 3. Level 3 — Skills and plugins",
    description:
      "Skills handle the process. Your about-me handles the tone. Two layers, working at the same time.",
    icon: Puzzle,
    steps: [
      {
        key: "skill-creator-build",
        title: "Build your first skill with skill-creator",
        body: "In Cowork, type: 'Use the skill-creator to help me build a skill for [your most repeated task].' Claude interviews you. Be specific in your answers.",
      },
      {
        key: "test-skill-description",
        title: "Test the description",
        body: "Claude generates a SKILL.md. Ask back: 'When would you use this skill?' If the answer is vague, the description is vague. Tighten it until Claude knows exactly when to fire.",
      },
      {
        key: "upload-skill",
        title: "Upload your skill",
        body: "Settings, Capabilities, Skills, Upload. Now it fires automatically. No slash command, no reminder needed.",
      },
      {
        key: "install-starter-skills",
        title: "Browse and install plugins",
        body: "Cowork, Customize, Browse plugins. Install what looks useful. They pay for themselves the first time you use them.",
      },
    ],
  },
  {
    id: "level-4-code",
    title: "Lesson 4. Level 4 — Code and Computer",
    description:
      "This is where you stop working inside Claude. Claude starts working on your computer.",
    icon: Terminal,
    steps: [
      {
        key: "claude-code-tab-github",
        title: "Open the Code tab and connect GitHub",
        body: "Click the Code tab in Claude Desktop. Connect GitHub through Settings, Connectors. A free GitHub account is fine if you don't have one.",
      },
      {
        key: "claude-build-repo",
        title: "Have Claude build your first project",
        body: "Prompt: 'Create a GitHub repo named [project]. Code everything. Don't ask for permissions.' Watch it work.",
      },
      {
        key: "install-claude-code",
        title: "Install Claude Code in your terminal",
        body: "Install Node.js LTS from nodejs.org, run 'npm install -g @anthropic-ai/claude-code', then 'claude' to authenticate. Every serious workflow eventually touches the terminal.",
        url: "https://claudecode.free",
      },
      {
        key: "vscode-claude-extension",
        title: "Install VS Code + the Claude extension",
        body: "Download VS Code, install the Claude extension from the marketplace. Turn on Skip Permissions in settings to go 100x faster on personal projects.",
        url: "https://code.visualstudio.com/download",
      },
      {
        key: "create-claude-md",
        title: "Generate a CLAUDE.md",
        body: "After your session, paste: 'Create a CLAUDE.md file with everything you learned about this project.' Claude remembers your fonts, colours and structure forever.",
      },
      {
        key: "enable-computer-browser-use",
        title: "Turn on Browser + Computer use",
        body: "Settings, Desktop app, enable Browser use and Computer use. Claude can now click buttons, fill forms and drive your machine like a person.",
      },
      {
        key: "connect-dispatch",
        title: "Connect Dispatch",
        body: "Connect your phone with Dispatch. Text Claude a task. It runs in the background while you live your life.",
      },
      {
        key: "schedule-recurring-task",
        title: "Schedule a recurring task",
        body: "Left sidebar, Scheduled, write the prompt, pick a frequency. Claude fires it on its own.",
      },
    ],
  },
  {
    id: "grounding",
    title: "Lesson 5. A little grounding",
    description:
      "Pick at least two so later sections stop feeling like a foreign language.",
    icon: BookOpen,
    steps: [
      {
        key: "read-anthropic-research",
        title: "Read one Anthropic research article",
        body: "anthropic.com/research. Pick one that looks interesting and read it properly. Dry, but the highest signal-per-hour in the industry.",
        url: "https://anthropic.com/research",
      },
      {
        key: "walkthrough-attention-paper",
        title: "Walk through 'Attention Is All You Need' with Claude",
        body: "Don't read it cold. Open Claude and say: 'Walk me through the 2017 Attention Is All You Need paper in plain English, section by section, and stop after each one for my questions.' One hour here is the single most useful conceptual hour you'll spend.",
      },
      {
        key: "skim-claude-code-docs",
        title: "Skim the Claude Code docs",
        body: "So the terminal doesn't feel foreign when you hit the Claude Code part of this journey.",
        url: "https://docs.claude.com",
      },
    ],
  },
  {
    id: "primer",
    title: "Lesson 6. The plain-language primer",
    description: "Five short reads, in this order. Each builds on the last.",
    icon: BookOpen,
    steps: [
      {
        key: "article-cmu-ai-explained",
        title: "Artificial Intelligence, Explained (CMU)",
        body: "What AI actually is, in plain words. A good first read.",
        url: "https://www.heinz.cmu.edu/media/2023/July/artificial-intelligence-explained",
      },
      {
        key: "article-atlassian-ai-101",
        title: "AI 101: The basics everyone should know (Atlassian)",
        body: "Simple explanations of terms you'll keep hearing: machine learning, models, datasets.",
        url: "https://www.atlassian.com/blog/artificial-intelligence/artificial-intelligence-101-the-basics-of-ai",
      },
      {
        key: "article-mit-chatgpt-primer",
        title: "How ChatGPT Works: a non-technical primer (MIT Sloan)",
        body: "How chatbots like ChatGPT and Claude actually work, without math.",
        url: "https://mitsloanedtech.mit.edu/ai/basics/how-chatgpt-works-a-non-technical-primer/",
      },
      {
        key: "article-claude-getting-started",
        title: "Get started with Claude (Claude Help Center)",
        body: "Official basics: sign up, type a prompt, see what happens.",
        url: "https://support.claude.com/en/articles/8114491-get-started-with-claude",
      },
      {
        key: "article-helena-beginner-guide",
        title: "A beginner's guide to using Claude (Helena Di Biase)",
        body: "A practical walk-through for someone running a business. What each feature is for, with a simple workflow to try this week.",
        url: "https://helenadibiase.substack.com/p/a-beginners-guide-to-using-claude",
      },
    ],
  },
  {
    id: "videos",
    title: "Lesson 7. Watch two videos",
    description: "Short, high-signal. Watch between the reading.",
    icon: Zap,
    steps: [
      {
        key: "video-3blue1brown-llms",
        title: "Large Language Models, explained briefly (3Blue1Brown, 7 min)",
        body: "Made for people who find other AI videos too heavy. Watch after article 2.",
        url: "https://www.youtube.com/watch?v=LPZh9BOjkQs",
      },
      {
        key: "video-hubspot-claude-tutorial",
        title: "Full Claude Tutorial in 19 minutes (HubSpot)",
        body: "Watch someone actually use Claude end to end. Good after article 5.",
        url: "https://www.youtube.com/watch?v=WSPChlfxJyA",
      },
    ],
  },
  {
    id: "for-your-work",
    title: "Lesson 8. Claude for your actual work",
    description:
      "This is the 'oh, this does my work' moment. Read these once you've got the basics.",
    icon: Wrench,
    steps: [
      {
        key: "article-datacamp-claude-excel",
        title: "Claude in Excel, getting started (DataCamp)",
        body: "Install the Excel add-in, then ask things like 'why is this formula wrong?' or 'build me a forecast from these numbers.' Written for non-finance people.",
        url: "https://www.datacamp.com/tutorial/claude-in-excel",
      },
      {
        key: "article-substack-claude-powerpoint",
        title: "The Claude Add-In That Builds Your PowerPoint (Market Smarter With AI)",
        body: "Six steps from install to branded deck. Claude respects your brand template (fonts, colours, layout).",
        url: "https://marketsmarterwithai.substack.com/p/the-claude-add-in-that-builds-and",
      },
      {
        key: "article-deb-szabo-connectors",
        title: "Turn Claude into your personal assistant: Connectors (Deb Szabo)",
        body: "Connectors explained as bridges, in plain English. Which to turn on first (Gmail, Calendar, Drive, Canva) and when to turn them off.",
        url: "https://www.debszabo.com/blog/how-to-turn-claude-into-your-personal-assistant-connectors",
      },
      {
        key: "article-mindstudio-gas-claude",
        title: "Google Workspace CLI with Claude Code (MindStudio)",
        body: "The real unlock: one plain-English instruction triggers a chain across Gmail, Calendar, Sheets, Docs, and back to Gmail. Step up from the others.",
        url: "https://www.mindstudio.ai/blog/google-workspace-cli-claude-code-automation",
      },
    ],
  },
  {
    id: "podcasts",
    title: "Lesson 9. Three podcast episodes",
    description:
      "For commutes and walks. Saves you from more reading.",
    icon: Headphones,
    steps: [
      {
        key: "podcast-hardfork-chatgpt",
        title: "Hard Fork: Can ChatGPT Make This Podcast?",
        body: "The original 'whoa, what is this thing?' episode.",
        url: "https://open.spotify.com/episode/1q0yentSf8qPcy1OKm29sc",
      },
      {
        key: "podcast-examined-life-dan-shipper",
        title: "The Examined Life: How do I get started with AI? (Dan Shipper)",
        body: "Someone stuck using AI like a fancy Google learns how to use it for real work.",
        url: "https://open.spotify.com/episode/4k60W1CtvTMWkGvlkgh15K",
      },
      {
        key: "podcast-ezra-klein-jack-clark",
        title: "Ezra Klein: How Quickly Will AI Agents Rip Through the Economy? (Jack Clark)",
        body: "Zooms out to where this is all heading and what it might mean for jobs. A good finale.",
        url: "https://open.spotify.com/episode/6aeTJQPEXYHITci8d0wfdp",
      },
    ],
  },
  {
    id: "go-deeper",
    title: "Lesson 10. Go deeper with a full course",
    description:
      "The capstone. One long-form course that takes you from basics to real PM work with Claude Code.",
    icon: GraduationCap,
    steps: [
      {
        key: "course-cc-for-pms",
        title: "Claude Code for Product Managers (Carl Vellotti)",
        body: "Free hands-on course covering file operations, parallel agents, PRD writing, and data analysis. No coding background needed. Allow 10-12 hours. Requires a Claude Pro or Max subscription to follow along inside the tool.",
        url: "https://ccforpms.com/#about-this-course",
      },
    ],
  },
];

const TOTAL_STEPS = LESSONS.reduce((sum, l) => sum + l.steps.length, 0);

export default async function StartHerePage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: completions } = await supabase
    .from("journey_step_completions")
    .select("step_key")
    .eq("user_id", user.id);

  const doneSet = new Set((completions ?? []).map((c) => c.step_key));
  const doneCount = LESSONS.flatMap((l) => l.steps).filter((s) =>
    doneSet.has(s.key),
  ).length;
  const journeyDone = doneCount >= TOTAL_STEPS;

  return (
    <div className="space-y-14">
      <header>
        <SectionLabel>Start your journey here</SectionLabel>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          You can learn this. Everyone can.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          This is the beginner path for anyone new to AI at the Temple. Four
          levels to get yourself set up, then articles, videos and podcasts to
          lock it in. Tick things off as you go. A few focused hours spread
          over a week or two and you&apos;ll be fluent enough to follow along
          in any future training session, and confident enough to start
          building your own things.
        </p>

        <Card className="mt-8 flex items-center gap-6">
          <SunProgress done={doneCount} total={TOTAL_STEPS} size={112} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold tabular-nums text-foreground">
                {doneCount}
              </span>{" "}
              of {TOTAL_STEPS} steps complete
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              +5 points per step · +100 bonus when you finish the whole journey.
            </p>
          </div>
        </Card>
      </header>

      <section>
        <SectionLabel>If you&apos;re not a developer</SectionLabel>
        <Card className="mt-3 bg-primary/5">
          <ul className="space-y-2 text-sm">
            <li>
              You still want Claude Code installed, because some skills only
              work there and it handles some file tasks better than the desktop
              app.
            </li>
            <li>
              But 90% of your time should be in Claude Chat, Projects, Cowork,
              and Connectors.
            </li>
            <li>
              <span className="font-medium">Claude Code is the power tool.</span>{" "}
              <span className="font-medium">Cowork is the daily driver.</span>
            </li>
          </ul>
        </Card>
      </section>

      <section>
        <SectionLabel>A tiny glossary</SectionLabel>
        <h2 className="mt-3 text-xl font-semibold tracking-tight">
          Five words that show up everywhere
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <GlossaryItem
            icon={Terminal}
            term="Terminal"
            def="A text window where you type instructions for the computer. Open Terminal on Mac or Command Prompt on Windows. It's just a typing interface, nothing to be spooked by."
          />
          <GlossaryItem
            icon={Terminal}
            term="CLI"
            def="Command Line Interface. A tool you control by typing commands instead of clicking. Claude Code is a CLI. When you're told to 'use the CLI', it means: type the command in Terminal rather than clicking around in a dashboard."
          />
          <GlossaryItem
            icon={Sparkles}
            term="MCP"
            def="Model Context Protocol. A standard way for Claude to talk to external tools like Slack, Notion, or Google Drive. Every Connector you add in Claude Desktop settings is effectively an MCP server."
          />
          <GlossaryItem
            icon={Sparkles}
            term="API call"
            def="A request from one program to another. When Claude 'calls the Anthropic API' it's sending your prompt to Anthropic's servers, which reply with the answer."
          />
          <GlossaryItem
            icon={Sparkles}
            term="Token"
            def="A small chunk of text, roughly three quarters of a word. Language models read tokens, not words. You get billed per token when using the API."
          />
        </div>
      </section>

      <section>
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Warm-up done. Ready when you are.
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Let&apos;s go into lesson one.
          </h2>
        </div>
      </section>

      {LESSONS.map((lesson) => (
        <LessonSection key={lesson.id} lesson={lesson} doneSet={doneSet} />
      ))}

      <section>
        {journeyDone ? (
          <Card className="bg-primary/5 text-center">
            <div className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-primary/10">
              <TrophyIcon name="Emerald" tier="special" size="lg" animate />
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              You finished the journey.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              +100 bonus points logged. Now you&apos;re free to explore and pick
              what takes your fancy, both from here and in any future training
              session. This database will be referenced as we go, and it&apos;s
              free for all of us to follow where our curiosity takes us.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="/plugins">Browse plugins</Button>
              <Button href="/articles" variant="secondary">
                The reading room
              </Button>
              <Button href="/leaderboard" variant="secondary">
                See the leaderboard
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="text-center">
            <div className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Rocket className="size-5 text-primary" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-xl font-semibold tracking-tight">
              Finish the journey to unlock Completed Beginner Reading
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {TOTAL_STEPS - doneCount} to go. After this you&apos;re free to
              explore wherever your curiosity takes you.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}

function LessonSection({
  lesson,
  doneSet,
}: {
  lesson: Lesson;
  doneSet: Set<string>;
}) {
  const Icon = lesson.icon;
  const done = lesson.steps.filter((s) => doneSet.has(s.key)).length;
  const allDone = done === lesson.steps.length;

  return (
    <section id={lesson.id} className="scroll-mt-32">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-full",
            allDone ? "bg-primary/10 text-primary" : "bg-muted",
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <h2 className="text-xl font-semibold tracking-tight">
            {lesson.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {lesson.description}
          </p>
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {done} / {lesson.steps.length}
        </span>
      </div>

      <Card className="mt-4 p-0">
        <ol className="divide-y divide-border">
          {lesson.steps.map((step, i) => {
            const isDone = doneSet.has(step.key);
            return (
              <li
                key={step.key}
                className={cn(
                  "flex items-start justify-between gap-4 p-5",
                  isDone && "bg-muted/20",
                )}
              >
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step.url ? (
                      <a
                        href={step.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium hover:underline"
                      >
                        {step.title}
                        <ExternalLink
                          className="size-3.5 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </a>
                    ) : (
                      <span className="font-medium">{step.title}</span>
                    )}
                  </div>
                  <p className="mt-1 pl-8 text-sm text-muted-foreground">
                    {step.body}
                  </p>
                </div>
                <MarkDoneButton
                  contentType="journey_step"
                  contentKey={step.key}
                  alreadyDone={isDone}
                />
              </li>
            );
          })}
        </ol>
      </Card>
    </section>
  );
}

function GlossaryItem({
  icon: Icon,
  term,
  def,
}: {
  icon: LucideIcon;
  term: string;
  def: string;
}) {
  return (
    <Card className="h-full p-5">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        <h3 className="font-semibold">{term}</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{def}</p>
    </Card>
  );
}
