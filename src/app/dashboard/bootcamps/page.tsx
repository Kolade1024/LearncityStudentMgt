"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import {
  Plus,
  GraduationCap,
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  Warning,
} from "@phosphor-icons/react";
import { listBootcamps } from "@/lib/api-client";
import type { Bootcamp, PageMeta } from "@/lib/types";
import { PageShell, PageHeader } from "@/components/page-shell";
import { Button, Card } from "@/components/ui";
import { BootcampAvatar, TypeBadge } from "@/components/bootcamp-bits";
import { AddStudentModal } from "@/components/add-student-modal";
import { LearncityMark } from "@/components/brand";
import { bootcampName, formatDateShort, humanize } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function BootcampsPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Bootcamp[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await listBootcamps(page, PAGE_SIZE);
        if (!active) return;
        setData(res.data ?? []);
        setMeta(res.meta ?? null);
        setError("");
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load students.");
        setData([]);
        setMeta(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [page, reloadKey]);

  const goToPage = (next: number) => {
    setLoading(true);
    setPage(next);
  };

  const retry = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const handleCreated = () => {
    setShowAdd(false);
    setLoading(true);
    setPage(1);
    setReloadKey((k) => k + 1);
  };

  const lastPage = meta?.last_page ?? 1;
  const total = meta?.total ?? data.length;

  return (
    <PageShell>
      <PageHeader
        title="Students"
        description="Browse every LearnCity student and open one to manage them."
        actions={
          <Button onClick={() => setShowAdd(true)}>
            <Plus weight="bold" className="h-4 w-4" />
            Add student
          </Button>
        }
      />

      {loading ? (
        <div className="mt-16 flex justify-center">
          <LearncityMark className="h-10 w-10 animate-pulse" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : data.length === 0 ? (
        <EmptyState onAdd={() => setShowAdd(true)} />
      ) : (
        <>
          <Card className="mt-6 overflow-hidden">
            {/* table header (desktop) */}
            <div className="hidden grid-cols-[1.8fr_1fr_1fr_0.9fr_auto] gap-4 border-b border-border bg-surface-muted/50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
              <span>Student</span>
              <span>Course</span>
              <span>Type</span>
              <span>Created</span>
              <span className="text-right">Open</span>
            </div>

            <div className="divide-y divide-border">
              {data.map((b) => (
                <Link
                  key={b.id}
                  href={`/dashboard/bootcamps/${b.id}`}
                  className="group grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-surface-muted/60 md:grid-cols-[1.8fr_1fr_1fr_0.9fr_auto] md:items-center md:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <BootcampAvatar seed={b.id} size={42} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {bootcampName(b.name)}
                      </p>
                      <p className="truncate font-mono text-xs text-muted-foreground">
                        {b.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground md:hidden">Course: </span>
                    {humanize(b.bootcampCourse)}
                  </div>

                  <div>
                    <TypeBadge type={b.bootcampType} />
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground md:hidden">Created: </span>
                    {formatDateShort(b.createdAt)}
                  </div>

                  <div className="flex justify-end">
                    <ArrowUpRight
                      weight="bold"
                      className="hidden h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 md:block"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {meta?.current_page ?? page} of {lastPage} · {total} total
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => goToPage(Math.max(1, page - 1))}
                disabled={(meta?.current_page ?? page) <= 1}
              >
                <CaretLeft weight="bold" className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={(meta?.current_page ?? page) >= lastPage}
              >
                Next
                <CaretRight weight="bold" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {showAdd && (
          <AddStudentModal
            onClose={() => setShowAdd(false)}
            onCreated={handleCreated}
          />
        )}
      </AnimatePresence>
    </PageShell>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="mt-6 flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
        <GraduationCap weight="fill" className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-foreground">No students yet</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        Add your first student to start managing cohorts and issuing certificates.
      </p>
      <Button className="mt-5" onClick={onAdd}>
        <Plus weight="bold" className="h-4 w-4" />
        Add student
      </Button>
    </Card>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="mt-6 flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-soft text-danger">
        <Warning weight="fill" className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        Couldn&apos;t load students
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{message}</p>
      <Button variant="secondary" className="mt-5" onClick={onRetry}>
        Try again
      </Button>
    </Card>
  );
}
