"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { X, DownloadSimple, Warning } from "@phosphor-icons/react";
import { fetchCertificate, saveBlob } from "@/lib/api-client";
import { Button } from "@/components/ui";
import { LearncityMark } from "@/components/brand";

// react-pdf pulls in pdfjs (browser-only), so load it client-side only.
const PdfViewer = dynamic(() => import("@/components/pdf-viewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <LearncityMark className="h-10 w-10 animate-pulse" />
    </div>
  ),
});

/**
 * Previews a student's certificate PDF inline and offers a download.
 * Render inside an <AnimatePresence> so enter/exit animate.
 */
export function CertificateModal({
  id,
  filename,
  studentName,
  onClose,
}: {
  id: string;
  filename: string;
  studentName: string;
  onClose: () => void;
}) {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const b = await fetchCertificate(id);
        if (!active) return;
        setBlob(b);
        setStatus("ready");
      } catch (err) {
        if (!active) return;
        setErrorMsg(
          err instanceof Error ? err.message : "Certificate could not be generated.",
        );
        setStatus("error");
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  // Esc to close + lock background scroll.
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Certificate preview"
        className="relative flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-xl"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.18 }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-foreground">
              Certificate of participation
            </h2>
            <p className="truncate text-sm text-muted-foreground">{studentName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => blob && saveBlob(blob, filename)}
              disabled={status !== "ready"}
            >
              <DownloadSimple weight="bold" className="h-4 w-4" />
              Download
            </Button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="focus-ring rounded-md p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden bg-surface-muted">
          {status === "loading" && (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <LearncityMark className="h-10 w-10 animate-pulse" />
              <p className="text-sm text-muted-foreground">Generating certificate…</p>
            </div>
          )}
          {status === "error" && (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
              <Warning weight="fill" className="h-8 w-8 text-danger" />
              <p className="text-sm text-muted-foreground">{errorMsg}</p>
            </div>
          )}
          {status === "ready" && blob && <PdfViewer file={blob} />}
        </div>
      </motion.div>
    </div>
  );
}
