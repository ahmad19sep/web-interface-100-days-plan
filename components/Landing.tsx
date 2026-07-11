"use client";

// The front door. Ahmad's own 3D avatar welcomes every visitor next to a
// working login form (name + access code), with signup one tap away.
// Logged-in visitors go straight to /courses.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { nameToHandle } from "@/lib/handle";
import { login, useProfiles } from "@/lib/profiles";
import { SITE } from "@/lib/site";
import CreatorAvatar from "./CreatorAvatar";
import { Logo } from "./icons";

const inputClass =
  "w-full rounded-xl border border-edge3 bg-panel px-4 py-3.5 text-[15px] text-ink placeholder:text-dim focus:border-[rgba(34,211,238,.5)] focus:outline-none";

export default function Landing() {
  const router = useRouter();
  const { ready, activeId } = useProfiles();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && activeId) router.replace("/courses");
  }, [ready, activeId, router]);

  async function submitLogin() {
    if (!name.trim() || !code) {
      setError("Write your name and access code.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await login(nameToHandle(name), code);
      // the redirect above fires once the session lands
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't log in.");
      setCode("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="flex w-full max-w-[960px] flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:gap-12">
        {/* ── Ahmad welcomes you ── */}
        <div className="w-full max-w-[400px] shrink-0 lg:w-[380px]">
          {/* speech bubble */}
          <div className="relative mb-3 rounded-[16px] border border-[rgba(245,158,11,.3)] bg-[rgba(245,158,11,.06)] px-5 py-4">
            <div className="text-[14.5px] leading-[1.6] text-ink">
              👋 <span className="font-semibold">Assalam-o-Alaikum!</span> I&apos;m
              Ahmad — welcome to my world. 120 days, 20 shipped projects, one
              glowing road. Log in and let&apos;s walk it together.
            </div>
            <span className="absolute -bottom-[9px] left-10 h-4 w-4 rotate-45 border-b border-r border-[rgba(245,158,11,.3)] bg-[#181712]" />
          </div>
          <CreatorAvatar className="h-[380px] w-full sm:h-[440px]" />
          <div className="mt-3 text-center font-mono text-[10px] tracking-[.24em] text-mut3">
            AHMAD · YOUR GUIDE THROUGH THE WORLD
          </div>
        </div>

        {/* ── the door ── */}
        <div className="flex w-full max-w-[440px] flex-col justify-center">
          <div className="mb-7 flex items-center gap-3">
            <Logo size={34} radius={10} />
            <span className="font-display text-[16px] font-semibold">
              {SITE.name}
            </span>
            <span className="rounded-md border border-edge2 px-[7px] py-[2px] font-mono text-[10px] tracking-[.06em] text-mut3">
              {SITE.handle.toUpperCase()}
            </span>
          </div>

          <h1 className="mb-2 font-display text-[34px] font-bold leading-[1.1] tracking-[-.02em] sm:text-[40px]">
            Welcome,
            <br />
            <span className="text-accent">Explorer</span>
          </h1>
          <p className="mb-7 text-[14.5px] leading-[1.65] text-mut">
            Don&apos;t just watch AI happen — <span className="text-ink">build it</span>.
            Log in to continue your journey.
          </p>

          {/* login */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="username"
              className={inputClass}
            />
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void submitLogin();
              }}
              placeholder="Access code"
              autoComplete="current-password"
              className={`${inputClass} font-mono`}
            />
            {error && (
              <div className="rounded-[10px] border border-[rgba(248,113,113,.35)] bg-[rgba(248,113,113,.06)] px-3.5 py-2.5 text-[13px] text-[#fca5a5]">
                {error}
              </div>
            )}
            <button
              type="button"
              onClick={() => void submitLogin()}
              disabled={busy}
              className="btn-amber w-full py-4 text-[16px] disabled:opacity-60"
            >
              {busy ? "Opening the world…" : "Enter the World →"}
            </button>
          </div>

          {/* signup */}
          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-divider" />
            <span className="font-mono text-[10px] tracking-[.2em] text-mut3">
              NEW HERE?
            </span>
            <span className="h-px flex-1 bg-divider" />
          </div>
          <Link
            href="/start?signup=1"
            className="btn-ghost mt-4 w-full py-3.5 text-[14.5px]"
          >
            ✨ Create your access code →
          </Link>

          <div className="mt-8 text-center font-mono text-[10.5px] text-mut3 lg:text-left">
            © 2026 {SITE.name} · radar.hafizahmad.com · built in public
          </div>
        </div>
      </div>
    </div>
  );
}
