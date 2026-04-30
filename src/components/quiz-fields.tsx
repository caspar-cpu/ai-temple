import { Field } from "@/components/ui/field";
import { SectionLabel } from "@/components/ui/card";

/**
 * Optional 4-option quiz block embedded in submit forms (plugins,
 * skills, courses, articles). All fields blank → no quiz is created
 * and `markWithoutQuiz` will award the trophy unconditionally.
 * Pair with `parseQuizFields` on the server action side.
 */
export function QuizFields() {
  return (
    <div className="space-y-4 rounded-2xl border border-dashed border-border bg-muted/30 p-5">
      <div>
        <SectionLabel>Quick-check quiz</SectionLabel>
        <p className="mt-1 text-sm text-muted-foreground">
          A multiple-choice question that only someone who actually read or did
          this could answer. Four options, one correct answer. Leave blank to
          skip for now (anyone can tick without a quiz).
        </p>
      </div>
      <Field
        name="quiz_question"
        label="Question"
        placeholder="What specific detail from the material do you want to test?"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="quiz_option_a" label="Option A" />
        <Field name="quiz_option_b" label="Option B" />
        <Field name="quiz_option_c" label="Option C" />
        <Field name="quiz_option_d" label="Option D" />
      </div>
      <label className="block">
        <span className="text-sm font-medium text-foreground">
          Correct answer
        </span>
        <select
          name="quiz_correct"
          defaultValue=""
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
        >
          <option value="">Pick one</option>
          <option value="0">A</option>
          <option value="1">B</option>
          <option value="2">C</option>
          <option value="3">D</option>
        </select>
      </label>
    </div>
  );
}

/**
 * Parses the QuizFields formdata into a `{question, options, correctIndex}`
 * shape, or returns null if any field is blank or `correct` is out of
 * range. Use in submit-form server actions to decide whether to insert
 * a `quizzes` row.
 */
export function parseQuizFields(formData: FormData) {
  const question = (formData.get("quiz_question") as string | null)?.trim();
  const a = (formData.get("quiz_option_a") as string | null)?.trim();
  const b = (formData.get("quiz_option_b") as string | null)?.trim();
  const c = (formData.get("quiz_option_c") as string | null)?.trim();
  const d = (formData.get("quiz_option_d") as string | null)?.trim();
  const correctRaw = formData.get("quiz_correct") as string | null;
  if (!question || !a || !b || !c || !d || !correctRaw) return null;
  const correctIndex = Number(correctRaw);
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3)
    return null;
  return {
    question,
    options: [a, b, c, d],
    correctIndex,
  };
}
