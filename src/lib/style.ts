// Shared Tailwind class strings used across multiple components, kept here
// so future tweaks (lift distance, ring color, etc.) are a one-line edit.

/** Subtle elevation on hover: lift 2px + soft gold-tinted shadow + darker border. */
export const cardHoverLift =
  "transition hover:-translate-y-0.5 hover:border-foreground/40 hover:shadow-md hover:shadow-primary/10";

/** Brand-gold focus-visible ring — used on Buttons via BASE composition. */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Link wrapper: the focus ring above plus rounded-lg so the ring follows
 *  the natural card corner. */
export const linkFocusRing = `rounded-lg ${focusRing}`;
