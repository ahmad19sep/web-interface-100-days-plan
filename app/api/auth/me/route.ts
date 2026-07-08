import { NextResponse } from "next/server";
import { DbNotConfiguredError } from "@/lib/db";
import { profileSnapshot } from "@/lib/profile-snapshot";
import { currentProfile } from "@/lib/session";

export async function GET() {
  try {
    const profile = await currentProfile();
    if (!profile) return NextResponse.json({ profile: null });
    return NextResponse.json(await profileSnapshot(profile));
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
