"use client";

import { useEffect, useState } from "react";
import type { Badge } from "@/lib/badges";
import { DEMO_SHOWCASE } from "@/lib/demo";
import { TOTAL_DAYS } from "@/lib/plan";
import { useProgress } from "@/lib/store";
import Avatar3D from "./Avatar3D";
import { IconHeart } from "./icons";

const FILTERS = ["This week", "All time"];

interface Member {
  handle: string;
  name: string;
  avatar?: string;
  day: number;
  streak: number;
  totalDays: number;
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

export default function Leaderboard() {
  const state = useProgress();
  const [filter, setFilter] = useState(1);
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

      {/* the same road — every explorer's 3D character at their day */}
      {community.state === "ready" && community.members.length > 0 && (
        <div className="mb-[22px] rounded-[18px] border border-edge bg-card px-5 py-5 sm:px-7">
          <div className="mb-3 font-mono text-[10px] tracking-[.22em] text-mut3">
            THE SAME ROAD — EVERYONE&apos;S POSITION ON THE {TOTAL_DAYS}-DAY
            PATH
          </div>
          <div className="relative h-[104px]">
            <div
              className="absolute left-0 right-0 top-[58px] h-[3px] rounded-[2px]"
              style={{ background: "linear-gradient(90deg,#0e7490,#1a2338)" }}
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
      )}

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
                    ? "border border-[rgba(34,211,238,.4)] bg-[rgba(34,211,238,.1)] text-accent"
                    : "border border-[#232B35] bg-transparent text-mut2 hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {community.state === "loading" && (
            <div className="py-8 text-center text-[13px] text-mut3">
              Loading the community…
            </div>
          )}

          {community.state === "not-configured" && (
            <div className="py-8 text-center text-[13px] leading-[1.6] text-mut3">
              The community backend isn&apos;t connected yet — this list
              fills in once it is.
            </div>
          )}

          {community.state === "error" && (
            <div className="py-8 text-center text-[13px] text-mut3">
              Couldn&apos;t load the community right now — try again shortly.
            </div>
          )}

          {community.state === "ready" && community.members.length === 0 && (
            <div className="py-8 text-center text-[13px] leading-[1.6] text-mut3">
              No public tracks yet.{" "}
              {state.visibility === "public"
                ? "You'll show up here once you've checked in a day."
                : "Turn on a public profile in Settings to be the first."}
            </div>
          )}

          {community.state === "ready" && community.members.length > 0 && (
            <div className="flex flex-col gap-0.5">
              {community.members.map((u, i) => {
                const me = Boolean(state.handle) && u.handle === state.handle;
                return (
                  <div
                    key={u.handle}
                    className={`flex items-center gap-3 rounded-[11px] px-3 py-[11px] ${
                      me
                        ? "border border-[rgba(34,211,238,.28)] bg-[rgba(34,211,238,.08)]"
                        : "border border-transparent"
                    }`}
                  >
                    <span
                      className="w-[26px] font-mono text-sm font-bold"
                      style={{
                        color:
                          i === 0 ? "#F5B54B" : i < 3 ? "#ECE6DA" : "#6C7581",
                      }}
                    >
                      {i + 1}
                    </span>
                    <Avatar3D id={u.avatar} size={34} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[13.5px] font-semibold">
                          {u.name}
                        </span>
                        {u.badges.length > 0 && (
                          <span className="flex shrink-0 items-center gap-[3px]">
                            {u.badges.map((b) => (
                              <span key={b.id} title={`${b.label} — ${b.description}`}>
                                {b.emoji}
                              </span>
                            ))}
                          </span>
                        )}
                      </div>
                      <div className="truncate text-[11.5px] text-mut3">
                        @{u.handle} · Day {u.day}
                        {u.quizScore !== null && ` · 🎯 ${u.quizScore}%`}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="whitespace-nowrap font-mono text-sm text-today">
                        🔥 {u.streak}
                      </div>
                      <div className="whitespace-nowrap text-[11px] text-mut3">
                        {u.totalDays} days
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* showcase wall */}
        <div className="rounded-[18px] border border-edge bg-card p-[22px]">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-display text-base font-semibold">
              Weekly showcase wall
            </div>
            <span className="text-[11.5px] text-mut3">preview · opt-in</span>
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
