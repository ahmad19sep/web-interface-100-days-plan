"use client";

// The design's 68px icon rail, matched exactly: glowing AX tile, then
// map · today · projects · courses · leaderboard · profile · crown ·
// sliders. The crown is the Creator Studio (the About-me page; the owner's
// crown opens the creator dashboard instead). Mobile keeps the top bar.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOTAL_DAYS } from "@/lib/plan";
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
  { key: "journey", href: "/journey", label: "Journey world", Icon: IconJourney },
  { key: "today", href: "/today", label: "Today", Icon: IconToday },
  { key: "projects", href: "/projects", label: "Projects", Icon: IconProjects },
  { key: "courses", href: "/courses", label: "Courses", Icon: IconCourses },
  { key: "leaderboard", href: "/leaderboard", label: "Leaderboard", Icon: IconLeaderboard },
  { key: "profile", href: "/profile", label: "Profile", Icon: IconProfile },
];

function activeKey(pathname: string): string {
  if (pathname.startsWith("/today")) return "today";
  if (pathname.startsWith("/journey") || pathname.startsWith("/day")) return "journey";
  if (pathname.startsWith("/projects")) return "projects";
  if (pathname.startsWith("/courses")) return "courses";
  if (pathname.startsWith("/leaderboard")) return "leaderboard";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/profile") || pathname.startsWith("/complete")) return "profile";
  if (pathname.startsWith("/settings")) return "settings";
  if (pathname.startsWith("/creator")) return "creator";
  return "today";
}

export default function Sidebar() {
  const pathname = usePathname();
  const state = useProgress();
  const active = activeKey(pathname);
  const day = Math.min(currentDay(state.checkins), TOTAL_DAYS);
  const { streak } = computeStreak(state.checkins);
  const name = state.name || "Your track";
  // Course tabs unlock once the user starts the course (onboarding done);
  // until then the rail is the platform: Courses, Creator Studio, community.
  const COURSE_TABS = ["today", "journey", "projects"];
  const base = state.onboarded
    ? NAV
    : NAV.filter((n) => !COURSE_TABS.includes(n.key));
  const nav = [
    ...base,
    // the crown — the design's Creator Studio slot
    state.isOwner
      ? { key: "creator", href: "/creator", label: "Creator Studio", Icon: IconCreator }
      : { key: "about", href: "/about", label: "Creator Studio — About me", Icon: IconCreator },
    { key: "settings", href: "/settings", label: "Settings", Icon: IconSettings },
  ];

  return (
    <>
      {/* Desktop icon rail */}
      <aside className="fixed bottom-0 left-0 top-0 z-50 hidden w-[68px] flex-col items-center gap-[6px] border-r border-edge bg-[rgba(10,14,23,.95)] py-3.5 lg:flex">
        <Link
          href="/courses"
          title={`Ahmad X AI — ${name}`}
          className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-[10px] font-mono text-[14px] font-extrabold !text-[#06121a]"
          style={{
            background: "linear-gradient(135deg,#0e7490,#22d3ee)",
            boxShadow: "0 3px 0 #083344, 0 0 22px rgba(34,211,238,.35)",
          }}
        >
          AX
        </Link>
        {nav.map(({ key, href, label, Icon }) => (
          <Link
            key={key}
            href={href}
            title={label}
            className={`flex h-[46px] w-[46px] items-center justify-center rounded-[11px] border transition-colors ${
              key === active
                ? "border-[rgba(34,211,238,.4)] bg-[rgba(34,211,238,.12)] !text-accent"
                : "border-transparent !text-mut3 hover:bg-[rgba(34,211,238,.08)] hover:!text-ink"
            }`}
          >
            <Icon size={20} />
          </Link>
        ))}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-divider bg-[rgba(10,14,23,.9)] px-4 py-3 backdrop-blur-[10px] lg:hidden">
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
                  ? "bg-[rgba(34,211,238,.1)] !text-accent"
                  : "!text-mut"
              }`}
            >
              {key === "about" ? "Creator" : label}
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
