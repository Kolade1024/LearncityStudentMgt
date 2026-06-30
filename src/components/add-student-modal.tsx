"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, X } from "@phosphor-icons/react";
import { createBootcamp } from "@/lib/api-client";
import { Button, Field, Input } from "@/components/ui";

/**
 * Modal for enrolling a new student. Render it conditionally
 * (`{open && <AddStudentModal .../>}`) so its state resets each time.
 */
export function AddStudentModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const created = await createBootcamp(name.trim());
      onCreated(created.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]"
        onClick={submitting ? undefined : onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-xl"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", duration: 0.32, bounce: 0.2 }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
              <GraduationCap weight="fill" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Add a student</h2>
              <p className="text-sm text-muted-foreground">
                Enter the student&apos;s name to enroll them.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="focus-ring -mr-1 -mt-1 rounded-md p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
          <Field label="Student name" htmlFor="student-name" error={error}>
            <Input
              id="student-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Amara Okonkwo"
              autoFocus
              disabled={submitting}
            />
          </Field>

          <div className="flex justify-end gap-2.5">
            <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding…" : "Add student"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
