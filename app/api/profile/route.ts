import { NextResponse } from "next/server";
import { isAvatarId } from "@/lib/avatars";
import { DbNotConfiguredError, ensureAvatarColumn, query } from "@/lib/db";
import { profileSnapshot } from "@/lib/profile-snapshot";
import { currentProfile } from "@/lib/session";

const REMINDERS = new Set(["morning", "evening", "none"]);
const VISIBILITIES = new Set(["public", "private"]);

export async function PATCH(request: Request) {
  try {
    const profile = await currentProfile();
    if (!profile)
      return NextResponse.json({ error: "Not logged in." }, { status: 401 });

    const body = await request.json();
    const sets: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    if (typeof body.name === "string" && body.name.trim()) {
      sets.push(`name = $${i++}`);
      values.push(body.name.trim());
    }
    if (typeof body.github === "string") {
      sets.push(`github = $${i++}`);
      values.push(body.github);
    }
    if (typeof body.reminder === "string" && REMINDERS.has(body.reminder)) {
      sets.push(`reminder = $${i++}`);
      values.push(body.reminder);
    }
    if (typeof body.visibility === "string" && VISIBILITIES.has(body.visibility)) {
      sets.push(`visibility = $${i++}`);
      values.push(body.visibility);
    }
    if (typeof body.notesPrivate === "boolean") {
      sets.push(`notes_private = $${i++}`);
      values.push(body.notesPrivate);
    }
    if (isAvatarId(body.avatar)) {
      await ensureAvatarColumn();
      sets.push(`avatar = $${i++}`);
      values.push(body.avatar);
    }
    if (typeof body.startDate === "string") {
      sets.push(`start_date = $${i++}`);
      values.push(body.startDate);
    }
    if (typeof body.onboarded === "boolean") {
      sets.push(`onboarded = $${i++}`);
      values.push(body.onboarded);
    }

    if (sets.length === 0) return NextResponse.json(await profileSnapshot(profile));

    values.push(profile.id);
    await query(
      `update profiles set ${sets.join(", ")} where id = $${i}`,
      values
    );

    const updated = await currentProfile();
    return NextResponse.json(await profileSnapshot(updated!));
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
