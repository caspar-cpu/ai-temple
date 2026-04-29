import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { SectionLabel } from "@/components/ui/card";
import { QuizFields } from "@/components/quiz-fields";
import { FormError } from "@/components/form-error";
import { submitSkill } from "./actions";

export default async function SubmitSkillPage({
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
          href="/skills"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← All skills
        </Link>
        <SectionLabel className="mt-3">New skill</SectionLabel>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Add a skill
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste a link from skills.sh or any other marketplace. You earn 30
          points for adding it.
        </p>
      </header>

      <form action={submitSkill} className="space-y-5">
        <Field name="title" label="Title" placeholder="SEO Audit" required />
        <Field
          name="description"
          label="Description"
          textarea
          placeholder="What does this skill do and when should someone use it?"
          required
        />
        <Field
          name="url"
          label="URL"
          placeholder="https://skills.sh/…"
          required
          type="url"
        />
        <Field
          name="publisher"
          label="Publisher"
          placeholder="e.g. Vercel Labs, coreyhaines31"
        />
        <Field
          name="category"
          label="Category"
          placeholder="Marketing, Design, Developer productivity…"
        />
        <Field
          name="department"
          label="Department"
          placeholder="Finance, Marketing, Culinary, Ops, Tech…"
        />

        <QuizFields />

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit">Publish skill</Button>
          <Button href="/skills" variant="ghost">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
