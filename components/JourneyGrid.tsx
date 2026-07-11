"use client";

// The 100-cell journey map, in every size the design uses:
//  - preview  (landing hero, 10-col, unlabeled)
//  - mini     (dashboard/profile, 10- or 20-col, unlabeled, clickable)
//  - journey  (full page, 10-col, numbered, pulsing today cell)
//  - share    (share cards, 50- or 20-col micro strip)

import { useRouter } from "next/navigation";
import { DAYS } from "@/lib/plan";
import { dayState, type DayState } from "@/lib/store";

export interface CellData {
  n: number;
  rest: boolean;
  state: DayState;
}

export function buildCells(
  checkins: Record<number, string>,
  current: number
): CellData[] {
  return DAYS.map((d) => ({
    n: d.day,
    rest: d.isRest,
    state: dayState(d.day, checkins, current),
  }));
}

/** Demo cells for the logged-out landing preview (day 37, like the design). */
export function demoCells(current = 37): CellData[] {
  return DAYS.map((d) => ({
    n: d.day,
    rest: d.isRest,
    state: d.day < current ? "done" : d.day === current ? "current" : "locked",
  }));
}

function cellColors(c: CellData) {
  let bg: string;
  let border = "1px solid transparent";
  if (c.state === "done") bg = c.rest ? "var(--rest-done)" : "var(--done)";
  else if (c.state === "current") {
    bg = "rgba(245,181,75,.16)";
    border = "1.5px solid var(--today)";
  } else bg = c.rest ? "transparent" : "var(--locked)";
  if (c.rest && c.state !== "current") border = "1px dashed #3A4552";
  return { bg, border };
}

// Used as a canvas fillStyle in ShareCards.tsx, which can't resolve CSS
// custom properties — keep these as literal hex/rgba, not var(--...).
export function shareCellColor(c: CellData): string {
  if (c.state === "done") return c.rest ? "rgba(34,211,238,.28)" : "#22D3EE";
  if (c.state === "current") return "#F5B54B";
  return "rgba(255,255,255,.07)";
}

export function JourneyCells({
  cells,
  variant,
  cols = 10,
  gap = 6,
  interactive = false,
}: {
  cells: CellData[];
  variant: "flat" | "journey" | "share";
  cols?: number;
  gap?: number;
  interactive?: boolean;
}) {
  const router = useRouter();

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${cols},1fr)`, gap }}
    >
      {cells.map((c) => {
        if (variant === "share") {
          return (
            <div
              key={c.n}
              style={{
                aspectRatio: "1",
                borderRadius: 2,
                background: shareCellColor(c),
              }}
            />
          );
        }
        const { bg, border } = cellColors(c);
        const pulse = c.state === "current" ? "anim-pulse-ring" : "";
        const title = `Day ${c.n}${c.rest ? " · Rest day" : ""} · ${c.state}`;
        if (variant === "journey") {
          let numColor = "var(--dim)";
          let weight = 400;
          if (c.state === "done") {
            numColor = c.rest ? "#5FC7A4" : "#08281E";
            if (!c.rest) weight = 700;
          } else if (c.state === "current") numColor = "var(--today)";
          return (
            <button
              key={c.n}
              type="button"
              title={title}
              onClick={() => router.push(`/learn/day/${c.n}`)}
              className={`cell3d flex cursor-pointer items-center justify-center ${pulse}`}
              style={{
                aspectRatio: "1",
                borderRadius: 9,
                background: bg,
                border,
              }}
            >
              <span
                className="font-mono text-xs"
                style={{ color: numColor, fontWeight: weight }}
              >
                {c.n}
              </span>
            </button>
          );
        }
        // flat (preview / mini)
        const El = interactive ? "button" : "div";
        return (
          <El
            key={c.n}
            type={interactive ? "button" : undefined}
            title={title}
            onClick={
              interactive ? () => router.push(`/learn/day/${c.n}`) : undefined
            }
            className={`${interactive ? "cell3d cursor-pointer" : ""} ${pulse}`}
            style={{
              aspectRatio: "1",
              borderRadius: 4,
              background: bg,
              border,
            }}
          />
        );
      })}
    </div>
  );
}
