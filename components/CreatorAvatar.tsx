"use client";

// Ahmad's personal 3D avatar (public/avatars/ahmad.glb) — About-me page
// only, never a user-pickable character. A full-body live stage: the idle
// animation plays, the model slowly turns, and dragging spins it by hand.
// Falls back to the photo / branded "A" block when WebGL is unavailable.

import { useEffect, useRef, useState } from "react";
import { buildAvatarObject, loadThree } from "@/lib/avatar-models";
import { ABOUT } from "@/lib/site";

function PhotoFallback() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="flex h-full w-full items-center justify-center font-display text-6xl font-bold text-[#062018]"
        style={{ background: "linear-gradient(150deg,#35D399,#16A97E)" }}
      >
        A
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ABOUT.photo}
      alt={ABOUT.fullName}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  );
}

export default function CreatorAvatar({
  className = "",
}: {
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let raf = 0;
    let disposed = false;
    let cleanup: (() => void) | null = null;
    (async () => {
      try {
        const T = await loadThree();
        const mount = mountRef.current;
        if (disposed || !mount) return;

        const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);
        renderer.domElement.style.display = "block";
        renderer.domElement.style.cursor = "grab";
        renderer.domElement.style.touchAction = "none";

        const scene = new T.Scene();
        scene.add(new T.HemisphereLight(0xffffff, 0x28303c, 1.25));
        const key = new T.DirectionalLight(0xffffff, 1.7);
        key.position.set(3, 5, 4);
        scene.add(key);
        const rim = new T.DirectionalLight(0x35d399, 0.7);
        rim.position.set(-4, 3, -3);
        scene.add(rim);

        const { object: model, tick: charTick } = await buildAvatarObject(T, "ahmad");
        if (disposed) {
          renderer.dispose();
          renderer.domElement.remove();
          return;
        }
        scene.add(model);
        setLoaded(true);

        // portrait framing: full body, eyes near the upper third
        const camera = new T.PerspectiveCamera(32, 1, 0.1, 50);
        camera.position.set(0, 1.9, 5.4);
        camera.lookAt(0, 1.45, 0);

        const ro = new ResizeObserver(() => {
          const w = mount.clientWidth || 1;
          const h = mount.clientHeight || 1;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        });
        ro.observe(mount);

        // drag to spin, gentle auto-turn otherwise
        let dragging = false;
        let lastX = 0;
        let idle = 0;
        const onDown = (e: PointerEvent) => {
          dragging = true;
          lastX = e.clientX;
          renderer.domElement.style.cursor = "grabbing";
        };
        const onMove = (e: PointerEvent) => {
          if (!dragging) return;
          model.rotation.y += (e.clientX - lastX) * 0.012;
          lastX = e.clientX;
          idle = 0;
        };
        const onUp = () => {
          dragging = false;
          renderer.domElement.style.cursor = "grab";
        };
        renderer.domElement.addEventListener("pointerdown", onDown);
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);

        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        if (reduced) charTick(0.6);

        const tick = () => {
          if (!reduced) {
            if (!dragging && ++idle > 90) model.rotation.y += 0.005;
            charTick(1 / 60);
          }
          renderer.render(scene, camera);
          if (!reduced || dragging) raf = requestAnimationFrame(tick);
        };
        // reduced motion still re-renders on drag
        if (reduced) {
          renderer.domElement.addEventListener("pointerdown", () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(tick);
          });
        }
        tick();

        cleanup = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          renderer.domElement.removeEventListener("pointerdown", onDown);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        setFailed(true);
      }
    })();
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-[22px] border border-edge2 ${className}`}
      style={{
        background:
          "radial-gradient(circle at 50% 18%, rgba(53,211,153,.16), rgba(15,20,26,.9) 68%)",
      }}
      title={`${ABOUT.fullName} — drag to spin`}
    >
      {failed ? (
        <PhotoFallback />
      ) : (
        <>
          <div ref={mountRef} className="absolute inset-0" />
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-[10.5px] tracking-[.18em] text-mut3">
              LOADING 3D…
            </div>
          )}
          <div className="pointer-events-none absolute bottom-2 left-0 right-0 text-center font-mono text-[9.5px] tracking-[.18em] text-mut3">
            DRAG TO SPIN
          </div>
        </>
      )}
    </div>
  );
}
