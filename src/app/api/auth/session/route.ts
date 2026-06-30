import { readAccessToken, readEmail, unauthorized } from "@/lib/server/api";

export async function GET() {
  const token = await readAccessToken();
  if (!token) return unauthorized();
  return Response.json({ email: (await readEmail()) ?? "" });
}
