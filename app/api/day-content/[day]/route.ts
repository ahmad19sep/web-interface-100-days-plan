import { NextResponse } from "next/server";
import { TOTAL_DAYS } from "@/lib/plan";
import { DbNotConfiguredError, query } from "@/lib/db";
import {
  ensureLinksColumn,
  getDayContentRow,
  sanitizeLinksInput,
  sanitizeQuizInput,
} from "@/lib/day-content";
import { currentProfile } from "@/lib/session";

function parseDay(raw: string): number | null {
  const day = Number(raw);
  return Number.isInteger(day) && day >= 1 && day <= TOTAL_DAYS ? day : null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ day: string }> }
) {
  try {
    const day = parseDay((await params).day);
    if (day === null) return NextResponse.json({ error: "Invalid day." }, { status: 400 });

    return NextResponse.json(await getDayContentRow(day));
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({
        videoUrl: null,
        githubUrl: null,
        note: null,
        quiz: null,
        links: null,
      });
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
    const quiz = sanitizeQuizInput(body?.quiz);
    const links = sanitizeLinksInput(body?.links);

    await ensureLinksColumn();
    await query(
      `insert into day_content (day, video_url, github_url, note, quiz, links, updated_at)
       values ($1, $2, $3, $4, $5, $6, now())
       on conflict (day) do update set
         video_url = excluded.video_url,
         github_url = excluded.github_url,
         note = excluded.note,
         quiz = excluded.quiz,
         links = excluded.links,
         updated_at = now()`,
      [
        day,
        videoUrl,
        githubUrl,
        note,
        quiz ? JSON.stringify(quiz) : null,
        links ? JSON.stringify(links) : null,
      ]
    );

    return NextResponse.json({ videoUrl, githubUrl, note, quiz, links });
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
