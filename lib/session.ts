// Server-only session cookie helpers. The cookie holds an opaque random
// token; the `sessions` table is the source of truth for who it belongs to.

import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { ensureAvatarColumn, query } from "./db";

const COOKIE = "session_id";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days

export interface SessionProfile {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  github: string;
  reminder: "morning" | "evening" | "none";
  visibility: "public" | "private";
  notes_private: boolean;
  start_date: string | null;
  joined: string;
  onboarded: boolean;
  is_owner: boolean;
}

export async function createSession(profileId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  await query("insert into sessions (id, profile_id) values ($1, $2)", [
    token,
    profileId,
  ]);
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await query("delete from sessions where id = $1", [token]);
  jar.delete(COOKIE);
}

/** The logged-in profile for this request, or null. */
export async function currentProfile(): Promise<SessionProfile | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  await ensureAvatarColumn();
  const rows = await query<SessionProfile>(
    `select p.id, p.handle, p.name, p.avatar, p.github, p.reminder, p.visibility,
            p.notes_private, p.start_date::text as start_date,
            p.joined::text as joined, p.onboarded, p.is_owner
     from sessions s join profiles p on p.id = s.profile_id
     where s.id = $1`,
    [token]
  );
  return rows[0] ?? null;
}
