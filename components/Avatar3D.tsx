"use client";

// A real 3D character avatar (postman, police officer, girl, builder,
// robot — built in code, no model files). Small placements (sidebar,
// leaderboard) show a cached transparent PNG snapshot; pass `live` for a
// slowly rotating real-time model (signup picker selection, profile hero).
// three.js loads lazily on the client only.

import { useEffect, useRef, useState } from "react";
import { avatarById } from "@/lib/avatars";
import { avatarSnapshot, loadThree, stageFor } from "@/lib/avatar-models";

export default function Avatar3D({
  id,
  size = 40,
  className = "",
  live = false,
}: {
  id?: string | null;
  size?: number;
  className?: string;
  live?: boolean;
}) {
  const a = avatarById(id);
  const [src, setSrc] = useState<string | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  // static: fetch the cached snapshot image
  useEffect(() => {
    if (live) return;
    let on = true;
    avatarSnapshot(a.id)
      .then((s) => {
        if (on) setSrc(s);
      })
      .catch(() => {});
    return () => {
      on = false;
    };
  }, [a.id, live]);

  // live: own tiny renderer with a slow turntable spin
  useEffect(() => {
    if (!live) return;
    let raf = 0;
    let disposed = false;
    let renderer: { dispose(): void; domElement: HTMLCanvasElement } | null =
      null;
    (async () => {
      const T = await loadThree();
      const mount = mountRef.current;
      if (disposed || !mount) return;
      const r = new T.WebGLRenderer({ antialias: true, alpha: true });
      renderer = r;
      r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      r.setSize(size, size);
      r.setClearColor(0x000000, 0);
      mount.appendChild(r.domElement);
      const { scene, model, camera } = stageFor(T, a.id);
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) model.rotation.y = 0.5;
      const tick = () => {
        model.rotation.y += 0.014;
        r.render(scene, camera);
        if (!reduced) raf = requestAnimationFrame(tick);
      };
      tick();
    })();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (renderer) {
        if (renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, [a.id, live, size]);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border border-edge2 ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 32% 26%, ${a.from}40, ${a.to}26 72%, rgba(0,0,0,.25))`,
        boxShadow: `inset 0 ${-Math.max(1, size * 0.05)}px ${size * 0.18}px rgba(0,0,0,.35)`,
      }}
      title={a.label}
    >
      {live ? (
        <div ref={mountRef} className="h-full w-full" />
      ) : src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={a.label}
          width={size}
          height={size}
          draggable={false}
          className="h-full w-full select-none"
        />
      ) : (
        <span
          className="flex h-full w-full select-none items-center justify-center"
          style={{ fontSize: size * 0.5 }}
        >
          {a.emoji}
        </span>
      )}
    </div>
  );
}
