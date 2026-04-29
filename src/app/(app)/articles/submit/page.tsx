import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { SectionLabel } from "@/components/ui/card";
import { QuizFields } from "@/components/quiz-fields";
import { FormError } from "@/components/form-error";
import { submitArticle } from "./actions";

export default async function SubmitArticlePage({
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
          href="/articles"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← All articles
        </Link>
        <SectionLabel className="mt-3">New article</SectionLabel>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Add an article
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Share something worth reading. You earn a badge for adding it.
        </p>
      </header>

      <form action={submitArticle} className="space-y-5">
        <Field name="title" label="Title" required />
        <Field name="url" label="URL" placeholder="https://…" required type="url" />
        <Field name="author" label="Author" placeholder="Andrej Karpathy" />
        <Field name="source" label="Source" placeholder="Anthropic" />
        <Field
          name="description"
          label="Short description"
          textarea
          placeholder="Why it's worth reading."
        />

        <QuizFields />

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit">Publish article</Button>
          <Button href="/articles" variant="ghost">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
