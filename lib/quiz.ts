// Pure quiz-grading logic — no storage, no "use client". Answers are stored
// as raw selected indices only; grading always re-reads the current
// correctIndex from the curriculum data, so fixing a quiz in code re-grades
// every past answer automatically.

import { getDay } from "./plan";

export interface QuizStats {
  correct: number;
  total: number;
}

export interface StoredAnswer {
  day: number;
  questionIndex: number;
  selectedIndex: number;
}

/** Aggregate correct/total across every question a user has answered. */
export function gradeAll(answers: StoredAnswer[]): QuizStats {
  let correct = 0;
  let total = 0;
  for (const a of answers) {
    const q = getDay(a.day)?.quiz?.[a.questionIndex];
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
  day: number,
  selected: Record<number, number>
): GradedQuestion[] {
  const quiz = getDay(day)?.quiz;
  if (!quiz) return [];
  return quiz.map((q, i) => ({
    question: q.question,
    options: q.options,
    selectedIndex: selected[i] ?? null,
    correctIndex: q.correctIndex,
  }));
}
