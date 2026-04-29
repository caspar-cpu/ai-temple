"use client";

import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { SunMark } from "@/components/sun-mark";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { inputClass } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";

const EMAIL_KEY = "ai-temple-email";
const USERNAME_KEY = "ai-temple-username";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem(EMAIL_KEY);
    const savedUsername = localStorage.getItem(USERNAME_KEY);
    if (savedEmail) setEmail(savedEmail);
    if (savedUsername) setUsername(savedUsername);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");

    if (cleanUsername.length < 2) {
      setError("Username must be at least 2 characters.");
      return;
    }

    setStatus("sending");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { username: cleanUsername },
      },
    });

    if (err) {
      setStatus("error");
      setError(err.message);
    } else {
      localStorage.setItem(EMAIL_KEY, cleanEmail);
      localStorage.setItem(USERNAME_KEY, cleanUsername);
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
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setError("");
              }}
              className="mt-5 text-xs text-muted-foreground underline-offset-4 hover:text-bead-blue hover:underline"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold tracking-tight">
              The AI Temple
            </h1>

            <label htmlFor="email" className="mt-6 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />

            <label
              htmlFor="username"
              className="mt-4 block text-sm font-medium"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              minLength={2}
              maxLength={40}
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              pattern="[a-zA-Z0-9-]+"
              className={inputClass}
            />

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
