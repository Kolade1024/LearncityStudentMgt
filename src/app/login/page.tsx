"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeSlash, Sparkle } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth";
import { LearncityLogo } from "@/components/brand";
import { Button, Field, Input } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const { session, ready, signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && session) router.replace("/dashboard");
  }, [ready, session, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await signIn(email, password);
    if (result.ok) {
      router.replace("/dashboard");
    } else {
      setError(result.error ?? "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-[100dvh]">
      {/* Form panel */}
      <section className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <LearncityLogo />
          </div>

          {/* <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-strong">
            <Sparkle weight="fill" className="h-3.5 w-3.5" />
            Admin console
          </span> */}
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h2>
          <p className="mt-1.5 text-sm text-foreground/80">
            Sign in to manage your students and certificates.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <Field label="Email address" htmlFor="email">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@learncity.io"
                required
              />
            </Field>

            <Field label="Password" htmlFor="password">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="focus-ring absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlash className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </Field>

            {error && (
              <div className="rounded-[var(--radius-md)] border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" disabled={submitting} className="mt-1">
              {submitting ? "Signing in…" : "Sign in"}
              {!submitting && <ArrowRight weight="bold" className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Use your LearnCity admin credentials to sign in.
          </p>
        </div>
      </section>
    </main>
  );
}
