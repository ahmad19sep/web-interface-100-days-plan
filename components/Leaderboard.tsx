"use client";

import { useState } from "react";
import { DEMO_LEADERS, DEMO_SHOWCASE, initialsOf } from "@/lib/demo";
import {
  computeStreak,
  currentDay,
  useProgress,
} from "@/lib/store";
import { IconHeart } from "./icons";

const FILTERS = ["This week", "All time", "🇵🇰 My country"];

export default function Leaderboard() {
  const state = useProgress();
  const [filter, setFilter] = useState(0);
  const streak = computeStreak(state.checkins);
  const day = Math.min(currentDay(state.checkins), 100);
  const done = Object.keys(state.checkins).length;

  const rows = DEMO_LEADERS.map((u) =>
    u.me
      ? {
          ...u,
          name: `${state.name || "You"} (you)`,
          initials: initialsOf(state.name || "You"),
          day,
          streak: streak.streak,
          total: done,
        }
      : u
  );

  return (
    <div>
      <div className="mb-[22px]">
        <div className="text-sm text-mut2">
          Ranked by consistency — never speed
        </div>
        <h1 className="font-display text-[26px] font-bold tracking-[-.02em]">
          Leaderboard &amp; community
        </h1>
        <div className="mt-1 font-mono text-[11px] text-mut3">
          preview cohort · live sync ships with the community backend
        </div>
      </div>

      <div className="grid items-start gap-[22px] lg:grid-cols-[1.15fr_1fr]">
        {/* ranking */}
        <div className="rounded-[18px] border border-edge bg-card p-[22px]">
          <div className="mb-[18px] flex flex-wrap gap-1.5">
            {FILTERS.map((f, i) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(i)}
                className={`cursor-pointer rounded-full px-3.5 py-[7px] text-xs transition-colors ${
                  filter === i
                    ? "border border-[rgba(53,211,153,.4)] bg-[rgba(53,211,153,.1)] text-accent"
                    : "border border-[#232B35] bg-transparent text-mut2 hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-0.5">
            {rows.map((u) => (
              <div
                key={u.rank}
                className={`flex items-center gap-3 rounded-[11px] px-3 py-[11px] ${
                  u.me
                    ? "border border-[rgba(53,211,153,.28)] bg-[rgba(53,211,153,.08)]"
                    : "border border-transparent"
                }`}
              >
                <span
                  className="w-[26px] font-mono text-sm font-bold"
                  style={{
                    color:
                      u.rank === 1
                        ? "#F5B54B"
                        : u.rank <= 3
                          ? "#ECE6DA"
                          : "#6C7581",
                  }}
                >
                  {u.rank}
                </span>
                <div
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full font-display text-[13px] font-bold text-white"
                  style={{ background: u.avatar }}
                >
                  {u.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-semibold">
                    {u.name}
                  </div>
                  <div className="truncate text-[11.5px] text-mut3">
                    {u.country} · Day {u.day}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="whitespace-nowrap font-mono text-sm text-today">
                    🔥 {u.streak}
                  </div>
                  <div className="whitespace-nowrap text-[11px] text-mut3">
                    {u.total} days
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* showcase wall */}
        <div className="rounded-[18px] border border-edge bg-card p-[22px]">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-display text-base font-semibold">
              Weekly showcase wall
            </div>
            <span className="text-[11.5px] text-mut3">opt-in</span>
          </div>
          <div className="flex flex-col gap-3">
            {DEMO_SHOWCASE.map((c) => (
              <div
                key={c.title}
                className="overflow-hidden rounded-xl border border-edge3 bg-panel"
              >
                <div
                  className="flex h-24 items-center justify-center font-mono text-xs text-[rgba(255,255,255,.55)]"
                  style={{ background: c.thumb }}
                >
                  {c.tag}
                </div>
                <div className="flex items-center gap-2.5 px-3.5 py-3">
                  <div
                    className="h-[26px] w-[26px] shrink-0 rounded-full"
                    style={{ background: c.avatar }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium">
                      {c.title}
                    </div>
                    <div className="text-[11px] text-mut3">{c.who}</div>
                  </div>
                  <div className="flex items-center gap-[5px] text-xs text-mut2">
                    <IconHeart />
                    {c.likes}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
