"use client";

// Site-wide three.js backdrop: a drifting field of emerald/amber particles
// over a slowly approaching wireframe floor, with gentle pointer parallax.
// Fixed behind every screen (login → dashboard → certificate). Renders one
// static frame under prefers-reduced-motion.

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Background3D() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = ref.current;
    if (!mount) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d1117, 0.05);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    camera.position.set(0, 2.2, 9);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // particle field
    const N = 340;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const emerald = new THREE.Color(0x22d3ee);
    const amber = new THREE.Color(0xf5b54b);
    const dim = new THREE.Color(0x4a5460);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 42;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 32 - 4;
      const r = Math.random();
      const c = r < 0.1 ? amber : r < 0.5 ? emerald : dim;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pgeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const pmat = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(pgeo, pmat);
    scene.add(points);

    // wireframe floor drifting toward the camera
    const grid = new THREE.GridHelper(90, 50, 0x1dba89, 0x1b2733);
    const gmat = grid.material as THREE.Material;
    gmat.transparent = true;
    gmat.opacity = 0.14;
    grid.position.y = -4.6;
    scene.add(grid);
    const cellSize = 90 / 50;

    // pointer parallax
    const target = { x: 0, y: 0 };
    function onMove(e: PointerEvent) {
      target.x = (e.clientX / window.innerWidth - 0.5) * 0.35;
      target.y = (e.clientY / window.innerHeight - 0.5) * 0.18;
    }
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    let ry = 0;
    let rx = 0;
    const clock = new THREE.Clock();
    function tick() {
      const t = clock.getElapsedTime();
      ry += (target.x - ry) * 0.04;
      rx += (target.y - rx) * 0.04;
      points.rotation.y = (reduced ? 0 : t * 0.02) + ry;
      points.rotation.x = rx * 0.6;
      if (!reduced) grid.position.z = (t * 0.55) % cellSize;
      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(tick);
    }
    tick();

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (reduced) renderer.render(scene, camera);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      pgeo.dispose();
      pmat.dispose();
      grid.geometry.dispose();
      gmat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
