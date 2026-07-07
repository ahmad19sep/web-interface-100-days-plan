"use client";

import Link from "next/link";
import { initialsOf } from "@/lib/demo";
import {
  computeStreak,
  currentDay,
  shippedCount,
  useProgress,
} from "@/lib/store";
import { buildCells, JourneyCells } from "./JourneyGrid";
import { IconGitHub, IconShare } from "./icons";

function prettyDate(iso: string | null): string {
  if (!iso) return "today";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Profile() {
  const state = useProgress();
  const streak = computeStreak(state.checkins);
  const day = currentDay(state.checkins);
  const done = Object.keys(state.checkins).length;
  const shipped = shippedCount(state.checkins);
  const name = state.name || "Your Name";
  const github = state.github || "github.com/aixahmad";

  return (
    <div>
      <div className="mb-[26px] flex flex-col items-start gap-5 sm:flex-row">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[22px] font-display text-3xl font-bold text-white"
          style={{ background: "linear-gradient(150deg,#7C6CF5,#5B4BD6)" }}
        >
          {initialsOf(name)}
        </div>
        <div className="flex-1 pt-1">
          <div className="mb-1 flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold tracking-[-.02em]">
              {name}
            </h1>
            <span className="rounded-md border border-[#232B35] px-2 py-0.5 text-[11px] text-mut3">
              {state.visibility === "public" ? "Public profile" : "Private profile"}
            </span>
          </div>
          <div className="mb-3 text-[13.5px] text-mut2">
            Joined {prettyDate(state.joined)} · on the 100-day track
          </div>
          <a
            href={`https://${github.replace(/^https?:\/\//, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[7px] text-[13px] !text-mut hover:!text-ink"
          >
            <IconGitHub />
            {github.replace(/^https?:\/\//, "")}
          </a>
        </div>
        <Link
          href="/share"
          className="btn-ghost px-4 py-[11px] text-[13.5px] !rounded-[11px]"
        >
          <IconShare />
          Share card
        </Link>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <div className="card-std rounded-[14px] p-5">
          <div className="font-mono text-3xl font-extrabold text-today">
            {streak.streak}
          </div>
          <div className="mt-1 text-[12.5px] text-mut3">🔥 current streak</div>
        </div>
        <div className="card-std rounded-[14px] p-5">
          <div className="font-mono text-3xl font-extrabold text-accent">
            {done}
          </div>
          <div className="mt-1 text-[12.5px] text-mut3">days done</div>
        </div>
        <div className="card-std rounded-[14px] p-5">
          <div className="font-mono text-3xl font-extrabold text-ink">
            {shipped}
          </div>
          <div className="mt-1 text-[12.5px] text-mut3">projects shipped</div>
        </div>
        <div className="card-std rounded-[14px] p-5">
          <div className="font-mono text-3xl font-extrabold text-ink">
            {streak.longest}
          </div>
          <div className="mt-1 text-[12.5px] text-mut3">longest streak</div>
        </div>
      </div>

      <div className="rounded-[18px] border border-edge bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-display text-base font-semibold">
            Journey map
          </div>
          <Link
            href="/journey"
            className="text-[12.5px] !text-accent hover:!text-accent2"
          >
            Open full →
          </Link>
        </div>
        <JourneyCells
          cells={buildCells(state.checkins, day)}
          variant="flat"
          cols={20}
          gap={5}
          interactive
        />
      </div>
    </div>
  );
}
