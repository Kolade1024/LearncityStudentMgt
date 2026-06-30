"use client";

import { useState } from "react";
import { ShieldCheck, CheckCircle } from "@phosphor-icons/react";
import { changePassword } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import { PageShell, PageHeader } from "@/components/page-shell";
import { Button, Card, Field, Input } from "@/components/ui";

export default function SettingsPage() {
  const { session } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDone(false);

    if (!current || !next) {
      setError("Please fill in both password fields.");
      return;
    }
    if (next.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await changePassword(current, next);
      setDone(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell className="max-w-2xl">
      <PageHeader
        title="Settings"
        description="Manage your administrator account."
      />

      <Card className="mt-7 p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-surface-muted text-muted-foreground">
            <ShieldCheck weight="fill" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-foreground">Account</h2>
            <p className="text-sm text-muted-foreground">{session?.email}</p>
          </div>
        </div>
      </Card>

      <Card className="mt-6 p-6 sm:p-7">
        <h2 className="text-base font-semibold text-foreground">Change password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a strong password you don&apos;t use elsewhere.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
          <Field label="Current password" htmlFor="current">
            <Input
              id="current"
              type="password"
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              disabled={submitting}
            />
          </Field>
          <Field label="New password" htmlFor="new" hint="At least 6 characters.">
            <Input
              id="new"
              type="password"
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              disabled={submitting}
            />
          </Field>
          <Field label="Confirm new password" htmlFor="confirm">
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={submitting}
            />
          </Field>

          {error && (
            <div className="rounded-[var(--radius-md)] border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
              {error}
            </div>
          )}
          {done && (
            <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-brand/25 bg-brand-soft px-3.5 py-2.5 text-sm text-brand-strong">
              <CheckCircle weight="fill" className="h-4 w-4" />
              Password updated successfully.
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Updating…" : "Update password"}
            </Button>
          </div>
        </form>
      </Card>
    </PageShell>
  );
}
