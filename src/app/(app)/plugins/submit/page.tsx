import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { SectionLabel } from "@/components/ui/card";
import { QuizFields } from "@/components/quiz-fields";
import { FormError } from "@/components/form-error";
import { submitPlugin } from "./actions";

export default async function SubmitPluginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="max-w-2xl space-y-8">
      <FormError message={error} />
      <header>
        <Link
          href="/plugins"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← All plugins
        </Link>
        <SectionLabel className="mt-3">New plugin</SectionLabel>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Add a plugin
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Link to a Claude skill hosted on GitHub. The warehouse pulls it live,
          so updates you push appear for everyone.
        </p>
      </header>

      <form action={submitPlugin} className="space-y-5">
        <Field name="name" label="Name" placeholder="Brand voice writer" required />
        <Field
          name="description"
          label="Description"
          textarea
          placeholder="What does this plugin do and when should someone reach for it?"
          required
        />
        <Field
          name="github_url"
          label="GitHub URL (optional — leave blank for Cowork-directory plugins)"
          placeholder="https://github.com/your-org/skills/blob/main/…/SKILL.md"
        />
        <Field
          name="install_command"
          label="Install command"
          placeholder="/plugin install brand-voice-writer"
          required
        />
        <Field
          name="invocation_prompt"
          label="How to invoke it"
          placeholder="Ask Claude to use the brand voice writer skill."
          required
        />
        <Field
          name="example_search"
          label="Example query to trigger it"
          placeholder="Build me a P&L forecast for next quarter"
        />
        <Field
          name="department"
          label="Department"
          placeholder="Finance, Marketing, Culinary, Ops, Tech…"
        />

        <QuizFields />

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit">Publish plugin</Button>
          <Button href="/plugins" variant="ghost">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
