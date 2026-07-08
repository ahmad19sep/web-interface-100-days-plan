import { NextResponse } from "next/server";
import { DbNotConfiguredError } from "@/lib/db";
import { destroySession } from "@/lib/session";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
