"use client";

// Pointer-tracked 3D tilt with an emerald glare highlight. Pure CSS
// transforms — no libraries. Mouse-only (touch scrolling stays untouched)
// and inert under prefers-reduced-motion.

import { useRef } from "react";

export default function Tilt({
  children,
  max = 7,
  className = "",
}: {
  children: React.ReactNode;
  /** Max tilt in degrees */
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max).toFixed(2)}deg) scale3d(1.015,1.015,1)`;
    const g = glare.current;
    if (g) {
      g.style.background = `radial-gradient(420px circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(34,211,238,.10), transparent 55%)`;
      g.style.opacity = "1";
    }
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    if (glare.current) glare.current.style.opacity = "0";
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt3d relative ${className}`}
    >
      {children}
      <div
        ref={glare}
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
      />
    </div>
  );
}
