import { proxyAuthed } from "@/lib/server/api";

export async function POST(request: Request) {
  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (!body.currentPassword || !body.newPassword) {
    return Response.json(
      { message: "Current and new password are required." },
      { status: 400 },
    );
  }

  return proxyAuthed("/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    }),
  });
}
