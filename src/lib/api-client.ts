"use client";

import type { Bootcamp, Paginated } from "./types";

/** Error thrown by the client API layer, carrying the HTTP status. */
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function messageFrom(data: unknown): string | undefined {
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    for (const key of ["message", "title", "detail"]) {
      if (typeof d[key] === "string" && d[key]) return d[key] as string;
    }
  }
  return undefined;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    cache: "no-store",
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
  });

  if (res.status === 401) {
    // Session expired — bounce to login.
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new ApiError(401, "Your session has expired. Please sign in again.");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, messageFrom(data) ?? "Something went wrong.");
  }
  return data as T;
}

export interface MutationResult {
  id: string;
  name: string | null;
  message: string;
}

export function listBootcamps(
  page = 1,
  pageSize = 10,
): Promise<Paginated<Bootcamp>> {
  return apiFetch<Paginated<Bootcamp>>(
    `/api/bootcamps?page=${page}&pageSize=${pageSize}`,
  );
}

export function getBootcamp(id: string): Promise<Bootcamp> {
  return apiFetch<Bootcamp>(`/api/bootcamps/${id}`);
}

export function createBootcamp(name: string): Promise<MutationResult> {
  return apiFetch<MutationResult>("/api/bootcamps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
}

export function updateBootcamp(id: string, name: string): Promise<MutationResult> {
  return apiFetch<MutationResult>(`/api/bootcamps/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
}

export async function deleteBootcamp(id: string): Promise<void> {
  await apiFetch<unknown>(`/api/bootcamps/${id}`, { method: "DELETE" });
}

export function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<unknown> {
  return apiFetch<unknown>("/api/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

/** Fetch the certificate as a PDF blob (typed as application/pdf for inline preview). */
export async function fetchCertificate(id: string): Promise<Blob> {
  const res = await fetch(`/api/bootcamps/${id}/certificate`, { cache: "no-store" });
  if (res.status === 401) {
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new ApiError(401, "Your session has expired. Please sign in again.");
  }
  if (!res.ok) {
    throw new ApiError(res.status, "Certificate could not be generated.");
  }
  const buffer = await res.arrayBuffer();
  return new Blob([buffer], { type: "application/pdf" });
}

/** Trigger a browser download for a blob. */
export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Fetch the certificate PDF and trigger a download in one step. */
export async function downloadCertificate(id: string, filename: string): Promise<void> {
  saveBlob(await fetchCertificate(id), filename);
}
