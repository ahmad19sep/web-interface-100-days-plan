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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { COHORT_START_DATE } from "@/lib/plan";
import {
  HANDLE_RE,
  MIN_CODE_LENGTH,
  login,
  signup,
  useProfiles,
} from "@/lib/profiles";
import { AVATARS } from "@/lib/avatars";
import { nameToHandle } from "@/lib/handle";
import Avatar3D from "./Avatar3D";

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
          ? "border-[1.5px] border-[rgba(34,211,238,.5)] bg-[rgba(34,211,238,.08)]"
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
          ? "border border-[rgba(34,211,238,.4)] bg-[rgba(34,211,238,.1)] text-accent"
          : "border border-edge3 bg-panel text-mut hover:border-[#2A3542]"
      }`}
    >
      {label}
    </button>
  );
}

const inputClass =
  "w-full rounded-xl border border-edge3 bg-panel px-4 py-3 text-sm text-ink placeholder:text-dim focus:border-[rgba(34,211,238,.5)] focus:outline-none";

type Phase = "boot" | "login" | "signup" | "setup";

export default function Onboarding() {
  const router = useRouter();
  const { ready, activeId } = useProfiles();
  const { onboarded } = useProgress();

  // ?setup=1 / ?signup=1 come from useSearchParams — they match the route
  // being rendered even mid client-navigation, where window.location can
  // still hold the previous URL and would bounce the user back to /courses
  const params = useSearchParams();
  const [subPhase, setSubPhase] = useState<"login" | "signup" | null>(
    params.get("signup") === "1" ? "signup" : null
  );

  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [avatar, setAvatar] = useState("bot");

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // The 3-step course setup only opens when the Courses page asks for it
  // (/start?setup=1). A plain login/signup goes straight to /courses.
  const setupRequested = params.get("setup") === "1";

  const phase: Phase = !ready
    ? "boot"
    : activeId
      ? onboarded || !setupRequested
        ? "boot" // logged in — redirecting below
        : "setup"
      : (subPhase ?? "signup");

  useEffect(() => {
    if (!ready || !activeId) return;
    // Udemy-style: every login lands on the course catalog first — the
    // user picks their course there, even while we only have one.
    if (onboarded || !setupRequested) router.replace("/courses");
  }, [ready, activeId, onboarded, setupRequested, router]);

  // ── actions ───────────────────────────────────────────────────────────────

  async function submitSignup() {
    const cleanName = name.trim();
    if (!cleanName) {
      setError("Add your name.");
      return;
    }
    const derivedHandle = nameToHandle(cleanName);
    if (derivedHandle.length < 3) {
      setError("Use a name with at least 3 letters or numbers.");
      return;
    }
    if (code.length < MIN_CODE_LENGTH) {
      setError(`Your code needs at least ${MIN_CODE_LENGTH} characters.`);
      return;
    }
    setError("");
    setBusy(true);
    try {
      await signup(derivedHandle, cleanName, code, avatar);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create your access code.");
    } finally {
      setBusy(false);
    }
  }

  async function submitLogin() {
    if (!handle.trim() || !code) return;
    setError("");
    setBusy(true);
    try {
      await login(nameToHandle(handle), code);
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
    setError("");
    setSubPhase(next);
  }

  // ── header + shell ────────────────────────────────────────────────────────

  const heading =
    phase === "login"
      ? "Welcome back"
      : phase === "signup"
        ? "Create your access code"
        : "Set up your course";

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

        {/* ── LOGIN ── */}
        {phase === "login" && (
          <div className="anim-fade-up card-std rounded-[20px] p-6 sm:p-[30px]">
            <div className="mb-4 text-[13px] text-mut2">
              Write your name and access code to open your account.
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
                placeholder="Your name"
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
                placeholder="Your access code"
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
                {busy ? "Checking…" : "Open →"}
              </button>
            </form>
            <button
              type="button"
              onClick={() => goTo("signup")}
              className="mt-3 cursor-pointer text-[12.5px] text-mut3 hover:text-ink"
            >
              New here? Create an access code
            </button>
            <p className="mt-4 text-xs leading-[1.6] text-mut3">
              Codes can&apos;t be recovered — if it&apos;s truly gone, create a
              new one and keep building.
            </p>
          </div>
        )}

        {/* ── SIGNUP ── */}
        {phase === "signup" && (
          <div className="anim-fade-up card-std rounded-[20px] p-6 sm:p-[30px]">
            <div className="mb-1 font-display text-base font-semibold">
              Your name
            </div>
            <div className="mb-2.5 text-[13px] text-mut2">
              You&apos;ll write this name + your code to log in anywhere.
            </div>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="e.g. Saad Khan"
              autoComplete="name"
              className={`${inputClass} mb-5`}
            />

            <div className="mb-2.5 font-display text-base font-semibold">
              Pick your 3D character
            </div>
            <div className="mb-2 flex flex-wrap gap-3">
              {AVATARS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAvatar(a.id)}
                  className={`cursor-pointer rounded-full p-1 transition-transform ${
                    avatar === a.id
                      ? "scale-110 ring-2 ring-accent"
                      : "opacity-60 hover:scale-105 hover:opacity-100"
                  }`}
                  aria-label={a.label}
                >
                  <Avatar3D id={a.id} size={52} live={avatar === a.id} />
                </button>
              ))}
            </div>
            <div className="mb-5 font-mono text-[11px] tracking-[.08em] text-accent">
              {AVATARS.find((a) => a.id === avatar)?.label.toUpperCase()}
            </div>

            <div className="mb-1 font-display text-base font-semibold">
              Set your access code
            </div>
            <div className="mb-3 text-[13px] text-mut2">
              It can&apos;t be recovered — pick one you&apos;ll remember.
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
                placeholder={`Access code — at least ${MIN_CODE_LENGTH} characters`}
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
                {busy ? "Creating…" : "Create & enter →"}
              </button>
            </form>
            <Link
              href="/"
              className="mt-3 block text-[12.5px] !text-mut3 hover:!text-ink"
            >
              ← Already have a code? Log in
            </Link>
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
