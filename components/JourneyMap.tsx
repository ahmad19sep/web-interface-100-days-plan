"use client";

import { useState } from "react";
import { TOTAL_DAYS } from "@/lib/plan";
import {
  currentDay,
  expectedDay,
  useProgress,
} from "@/lib/store";
import { buildCells, JourneyCells } from "./JourneyGrid";
import { IconInfo } from "./icons";
import { Toggle } from "./Toggle";

export default function JourneyMap() {
  const state = useProgress();
  const [showCohort, setShowCohort] = useState(false);

  const day = currentDay(state.checkins);
  const done = Object.keys(state.checkins).length;
  const toGo = TOTAL_DAYS - done - (day <= TOTAL_DAYS ? 1 : 0);
  const expected = expectedDay(state.startDate);
  const gridRows = Math.ceil(TOTAL_DAYS / 10);
  const cohortRowPct = (Math.min(gridRows, Math.ceil(expected / 10)) / gridRows) * 100;

  return (
    <div>
      <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm text-mut2">Your {TOTAL_DAYS}-day track</div>
          <h1 className="font-display text-[26px] font-bold tracking-[-.02em]">
            Journey map
          </h1>
        </div>
        <div className="flex gap-[22px]">
          <div>
            <div className="font-mono text-[22px] font-extrabold text-accent">
              {done}
            </div>
            <div className="text-[11.5px] text-mut3">days done</div>
          </div>
          <div>
            <div className="font-mono text-[22px] font-extrabold text-today">
              {Math.min(day, TOTAL_DAYS)}
            </div>
            <div className="text-[11.5px] text-mut3">
              {day > TOTAL_DAYS ? "complete" : "today"}
            </div>
          </div>
          <div>
            <div className="font-mono text-[22px] font-extrabold text-ink">
              {Math.max(0, toGo)}
            </div>
            <div className="text-[11.5px] text-mut3">to go</div>
          </div>
        </div>
      </div>

      <div
        className="rounded-[20px] border border-edge p-5 sm:p-[30px]"
        style={{ background: "linear-gradient(180deg,#12181F,#0F141A)" }}
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-[18px] text-xs text-mut2">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-[3px] bg-done" />
              Done
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-[3px] border-[1.5px] border-today bg-[rgba(245,181,75,.16)]" />
              Today
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-[3px] bg-locked" />
              Locked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-[3px] border border-dashed border-[#3A4552]" />
              Rest day
            </span>
          </div>
          <Toggle
            on={showCohort}
            onClick={() => setShowCohort((v) => !v)}
            label="Show cohort line"
            color="today"
          />
        </div>

        <div className="relative">
          <JourneyCells
            cells={buildCells(state.checkins, day)}
            variant="journey"
            cols={10}
            gap={9}
          />
          {showCohort && (
            <div
              className="pointer-events-none absolute left-0 right-0 h-0.5"
              style={{
                top: `calc(${cohortRowPct}% - 1px)`,
                background:
                  "repeating-linear-gradient(90deg,#F5B54B 0 8px,transparent 8px 14px)",
              }}
            >
              <div className="absolute -top-[22px] right-0 rounded-[5px] bg-bg px-1.5 py-0.5 font-mono text-[10.5px] text-today">
                cohort · Day {expected}
              </div>
            </div>
          )}
        </div>

        <div className="mt-[22px] flex items-center gap-2 text-[12.5px] text-mut3">
          <IconInfo />
          Tap any day to open its detail, notes, and video.
        </div>
      </div>
    </div>
  );
}
