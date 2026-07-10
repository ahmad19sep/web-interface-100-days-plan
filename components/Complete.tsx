"use client";

import Link from "next/link";
import { PROJECTS, TOTAL_DAYS } from "@/lib/plan";
import Tilt from "./Tilt";
import { computeStreak, localToday, useProgress } from "@/lib/store";

function prettyMonth(iso: string | null): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.max(
    1,
    Math.round(
      (Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000
    ) + 1
  );
}

export default function Complete() {
  const state = useProgress();
  const done = Object.keys(state.checkins).length;
  const streak = computeStreak(state.checkins);
  const shippedAll = PROJECTS.filter((p) => state.checkins[p.shipDay]).length;
  const elapsed = state.startDate
    ? daysBetween(state.startDate, localToday())
    : done;
  const range = state.startDate
    ? `${prettyMonth(state.startDate)} – ${prettyMonth(localToday())}`
    : `your ${TOTAL_DAYS} days`;

  return (
    <div className="anim-fade-up-slow mx-auto my-2.5 max-w-[720px]">
      <Tilt max={4} className="rounded-3xl">
      <div
        className="relative overflow-hidden rounded-3xl border border-[rgba(53,211,153,.28)] p-8 text-center sm:p-11"
        style={{ background: "linear-gradient(180deg,#12181F,#0E1319)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(500px 240px at 50% -10%,rgba(53,211,153,.12),transparent 70%)",
          }}
        />
        <div className="relative">
          <div className="mb-5 font-mono text-xs tracking-[.14em] text-accent">
            CHALLENGE COMPLETE
          </div>
          <div className="mb-1.5 font-mono text-[100px] font-extrabold leading-[.85] tracking-[-.04em] text-accent">
            {done}
          </div>
          <div className="mb-[26px] font-mono text-base text-mut3">
            / {TOTAL_DAYS} days · {done >= TOTAL_DAYS ? "done" : "so far"}
          </div>
          <h1 className="mb-3 font-display text-3xl font-bold tracking-[-.02em]">
            {done >= TOTAL_DAYS
              ? `You finished the ${TOTAL_DAYS} days.`
              : `The certificate unlocks at Day ${TOTAL_DAYS}.`}
          </h1>
          <p className="mx-auto mb-7 max-w-[440px] text-[15.5px] text-mut">
            {state.name || "You"} · {range}.{" "}
            {done >= TOTAL_DAYS
              ? "Twenty projects shipped, a production capstone built, and a habit that's now yours. This is the hard part most people never reach."
              : "Keep checking in — every day here is one most people never reach."}
          </p>
          <div className="mb-8 flex justify-center gap-[34px]">
            <div>
              <div className="font-mono text-[26px] font-extrabold text-ink">
                {shippedAll}
              </div>
              <div className="text-xs text-mut3">projects</div>
            </div>
            <div>
              <div className="font-mono text-[26px] font-extrabold text-today">
                🔥 {streak.longest}
              </div>
              <div className="text-xs text-mut3">best streak</div>
            </div>
            <div>
              <div className="font-mono text-[26px] font-extrabold text-ink">
                {elapsed}
              </div>
              <div className="text-xs text-mut3">days elapsed</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/share" className="btn-primary px-6 py-[13px] text-[14.5px]">
              Get your share card
            </Link>
            <Link href="/profile" className="btn-ghost px-[22px] py-[13px] text-[14.5px]">
              View profile
            </Link>
          </div>
        </div>
      </div>
      </Tilt>
    </div>
  );
}
