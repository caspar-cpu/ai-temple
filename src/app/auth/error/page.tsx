import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const REASONS: Record<string, string> = {
  "missing-code": "Something went wrong with the login link. Please try again.",
  exchange: "Your login link has expired. Please request a new one.",
  callback: "Authentication callback failed. Please try again.",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const message = REASONS[reason ?? ""] ?? "Authentication failed.";

  return (
    <AuthShell>
      <Card className="w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold tracking-tight">
          Sign-in problem
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <Button href="/login" className="mt-5 w-full">
          Try again
        </Button>
      </Card>
    </AuthShell>
  );
}
