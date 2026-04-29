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
          Edit profile
        </h1>
      </header>

      <Card>
        <form action={updateProfile} className="space-y-5">
          <Field
            name="full_name"
            label="Name"
            defaultValue={user.full_name}
          />
          <Field
            name="username"
            label="Username"
            defaultValue={user.username}
          />
          <Field
            name="department"
            label="Team"
            defaultValue={user.department ?? ""}
          />

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit">Save</Button>
            <Button href={`/u/${user.username}`} variant="ghost">
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      <p className="text-xs text-muted-foreground">
        Signed in as{" "}
        <span className="font-medium text-foreground">{user.email}</span>.
      </p>
    </div>
  );
}
