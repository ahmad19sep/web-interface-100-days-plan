"use client";

// The champions' podium — a live 3D scene crowning the leaderboard: the
// top three explorers' actual chosen characters stand on gold / silver /
// bronze pedestals, idle animations playing, the whole stage gently
// swaying. Renders nothing at all if WebGL is unavailable.

import { useEffect, useRef, useState } from "react";
import { buildAvatarObject, loadThree } from "@/lib/avatar-models";

export interface PodiumWinner {
  handle: string;
  name: string;
  avatar?: string;
  xp: number;
}

// pedestal slots: rank 1 center (tall), rank 2 left, rank 3 right
const SLOTS = [
  { x: 0, h: 1.5, hex: 0xf5b54b },
  { x: -2.35, h: 1.0, hex: 0xc3cddc },
  { x: 2.35, h: 0.7, hex: 0xe8a06b },
];
const MEDALS = ["🥇", "🥈", "🥉"];
const RANK_CSS = ["#f59e0b", "#c3cddc", "#e8a06b"];

export default function LeaderboardPodium({
  winners,
}: {
  winners: PodiumWinner[];
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const sig = winners.map((w) => w.handle + (w.avatar ?? "")).join("|");

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

        const scene = new T.Scene();
        scene.add(new T.HemisphereLight(0xffffff, 0x1a2338, 1.1));
        const key = new T.DirectionalLight(0xffffff, 1.5);
        key.position.set(4, 7, 5);
        scene.add(key);
        const crown = new T.PointLight(0xf5b54b, 26, 14);
        crown.position.set(0, 5.4, 1.5);
        scene.add(crown);

        const stage = new T.Group();
        scene.add(stage);

        // floor disc
        const floor = new T.Mesh(
          new T.CylinderGeometry(5.4, 5.6, 0.22, 48),
          new T.MeshStandardMaterial({ color: 0x0d1424, roughness: 0.9 })
        );
        floor.position.y = -0.11;
        stage.add(floor);
        const rim = new T.Mesh(
          new T.TorusGeometry(5.5, 0.035, 8, 72),
          new T.MeshBasicMaterial({
            color: 0x22d3ee,
            transparent: true,
            opacity: 0.4,
          })
        );
        rim.rotation.x = Math.PI / 2;
        stage.add(rim);

        // pedestals + characters
        const characters: { tick: (dt: number) => void }[] = [];
        const charGroups: InstanceType<(typeof T)["Group"]>[] = [];
        await Promise.all(
          winners.slice(0, 3).map(async (w, i) => {
            const slot = SLOTS[i];
            const ped = new T.Mesh(
              new T.BoxGeometry(1.8, slot.h, 1.8),
              new T.MeshStandardMaterial({
                color: 0x121c30,
                roughness: 0.5,
                metalness: 0.3,
                emissive: slot.hex,
                emissiveIntensity: 0.08,
              })
            );
            ped.position.set(slot.x, slot.h / 2, 0);
            stage.add(ped);
            const top = new T.Mesh(
              new T.BoxGeometry(1.86, 0.07, 1.86),
              new T.MeshStandardMaterial({
                color: slot.hex,
                emissive: slot.hex,
                emissiveIntensity: 0.55,
                roughness: 0.4,
              })
            );
            top.position.set(slot.x, slot.h + 0.035, 0);
            stage.add(top);

            const { object, tick } = await buildAvatarObject(
              T,
              w.avatar ?? "bot"
            );
            if (disposed) return;
            const g = new T.Group();
            object.scale.multiplyScalar(0.62);
            g.add(object);
            g.position.set(slot.x, slot.h + 0.07, 0);
            stage.add(g);
            characters.push({ tick });
            charGroups.push(g);
          })
        );
        if (disposed) {
          renderer.dispose();
          renderer.domElement.remove();
          return;
        }

        // celebratory particles
        const pArr = new Float32Array(140 * 3);
        for (let i = 0; i < 140; i++) {
          pArr[i * 3] = (Math.random() - 0.5) * 11;
          pArr[i * 3 + 1] = Math.random() * 5.5;
          pArr[i * 3 + 2] = (Math.random() - 0.5) * 7;
        }
        const pGeo = new T.BufferGeometry();
        pGeo.setAttribute("position", new T.BufferAttribute(pArr, 3));
        const particles = new T.Points(
          pGeo,
          new T.PointsMaterial({
            color: 0xf5b54b,
            size: 0.055,
            transparent: true,
            opacity: 0.7,
          })
        );
        scene.add(particles);

        const camera = new T.PerspectiveCamera(34, 1, 0.1, 60);
        camera.position.set(0, 3.1, 9.6);
        camera.lookAt(0, 1.5, 0);

        const ro = new ResizeObserver(() => {
          const w = mount.clientWidth || 1;
          const h = mount.clientHeight || 1;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        });
        ro.observe(mount);

        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        let clock = 0;
        const tick = () => {
          clock += 0.016;
          if (!reduced) {
            stage.rotation.y = Math.sin(clock * 0.28) * 0.3;
            particles.rotation.y = clock * 0.05;
            for (const c of characters) c.tick(1 / 60);
          } else {
            for (const c of characters) c.tick(0);
          }
          renderer.render(scene, camera);
          if (!reduced) raf = requestAnimationFrame(tick);
        };
        tick();

        cleanup = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          // characters may share cached template geometry — pull them out
          // before the deep dispose
          for (const g of charGroups) stage.remove(g);
          scene.traverse((o) => {
            const mesh = o as {
              geometry?: { dispose(): void };
              material?: { dispose(): void };
            };
            mesh.geometry?.dispose();
            mesh.material?.dispose();
          });
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
    // rebuild only when the actual podium lineup changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);

  if (failed || winners.length === 0) return null;

  // label order matches pedestal order on screen: silver, gold, bronze
  const order = [1, 0, 2].filter((i) => i < winners.length);

  return (
    <div
      className="mb-[22px] overflow-hidden rounded-[18px] border border-edge"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,.07), rgba(13,20,36,.9) 62%)",
      }}
    >
      <div className="px-5 pt-4 font-mono text-[10px] tracking-[.22em] text-mut3 sm:px-7">
        THE PODIUM — THIS COHORT&apos;S FRONT-RUNNERS
      </div>
      <div ref={mountRef} className="h-[240px] w-full sm:h-[280px]" />
      <div className="grid grid-cols-3 gap-2 px-4 pb-5 sm:px-10">
        {order.map((rank) => {
          const w = winners[rank];
          return (
            <div
              key={w.handle}
              className="text-center"
              style={{
                marginTop: rank === 0 ? 0 : 8,
                gridColumnStart: rank === 0 ? 2 : rank === 1 ? 1 : 3,
                gridRowStart: 1,
              }}
            >
              <div className="text-[17px]">{MEDALS[rank]}</div>
              <div className="truncate text-[13px] font-semibold">
                {w.name}
              </div>
              <div
                className="font-mono text-[10.5px]"
                style={{ color: RANK_CSS[rank] }}
              >
                {w.xp} XP
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
