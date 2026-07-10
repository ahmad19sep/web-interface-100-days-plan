// 3D character avatars users can pick — three realistic rigged VRM people
// (public/avatars/*.vrm) plus five low-poly people built in code (see
// lib/avatar-models.ts). Picked at signup, shown everywhere the account
// appears. Ahmad's personal GLB scan is NOT in this list — it lives on the
// About-me page only (components/CreatorAvatar.tsx). Pure data here: safe
// to import from client and server.

export interface AiAvatar {
  id: string;
  emoji: string;
  from: string;
  to: string;
  label: string;
}

export const AVATARS: AiAvatar[] = [
  { id: "explorer", emoji: "🧭", from: "#7DD3FC", to: "#1E5E8A", label: "Explorer" },
  { id: "voyager", emoji: "🚀", from: "#A78BFA", to: "#4C2E8A", label: "Voyager" },
  { id: "pioneer", emoji: "🌟", from: "#34D399", to: "#116B4E", label: "Pioneer" },
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
