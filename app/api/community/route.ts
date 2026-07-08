import { NextResponse } from "next/server";
import { DbNotConfiguredError, query } from "@/lib/db";
import { CHALLENGE } from "@/lib/plan";
import { computeStreak, currentDay, shippedCount } from "@/lib/progress";

interface Row {
  handle: string;
  name: string;
  github: string;
  joined: string;
  checkins: Record<number, string> | null;
}

export interface CommunityMember {
  handle: string;
  name: string;
  github: string;
  joined: string;
  day: number;
  streak: number;
  totalDays: number;
  shipped: number;
}

export async function GET() {
  try {
    const rows = await query<Row>(
      `select p.handle, p.name, p.github, p.joined::text as joined,
              coalesce(
                jsonb_object_agg(c.day, c.checked_on::text) filter (where c.day is not null),
                '{}'::jsonb
              ) as checkins
       from profiles p
       left join checkins c on c.profile_id = p.id
       where p.visibility = 'public'
       group by p.id
       order by p.joined desc
       limit 300`
    );

    const members: CommunityMember[] = rows.map((r) => {
      const checkins = r.checkins ?? {};
      const streak = computeStreak(checkins);
      return {
        handle: r.handle,
        name: r.name,
        github: r.github,
        joined: r.joined,
        day: Math.min(currentDay(checkins), CHALLENGE.totalDays),
        streak: streak.streak,
        totalDays: Object.keys(checkins).length,
        shipped: shippedCount(checkins),
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
