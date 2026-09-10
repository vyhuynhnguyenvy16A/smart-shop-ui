import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiFetch, saveAuthTokens, type AuthResponse, type UserResponse } from "@/lib/api-client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account — Northline" },
      {
        name: "description",
        content: "Sign in to track Northline orders, or create an account in seconds. Guest checkout is always available.",
      },
      { property: "og:title", content: "Sign in — Northline" },
      { property: "og:description", content: "Sign in or create your Northline account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const locked = attempts >= 5;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (locked || submitting) return;
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter a valid email address.");
    if (mode === "signup" && !fullName.trim()) return setError("Full name is required.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (mode === "signup" && password !== confirm) return setError("Passwords do not match.");

    setSubmitting(true);
    setError("");
    try {
      if (mode === "signup") {
        await apiFetch<UserResponse>("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ email: email.trim(), fullName: fullName.trim(), password }),
        });
        setMode("signin");
        setPassword("");
        setConfirm("");
        setError("Account created. Sign in to continue.");
        return;
      }

      const auth = await apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      saveAuthTokens(auth);
      setAttempts(0);
      navigate({ to: "/account" });
    } catch (reason) {
      const next = attempts + 1;
      setAttempts(next);
      setError(
        next >= 5
          ? "Too many failed attempts. Your account is temporarily locked. Try again in 15 minutes."
          : `${reason instanceof Error ? reason.message : "Authentication failed."} ${5 - next} attempts left before a temporary lock.`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-shop section-y pb-24 md:pb-12">
      <div className="mx-auto w-full max-w-md rounded-xl bg-card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-foreground">
          {mode === "signin" ? "Sign in" : "Create an account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Track orders and save your addresses."
            : "It takes less than a minute."}
        </p>

        {(error || locked) && (
          <div
            role="alert"
            className="mt-6 flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="h-12 w-full rounded-lg border border-input bg-background px-4 text-base outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="h-12 w-full rounded-lg border border-input bg-background px-4 text-base outline-none focus:border-primary"
            />
          </div>
          {mode === "signup" && (
            <div>
              <label htmlFor="fullName" className="mb-1 block text-sm font-semibold text-foreground">
                Full name
              </label>
              <input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                className="h-12 w-full rounded-lg border border-input bg-background px-4 text-base outline-none focus:border-primary"
              />
            </div>
          )}
          {mode === "signup" && (
            <div>
              <label htmlFor="confirm" className="mb-1 block text-sm font-semibold text-foreground">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                className="h-12 w-full rounded-lg border border-input bg-background px-4 text-base outline-none focus:border-primary"
              />
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={locked || submitting}
            className={cn("w-full")}
          >
            <Lock /> {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm">
          <button
            type="button"
            className="font-semibold text-primary hover:underline"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
            }}
          >
            {mode === "signin" ? "Create an account" : "I already have an account"}
          </button>
          <Link to="/cart" className="text-muted-foreground hover:text-foreground hover:underline">
            Continue as guest
          </Link>
        </div>
      </div>
    </div>
  );
}
