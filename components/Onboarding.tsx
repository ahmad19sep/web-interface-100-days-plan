"use client";

// /start — the door to every track on this device.
//
//  new person   → name + personal code → 3 setup steps → Day 1
//  returning    → pick your name → enter your code → your dashboard
//  mid-setup    → straight back to the setup steps
//
// Tracks are code-locked per person (lib/profiles.ts); the code is asked at
// every login — sessions last one browser session, and Settings can lock the
// track any time.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { COHORT_START_DATE } from "@/lib/plan";
import {
  createProfile,
  legacyName,
  legacyTrackExists,
  login,
  MIN_CODE_LENGTH,
  useProfiles,
  type Profile,
} from "@/lib/profiles";
import { initialsOf } from "@/lib/demo";
import {
  completeOnboarding,
  expectedDay,
  useProgress,
  type Reminder,
  type Visibility,
} from "@/lib/store";
import { Logo } from "./icons";

const AVATARS = [
  "linear-gradient(150deg,#7C6CF5,#5B4BD6)",
  "linear-gradient(150deg,#35D399,#16A97E)",
  "linear-gradient(150deg,#F5B54B,#D98A2B)",
  "linear-gradient(150deg,#EC6A9C,#C13E77)",
  "linear-gradient(150deg,#4AA8FF,#2B7FD6)",
];

function avatarFor(index: number): string {
  return AVATARS[index % AVATARS.length];
}

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

const inputClass =
  "w-full rounded-xl border border-edge3 bg-panel px-4 py-3 text-sm text-ink placeholder:text-dim focus:border-[rgba(53,211,153,.5)] focus:outline-none";

type Phase = "boot" | "who" | "code" | "create" | "setup";

export default function Onboarding() {
  const router = useRouter();
  const { ready, list, activeId } = useProfiles();
  const { onboarded } = useProgress();

  // Sub-navigation inside the logged-out flow; null = default screen.
  // Everything else about the phase is derived from the stores at render.
  const [subPhase, setSubPhase] = useState<"who" | "code" | "create" | null>(
    null
  );
  const [selected, setSelected] = useState<Profile | null>(null);

  // create form (name prefills from a pre-profiles track, if one exists)
  const [name, setName] = useState<string>(() => legacyName());
  const [newCode, setNewCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  // login form
  const [code, setCode] = useState("");

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const phase: Phase = !ready
    ? "boot"
    : activeId
      ? onboarded
        ? "boot" // logged in and done — redirecting to /today below
        : "setup"
      : subPhase === "code" && !selected
        ? "who"
        : (subPhase ?? (list.length > 0 ? "who" : "create"));

  const claiming = phase === "create" && legacyTrackExists();

  useEffect(() => {
    if (ready && activeId && onboarded) router.replace("/today");
  }, [ready, activeId, onboarded, router]);

  // ── actions ───────────────────────────────────────────────────────────────

  async function submitCreate() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Add a name so we know whose track this is.");
      return;
    }
    if (newCode.length < MIN_CODE_LENGTH) {
      setError(`Your code needs at least ${MIN_CODE_LENGTH} characters.`);
      return;
    }
    if (newCode !== confirmCode) {
      setError("The two codes don't match — type them again.");
      return;
    }
    setError("");
    setBusy(true);
    await createProfile(trimmed, newCode);
    setBusy(false);
    // activeId flips → the derived phase becomes "setup"
  }

  async function submitLogin() {
    if (!selected) return;
    setBusy(true);
    const ok = await login(selected.id, code);
    setBusy(false);
    if (!ok) {
      setError("That code didn't match — try again.");
      setCode("");
      return;
    }
    setError("");
    // activeId flips → setup steps, or the redirect effect sends us to /today
  }

  function pickProfile(p: Profile) {
    setSelected(p);
    setCode("");
    setError("");
    setSubPhase("code");
  }

  function startNew() {
    setName("");
    setNewCode("");
    setConfirmCode("");
    setError("");
    setSubPhase("create");
  }

  // ── header + shell ────────────────────────────────────────────────────────

  const heading =
    phase === "who"
      ? "Who's checking in?"
      : phase === "code"
        ? "Welcome back"
        : phase === "create"
          ? "Create your track"
          : "Set up your track";

  return (
    <div className="flex min-h-screen items-center justify-center p-5 sm:p-10">
      <div className="w-full max-w-[560px]">
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size={30} radius={8} />
            <span className="font-display text-sm font-semibold">
              {heading}
            </span>
          </div>
          <Link href="/" className="!text-mut3 text-[13px] hover:!text-ink">
            Cancel
          </Link>
        </div>
        <div className="mb-[26px] flex gap-1.5">
          <span className="h-1 flex-1 rounded-full bg-accent" />
          <span
            className={`h-1 flex-1 rounded-full ${phase === "setup" ? "bg-accent" : "bg-locked"}`}
          />
          <span
            className={`h-1 flex-1 rounded-full ${phase === "setup" ? "bg-accent" : "bg-locked"}`}
          />
        </div>

        {phase === "boot" && (
          <div className="card-std rounded-[20px] p-[30px] text-center text-[13px] text-mut3">
            Opening…
          </div>
        )}

        {/* ── WHO — pick your track ── */}
        {phase === "who" && (
          <div className="anim-fade-up card-std rounded-[20px] p-6 sm:p-[30px]">
            <div className="mb-1 font-display text-base font-semibold">
              Pick your track
            </div>
            <div className="mb-4 text-[13px] text-mut2">
              Everyone on this device has their own code-locked track.
            </div>
            <div className="mb-4 flex flex-col gap-2">
              {list.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => pickProfile(p)}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-edge3 bg-panel p-3 text-left transition-colors hover:border-[rgba(53,211,153,.4)]"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-white"
                    style={{ background: avatarFor(i) }}
                  >
                    {initialsOf(p.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {p.name}
                    </span>
                    <span className="block font-mono text-[11px] text-mut3">
                      joined {p.created}
                    </span>
                  </span>
                  <span className="text-[13px] text-mut3">🔒</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={startNew}
              className="btn-ghost w-full py-3 text-[13.5px]"
            >
              + Start a new track
            </button>
          </div>
        )}

        {/* ── CODE — unlock a track ── */}
        {phase === "code" && selected && (
          <div className="anim-fade-up card-std rounded-[20px] p-6 sm:p-[30px]">
            <div className="mb-4 flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold text-white"
                style={{
                  background: avatarFor(
                    Math.max(0, list.findIndex((p) => p.id === selected.id))
                  ),
                }}
              >
                {initialsOf(selected.name)}
              </span>
              <div>
                <div className="text-sm font-semibold text-ink">
                  {selected.name}
                </div>
                <div className="text-xs text-mut2">
                  Enter your code to open your track
                </div>
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submitLogin();
              }}
            >
              <input
                type="password"
                autoFocus
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError("");
                }}
                placeholder="Your code"
                autoComplete="current-password"
                className={`${inputClass} mb-2.5 font-mono tracking-[.2em]`}
              />
              {error && (
                <div className="mb-2.5 text-[12.5px] text-today">{error}</div>
              )}
              <button
                type="submit"
                disabled={busy || code.length === 0}
                className="btn-primary w-full py-[13px] text-sm disabled:cursor-default disabled:opacity-60"
              >
                {busy ? "Checking…" : "Open my track →"}
              </button>
            </form>
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSubPhase("who")}
                className="cursor-pointer text-[12.5px] text-mut3 hover:text-ink"
              >
                ← Not you? Pick another track
              </button>
            </div>
            <p className="mt-4 text-xs leading-[1.6] text-mut3">
              Codes can&apos;t be recovered — they never leave this device. If
              it&apos;s truly gone, start a new track and keep building.
            </p>
          </div>
        )}

        {/* ── CREATE — name + code ── */}
        {phase === "create" && (
          <div className="anim-fade-up card-std rounded-[20px] p-6 sm:p-[30px]">
            {claiming && (
              <div className="mb-4 rounded-xl border border-[rgba(53,211,153,.35)] bg-[rgba(53,211,153,.08)] p-3.5 text-[13px] leading-[1.6] text-ink2">
                This device already has a track in progress. Set a code now to
                claim it — every check-in and note carries over.
              </div>
            )}
            <div className="mb-1 font-display text-base font-semibold">
              1 · Your name
            </div>
            <div className="mb-3 text-[13px] text-mut2">
              Shown on your dashboard and share card.
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Display name (e.g. Saad Khan)"
              className={`${inputClass} mb-5`}
            />
            <div className="mb-1 font-display text-base font-semibold">
              2 · Set your code
            </div>
            <div className="mb-3 text-[13px] text-mut2">
              You&apos;ll enter it every time you open your track, so progress
              and notes stay yours — even on a shared device.
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submitCreate();
              }}
            >
              <input
                type="password"
                value={newCode}
                onChange={(e) => {
                  setNewCode(e.target.value);
                  setError("");
                }}
                placeholder={`Code — at least ${MIN_CODE_LENGTH} characters`}
                autoComplete="new-password"
                className={`${inputClass} mb-2.5 font-mono tracking-[.2em]`}
              />
              <input
                type="password"
                value={confirmCode}
                onChange={(e) => {
                  setConfirmCode(e.target.value);
                  setError("");
                }}
                placeholder="Repeat the code"
                autoComplete="new-password"
                className={`${inputClass} mb-2.5 font-mono tracking-[.2em]`}
              />
              {error && (
                <div className="mb-2.5 text-[12.5px] text-today">{error}</div>
              )}
              <button
                type="submit"
                disabled={busy}
                className="btn-primary w-full py-[13px] text-sm disabled:cursor-default disabled:opacity-60"
              >
                {busy ? "Creating…" : claiming ? "Claim my track →" : "Continue →"}
              </button>
            </form>
            {list.length > 0 && (
              <button
                type="button"
                onClick={() => setSubPhase("who")}
                className="mt-3 cursor-pointer text-[12.5px] text-mut3 hover:text-ink"
              >
                ← Back to all tracks
              </button>
            )}
            <p className="mt-4 text-xs leading-[1.6] text-mut3">
              Your code and progress live only in this browser — nothing is
              uploaded, and a forgotten code can&apos;t be reset. Pick one
              you&apos;ll remember.
            </p>
          </div>
        )}

        {/* ── SETUP — the 3 classic steps ── */}
        {phase === "setup" && <SetupSteps />}
      </div>
    </div>
  );
}

function SetupSteps() {
  const router = useRouter();
  const { list, activeId } = useProfiles();
  const [startToday, setStartToday] = useState(true);
  const [reminder, setReminder] = useState<Reminder>("evening");
  const [visibility, setVisibility] = useState<Visibility>("public");

  const cohortDay = expectedDay(COHORT_START_DATE);
  const profileName = list.find((p) => p.id === activeId)?.name ?? "";

  function start() {
    completeOnboarding({ startToday, reminder, visibility, name: profileName });
    router.push("/today");
  }

  return (
    <div className="anim-fade-up card-std rounded-[20px] p-6 sm:p-[30px]">
      {/* step 1 */}
      <div className="mb-[26px]">
        <div className="mb-1 font-display text-base font-semibold">
          1 · When do you start?
        </div>
        <div className="mb-3.5 text-[13px] text-mut2">
          Your Day 1 is personal — it doesn&apos;t have to match anyone else.
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
  );
}
