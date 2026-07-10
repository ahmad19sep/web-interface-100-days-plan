"use client";

import { useRouter } from "next/navigation";
import { AVATARS } from "@/lib/avatars";
import { logout } from "@/lib/profiles";
import {
  setAvatar,
  setGithub,
  setName,
  setNotesPrivate,
  setReminder,
  setVisibility,
  useProgress,
  type Reminder,
} from "@/lib/store";
import Avatar3D from "./Avatar3D";
import { Toggle } from "./Toggle";

const REMINDERS: { key: Reminder; label: string }[] = [
  { key: "morning", label: "Morning" },
  { key: "evening", label: "Evening · 8:30 PM" },
  { key: "none", label: "No reminder" },
];

/** The settings cards without page chrome — embedded in the Profile tab. */
export function SettingsPanel() {
  const router = useRouter();
  const state = useProgress();

  return (
    <div>
      <div className="flex max-w-[640px] flex-col gap-3.5">
        <div className="card-std p-[22px]">
          <div className="mb-3">
            <div className="mb-[3px] text-[14.5px] font-semibold">
              Your 3D character
            </div>
            <div className="text-[13px] text-mut2">
              Shown on your profile, the sidebar and the leaderboard.
            </div>
          </div>
          <div className="mb-2 flex flex-wrap gap-3">
            {AVATARS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAvatar(a.id)}
                className={`cursor-pointer rounded-full p-1 transition-transform ${
                  state.avatar === a.id
                    ? "scale-110 ring-2 ring-accent"
                    : "opacity-60 hover:scale-105 hover:opacity-100"
                }`}
                aria-label={a.label}
              >
                <Avatar3D id={a.id} size={52} live={state.avatar === a.id} />
              </button>
            ))}
          </div>
          <div className="font-mono text-[11px] tracking-[.08em] text-accent">
            {AVATARS.find((a) => a.id === state.avatar)?.label.toUpperCase() ??
              "PICK A CHARACTER"}
          </div>
        </div>

        <div className="card-std p-[22px]">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <div className="mb-[3px] text-[14.5px] font-semibold">
                Daily reminder
              </div>
              <div className="text-[13px] text-mut2">
                A gentle nudge to check in — never a guilt trip.
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {REMINDERS.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setReminder(r.key)}
                className={`cursor-pointer rounded-full px-[15px] py-[9px] text-[13px] transition-colors ${
                  state.reminder === r.key
                    ? "border border-[rgba(34,211,238,.4)] bg-[rgba(34,211,238,.1)] text-accent"
                    : "border border-edge3 bg-panel text-mut hover:border-[#2A3542]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card-std p-[22px]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="mb-[3px] text-[14.5px] font-semibold">
                Public profile
              </div>
              <div className="text-[13px] text-mut2">
                Show your streak and shipped projects on the leaderboard.
              </div>
            </div>
            <Toggle
              on={state.visibility === "public"}
              onClick={() =>
                setVisibility(state.visibility === "public" ? "private" : "public")
              }
            />
          </div>
        </div>

        <div className="card-std p-[22px]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="mb-[3px] text-[14.5px] font-semibold">
                Private notes
              </div>
              <div className="text-[13px] text-mut2">
                Your journal entries stay yours by default.
              </div>
            </div>
            <Toggle
              on={state.notesPrivate}
              onClick={() => setNotesPrivate(!state.notesPrivate)}
            />
          </div>
        </div>

        <div className="card-std p-[22px]">
          <div className="mb-3 text-[14.5px] font-semibold">Account</div>
          <div className="mb-3 grid gap-2.5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs text-mut3">Display name</span>
              <input
                type="text"
                value={state.name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-[10px] border border-edge3 bg-panel px-3 py-2.5 text-[13px] text-ink placeholder:text-dim focus:border-[rgba(34,211,238,.5)] focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-mut3">GitHub</span>
              <input
                type="text"
                value={state.github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="github.com/you"
                className="w-full rounded-[10px] border border-edge3 bg-panel px-3 py-2.5 text-[13px] text-ink placeholder:text-dim focus:border-[rgba(34,211,238,.5)] focus:outline-none"
              />
            </label>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => {
                void logout().then(() => router.push("/start"));
              }}
              className="cursor-pointer rounded-[10px] border border-edge2 bg-card2 px-4 py-2.5 text-[13px] text-mut2 hover:text-ink"
            >
              🔒 Log out
            </button>
          </div>
          <p className="mt-2.5 text-xs text-mut3">
            Your track is saved to your account — log in with your username
            and code from any device to pick up where you left off.
          </p>
        </div>
      </div>
    </div>
  );
}

/** The /settings route keeps working (old links); it just shows the panel. */
export default function Settings() {
  return (
    <div>
      <div className="mb-[22px]">
        <div className="text-sm text-mut2">Your track, your rules</div>
        <h1 className="font-display text-[26px] font-bold tracking-[-.02em]">
          Settings
        </h1>
      </div>
      <SettingsPanel />
    </div>
  );
}
