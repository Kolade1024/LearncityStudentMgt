import type { NextRequest } from "next/server";
import { proxyAuthed } from "@/lib/server/api";

const BASE = "/learn-city-bootcamps";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyAuthed(`${BASE}/${encodeURIComponent(id)}`);
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  let body: { name?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (!body.name?.trim()) {
    return Response.json({ message: "Name is required." }, { status: 400 });
  }

  return proxyAuthed(`${BASE}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: body.name.trim() }),
  });
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyAuthed(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" });
}
