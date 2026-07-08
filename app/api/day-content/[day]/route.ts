import { NextResponse } from "next/server";
import { DbNotConfiguredError, query } from "@/lib/db";
import { currentProfile } from "@/lib/session";

interface Row {
  video_url: string | null;
  github_url: string | null;
  note: string | null;
}

function parseDay(raw: string): number | null {
  const day = Number(raw);
  return Number.isInteger(day) && day >= 1 && day <= 100 ? day : null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ day: string }> }
) {
  try {
    const day = parseDay((await params).day);
    if (day === null) return NextResponse.json({ error: "Invalid day." }, { status: 400 });

    const rows = await query<Row>(
      "select video_url, github_url, note from day_content where day = $1",
      [day]
    );
    const row = rows[0];
    return NextResponse.json({
      videoUrl: row?.video_url ?? null,
      githubUrl: row?.github_url ?? null,
      note: row?.note ?? null,
    });
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ videoUrl: null, githubUrl: null, note: null });
    }
    throw err;
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ day: string }> }
) {
  try {
    const profile = await currentProfile();
    if (!profile || !profile.is_owner) {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    const day = parseDay((await params).day);
    if (day === null) return NextResponse.json({ error: "Invalid day." }, { status: 400 });

    const body = await request.json();
    const videoUrl = typeof body?.videoUrl === "string" ? body.videoUrl.trim() || null : null;
    const githubUrl = typeof body?.githubUrl === "string" ? body.githubUrl.trim() || null : null;
    const note = typeof body?.note === "string" ? body.note.trim() || null : null;

    await query(
      `insert into day_content (day, video_url, github_url, note, updated_at)
       values ($1, $2, $3, $4, now())
       on conflict (day) do update set
         video_url = excluded.video_url,
         github_url = excluded.github_url,
         note = excluded.note,
         updated_at = now()`,
      [day, videoUrl, githubUrl, note]
    );

    return NextResponse.json({ videoUrl, githubUrl, note });
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
