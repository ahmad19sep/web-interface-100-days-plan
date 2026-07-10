"use client";

// The "About me" tab — who's teaching this. A big split: Ahmad's personal
// 3D avatar fills the left column (sticky, drag to spin), the "who I am"
// story fills the right. Content lives in lib/site.ts (ABOUT); the avatar
// (components/CreatorAvatar.tsx) falls back to the photo without WebGL.

import Link from "next/link";
import { CHALLENGE, CREATOR, TOTAL_DAYS, TOTAL_PROJECTS } from "@/lib/plan";
import { ABOUT, SITE } from "@/lib/site";
import CreatorAvatar from "./CreatorAvatar";
import { IconGitHub, IconPlay } from "./icons";

export default function AboutMe() {
  return (
    <div className="flex flex-col gap-7 lg:flex-row lg:items-start">
      {/* ── the big me ── */}
      <div className="w-full shrink-0 lg:sticky lg:top-2 lg:w-[350px]">
        <CreatorAvatar className="h-[440px] w-full sm:h-[540px] lg:h-[560px]" />
        <div className="mt-4 text-center">
          <div className="mb-1 font-mono text-[10px] tracking-[.24em] text-accent">
            MY 3D AVATAR — THIS IS ME
          </div>
          <div className="font-display text-[22px] font-bold tracking-[-.02em]">
            {ABOUT.fullName}
          </div>
          <div className="mt-0.5 font-mono text-[11px] tracking-[.08em] text-mut2">
            {ABOUT.role.toUpperCase()} · {SITE.handle.toUpperCase()}
          </div>
        </div>
      </div>

      {/* ── who I am ── */}
      <div className="min-w-0 flex-1">
        <div className="mb-5">
          <div className="text-sm text-mut2">
            The person behind {SITE.name}
          </div>
          <h1 className="font-display text-[28px] font-bold tracking-[-.02em]">
            Who I am
          </h1>
        </div>

        <p className="mb-6 text-[16px] leading-[1.75] text-ink2">
          {ABOUT.intro}
        </p>

        <div className="mb-6 space-y-3.5">
          {ABOUT.bio.map((p) => (
            <div key={p.slice(0, 24)} className="card-std rounded-2xl p-5">
              <p className="text-[14.5px] leading-[1.7] text-ink2">{p}</p>
            </div>
          ))}
        </div>

        {/* current course */}
        <div className="card-std mb-5 rounded-2xl border-[rgba(245,158,11,.25)] bg-[rgba(245,158,11,.04)] p-5">
          <div className="mb-1.5 font-mono text-[10px] tracking-[.2em] text-today">
            🎓 TEACHING NOW
          </div>
          <div className="mb-1 font-display text-[17px] font-semibold">
            {CHALLENGE.title}
          </div>
          <p className="mb-3 text-[13.5px] leading-[1.6] text-mut">
            {TOTAL_DAYS} days, {TOTAL_PROJECTS} portfolio projects —
            evals-first, production-first, built by hand in public.
          </p>
          <Link
            href="/courses"
            className="text-[13px] !text-accent hover:!text-accent2"
          >
            Go to the course →
          </Link>
        </div>

        {/* links */}
        <div className="card-std rounded-2xl p-5">
          <div className="mb-3.5 font-display text-[15px] font-semibold">
            Find me
          </div>
          <div className="flex flex-wrap gap-2.5">
            {ABOUT.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost px-4 py-2.5 text-[13px] !rounded-[11px] !font-normal !text-ink"
              >
                {l.label === "YouTube" ? (
                  <IconPlay size={14} fill="#ECE6DA" />
                ) : l.label === "GitHub" ? (
                  <IconGitHub size={14} />
                ) : null}
                {l.label} ↗
              </a>
            ))}
          </div>
          <p className="mt-3.5 text-xs text-mut3">
            {CREATOR.tagline} · every day of the challenge ships to GitHub.
          </p>
        </div>
      </div>
    </div>
  );
}
