// Pure quiz-grading logic — no storage, no "use client", no direct
// curriculum lookups. Callers pass in the *effective* quiz for a day
// (code-based QUIZZES merged with any live owner override — see
// lib/day-content.ts on the server, or DayDetail's dayContent on the
// client) so grading always uses whichever quiz is actually showing.

import type { QuizQuestion } from "./challenges/types";

export interface QuizStats {
  correct: number;
  total: number;
}

export interface StoredAnswer {
  day: number;
  questionIndex: number;
  selectedIndex: number;
}

export type QuizMap = Record<number, QuizQuestion[]>;

/** Aggregate correct/total across every question a user has answered. */
export function gradeAll(answers: StoredAnswer[], quizMap: QuizMap): QuizStats {
  let correct = 0;
  let total = 0;
  for (const a of answers) {
    const q = quizMap[a.day]?.[a.questionIndex];
    if (!q) continue; // question no longer exists — don't penalize or count it
    total++;
    if (q.correctIndex === a.selectedIndex) correct++;
  }
  return { correct, total };
}

export interface GradedQuestion {
  question: string;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
}

/** One day's quiz, with the user's selections (if any) graded inline. */
export function gradeDayQuiz(
  quiz: QuizQuestion[] | undefined,
  selected: Record<number, number>
): GradedQuestion[] {
  if (!quiz) return [];
  return quiz.map((q, i) => ({
    question: q.question,
    options: q.options,
    selectedIndex: selected[i] ?? null,
    correctIndex: q.correctIndex,
  }));
}
