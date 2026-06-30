import type { NextRequest } from "next/server";
import { proxyAuthed } from "@/lib/server/api";

const BASE = "/learn-city-bootcamps";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const qs = new URLSearchParams();
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  if (page) qs.set("page", page);
  if (pageSize) qs.set("pageSize", pageSize);
  const query = qs.toString();
  return proxyAuthed(query ? `${BASE}?${query}` : BASE);
}

export async function POST(request: NextRequest) {
  let body: { name?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (!body.name?.trim()) {
    return Response.json({ message: "Name is required." }, { status: 400 });
  }

  return proxyAuthed(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: body.name.trim() }),
  });
}
