// Learning-workspace progress — the backend source of truth for where a
// user is inside a day (/learn/day/N). GET returns one day's blob; POST
// shallow-merges a patch (jsonb || — the client always sends whole values
// per top-level key, e.g. the full `sections` map).

import { NextResponse } from "next/server";
import { TOTAL_DAYS } from "@/lib/plan";
import { DbNotConfiguredError, ensureDayProgressTable, query } from "@/lib/db";
import { currentProfile } from "@/lib/session";
import type { WorkspaceProgress } from "@/lib/lessons/types";

// keys the client may write — anything else in a patch is dropped
const ALLOWED_KEYS = new Set([
  "lastStage",
  "video",
  "sections",
  "lab",
  "buildStarted",
  "hintsUnlocked",
  "solutionUnlocked",
  "verify",
  "verifyStatus",
  "verifyAt",
  "reflections",
  "ship",
]);

function parseDay(raw: unknown): number | null {
  const day = Number(raw);
  if (!Number.isInteger(day) || day < 1 || day > TOTAL_DAYS) return null;
  return day;
}

export async function GET(request: Request) {
  try {
    const profile = await currentProfile();
    if (!profile)
      return NextResponse.json({ error: "Not logged in." }, { status: 401 });
    const day = parseDay(new URL(request.url).searchParams.get("day"));
    if (day === null)
      return NextResponse.json({ error: "Invalid day." }, { status: 400 });

    await ensureDayProgressTable();
    const rows = await query<{ data: WorkspaceProgress }>(
      "select data from day_progress where profile_id = $1 and day = $2",
      [profile.id, day]
    );
    return NextResponse.json({ data: rows[0]?.data ?? {} });
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}

export async function POST(request: Request) {
  try {
    const profile = await currentProfile();
    if (!profile)
      return NextResponse.json({ error: "Not logged in." }, { status: 401 });

    const body = await request.json().catch(() => null);
    const day = parseDay(body?.day);
    const rawPatch = body?.patch;
    if (day === null || typeof rawPatch !== "object" || rawPatch === null) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rawPatch as Record<string, unknown>)) {
      if (ALLOWED_KEYS.has(k)) patch[k] = v;
    }
    // cap blob size — reflections/pastes are text, not file uploads
    if (JSON.stringify(patch).length > 64_000) {
      return NextResponse.json(
        { error: "Progress payload too large." },
        { status: 413 }
      );
    }

    await ensureDayProgressTable();
    const rows = await query<{ data: WorkspaceProgress }>(
      `insert into day_progress (profile_id, day, data, updated_at)
       values ($1, $2, $3::jsonb, now())
       on conflict (profile_id, day)
       do update set data = day_progress.data || excluded.data, updated_at = now()
       returning data`,
      [profile.id, day, JSON.stringify(patch)]
    );
    return NextResponse.json({ data: rows[0]?.data ?? {} });
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
