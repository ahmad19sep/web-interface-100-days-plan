"use client";

// Per-day workspace progress: loads the server blob once, applies edits
// optimistically, and debounces POSTs so typing stays instant. The server
// (day_progress table) is the source of truth — the gate re-derives every
// requirement from what's stored there, never from transient UI state.

import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkspaceProgress } from "./lessons/types";

export interface WorkspaceProgressApi {
  ready: boolean;
  error: string | null;
  progress: WorkspaceProgress;
  /** shallow-merge a patch (send whole values per top-level key) */
  update: (patch: Partial<WorkspaceProgress>) => void;
  /** flush pending writes immediately (called before check-in) */
  flush: () => Promise<void>;
}

interface Loaded {
  day: number;
  progress: WorkspaceProgress;
  error: string | null;
}

const EMPTY: WorkspaceProgress = {};

export function useWorkspaceProgress(day: number): WorkspaceProgressApi {
  // keyed by day — a day change simply means "not loaded yet", no resets
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const ready = loaded?.day === day;
  const progress = ready ? loaded.progress : EMPTY;
  const error = ready ? loaded.error : null;

  const pending = useRef<Partial<WorkspaceProgress>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inflight = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/progress/workspace?day=${day}`)
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (cancelled) return;
        setLoaded(
          res.ok
            ? { day, progress: body.data ?? {}, error: null }
            : { day, progress: {}, error: body.error ?? "Couldn't load your progress." }
        );
      })
      .catch(() => {
        if (!cancelled)
          setLoaded({ day, progress: {}, error: "Couldn't load your progress." });
      });
    return () => {
      cancelled = true;
    };
  }, [day]);

  const setError = useCallback((msg: string | null) => {
    setLoaded((l) => (l ? { ...l, error: msg } : l));
  }, []);

  const send = useCallback(async () => {
    const patch = pending.current;
    if (Object.keys(patch).length === 0) return;
    pending.current = {};
    const req = fetch("/api/progress/workspace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day, patch }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body.error ?? "Couldn't save your progress.");
        } else {
          setError(null);
        }
      })
      .catch(() => setError("Couldn't save — check your connection."))
      .finally(() => {
        inflight.current = null;
      });
    inflight.current = req;
    await req;
  }, [day, setError]);

  const update = useCallback(
    (patch: Partial<WorkspaceProgress>) => {
      setLoaded((l) =>
        l && l.day === day ? { ...l, progress: { ...l.progress, ...patch } } : l
      );
      pending.current = { ...pending.current, ...patch };
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void send(), 700);
    },
    [day, send]
  );

  const flush = useCallback(async () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    await send();
    if (inflight.current) await inflight.current;
  }, [send]);

  // last-chance flush when the tab closes mid-debounce
  useEffect(() => {
    const onHide = () => {
      const patch = pending.current;
      if (Object.keys(patch).length === 0) return;
      pending.current = {};
      navigator.sendBeacon?.(
        "/api/progress/workspace",
        new Blob([JSON.stringify({ day, patch })], { type: "application/json" })
      );
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, [day]);

  return { ready, error, progress, update, flush };
}
