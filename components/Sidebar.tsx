"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { initialsOf } from "@/lib/demo";
import { computeStreak, currentDay, useProgress } from "@/lib/store";
import {
  IconCourses,
  IconCreator,
  IconJourney,
  IconLeaderboard,
  IconProfile,
  IconProjects,
  IconSettings,
  IconToday,
  Logo,
} from "./icons";

const NAV = [
  { key: "today", href: "/today", label: "Today", Icon: IconToday },
  { key: "journey", href: "/journey", label: "Journey map", Icon: IconJourney },
  { key: "projects", href: "/projects", label: "Projects", Icon: IconProjects },
  { key: "courses", href: "/courses", label: "Courses", Icon: IconCourses },
  { key: "leaderboard", href: "/leaderboard", label: "Leaderboard", Icon: IconLeaderboard },
  { key: "profile", href: "/profile", label: "Profile", Icon: IconProfile },
  { key: "settings", href: "/settings", label: "Settings", Icon: IconSettings },
];

function activeKey(pathname: string): string {
  if (pathname.startsWith("/today")) return "today";
  if (pathname.startsWith("/journey") || pathname.startsWith("/day")) return "journey";
  if (pathname.startsWith("/projects")) return "projects";
  if (pathname.startsWith("/courses")) return "courses";
  if (pathname.startsWith("/leaderboard")) return "leaderboard";
  if (pathname.startsWith("/profile") || pathname.startsWith("/complete")) return "profile";
  if (pathname.startsWith("/settings")) return "settings";
  if (pathname.startsWith("/creator")) return "creator";
  return "today";
}

export default function Sidebar() {
  const pathname = usePathname();
  const state = useProgress();
  const active = activeKey(pathname);
  const day = Math.min(currentDay(state.checkins), 100);
  const { streak } = computeStreak(state.checkins);
  const name = state.name || "Your track";
  const nav = state.isOwner
    ? [...NAV, { key: "creator", href: "/creator", label: "Creator", Icon: IconCreator }]
    : NAV;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col border-r border-divider bg-panel px-4 py-6 lg:flex">
        <Link href="/" className="flex items-center gap-2.5 px-2 pb-[22px]">
          <Logo size={30} radius={8} />
          <div className="font-display text-[13.5px] font-semibold leading-[1.15] text-ink">
            100 Days
            <br />
            <span className="text-[11px] font-normal text-mut3">
              of Modern AI
            </span>
          </div>
        </Link>
        <nav className="flex flex-col gap-[3px]">
          {nav.map(({ key, href, label, Icon }) => (
            <Link
              key={key}
              href={href}
              className={`flex w-full items-center gap-[11px] rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                key === active
                  ? "bg-[rgba(53,211,153,.1)] !text-accent"
                  : "!text-mut hover:!text-ink"
              }`}
            >
              <span className="flex w-[18px]">
                <Icon />
              </span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <Link
          href="/profile"
          className="mt-auto block rounded-xl border border-[#202832] bg-card p-3.5"
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-bold text-white"
              style={{ background: "linear-gradient(150deg,#7C6CF5,#5B4BD6)" }}
            >
              {initialsOf(name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold text-ink">
                {name}
              </div>
              <div className="font-mono text-[11px] text-accent">
                Day {day} · 🔥 {streak}
              </div>
            </div>
          </div>
        </Link>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-divider bg-[rgba(13,17,23,.9)] px-4 py-3 backdrop-blur-[10px] lg:hidden">
        <Link href="/" className="shrink-0">
          <Logo size={28} radius={8} />
        </Link>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {nav.map(({ key, href, label }) => (
            <Link
              key={key}
              href={href}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                key === active
                  ? "bg-[rgba(53,211,153,.1)] !text-accent"
                  : "!text-mut"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <span className="shrink-0 font-mono text-[11px] text-accent">
          D{day} · 🔥{streak}
        </span>
      </div>
    </>
  );
}
