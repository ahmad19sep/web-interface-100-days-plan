"use client";

// Client-side fetch of owner-editable day content (video/GitHub link/note/
// quiz) — shared by DayDetail (the editable view) and DashboardHome (which
// only needs to know whether today's day has a quiz, to route check-in
// through the day page so its 60% pass gate can't be bypassed).

import { useEffect, useState } from "react";
import type { QuizQuestion } from "./challenges/types";

export interface DayLink {
  label: string;
  url: string;
}

export interface DayContent {
  videoUrl: string | null;
  githubUrl: string | null;
  note: string | null;
  quiz: QuizQuestion[] | null;
  links: DayLink[] | null;
}

const EMPTY_CONTENT: DayContent = {
  videoUrl: null,
  githubUrl: null,
  note: null,
  quiz: null,
  links: null,
};

/**
 * `ready` gates consumers that render inputs from the fetched value, so
 * those inputs mount already initialized instead of syncing via an effect.
 */
export function useDayContent(day: number): {
  content: DayContent;
  ready: boolean;
  setContent: (next: DayContent) => void;
} {
  const [content, setContent] = useState<DayContent>(EMPTY_CONTENT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/day-content/${day}`)
      .then((res) => res.json())
      .then((body: DayContent) => {
        if (cancelled) return;
        setContent(body);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [day]);

  return { content, ready, setContent };
}
