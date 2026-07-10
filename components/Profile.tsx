"use client";

// The Explorer Profile — the design's layout on real data: a big live 3D
// character card on the left (with the real character picker, not color
// swatches), and on the right the stat grid, badge shelf and per-week
// region progress. Everything derives fresh from check-ins (lib/game.ts).

import Link from "next/link";
import { AVATARS } from "@/lib/avatars";
import { levelOf, weekColorCss, weekProgress, xpOf } from "@/lib/game";
import { TOTAL_DAYS, TOTAL_PROJECTS } from "@/lib/plan";
import {
  computeStreak,
  currentDay,
  setAvatar,
  shippedCount,
  useProgress,
} from "@/lib/store";
import { useState } from "react";
import Avatar3D from "./Avatar3D";
import { SettingsPanel } from "./Settings";
import { IconGitHub, IconSettings, IconShare } from "./icons";

function joinedLabel(iso: string | null): string {
  if (!iso) return "THIS MONTH";
  const [y, m] = iso.split("-").map(Number);
  return new Date(y, m - 1, 1)
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toUpperCase();
}

export default function Profile() {
  const state = useProgress();
  const [showSettings, setShowSettings] = useState(false);
  const streak = computeStreak(state.checkins);
  const done = Object.keys(state.checkins).length;
  const day = Math.min(currentDay(state.checkins), TOTAL_DAYS);
  const shipped = shippedCount(state.checkins);
  const xp = xpOf(state.checkins);
  const level = levelOf(xp);
  const gates = Object.keys(state.quizAnswers).length;
  const weeks = weekProgress(state.checkins);
  const weeksCleared = weeks.filter((w) => w.done >= w.total).length;
  const name = state.name || "Explorer";
  const github = state.github || "";

  const stats = [
    { label: "CURRENT DAY", value: String(day), color: "#f59e0b" },
    { label: "STREAK", value: `${streak.streak} 🔥`, color: "#e6ecf5" },
    { label: "TOTAL XP", value: String(xp), color: "#22d3ee" },
    { label: "QUIZ GATES", value: String(gates), color: "#e6ecf5" },
    { label: "PROJECTS", value: `${shipped}/${TOTAL_PROJECTS}`, color: "#a78bfa" },
    { label: "WEEKS CLEARED", value: `${weeksCleared}/${weeks.length}`, color: "#34d399" },
  ];

  const badges = [
    { icon: "⚡", name: "FIRST CALL", hint: "Complete Day 1", ok: !!state.checkins[1] },
    { icon: "🛠️", name: "SHIPPER", hint: "Ship your first project", ok: shipped >= 1 },
    { icon: "🔥", name: "WEEK ONE", hint: "Hold a 7-day streak", ok: streak.longest >= 7 },
    { icon: "🌗", name: "ONE MONTH", hint: "Complete 30 days", ok: done >= 30 },
    { icon: "⛰️", name: "HALFWAY", hint: "Complete 60 days", ok: done >= 60 },
    { icon: "💯", name: "CENTURION", hint: "Complete 100 days", ok: done >= 100 },
    { icon: "🚀", name: "LAUNCHED", hint: `Finish Day ${TOTAL_DAYS}`, ok: done >= TOTAL_DAYS },
  ];

  return (
    <div>
      <div className="mb-[22px] flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-sm text-mut2">Your explorer, your record</div>
          <h1 className="font-display text-[26px] font-bold tracking-[-.02em]">
            Explorer Profile
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setShowSettings((v) => !v)}
          className={`flex cursor-pointer items-center gap-2 rounded-[11px] border px-4 py-2.5 font-mono text-[11px] tracking-[.1em] transition-colors ${
            showSettings
              ? "border-[rgba(34,211,238,.4)] bg-[rgba(34,211,238,.1)] text-accent"
              : "border-edge2 bg-card2 text-mut2 hover:text-ink"
          }`}
        >
          <IconSettings size={15} />
          SETTINGS {showSettings ? "▴" : "▾"}
        </button>
      </div>

      {showSettings && (
        <div className="anim-rise mb-6">
          <SettingsPanel />
        </div>
      )}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        {/* ── the explorer card ── */}
        <div className="card-std w-full shrink-0 rounded-[18px] p-6 text-center lg:w-[300px]">
          <div className="mb-4 flex justify-center">
            <Avatar3D id={state.avatar} size={150} live />
          </div>
          <div className="font-display text-[21px] font-bold">{name}</div>
          <div className="mt-1 font-mono text-[10.5px] tracking-[.22em] text-today">
            LEVEL {level} EXPLORER
          </div>
          <div className="mt-1.5 font-mono text-[9.5px] tracking-[.1em] text-mut3">
            JOINED {joinedLabel(state.joined)} ·{" "}
            {state.visibility === "public" ? "PUBLIC" : "PRIVATE"} PROFILE
          </div>
          {github && (
            <a
              href={`https://${github.replace(/^https?:\/\//, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-[12px] !text-mut hover:!text-ink"
            >
              <IconGitHub size={13} />
              {github.replace(/^https?:\/\//, "").replace(/^github\.com\//, "")}
            </a>
          )}

          <div className="mt-4 border-t border-divider pt-4">
            <div className="mb-2.5 font-mono text-[9.5px] tracking-[.24em] text-mut3">
              YOUR CHARACTER
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  title={a.label}
                  onClick={() => setAvatar(a.id)}
                  className={`cursor-pointer rounded-full p-[2px] transition-transform ${
                    state.avatar === a.id
                      ? "scale-110 ring-2 ring-accent"
                      : "opacity-55 hover:scale-105 hover:opacity-100"
                  }`}
                >
                  <Avatar3D id={a.id} size={34} />
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/share"
            className="btn-ghost mt-5 w-full px-4 py-[11px] text-[13px] !rounded-[11px]"
          >
            <IconShare />
            Share card
          </Link>
        </div>

        {/* ── the record ── */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {/* stat grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="card-std rounded-[14px] p-4">
                <div
                  className="font-mono text-[22px] font-extrabold leading-none"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="mt-1.5 font-mono text-[9.5px] tracking-[.14em] text-mut3">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* badges */}
          <div className="card-std rounded-[16px] p-5">
            <div className="mb-3 font-mono text-[10px] tracking-[.24em] text-mut3">
              BADGES
            </div>
            <div className="flex flex-wrap gap-2.5">
              {badges.map((b) => (
                <div
                  key={b.name}
                  title={b.hint}
                  className="flex items-center gap-2 rounded-[9px] border px-3 py-2"
                  style={{
                    opacity: b.ok ? 1 : 0.35,
                    borderColor: b.ok
                      ? "rgba(245,158,11,.35)"
                      : "rgba(148,163,184,.12)",
                    background: b.ok
                      ? "rgba(245,158,11,.07)"
                      : "rgba(148,163,184,.04)",
                  }}
                >
                  <span className="text-[15px]">{b.icon}</span>
                  <span
                    className="font-mono text-[10px] tracking-[.08em]"
                    style={{ color: b.ok ? "#e6ecf5" : "#61708a" }}
                  >
                    {b.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* per-week regions */}
          <div className="card-std rounded-[16px] p-5">
            <div className="mb-3 font-mono text-[10px] tracking-[.24em] text-mut3">
              REGIONS — WEEK BY WEEK
            </div>
            <div className="flex flex-col gap-2">
              {weeks.map((w) => {
                const color = weekColorCss(w.week);
                return (
                  <div key={w.week} className="flex items-center gap-3">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: color }}
                    />
                    <div className="w-[46%] truncate text-[12.5px] text-mut sm:w-[220px]">
                      W{w.week} · {w.title}
                    </div>
                    <div className="h-[5px] flex-1 overflow-hidden rounded-[3px] bg-[#1a2338]">
                      <div
                        className="h-full rounded-[3px]"
                        style={{
                          width: `${Math.round((w.done / w.total) * 100)}%`,
                          background: color,
                        }}
                      />
                    </div>
                    <div className="w-[44px] text-right font-mono text-[10.5px] text-mut3">
                      {w.done}/{w.total}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
