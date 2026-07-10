// Shared "game layer" math — XP, levels, ship days and the week palette.
// Everything derives fresh from check-ins; nothing is stored, so tuning
// the rules never needs a migration. Used by the 3D world HUD and the
// Explorer Profile alike.

import { DAYS, PROJECTS, WEEKS } from "./plan";

export const SHIP_DAYS = new Set(PROJECTS.map((p) => p.shipDay));

// One color band per week, cycling a fixed palette so the road visibly
// changes climate as you travel — fully derived from the curriculum data.
export const WEEK_PALETTE_HEX = [
  0x22d3ee, 0x7dd3fc, 0x34d399, 0xa78bfa, 0xfb923c, 0xf59e0b,
];
export const WEEK_PALETTE_CSS = [
  "#22d3ee", "#7dd3fc", "#34d399", "#a78bfa", "#fb923c", "#f59e0b",
];
export function weekColorHex(week: number): number {
  return WEEK_PALETTE_HEX[(week - 1) % WEEK_PALETTE_HEX.length];
}
export function weekColorCss(week: number): string {
  return WEEK_PALETTE_CSS[(week - 1) % WEEK_PALETTE_CSS.length];
}

/** 100 XP per lesson day, 250 per shipped project day, 40 per rest day. */
export function xpOf(checkins: Record<number, string>): number {
  let xp = 0;
  for (const key of Object.keys(checkins)) {
    const n = Number(key);
    xp += SHIP_DAYS.has(n) ? 250 : DAYS[n - 1]?.isRest ? 40 : 100;
  }
  return xp;
}

export function levelOf(xp: number): number {
  return 1 + Math.floor(xp / 500);
}

export interface WeekProgress {
  week: number;
  title: string;
  start: number;
  end: number;
  done: number;
  total: number;
}

/** Days completed inside each curriculum week. */
export function weekProgress(
  checkins: Record<number, string>
): WeekProgress[] {
  const days = Object.keys(checkins).map(Number);
  return WEEKS.map((w) => ({
    week: w.week,
    title: w.title,
    start: w.start,
    end: w.end,
    done: days.filter((d) => d >= w.start && d <= w.end).length,
    total: w.end - w.start + 1,
  }));
}
