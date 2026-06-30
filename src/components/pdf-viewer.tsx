"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Warning } from "@phosphor-icons/react";
import { LearncityMark } from "@/components/brand";

// Self-hosted worker, version-matched to the installed pdfjs-dist.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

function ViewerMessage({ text, error }: { text: string; error?: boolean }) {
  return (
    <div className="flex h-full min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
      {error ? (
        <Warning weight="fill" className="h-8 w-8 text-danger" />
      ) : (
        <LearncityMark className="h-10 w-10 animate-pulse" />
      )}
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

/** Renders a PDF to canvas (no native browser PDF toolbar). */
export default function PdfViewer({ file }: { file: Blob | string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      // Cap so very large frames don't render an oversized canvas.
      setWidth(Math.min(Math.round(w), 920));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full overflow-auto p-4 sm:p-6">
      <Document
        file={file}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<ViewerMessage text="Loading certificate…" />}
        error={<ViewerMessage error text="Could not display the certificate." />}
        noData={<ViewerMessage error text="No certificate available." />}
        className="flex flex-col items-center gap-4"
      >
        {width > 0 &&
          Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i}
              pageNumber={i + 1}
              width={width}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="overflow-hidden rounded-[var(--radius-md)] border border-border shadow-sm"
            />
          ))}
      </Document>
    </div>
  );
}
