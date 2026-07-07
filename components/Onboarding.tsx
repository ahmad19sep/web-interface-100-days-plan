"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { COHORT_START_DATE } from "@/lib/plan";
import {
  completeOnboarding,
  expectedDay,
  type Reminder,
  type Visibility,
} from "@/lib/store";
import { Logo } from "./icons";

function OptionCard({
  selected,
  title,
  sub,
  onClick,
}: {
  selected: boolean;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-4 text-left transition-colors ${
        selected
          ? "border-[1.5px] border-[rgba(53,211,153,.5)] bg-[rgba(53,211,153,.08)]"
          : "border-[1.5px] border-edge3 bg-panel hover:border-[#2A3542]"
      }`}
    >
      <div
        className={`mb-[3px] text-sm font-semibold ${selected ? "text-accent" : ""}`}
      >
        {title}
      </div>
      <div className="text-xs text-mut2">{sub}</div>
    </button>
  );
}

function Pill({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full px-[15px] py-[9px] text-[13px] transition-colors ${
        selected
          ? "border border-[rgba(53,211,153,.4)] bg-[rgba(53,211,153,.1)] text-accent"
          : "border border-edge3 bg-panel text-mut hover:border-[#2A3542]"
      }`}
    >
      {label}
    </button>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const [startToday, setStartToday] = useState(true);
  const [reminder, setReminder] = useState<Reminder>("evening");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [name, setName] = useState("");

  const cohortDay = expectedDay(COHORT_START_DATE);

  function start() {
    completeOnboarding({ startToday, reminder, visibility, name: name.trim() });
    router.push("/today");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-5 sm:p-10">
      <div className="w-full max-w-[560px]">
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size={30} radius={8} />
            <span className="font-display text-sm font-semibold">
              Set up your track
            </span>
          </div>
          <Link href="/" className="!text-mut3 text-[13px] hover:!text-ink">
            Cancel
          </Link>
        </div>
        <div className="mb-[26px] flex gap-1.5">
          <span className="h-1 flex-1 rounded-full bg-accent" />
          <span className="h-1 flex-1 rounded-full bg-accent" />
          <span className="h-1 flex-1 rounded-full bg-accent" />
        </div>
        <div className="card-std rounded-[20px] p-6 sm:p-[30px]">
          {/* step 1 */}
          <div className="mb-[26px]">
            <div className="mb-1 font-display text-base font-semibold">
              1 · When do you start?
            </div>
            <div className="mb-3.5 text-[13px] text-mut2">
              Your Day 1 is personal — it doesn&apos;t have to match anyone
              else.
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <OptionCard
                selected={startToday}
                title="Start today"
                sub="Begin Day 1 right now"
                onClick={() => setStartToday(true)}
              />
              <OptionCard
                selected={!startToday}
                title="Align with cohort"
                sub={`Jump in at Day ${cohortDay} with everyone`}
                onClick={() => setStartToday(false)}
              />
            </div>
          </div>
          {/* step 2 */}
          <div className="mb-[26px]">
            <div className="mb-1 font-display text-base font-semibold">
              2 · Daily reminder
            </div>
            <div className="mb-3.5 text-[13px] text-mut2">
              One gentle nudge a day. Pick a time you&apos;re usually free.
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill
                selected={reminder === "morning"}
                label="Morning"
                onClick={() => setReminder("morning")}
              />
              <Pill
                selected={reminder === "evening"}
                label="Evening · 8:30 PM"
                onClick={() => setReminder("evening")}
              />
              <Pill
                selected={reminder === "none"}
                label="No reminder"
                onClick={() => setReminder("none")}
              />
            </div>
          </div>
          {/* step 3 */}
          <div className="mb-7">
            <div className="mb-1 font-display text-base font-semibold">
              3 · Your profile
            </div>
            <div className="mb-3.5 text-[13px] text-mut2">
              You can change this anytime. Notes always stay private.
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Display name (e.g. Saad Khan)"
              className="mb-2.5 w-full rounded-xl border border-edge3 bg-panel px-4 py-3 text-sm text-ink placeholder:text-dim focus:border-[rgba(53,211,153,.5)] focus:outline-none"
            />
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <OptionCard
                selected={visibility === "public"}
                title="Public"
                sub="Appear on the leaderboard"
                onClick={() => setVisibility("public")}
              />
              <OptionCard
                selected={visibility === "private"}
                title="Private"
                sub="Just for you"
                onClick={() => setVisibility("private")}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={start}
            className="btn-primary w-full py-[15px] text-[15px] !font-bold"
          >
            Start Day 1 →
          </button>
        </div>
      </div>
    </div>
  );
}
