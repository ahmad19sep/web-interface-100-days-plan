"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar3D from "./Avatar3D";
import { TOTAL_DAYS } from "@/lib/plan";
import { computeStreak, currentDay, useProgress } from "@/lib/store";
import {
  IconAbout,
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
  { key: "about", href: "/about", label: "About me", Icon: IconAbout },
  { key: "profile", href: "/profile", label: "Profile", Icon: IconProfile },
  { key: "settings", href: "/settings", label: "Settings", Icon: IconSettings },
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
  // until then the sidebar is the platform: Courses, About me, community.
  const COURSE_TABS = ["today", "journey", "projects"];
  const base = state.onboarded
    ? NAV
    : NAV.filter((n) => !COURSE_TABS.includes(n.key));
  const nav = state.isOwner
    ? [...base, { key: "creator", href: "/creator", label: "Creator", Icon: IconCreator }]
    : base;

  return (
    <>
      {/* Desktop icon rail — the design's slim 68px nav */}
      <aside className="fixed bottom-0 left-0 top-0 z-50 hidden w-[68px] flex-col items-center gap-1 border-r border-edge bg-[rgba(10,14,23,.95)] py-3.5 lg:flex">
        <Link
          href="/courses"
          title={`Ahmad X AI — ${name}`}
          className="mb-3 flex h-10 w-10 items-center justify-center rounded-[10px] font-mono text-[14px] font-extrabold !text-[#06121a] shadow-[0_3px_0_#083344]"
          style={{ background: "linear-gradient(135deg,#0e7490,#22d3ee)" }}
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
        <Link
          href="/profile"
          title={`${name} — Day ${day} · 🔥 ${streak}`}
          className="mt-auto"
        >
          <Avatar3D id={state.avatar} size={38} />
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
                  ? "bg-[rgba(34,211,238,.1)] !text-accent"
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
