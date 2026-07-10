"use client";

// The Leaderboard Road — the design's screen on real accounts: the "same
// road" strip up top with every public explorer's 3D character standing at
// their day, then clean full-width ranked rows (medal styling for the top
// three, your row glowing amber). Ranked by consistency — never speed.

import { useEffect, useState } from "react";
import type { Badge } from "@/lib/badges";
import { TOTAL_DAYS } from "@/lib/plan";
import { useProgress } from "@/lib/store";
import Avatar3D from "./Avatar3D";
import LeaderboardPodium from "./LeaderboardPodium";

interface Member {
  handle: string;
  name: string;
  avatar?: string;
  day: number;
  streak: number;
  totalDays: number;
  shipped: number;
  badges: Badge[];
  quizScore: number | null;
}

type CommunityFetch =
  | { state: "loading" }
  | { state: "not-configured" }
  | { state: "error" }
  | { state: "ready"; members: Member[] };

function useCommunity(): CommunityFetch {
  const [result, setResult] = useState<CommunityFetch>({ state: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/community")
      .then((res) => res.json())
      .then((body: { members?: Member[]; notConfigured?: boolean }) => {
        if (cancelled) return;
        if (body.notConfigured) setResult({ state: "not-configured" });
        else setResult({ state: "ready", members: body.members ?? [] });
      })
      .catch(() => {
        if (!cancelled) setResult({ state: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return result;
}

/** Display XP from public stats (lesson 100 / ship-day 250). */
function xpOf(m: Member): number {
  return (m.totalDays - m.shipped) * 100 + m.shipped * 250;
}

const RANK_STYLE = [
  { color: "#f59e0b", medal: "🥇" },
  { color: "#c3cddc", medal: "🥈" },
  { color: "#e8a06b", medal: "🥉" },
];

export default function Leaderboard() {
  const state = useProgress();
  const community = useCommunity();

  return (
    <div>
      <div className="mb-[22px]">
        <div className="text-sm text-mut2">
          Ranked by consistency — never speed
        </div>
        <h1 className="font-display text-[26px] font-bold tracking-[-.02em]">
          The Leaderboard Road
        </h1>
        <div className="mt-1 font-mono text-[11px] text-mut3">
          everyone who&apos;s chosen a public profile shows up here
        </div>
      </div>

      {community.state === "loading" && (
        <div className="card-std rounded-[18px] py-14 text-center text-[13px] text-mut3">
          Loading the community…
        </div>
      )}

      {community.state === "not-configured" && (
        <div className="card-std rounded-[18px] py-14 text-center text-[13px] leading-[1.6] text-mut3">
          The community backend isn&apos;t connected yet — this road fills in
          once it is.
        </div>
      )}

      {community.state === "error" && (
        <div className="card-std rounded-[18px] py-14 text-center text-[13px] text-mut3">
          Couldn&apos;t load the community right now — try again shortly.
        </div>
      )}

      {community.state === "ready" && community.members.length === 0 && (
        <div className="card-std rounded-[18px] py-14 text-center text-[13px] leading-[1.6] text-mut3">
          No public tracks yet.{" "}
          {state.visibility === "public"
            ? "You'll show up here once you've checked in a day."
            : "Turn on a public profile in Settings to be the first."}
        </div>
      )}

      {community.state === "ready" && community.members.length > 0 && (
        <>
          {/* ── the 3D podium ── */}
          <LeaderboardPodium
            winners={community.members.slice(0, 3).map((u) => ({
              handle: u.handle,
              name: u.name,
              avatar: u.avatar,
              xp: xpOf(u),
            }))}
          />

          {/* ── the same road ── */}
          <div className="mb-[22px] rounded-[18px] border border-edge bg-card px-5 py-5 sm:px-7">
            <div className="mb-3 font-mono text-[10px] tracking-[.22em] text-mut3">
              THE SAME ROAD — EVERYONE&apos;S POSITION ON THE {TOTAL_DAYS}-DAY
              PATH
            </div>
            <div className="relative h-[104px]">
              <div
                className="absolute left-0 right-0 top-[58px] h-[3px] rounded-[2px]"
                style={{
                  background: "linear-gradient(90deg,#0e7490,#1a2338)",
                }}
              />
              {community.members.slice(0, 14).map((u, i) => {
                const me = Boolean(state.handle) && u.handle === state.handle;
                const pct = 3 + (Math.min(u.day, TOTAL_DAYS) / TOTAL_DAYS) * 94;
                const above = i % 2 === 0;
                const size = me ? 42 : 30;
                const showTag =
                  me || community.members.length <= 9 || i % 2 === 0;
                return (
                  <div
                    key={u.handle}
                    className="absolute bottom-0 top-0"
                    style={{ left: `${pct}%` }}
                  >
                    {showTag && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tracking-[.08em]"
                        style={{
                          top: above ? 12 : 84,
                          color: me ? "#f59e0b" : "#61708a",
                        }}
                      >
                        {me ? "YOU" : u.name.split(" ")[0].toUpperCase()}
                      </div>
                    )}
                    <div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{ top: 58 - size / 2 }}
                      title={`${u.name} — Day ${u.day}`}
                    >
                      <Avatar3D
                        id={u.avatar}
                        size={size}
                        className={me ? "ring-2 ring-[#f59e0b]" : ""}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── the ranking ── */}
          <div className="flex flex-col gap-2">
            {community.members.map((u, i) => {
              const me = Boolean(state.handle) && u.handle === state.handle;
              const top = RANK_STYLE[i];
              return (
                <div
                  key={u.handle}
                  className="flex items-center gap-3 rounded-[14px] border px-4 py-3 transition-colors sm:gap-4 sm:px-5"
                  style={{
                    borderColor: me
                      ? "rgba(245,158,11,.45)"
                      : i === 0
                        ? "rgba(34,211,238,.25)"
                        : "rgba(148,163,184,.1)",
                    background: me
                      ? "rgba(245,158,11,.05)"
                      : "rgba(13,20,36,.72)",
                    boxShadow:
                      i === 0 ? "0 0 26px rgba(34,211,238,.08)" : undefined,
                  }}
                >
                  <div
                    className="w-9 shrink-0 font-mono text-[15px] font-bold"
                    style={{ color: top?.color ?? "#61708a" }}
                  >
                    {top ? top.medal : `#${i + 1}`}
                  </div>
                  <Avatar3D id={u.avatar} size={i < 3 ? 44 : 38} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14.5px] font-semibold">
                      {u.name}
                      {me && (
                        <span className="ml-1.5 font-mono text-[10px] tracking-[.08em] text-today">
                          (YOU)
                        </span>
                      )}
                    </div>
                    <div className="truncate font-mono text-[10px] tracking-[.04em] text-mut3">
                      @{u.handle}
                      {u.shipped > 0 && ` · 📦 ${u.shipped} shipped`}
                      {u.badges.length > 0 &&
                        ` · ${u.badges
                          .slice(0, 3)
                          .map((b) => b.emoji)
                          .join(" ")}`}
                    </div>
                  </div>
                  <div className="hidden w-[64px] whitespace-nowrap font-mono text-[12px] text-mut sm:block">
                    Day {u.day}
                  </div>
                  <div className="w-[52px] whitespace-nowrap font-mono text-[12px] text-mut">
                    🔥 {u.streak}
                  </div>
                  <div className="w-[76px] whitespace-nowrap text-right font-mono text-[12px] font-bold text-accent">
                    {xpOf(u)} XP
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
