// 3D AI avatars — picked at signup, shown everywhere the account appears.
// Pure data: safe to import from client and server code.

export interface AiAvatar {
  id: string;
  emoji: string;
  from: string;
  to: string;
  label: string;
}

export const AVATARS: AiAvatar[] = [
  { id: "bot", emoji: "🤖", from: "#35D399", to: "#0E7A56", label: "Bot" },
  { id: "spark", emoji: "⚡", from: "#F5B54B", to: "#B06F1E", label: "Spark" },
  { id: "alien", emoji: "👾", from: "#7C6CF5", to: "#4A3BC0", label: "Alien" },
  { id: "brain", emoji: "🧠", from: "#EC6A9C", to: "#B03A6E", label: "Brain" },
  { id: "cyber", emoji: "🦾", from: "#4AA8FF", to: "#1E5C99", label: "Cyber" },
  { id: "astro", emoji: "🛸", from: "#2DD4BF", to: "#0E766B", label: "Astro" },
];

export function avatarById(id?: string | null): AiAvatar {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}

export function isAvatarId(id: unknown): id is string {
  return typeof id === "string" && AVATARS.some((a) => a.id === id);
}
