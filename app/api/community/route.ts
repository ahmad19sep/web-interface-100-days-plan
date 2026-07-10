import { NextResponse } from "next/server";
import { computeBadges, quizScorePercent, type Badge } from "@/lib/badges";
import { effectiveQuizMap } from "@/lib/day-content";
import { DbNotConfiguredError, ensureAvatarColumn, query } from "@/lib/db";
import { CHALLENGE } from "@/lib/plan";
import { computeStreak, currentDay, shippedCount } from "@/lib/progress";
import { gradeAll, type StoredAnswer } from "@/lib/quiz";

interface Row {
  handle: string;
  name: string;
  avatar: string | null;
  github: string;
  joined: string;
  checkins: Record<number, string> | null;
  quiz_answers: StoredAnswer[] | null;
}

export interface CommunityMember {
  handle: string;
  name: string;
  avatar: string;
  github: string;
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
    const quizMap = await effectiveQuizMap();
    await ensureAvatarColumn();

    // Two LEFT JOIN LATERAL subqueries, each pre-aggregated to one row per
    // profile — a plain LEFT JOIN on both checkins AND quiz_answers would
    // fan out (every checkin paired with every quiz answer) and corrupt
    // both aggregates.
    const rows = await query<Row>(
      `select p.handle, p.name, p.avatar, p.github, p.joined::text as joined,
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
       where p.visibility = 'public'
       order by p.joined desc
       limit 300`
    );

    const members: CommunityMember[] = rows.map((r) => {
      const checkins = r.checkins ?? {};
      const streak = computeStreak(checkins);
      const quiz = gradeAll(r.quiz_answers ?? [], quizMap);
      return {
        handle: r.handle,
        name: r.name,
        avatar: r.avatar ?? "bot",
        github: r.github,
        joined: r.joined,
        day: Math.min(currentDay(checkins), CHALLENGE.totalDays),
        streak: streak.streak,
        totalDays: Object.keys(checkins).length,
        shipped: shippedCount(checkins),
        badges: computeBadges(streak.longest, quiz),
        quizScore: quizScorePercent(quiz),
      };
    });

    members.sort((a, b) => b.streak - a.streak || b.day - a.day);
    return NextResponse.json({ members: members.slice(0, 100) });
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ members: [], notConfigured: true });
    }
    throw err;
  }
}
