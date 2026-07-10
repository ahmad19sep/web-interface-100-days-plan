// Preview community data (from the design handoff) — shown until the cohort
// backend ships. The "you" row is replaced with the user's real local stats.

export interface Leader {
  rank: number;
  name: string;
  country: string;
  day: number;
  streak: number;
  total: number;
  initials: string;
  avatar: string;
  me?: boolean;
}

export const DEMO_LEADERS: Leader[] = [
  { rank: 1, name: "Ayesha Nadeem", country: "🇵🇰 Pakistan", day: 44, streak: 44, total: 44, initials: "AN", avatar: "linear-gradient(150deg,#22D3EE,#0E7490)" },
  { rank: 2, name: "Rohan Mehta", country: "🇮🇳 India", day: 41, streak: 41, total: 43, initials: "RM", avatar: "linear-gradient(150deg,#F5B54B,#D98A2B)" },
  { rank: 3, name: "Bilal Aslam", country: "🇵🇰 Pakistan", day: 40, streak: 38, total: 40, initials: "BA", avatar: "linear-gradient(150deg,#7C6CF5,#5B4BD6)" },
  { rank: 4, name: "Sana Iqbal", country: "🇵🇰 Pakistan", day: 39, streak: 33, total: 39, initials: "SI", avatar: "linear-gradient(150deg,#EC6A9C,#C13E77)" },
  { rank: 5, name: "Aditya Rao", country: "🇮🇳 India", day: 38, streak: 30, total: 38, initials: "AR", avatar: "linear-gradient(150deg,#4AA8FF,#2B7FD6)" },
  { rank: 12, name: "You", country: "🇵🇰 Pakistan", day: 37, streak: 12, total: 36, initials: "SK", avatar: "linear-gradient(150deg,#7C6CF5,#5B4BD6)", me: true },
  { rank: 13, name: "Hamza Tariq", country: "🇵🇰 Pakistan", day: 35, streak: 12, total: 34, initials: "HT", avatar: "linear-gradient(150deg,#22D3EE,#0E7490)" },
];

export interface ShowcaseItem {
  tag: string;
  title: string;
  who: string;
  likes: number;
  thumb: string;
  avatar: string;
}

export const DEMO_SHOWCASE: ShowcaseItem[] = [
  { tag: "P1 · RAG", title: "RAG over 400 legal PDFs", who: "Ayesha · Day 34", likes: 128, thumb: "linear-gradient(135deg,#0E7490,#0E5C46)", avatar: "linear-gradient(150deg,#22D3EE,#0E7490)" },
  { tag: "P2 · EVAL", title: "Eval harness caught a 30% regression", who: "Bilal · Day 33", likes: 94, thumb: "linear-gradient(135deg,#7C6CF5,#3A2E9E)", avatar: "linear-gradient(150deg,#7C6CF5,#5B4BD6)" },
  { tag: "P3 · COST", title: "Prompt caching cut spend 41%", who: "Sana · Day 30", likes: 76, thumb: "linear-gradient(135deg,#F5B54B,#B06F1E)", avatar: "linear-gradient(150deg,#EC6A9C,#C13E77)" },
  { tag: "P1 · RAG", title: "Voice-note RAG for Urdu lectures", who: "Rohan · Day 32", likes: 61, thumb: "linear-gradient(135deg,#4AA8FF,#1E5C99)", avatar: "linear-gradient(150deg,#4AA8FF,#2B7FD6)" },
];

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AI";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
