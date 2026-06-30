import type { NextRequest } from "next/server";
import { proxyAuthed } from "@/lib/server/api";

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  return proxyAuthed(`/learn-city-bootcamps/${encodeURIComponent(id)}/certificate`);
}
