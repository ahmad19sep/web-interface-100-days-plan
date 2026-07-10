// A glossy 3D sphere avatar — specular highlight, inner shading, drop
// shadow. Pure CSS, sized by prop, used everywhere an account shows.

import { avatarById } from "@/lib/avatars";

export default function Avatar3D({
  id,
  size = 40,
  className = "",
}: {
  id?: string | null;
  size?: number;
  className?: string;
}) {
  const a = avatarById(id);
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,.45), rgba(255,255,255,0) 45%), linear-gradient(150deg, ${a.from}, ${a.to})`,
        boxShadow: `inset 0 ${-Math.max(2, size * 0.08)}px ${size * 0.2}px rgba(0,0,0,.45), inset 0 ${Math.max(1, size * 0.04)}px ${size * 0.08}px rgba(255,255,255,.25), 0 ${size * 0.14}px ${size * 0.3}px ${-size * 0.1}px rgba(0,0,0,.65)`,
      }}
      title={a.label}
    >
      <span
        style={{ fontSize: size * 0.5, lineHeight: 1 }}
        className="select-none"
      >
        {a.emoji}
      </span>
    </div>
  );
}
