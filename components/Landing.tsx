"use client";

// The front door. One job: the 3D title + the access-code gate.
// Logged-in visitors go straight to /courses; everything else (courses,
// about me, community) lives behind the code.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CHALLENGE, TOTAL_DAYS, TOTAL_PROJECTS } from "@/lib/plan";
import { SITE } from "@/lib/site";
import { useProfiles } from "@/lib/profiles";
import Tilt from "./Tilt";
import { Logo } from "./icons";

export default function Landing() {
  const router = useRouter();
  const { ready, activeId } = useProfiles();

  useEffect(() => {
    if (ready && activeId) router.replace("/courses");
  }, [ready, activeId, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-16 text-center">
      {/* brand */}
      <div className="mb-10 flex items-center gap-3">
        <Logo size={36} radius={10} />
        <span className="font-display text-[17px] font-semibold">
          {SITE.name}
        </span>
        <span className="rounded-md border border-[#232B35] px-[7px] py-[2px] font-mono text-[10.5px] text-dim2">
          {SITE.handle.toUpperCase()}
        </span>
      </div>

      {/* the 3D title */}
      <Tilt max={10} className="mb-9">
        <h1 className="text3d anim-float-title font-display text-[44px] font-bold uppercase leading-[1.06] tracking-[-.02em] sm:text-[76px] lg:text-[96px]">
          Learn AI
          <br />
          with <span className="text3d-amber">Ahmad</span>
        </h1>
      </Tilt>

      <p className="mb-10 max-w-[540px] text-[15px] leading-[1.7] text-mut sm:text-[17px]">
        {CHALLENGE.title} — {TOTAL_DAYS} days, {TOTAL_PROJECTS} real projects.
        Build the primitive, measure the system, ship the evidence.
      </p>

      {/* access-code gate */}
      <div className="flex flex-col items-center gap-3.5 sm:flex-row">
        <Link
          href="/start"
          className="btn-primary px-8 py-4 text-[16px] !font-bold"
        >
          Set your access code →
        </Link>
        <Link href="/start" className="btn-ghost px-6 py-4 text-[15px]">
          I already have a code
        </Link>
      </div>

      <div className="mt-14 font-mono text-[11.5px] text-dim2">
        © 2026 {SITE.name} · radar.hafizahmad.com · built in public
      </div>
    </div>
  );
}
