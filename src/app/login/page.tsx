"use client";

import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { SunMark } from "@/components/sun-mark";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { inputClass } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const clean = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanUsername = username
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");

    setStatus("sending");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: clean,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          ...(cleanName ? { full_name: cleanName } : {}),
          ...(cleanUsername ? { username: cleanUsername } : {}),
        },
      },
    });

    if (err) {
      setStatus("error");
      setError(err.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <AuthShell>
      <Card className="w-full max-w-sm">
        {status === "sent" ? (
          <div className="flex flex-col items-center text-center">
            <SunMark className="mb-3 size-8 animate-sun-shine text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">
              Check your inbox
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a sign-in link to{" "}
              <span className="font-medium text-foreground">{email}</span>.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Not there in a minute? Check your spam folder.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold tracking-tight">
              The AI Temple
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in with any email. We&apos;ll send you a magic link.
            </p>

            <label htmlFor="email" className="mt-6 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />

            <label htmlFor="name" className="mt-4 block text-sm font-medium">
              Your name{" "}
              <span className="text-xs text-muted-foreground">optional</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Caspar Rose"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />

            <label
              htmlFor="username"
              className="mt-4 block text-sm font-medium"
            >
              Username{" "}
              <span className="text-xs text-muted-foreground">
                optional · shown on the leaderboard
              </span>
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="caspar"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              pattern="[a-zA-Z0-9-]*"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Lowercase letters, numbers, hyphens. We&apos;ll auto-fix it on
              save.
            </p>

            <Button
              type="submit"
              className="mt-5 w-full"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending link…" : "Send sign-in link"}
            </Button>

            {error && (
              <p className="mt-3 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </form>
        )}
      </Card>
    </AuthShell>
  );
}
