// Pure badge logic — no storage, no "use client". Badges are derived fresh
// from streaks + quiz stats every time (by the browser or the server), so
// there's nothing to "award" or migrate if the rules change later.

export interface Badge {
  id: string;
  emoji: string;
  label: string;
  description: string;
}

import type { QuizStats } from "./quiz";
export type { QuizStats };

const STREAK_BADGES: { days: number; id: string; emoji: string; label: string }[] = [
  { days: 7, id: "streak-7", emoji: "🔥", label: "Week One" },
  { days: 14, id: "streak-14", emoji: "🔥", label: "Two Weeks" },
  { days: 30, id: "streak-30", emoji: "🔥", label: "One Month" },
  { days: 50, id: "streak-50", emoji: "🔥", label: "Halfway" },
  { days: 100, id: "streak-100", emoji: "🏆", label: "100 Days" },
];

/** Badges earned so far, most-recently-unlocked-tier first within each group. */
export function computeBadges(longestStreak: number, quiz: QuizStats): Badge[] {
  const badges: Badge[] = [];

  for (const m of STREAK_BADGES) {
    if (longestStreak >= m.days) {
      badges.push({
        id: m.id,
        emoji: m.emoji,
        label: m.label,
        description: `Reached a ${m.days}-day streak`,
      });
    }
  }

  if (quiz.total >= 1) {
    badges.push({
      id: "quiz-taker",
      emoji: "🎯",
      label: "Quiz Taker",
      description: "Answered at least one daily quiz",
    });
  }
  const pct = quiz.total > 0 ? quiz.correct / quiz.total : 0;
  if (quiz.total >= 5 && pct >= 0.9) {
    badges.push({
      id: "quiz-sharp",
      emoji: "🧠",
      label: "Sharp",
      description: "90%+ correct across 5+ quizzes",
    });
  }
  if (quiz.total >= 20 && pct === 1) {
    badges.push({
      id: "quiz-perfect",
      emoji: "💯",
      label: "Perfect Record",
      description: "100% correct across 20+ quizzes",
    });
  }

  return badges;
}

/** Rounded percent for a "quiz score" display, or null if nothing answered yet. */
export function quizScorePercent(quiz: QuizStats): number | null {
  if (quiz.total === 0) return null;
  return Math.round((quiz.correct / quiz.total) * 100);
}
