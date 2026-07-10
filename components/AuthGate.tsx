"use client";

// Wraps every signed-in screen. Logging in (access code) opens the
// platform tabs — Courses, About me, Leaderboard, Profile, Settings.
// The course tabs (Today / Journey / day pages / Projects / Complete /
// Share) additionally require having started the course (onboarding),
// which the Courses page kicks off.

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProfiles } from "@/lib/profiles";
import { useProgress } from "@/lib/store";

const COURSE_PREFIXES = [
  "/today",
  "/journey",
  "/day",
  "/projects",
  "/complete",
  "/share",
];

export default function AuthGate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, activeId } = useProfiles();
  const { onboarded } = useProgress();

  const needsCourse = COURSE_PREFIXES.some((p) => pathname.startsWith(p));
  const loggedIn = ready && activeId !== null;
  const allowed = loggedIn && (!needsCourse || onboarded);

  useEffect(() => {
    if (!ready || allowed) return;
    if (!loggedIn) router.replace("/start");
    else router.replace("/courses"); // logged in, course not started yet
  }, [ready, allowed, loggedIn, router]);

  if (!allowed) return null;
  return <>{children}</>;
}
