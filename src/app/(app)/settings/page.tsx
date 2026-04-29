import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { Button } from "@/components/ui/button";
import { Card, SectionLabel } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { FormError } from "@/components/form-error";
import { updateProfile } from "./actions";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const user = await getCurrentUser();

  return (
    <div className="max-w-2xl space-y-8">
      <FormError message={error} />

      <header>
        <Link
          href={`/u/${user.username}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Your profile
        </Link>
        <SectionLabel className="mt-3">Settings</SectionLabel>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Edit your profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your name shows on the leaderboard and on plugins/articles you
          contribute. Your username is the handle for your profile URL.
        </p>
      </header>

      <Card>
        <form action={updateProfile} className="space-y-5">
          <Field
            name="full_name"
            label="Your name"
            placeholder="Caspar Rose"
            defaultValue={user.full_name}
          />
          <div>
            <Field
              name="username"
              label="Username"
              placeholder="caspar"
              defaultValue={user.username}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Lowercase letters, numbers, and hyphens. Your profile URL will
              update to <span className="font-mono">/u/your-username</span>.
            </p>
          </div>

          <Field
            name="department"
            label="Department or team"
            placeholder="Marketing"
            defaultValue={user.department ?? ""}
          />

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit">Save changes</Button>
            <Button href={`/u/${user.username}`} variant="ghost">
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      <p className="text-xs text-muted-foreground">
        Your email is{" "}
        <span className="font-medium text-foreground">{user.email}</span> and
        can&apos;t be changed here. Contact an admin if you need to switch.
      </p>
    </div>
  );
}
