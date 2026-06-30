"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import {
  PencilSimple,
  Trash,
  Certificate,
  CalendarBlank,
  Books,
  Broadcast,
  IdentificationCard,
  Clock,
} from "@phosphor-icons/react";
import { getBootcamp, deleteBootcamp, ApiError } from "@/lib/api-client";
import type { Bootcamp } from "@/lib/types";
import { PageShell } from "@/components/page-shell";
import { BackLink } from "@/components/back-link";
import { Button, Card } from "@/components/ui";
import { BootcampAvatar, TypeBadge } from "@/components/bootcamp-bits";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CertificateModal } from "@/components/certificate-modal";
import { EditStudentModal } from "@/components/edit-student-modal";
import { LearncityMark } from "@/components/brand";
import { bootcampName, formatDate, humanize } from "@/lib/utils";

export default function BootcampDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [bootcamp, setBootcamp] = useState<Bootcamp | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const b = await getBootcamp(id);
        if (!active) return;
        setBootcamp(b);
        setStatus("ready");
      } catch (err) {
        if (!active) return;
        if (err instanceof ApiError && err.status === 404) setStatus("missing");
        else {
          setErrorMsg(err instanceof Error ? err.message : "Failed to load.");
          setStatus("error");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteBootcamp(id);
      router.push("/dashboard/bootcamps");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to delete.");
      setDeleting(false);
      setConfirmOpen(false);
      setStatus("error");
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LearncityMark className="h-10 w-10 animate-pulse" />
      </div>
    );
  }

  if (status === "missing" || (status === "error" && !bootcamp)) {
    return (
      <PageShell>
        <BackLink href="/dashboard/bootcamps" label="Back to students" />
        <Card className="flex flex-col items-center px-6 py-16 text-center">
          <h1 className="text-xl font-semibold text-foreground">
            {status === "missing" ? "Student not found" : "Something went wrong"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {status === "missing"
              ? "This student may have been deleted."
              : errorMsg}
          </p>
          <Link href="/dashboard/bootcamps" className="mt-5">
            <Button variant="secondary">Back to students</Button>
          </Link>
        </Card>
      </PageShell>
    );
  }

  if (!bootcamp) return null;

  const facts = [
    { icon: IdentificationCard, label: "Student ID", value: bootcamp.id, mono: true },
    { icon: Books, label: "Course", value: humanize(bootcamp.bootcampCourse) },
    { icon: Broadcast, label: "Delivery type", value: humanize(bootcamp.bootcampType) },
    { icon: CalendarBlank, label: "Start date", value: formatDate(bootcamp.startDate) },
    { icon: CalendarBlank, label: "End date", value: formatDate(bootcamp.endDate) },
    { icon: Clock, label: "Created", value: formatDate(bootcamp.createdAt) },
  ];

  return (
    <PageShell>
      <BackLink href="/dashboard/bootcamps" label="Back to students" />

      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <BootcampAvatar seed={bootcamp.id} size={64} />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {bootcampName(bootcamp.name)}
              </h1>
              <TypeBadge type={bootcamp.bootcampType} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {humanize(bootcamp.bootcampCourse)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" onClick={() => setCertOpen(true)}>
            <Certificate weight="fill" className="h-4 w-4" />
            Certificate
          </Button>
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <PencilSimple weight="bold" className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="ghost" onClick={() => setConfirmOpen(true)}>
            <Trash weight="bold" color="red" className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {status === "error" && bootcamp && (
        <div className="mt-6 rounded-[var(--radius-md)] border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
          {errorMsg}
        </div>
      )}

      {/* Details */}
      <Card className="mt-8 p-6 sm:p-7">
        <h2 className="text-base font-semibold text-foreground">Details</h2>
        <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          {facts.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-surface-muted text-muted-foreground">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {f.label}
                  </dt>
                  <dd
                    className={`mt-0.5 truncate text-[15px] text-foreground ${f.mono ? "font-mono" : ""}`}
                  >
                    {f.value}
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title={`Delete ${bootcampName(bootcamp.name)}?`}
        message="This permanently removes the student. This action cannot be undone."
        confirmLabel={deleting ? "Deleting…" : "Delete student"}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <AnimatePresence>
        {certOpen && (
          <CertificateModal
            id={bootcamp.id}
            studentName={bootcampName(bootcamp.name)}
            filename={`learncity-certificate-${bootcampName(bootcamp.name)
              .toLowerCase()
              .replace(/\s+/g, "-")}.pdf`}
            onClose={() => setCertOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editOpen && (
          <EditStudentModal
            id={bootcamp.id}
            initialName={bootcamp.name ?? ""}
            onClose={() => setEditOpen(false)}
            onUpdated={(name) => {
              setBootcamp((prev) => (prev ? { ...prev, name } : prev));
              setEditOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </PageShell>
  );
}
