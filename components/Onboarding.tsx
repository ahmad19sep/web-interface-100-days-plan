"use client";

// /start — the door to every account.
//
//  new person   → pick a username + personal code → 3 setup steps → Day 1
//  returning    → username + code → your dashboard
//  mid-setup    → straight back to the setup steps
//
// Accounts live in the shared database (lib/session-client.ts calls
// app/api/auth/*), not the browser — sign in from any device with the same
// username + code.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { COHORT_START_DATE } from "@/lib/plan";
import {
  HANDLE_RE,
  MIN_CODE_LENGTH,
  login,
  signup,
  useProfiles,
} from "@/lib/profiles";
import {
  completeOnboarding,
  expectedDay,
  useProgress,
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

const inputClass =
  "w-full rounded-xl border border-edge3 bg-panel px-4 py-3 text-sm text-ink placeholder:text-dim focus:border-[rgba(53,211,153,.5)] focus:outline-none";

type Phase = "boot" | "entry" | "login" | "signup" | "setup";

export default function Onboarding() {
  const router = useRouter();
  const { ready, activeId } = useProfiles();
  const { onboarded } = useProgress();

  const [subPhase, setSubPhase] = useState<"login" | "signup" | null>(null);

  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // The 3-step course setup only opens when the Courses page asks for it
  // (/start?setup=1). A plain login/signup goes straight to /courses.
  const [setupRequested, setSetupRequested] = useState(false);
  useEffect(() => {
    setSetupRequested(
      new URLSearchParams(window.location.search).get("setup") === "1"
    );
  }, []);

  const phase: Phase = !ready
    ? "boot"
    : activeId
      ? onboarded || !setupRequested
        ? "boot" // logged in — redirecting below
        : "setup"
      : (subPhase ?? "entry");

  useEffect(() => {
    if (!ready || !activeId) return;
    if (onboarded) router.replace("/today");
    else if (!setupRequested) router.replace("/courses");
  }, [ready, activeId, onboarded, setupRequested, router]);

  // ── actions ───────────────────────────────────────────────────────────────

  async function submitSignup() {
    const cleanHandle = handle.trim().toLowerCase();
    if (!HANDLE_RE.test(cleanHandle)) {
      setError("Username must be 3-24 characters: letters, numbers, - or _.");
      return;
    }
    if (!name.trim()) {
      setError("Add a name so we know whose track this is.");
      return;
    }
    if (code.length < MIN_CODE_LENGTH) {
      setError(`Your code needs at least ${MIN_CODE_LENGTH} characters.`);
      return;
    }
    if (code !== confirmCode) {
      setError("The two codes don't match — type them again.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await signup(cleanHandle, name.trim(), code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create your track.");
    } finally {
      setBusy(false);
    }
  }

  async function submitLogin() {
    if (!handle.trim() || !code) return;
    setError("");
    setBusy(true);
    try {
      await login(handle.trim().toLowerCase(), code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't log in.");
      setCode("");
    } finally {
      setBusy(false);
    }
  }

  function goTo(next: "login" | "signup") {
    setHandle("");
    setName("");
    setCode("");
    setConfirmCode("");
    setError("");
    setSubPhase(next);
  }

  // ── header + shell ────────────────────────────────────────────────────────

  const heading =
    phase === "login"
      ? "Welcome back"
      : phase === "signup"
        ? "Create your track"
        : phase === "entry"
          ? "Join the challenge"
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

        {/* ── ENTRY ── */}
        {phase === "entry" && (
          <div className="anim-fade-up card-std rounded-[20px] p-6 sm:p-[30px]">
            <div className="mb-1 font-display text-base font-semibold">
              Your track, everywhere
            </div>
            <div className="mb-5 text-[13px] text-mut2">
              One username + code opens your streak, check-ins and notes on
              any phone or laptop.
            </div>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => goTo("signup")}
                className="btn-primary w-full py-[13px] text-sm"
              >
                Create a new track →
              </button>
              <button
                type="button"
                onClick={() => goTo("login")}
                className="btn-ghost w-full py-[13px] text-sm"
              >
                I already have a track — log in
              </button>
            </div>
          </div>
        )}

        {/* ── LOGIN ── */}
        {phase === "login" && (
          <div className="anim-fade-up card-std rounded-[20px] p-6 sm:p-[30px]">
            <div className="mb-4 text-[13px] text-mut2">
              Enter your username and code to open your track.
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submitLogin();
              }}
            >
              <input
                type="text"
                autoFocus
                value={handle}
                onChange={(e) => {
                  setHandle(e.target.value);
                  setError("");
                }}
                placeholder="Username"
                autoComplete="username"
                autoCapitalize="none"
                className={`${inputClass} mb-2.5`}
              />
              <input
                type="password"
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
                disabled={busy || !handle.trim() || code.length === 0}
                className="btn-primary w-full py-[13px] text-sm disabled:cursor-default disabled:opacity-60"
              >
                {busy ? "Checking…" : "Open my track →"}
              </button>
            </form>
            <button
              type="button"
              onClick={() => goTo("signup")}
              className="mt-3 cursor-pointer text-[12.5px] text-mut3 hover:text-ink"
            >
              New here? Create a track instead
            </button>
            <p className="mt-4 text-xs leading-[1.6] text-mut3">
              Codes can&apos;t be recovered — if it&apos;s truly gone, start a
              new track and keep building.
            </p>
          </div>
        )}

        {/* ── SIGNUP ── */}
        {phase === "signup" && (
          <div className="anim-fade-up card-std rounded-[20px] p-6 sm:p-[30px]">
            <div className="mb-1 font-display text-base font-semibold">
              1 · Username &amp; name
            </div>
            <div className="mb-3 text-[13px] text-mut2">
              Your username is how you log back in — pick something you&apos;ll
              remember. Your name is shown on your dashboard and share card.
            </div>
            <input
              type="text"
              value={handle}
              onChange={(e) => {
                setHandle(e.target.value);
                setError("");
              }}
              placeholder="Username (e.g. saadkhan)"
              autoComplete="username"
              autoCapitalize="none"
              className={`${inputClass} mb-2.5`}
            />
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
              You&apos;ll enter this — with your username — to open your track
              on any device.
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submitSignup();
              }}
            >
              <input
                type="password"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
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
                {busy ? "Creating…" : "Continue →"}
              </button>
            </form>
            <button
              type="button"
              onClick={() => goTo("login")}
              className="mt-3 cursor-pointer text-[12.5px] text-mut3 hover:text-ink"
            >
              ← Already have a track? Log in
            </button>
            <p className="mt-4 text-xs leading-[1.6] text-mut3">
              Your code can&apos;t be recovered if forgotten — pick one
              you&apos;ll remember. Nobody else can see it.
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
  const { name } = useProgress();
  const [startToday, setStartToday] = useState(true);
  const [reminder, setReminder] = useState<Reminder>("evening");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [busy, setBusy] = useState(false);

  const cohortDay = expectedDay(COHORT_START_DATE);

  async function start() {
    setBusy(true);
    await completeOnboarding({ startToday, reminder, visibility, name });
    // course started — Today / Journey / Projects unlock now
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
            sub="Appear on the community tab"
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
        onClick={() => void start()}
        disabled={busy}
        className="btn-primary w-full py-[15px] text-[15px] !font-bold disabled:cursor-default disabled:opacity-60"
      >
        {busy ? "Starting…" : "Start Day 1 →"}
      </button>
    </div>
  );
}
