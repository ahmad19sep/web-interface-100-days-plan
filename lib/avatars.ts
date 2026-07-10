// 3D character avatars — low-poly people built in code with three.js, plus
// "ahmad", a real rigged GLB scan served from /public/avatars (see
// lib/avatar-models.ts). Picked at signup, shown everywhere the account
// appears. Pure data here: safe to import from client and server.

export interface AiAvatar {
  id: string;
  emoji: string;
  from: string;
  to: string;
  label: string;
}

export const AVATARS: AiAvatar[] = [
  { id: "ahmad", emoji: "🧑‍🏫", from: "#F5B54B", to: "#8A5A16", label: "Ahmad" },
  { id: "postman", emoji: "📮", from: "#EF6A6A", to: "#B22B2B", label: "Postman" },
  { id: "police", emoji: "👮", from: "#4A7DE0", to: "#1D326E", label: "Police Officer" },
  { id: "girl", emoji: "👧", from: "#F08BB8", to: "#B84378", label: "Girl" },
  { id: "builder", emoji: "👷", from: "#F5C518", to: "#B07708", label: "Builder" },
  { id: "bot", emoji: "🤖", from: "#9AA8BA", to: "#39424F", label: "Robot" },
];

export function avatarById(id?: string | null): AiAvatar {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[AVATARS.length - 1];
}

export function isAvatarId(id: unknown): id is string {
  return typeof id === "string" && AVATARS.some((a) => a.id === id);
}
