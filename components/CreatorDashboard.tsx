"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProgress } from "@/lib/store";
import type { AdminMember } from "@/app/api/admin/stats/route";

interface Stats {
  totalProfiles: number;
  publicProfiles: number;
  activeStreaks: number;
  funnel: Record<number, number>;
  members: AdminMember[];
}

type Fetch =
  | { state: "loading" }
  | { state: "forbidden" }
  | { state: "error" }
  | { state: "ready"; stats: Stats };

function useStats(enabled: boolean): Fetch {
  const [result, setResult] = useState<Fetch>({ state: "loading" });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    fetch("/api/admin/stats")
      .then(async (res) => {
        if (res.status === 403) {
          if (!cancelled) setResult({ state: "forbidden" });
          return;
        }
        const body = await res.json();
        if (!cancelled) setResult({ state: "ready", stats: body });
      })
      .catch(() => {
        if (!cancelled) setResult({ state: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return result;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card-std rounded-[14px] p-5">
      <div className="font-mono text-3xl font-extrabold text-accent">{value}</div>
      <div className="mt-1 text-[12.5px] text-mut3">{label}</div>
    </div>
  );
}

export default function CreatorDashboard() {
  const router = useRouter();
  const { isOwner, handle } = useProgress();
  const fetchState = useStats(Boolean(handle));
  // handles deleted this session — filtered out without a refetch
  const [deleted, setDeleted] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (handle && !isOwner) router.replace("/today");
  }, [handle, isOwner, router]);

  if (!handle || !isOwner) return null;

  async function deleteUser(target: string) {
    const sure = window.confirm(
      `Delete @${target} permanently?\n\nTheir check-ins, notes, quiz answers and workspace progress are erased with the account. This cannot be undone.`
    );
    if (!sure) return;
    setDeleting(target);
    setDeleteError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: target }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteError(body.error ?? "Couldn't delete the account.");
      } else {
        setDeleted((s) => new Set(s).add(target));
      }
    } catch {
      setDeleteError("Couldn't reach the server.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <div className="mb-[22px]">
        <div className="text-sm text-mut2">Only you can see this</div>
        <h1 className="font-display text-[26px] font-bold tracking-[-.02em]">
          Creator Studio
        </h1>
      </div>

      {fetchState.state === "loading" && (
        <div className="py-8 text-center text-[13px] text-mut3">Loading…</div>
      )}
      {fetchState.state === "forbidden" && (
        <div className="py-8 text-center text-[13px] text-mut3">
          Not authorized.
        </div>
      )}
      {fetchState.state === "error" && (
        <div className="py-8 text-center text-[13px] text-mut3">
          Couldn&apos;t load stats right now — try again shortly.
        </div>
      )}

      {fetchState.state === "ready" && (
        <>
          <div className="mb-5 grid grid-cols-3 gap-3.5">
            <StatCard label="Total sign-ups" value={fetchState.stats.totalProfiles} />
            <StatCard label="Public profiles" value={fetchState.stats.publicProfiles} />
            <StatCard label="Active streaks" value={fetchState.stats.activeStreaks} />
          </div>

          <Funnel funnel={fetchState.stats.funnel} />

          <div className="mt-5 card-std overflow-hidden rounded-[14px]">
            <div className="border-b border-edge p-[18px] font-display text-[15px] font-semibold">
              Every account
            </div>
            {deleteError && (
              <div className="border-b border-edge bg-[rgba(248,113,113,.06)] px-[18px] py-2.5 text-[12.5px] text-[#fca5a5]">
                {deleteError}
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="text-[11px] text-mut3">
                    <th className="px-[18px] py-2.5 font-normal">Handle</th>
                    <th className="px-[18px] py-2.5 font-normal">Name</th>
                    <th className="px-[18px] py-2.5 font-normal">Visibility</th>
                    <th className="px-[18px] py-2.5 font-normal">Day</th>
                    <th className="px-[18px] py-2.5 font-normal">Streak</th>
                    <th className="px-[18px] py-2.5 font-normal">Days done</th>
                    <th className="px-[18px] py-2.5 font-normal">Quiz</th>
                    <th className="px-[18px] py-2.5 font-normal">Joined</th>
                    <th className="px-[18px] py-2.5 font-normal" />
                  </tr>
                </thead>
                <tbody>
                  {fetchState.stats.members
                    .filter((m) => !deleted.has(m.handle))
                    .map((m) => (
                    <tr key={m.handle} className="border-t border-edge3">
                      <td className="px-[18px] py-2.5 font-mono text-ink">
                        @{m.handle}
                        {m.isOwner && (
                          <span className="ml-1.5 text-[11px]" title="Owner account">
                            👑
                          </span>
                        )}
                      </td>
                      <td className="px-[18px] py-2.5">{m.name}</td>
                      <td className="px-[18px] py-2.5 text-mut2">{m.visibility}</td>
                      <td className="px-[18px] py-2.5 font-mono">{m.day}</td>
                      <td className="px-[18px] py-2.5 font-mono text-today">🔥 {m.streak}</td>
                      <td className="px-[18px] py-2.5 font-mono">{m.totalDays}</td>
                      <td className="px-[18px] py-2.5 font-mono">
                        {m.quizScore === null ? "—" : `${m.quizScore}%`}
                      </td>
                      <td className="px-[18px] py-2.5 text-mut3">{m.joined}</td>
                      <td className="px-[18px] py-2.5 text-right">
                        {!m.isOwner && (
                          <button
                            type="button"
                            onClick={() => void deleteUser(m.handle)}
                            disabled={deleting === m.handle}
                            title={`Delete @${m.handle} permanently`}
                            className="cursor-pointer rounded-[8px] border border-[rgba(248,113,113,.35)] bg-[rgba(248,113,113,.06)] px-2.5 py-1.5 font-mono text-[10px] tracking-[.06em] text-[#fca5a5] hover:bg-[rgba(248,113,113,.14)] disabled:cursor-default disabled:opacity-50"
                          >
                            {deleting === m.handle ? "…" : "🗑 DELETE"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {fetchState.stats.members.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-[18px] py-6 text-center text-mut3">
                        No sign-ups yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Funnel({ funnel }: { funnel: Record<number, number> }) {
  const days = Object.keys(funnel)
    .map(Number)
    .sort((a, b) => a - b);
  if (days.length === 0) return null;
  const max = Math.max(...days.map((d) => funnel[d]));

  return (
    <div className="card-std rounded-[14px] p-[18px]">
      <div className="mb-3.5 font-display text-[15px] font-semibold">
        Per-day check-ins
      </div>
      <div className="flex flex-col gap-1.5">
        {days.map((d) => (
          <div key={d} className="flex items-center gap-2.5">
            <span className="w-9 shrink-0 font-mono text-[11px] text-mut3">
              D{d}
            </span>
            <div className="h-[14px] flex-1 overflow-hidden rounded-full bg-locked">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max(4, (funnel[d] / max) * 100)}%`,
                  background: "linear-gradient(90deg,#0E7490,#22D3EE)",
                }}
              />
            </div>
            <span className="w-6 shrink-0 text-right font-mono text-[11px] text-mut3">
              {funnel[d]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
