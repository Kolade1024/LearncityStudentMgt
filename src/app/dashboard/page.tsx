"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  GraduationCap,
  Broadcast,
  Buildings,
  ArrowRight,
  ArrowUpRight,
  Plus,
} from "@phosphor-icons/react";
import { listBootcamps } from "@/lib/api-client";
import type { Bootcamp } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { PageShell, PageHeader } from "@/components/page-shell";
import { Button, Card } from "@/components/ui";
import { BootcampAvatar, TypeBadge } from "@/components/bootcamp-bits";
import { AddStudentModal } from "@/components/add-student-modal";
import { bootcampName, formatDateShort, humanize } from "@/lib/utils";

export default function OverviewPage() {
  const { session } = useAuth();
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [data, setData] = useState<Bootcamp[]>([]);
  const [total, setTotal] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await listBootcamps(1, 100);
        if (active) {
          setData(res.data ?? []);
          setTotal(res.meta?.total ?? res.data?.length ?? 0);
        }
      } catch {
        /* surfaced on the Bootcamps page; keep the overview calm */
      } finally {
        if (active) setReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const countByType = (t: string) =>
    data.filter((b) => b.bootcampType?.toLowerCase() === t).length;

  const stats = [
    { label: "Total students", value: total, icon: GraduationCap, note: "Across LearnCity" },
    { label: "Online", value: countByType("online"), icon: Broadcast, note: "Remote delivery" },
    { label: "Onsite", value: countByType("onsite"), icon: Buildings, note: "In-person cohorts" },
  ];

  const recent = data.slice(0, 5);

  return (
    <PageShell>
      <PageHeader
        title="Overview"
        description={
          session?.email
            ? `Signed in as ${session.email}.`
            : "Here's how LearnCity is doing today."
        }
        actions={
          <Button onClick={() => setShowAdd(true)}>
            <Plus weight="bold" className="h-4 w-4" />
            Add student
          </Button>
        }
      />

      {/* Stats */}
      <motion.div
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Card className="p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-brand-soft text-brand-strong">
                  <Icon weight="fill" className="h-5 w-5" />
                </span>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                  {ready ? stat.value : "—"}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.note}</p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent bootcamps */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Recent students
          </h2>
          <Link
            href="/dashboard/bootcamps"
            className="focus-ring inline-flex items-center gap-1 rounded-md text-sm font-medium text-brand-strong hover:underline"
          >
            View all
            <ArrowRight weight="bold" className="h-4 w-4" />
          </Link>
        </div>

        {ready && recent.length === 0 ? (
          <Card className="mt-4 flex flex-col items-center px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No students yet.{" "}
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="focus-ring rounded font-medium text-brand-strong hover:underline"
              >
                Add your first one.
              </button>
            </p>
          </Card>
        ) : (
          <Card className="mt-4 divide-y divide-border overflow-hidden">
            {recent.map((b) => (
              <Link
                key={b.id}
                href={`/dashboard/bootcamps/${b.id}`}
                className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-muted/60"
              >
                <BootcampAvatar seed={b.id} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {bootcampName(b.name)}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {humanize(b.bootcampCourse)}
                  </p>
                </div>
                <div className="hidden w-28 text-sm text-muted-foreground md:block">
                  {formatDateShort(b.createdAt)}
                </div>
                <TypeBadge type={b.bootcampType} />
                <ArrowUpRight
                  weight="bold"
                  className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                />
              </Link>
            ))}
          </Card>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <AddStudentModal
            onClose={() => setShowAdd(false)}
            onCreated={(id) => {
              setShowAdd(false);
              router.push(`/dashboard/bootcamps/${id}`);
            }}
          />
        )}
      </AnimatePresence>
    </PageShell>
  );
}
