"use client";

import { COURSES } from "@/lib/plan";
import ProjectsBoard from "./ProjectsBoard";

function dayLabel(days: number[]): string {
  return days.length === 1 ? `Day ${days[0]}` : `Days ${days.join(", ")}`;
}

export default function CoursesBoard() {
  return (
    <div>
      <div className="mb-[22px]">
        <div className="text-sm text-mut2">
          External courses woven into the curriculum
        </div>
        <h1 className="font-display text-[26px] font-bold tracking-[-.02em]">
          Courses
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((c) => (
          <a
            key={c.id}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-std block p-5 !text-ink transition-transform hover:-translate-y-0.5"
          >
            <div className="mb-3.5 flex items-center justify-between">
              <span className="tag-mono bg-[rgba(53,211,153,.1)] uppercase tracking-[.04em] text-accent">
                {c.provider}
              </span>
            </div>
            <div className="mb-1.5 font-display text-[17px] font-semibold">
              {c.name}
            </div>
            <div className="mb-[18px] min-h-[38px] text-[12.5px] leading-[1.5] text-[#7C858F]">
              {c.blurb}
            </div>
            <div className="text-[11.5px] text-mut3">{dayLabel(c.days)}</div>
          </a>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-[22px] h-px bg-edge3" />
        <ProjectsBoard />
      </div>
    </div>
  );
}
