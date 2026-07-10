"use client";

// Check-in confirmation toast — small and tasteful, no confetti.

import { useCallback, useEffect, useRef, useState } from "react";
import { IconCheck } from "./icons";

export interface ToastData {
  title: string;
  sub: string;
}

export function useToast(): [ToastData | null, (t: ToastData) => void] {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((t: ToastData) => {
    setToast(t);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  return [toast, show];
}

export function Toast({ toast }: { toast: ToastData | null }) {
  if (!toast) return null;
  return (
    <div
      className="anim-toast-in fixed bottom-7 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-[14px] border border-[rgba(34,211,238,.4)] bg-card px-5 py-3.5"
      style={{ boxShadow: "0 20px 40px -16px rgba(0,0,0,.7)" }}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-deep">
        <IconCheck />
      </span>
      <div>
        <div className="font-display text-sm font-semibold">{toast.title}</div>
        <div className="text-[12.5px] text-mut2">{toast.sub}</div>
      </div>
    </div>
  );
}
