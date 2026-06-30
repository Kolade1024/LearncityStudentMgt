import { backendFetch, writeSession } from "@/lib/server/api";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  if (!email || !password) {
    return Response.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  const res = await backendFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const message =
      res.status === 401
        ? "Incorrect email or password."
        : "Sign in failed. Please try again.";
    return Response.json({ message }, { status: res.status });
  }

  const tokens = (await res.json()) as {
    accessToken: string;
    refreshToken: string;
    expiration?: string;
  };

  await writeSession(tokens, email);
  return Response.json({ email });
}
