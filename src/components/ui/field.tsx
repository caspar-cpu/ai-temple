import * as React from "react";
import { cn } from "@/lib/utils";

const INPUT_BASE =
  "mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-ring/20";

export function Field({
  name,
  label,
  placeholder,
  required,
  textarea,
  defaultValue,
  type = "text",
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">
        {label}
        {!required && (
          <span className="ml-1 text-xs text-muted-foreground">optional</span>
        )}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          rows={3}
          className={INPUT_BASE}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={INPUT_BASE}
        />
      )}
    </label>
  );
}

export const inputClass = INPUT_BASE;
