"use client";

// Wraps every signed-in screen. No active account session (or an unfinished
// onboarding) → back to /start, where a username + code opens the account.

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProfiles } from "@/lib/profiles";
import { useProgress } from "@/lib/store";

export default function AuthGate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { ready, activeId } = useProfiles();
  const { onboarded } = useProgress();
  const allowed = ready && activeId !== null && onboarded;

  useEffect(() => {
    if (ready && !allowed) router.replace("/start");
  }, [ready, allowed, router]);

  if (!allowed) return null;
  return <>{children}</>;
}
