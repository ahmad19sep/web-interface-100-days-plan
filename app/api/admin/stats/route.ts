import { NextResponse } from "next/server";
import { computeBadges, quizScorePercent, type Badge } from "@/lib/badges";
import { effectiveQuizMap } from "@/lib/day-content";
import { DbNotConfiguredError, query } from "@/lib/db";
import { CHALLENGE } from "@/lib/plan";
import { computeStreak, currentDay, shippedCount } from "@/lib/progress";
import { gradeAll, type StoredAnswer } from "@/lib/quiz";
import { currentProfile } from "@/lib/session";

interface Row {
  handle: string;
  name: string;
  visibility: "public" | "private";
  joined: string;
  checkins: Record<number, string> | null;
  quiz_answers: StoredAnswer[] | null;
}

export interface AdminMember {
  handle: string;
  name: string;
  visibility: "public" | "private";
  joined: string;
  day: number;
  streak: number;
  totalDays: number;
  shipped: number;
  badges: Badge[];
  quizScore: number | null;
}

export async function GET() {
  try {
    const me = await currentProfile();
    if (!me || !me.is_owner) {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    const quizMap = await effectiveQuizMap();

    // Same LEFT JOIN LATERAL shape as /api/community — pre-aggregate each
    // side per profile before joining, so a fan-out never corrupts the
    // checkins/quiz-answers aggregates. No visibility filter: the owner
    // sees every account, public or private.
    const rows = await query<Row>(
      `select p.handle, p.name, p.visibility, p.joined::text as joined,
              coalesce(ck.checkins, '{}'::jsonb) as checkins,
              coalesce(qz.answers, '[]'::jsonb) as quiz_answers
       from profiles p
       left join lateral (
         select jsonb_object_agg(c.day, c.checked_on::text) as checkins
         from checkins c where c.profile_id = p.id
       ) ck on true
       left join lateral (
         select jsonb_agg(jsonb_build_object(
           'day', q.day, 'questionIndex', q.question_index, 'selectedIndex', q.selected_index
         )) as answers
         from quiz_answers q where q.profile_id = p.id
       ) qz on true
       order by p.created_at desc
       limit 500`
    );

    const members: AdminMember[] = rows.map((r) => {
      const checkins = r.checkins ?? {};
      const streak = computeStreak(checkins);
      const quiz = gradeAll(r.quiz_answers ?? [], quizMap);
      return {
        handle: r.handle,
        name: r.name,
        visibility: r.visibility,
        joined: r.joined,
        day: Math.min(currentDay(checkins), CHALLENGE.totalDays),
        streak: streak.streak,
        totalDays: Object.keys(checkins).length,
        shipped: shippedCount(checkins),
        badges: computeBadges(streak.longest, quiz),
        quizScore: quizScorePercent(quiz),
      };
    });

    // Per-day check-in funnel — how many people have completed each day so far.
    const funnelRows = await query<{ day: number; n: string }>(
      "select day, count(*) as n from checkins group by day order by day"
    );
    const funnel: Record<number, number> = {};
    for (const r of funnelRows) funnel[r.day] = Number(r.n);

    return NextResponse.json({
      totalProfiles: members.length,
      publicProfiles: members.filter((m) => m.visibility === "public").length,
      activeStreaks: members.filter((m) => m.streak > 0).length,
      funnel,
      members,
    });
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
