import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <AuthShell>
      <Card className="w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold tracking-tight">
          This path leads nowhere
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist in the Temple. The
          way back is open.
        </p>
        <Button href="/" className="mt-5 w-full">
          Return to the Temple
        </Button>
      </Card>
    </AuthShell>
  );
}
