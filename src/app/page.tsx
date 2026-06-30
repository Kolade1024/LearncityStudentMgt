"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { LearncityMark } from "@/components/brand";

export default function Home() {
  const router = useRouter();
  const { session, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    router.replace(session ? "/dashboard" : "/login");
  }, [ready, session, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LearncityMark className="h-12 w-12 animate-pulse" />
    </div>
  );
}
