"use client";

// The journey map as a WebGL 3D city (three.js): one tower per day.
// Done days rise as glowing emerald towers, rest-done days as deep-green
// blocks, today pulses amber above everything, locked days stay low.
// The whole wall floats, slowly sways, and parallax-tilts toward the
// cursor. Static single frame under prefers-reduced-motion.
//
// Import via next/dynamic({ ssr: false }) — three.js only loads where a
// scene is actually on screen.

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { CellData } from "./JourneyGrid";

export default function Journey3D({
  cells,
  height = 320,
}: {
  cells: CellData[];
  height?: number;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Rebuild only when day states actually change (not on parent re-renders)
  const sig = cells.map((c) => c.state[0] + (c.rest ? "r" : "")).join("");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    const cols = 10;
    const rows = Math.ceil(cells.length / cols);
    const gap = 1.16;

    const camera = new THREE.PerspectiveCamera(
      42,
      Math.max(1, mount.clientWidth) / Math.max(1, mount.clientHeight),
      0.1,
      120
    );
    camera.position.set(0, rows * 0.85, rows * 1.35);
    camera.lookAt(0, -0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(6, 14, 8);
    scene.add(key);
    const emeraldGlow = new THREE.PointLight(0x35d399, 220, 60);
    emeraldGlow.position.set(-8, 8, 6);
    scene.add(emeraldGlow);
    const amberGlow = new THREE.PointLight(0xf5b54b, 90, 40);
    amberGlow.position.set(8, 6, -4);
    scene.add(amberGlow);

    const group = new THREE.Group();
    scene.add(group);

    // ground plate under the city
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(cols * gap + 1.6, 0.35, rows * gap + 1.6),
      new THREE.MeshStandardMaterial({
        color: 0x0f141a,
        roughness: 0.9,
        metalness: 0.1,
      })
    );
    plate.position.y = -0.35;
    group.add(plate);

    const geo = new THREE.BoxGeometry(1, 1, 1);
    const towers: { m: THREE.Mesh; c: CellData; baseH: number }[] = [];

    cells.forEach((c, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      let color = 0x1c2530;
      let emissive = 0x000000;
      let h = 0.35;
      if (c.state === "done") {
        color = c.rest ? 0x164034 : 0x2ab98a;
        emissive = c.rest ? 0x0a2019 : 0x0e5c46;
        h = 1.5;
      } else if (c.state === "current") {
        color = 0xf5b54b;
        emissive = 0x8a5a12;
        h = 2.2;
      } else if (c.rest) {
        color = 0x151d27;
      }
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive,
        emissiveIntensity: 0.55,
        roughness: 0.32,
        metalness: 0.18,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(
        (col - (cols - 1) / 2) * gap,
        h / 2,
        (row - (rows - 1) / 2) * gap
      );
      m.scale.set(0.88, h, 0.88);
      group.add(m);
      towers.push({ m, c, baseH: h });
    });

    // pointer parallax
    const target = { rx: 0, ry: 0 };
    function onPointer(e: PointerEvent) {
      const r = mount!.getBoundingClientRect();
      target.ry = ((e.clientX - r.left) / r.width - 0.5) * 0.55;
      target.rx = ((e.clientY - r.top) / r.height - 0.5) * 0.28;
    }
    function onLeave() {
      target.rx = 0;
      target.ry = 0;
    }
    mount.addEventListener("pointermove", onPointer);
    mount.addEventListener("pointerleave", onLeave);

    let raf = 0;
    const clock = new THREE.Clock();
    function tick() {
      const t = clock.getElapsedTime();
      const sway = reduced ? 0 : Math.sin(t * 0.22) * 0.3;
      group.rotation.y += (sway + target.ry - group.rotation.y) * 0.05;
      group.rotation.x += (target.rx - group.rotation.x) * 0.05;
      if (!reduced) group.position.y = Math.sin(t * 0.7) * 0.12;
      for (const { m, c, baseH } of towers) {
        if (c.state === "current" && !reduced) {
          const s = baseH * (1 + Math.sin(t * 3) * 0.14);
          m.scale.y = s;
          m.position.y = s / 2;
        }
      }
      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(tick);
    }
    tick();

    const ro = new ResizeObserver(() => {
      const w = mount!.clientWidth;
      const h = mount!.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (reduced) renderer.render(scene, camera);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mount.removeEventListener("pointermove", onPointer);
      mount.removeEventListener("pointerleave", onLeave);
      towers.forEach(({ m }) => (m.material as THREE.Material).dispose());
      plate.geometry.dispose();
      (plate.material as THREE.Material).dispose();
      geo.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig, height]);

  return (
    <div
      ref={mountRef}
      style={{ height }}
      className="w-full cursor-grab"
      aria-label="3D journey map"
    />
  );
}
