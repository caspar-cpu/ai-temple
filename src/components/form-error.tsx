import { AlertCircle } from "lucide-react";

/**
 * Inline form error banner — bead-red border + tinted background, with
 * an alert icon. Renders nothing when `message` is empty so callers can
 * pass it unconditionally. ARIA `role="alert"` for screen-reader announce.
 */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      role="alert"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
