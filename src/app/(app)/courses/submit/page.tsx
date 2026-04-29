import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { SectionLabel } from "@/components/ui/card";
import { QuizFields } from "@/components/quiz-fields";
import { FormError } from "@/components/form-error";
import { submitCourse } from "./actions";

export default async function SubmitCoursePage({
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
          href="/courses"
          className="text-sm text-muted-foreground hover:text-bead-blue"
        >
          ← All courses
        </Link>
        <SectionLabel className="mt-3">New course</SectionLabel>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Add a course
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Share an AI course worth completing.
        </p>
      </header>

      <form action={submitCourse} className="space-y-5">
        <Field name="title" label="Title" required />
        <Field name="url" label="URL" placeholder="https://…" required type="url" />
        <Field
          name="provider"
          label="Provider"
          placeholder="Anthropic, DeepLearning.AI, etc."
        />
        <Field
          name="estimated_hours"
          label="Estimated hours"
          placeholder="2"
        />
        <Field
          name="description"
          label="Short description"
          textarea
          placeholder="What you'll learn."
        />

        <QuizFields />

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit">Publish course</Button>
          <Button href="/courses" variant="ghost">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
