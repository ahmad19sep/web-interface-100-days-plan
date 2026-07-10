"use client";

// The "About me" tab — who's teaching this. All content lives in
// lib/site.ts (ABOUT); the photo is public/ahmad.jpg with a branded
// avatar fallback until one is added.

import Link from "next/link";
import { useState } from "react";
import { CHALLENGE, CREATOR, TOTAL_DAYS, TOTAL_PROJECTS } from "@/lib/plan";
import { ABOUT, SITE } from "@/lib/site";
import Tilt from "./Tilt";
import { IconGitHub, IconPlay } from "./icons";

function Photo() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-[28px] font-display text-5xl font-bold text-[#062018]"
        style={{ background: "linear-gradient(150deg,#35D399,#16A97E)" }}
      >
        A
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ABOUT.photo}
      alt={ABOUT.fullName}
      onError={() => setFailed(true)}
      className="h-[120px] w-[120px] shrink-0 rounded-[28px] border border-edge object-cover"
    />
  );
}

export default function AboutMe() {
  return (
    <div>
      <div className="mb-[22px]">
        <div className="text-sm text-mut2">The person behind {SITE.name}</div>
        <h1 className="font-display text-[26px] font-bold tracking-[-.02em]">
          About me
        </h1>
      </div>

      {/* hero */}
      <Tilt max={4} className="mb-5 max-w-[760px] rounded-[20px]">
        <div className="card-grad flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          <Photo />
          <div className="min-w-0">
            <h2 className="font-display text-[22px] font-bold tracking-[-.02em]">
              {ABOUT.fullName}
            </h2>
            <div className="mb-2 text-[13.5px] text-mut2">
              {ABOUT.role} · {ABOUT.location} · {SITE.handle}
            </div>
            <p className="max-w-[460px] text-[14.5px] leading-[1.6] text-mut">
              {ABOUT.intro}
            </p>
          </div>
        </div>
      </Tilt>

      {/* what I do */}
      <div className="mb-5 max-w-[760px] space-y-3.5">
        {ABOUT.bio.map((p) => (
          <div key={p.slice(0, 24)} className="card-std rounded-2xl p-5">
            <p className="text-[14.5px] leading-[1.7] text-ink2">{p}</p>
          </div>
        ))}
      </div>

      {/* current course */}
      <div className="card-std mb-5 max-w-[760px] rounded-2xl p-5">
        <div className="mb-1.5 font-mono text-[11px] tracking-[.08em] text-accent">
          🎓 TEACHING NOW
        </div>
        <div className="mb-1 font-display text-[17px] font-semibold">
          {CHALLENGE.title}
        </div>
        <p className="mb-3 text-[13.5px] leading-[1.6] text-mut">
          {TOTAL_DAYS} days, {TOTAL_PROJECTS} portfolio projects — evals-first,
          production-first, built by hand in public.
        </p>
        <Link href="/courses" className="text-[13px] !text-accent hover:!text-accent2">
          Go to the course →
        </Link>
      </div>

      {/* links */}
      <div className="card-std max-w-[760px] rounded-2xl p-5">
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
  );
}
