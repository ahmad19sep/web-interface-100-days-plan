"use client";

// The Journey tab as an explorable 3D game world: all 120 days are
// buildings along a winding glowing road. Done days light up cyan,
// today pulses amber, locked days stay dark. The user's own 3D character
// (lib/avatar-models) stands at today's marker. Drag to orbit, scroll to
// zoom, click a building to inspect it in the side panel and jump to the
// day page. Falls back to the classic 2D grid if WebGL is unavailable.

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { buildAvatarObject, loadThree } from "@/lib/avatar-models";
import {
  SHIP_DAYS,
  weekColorCss,
  weekColorHex as weekColor,
  xpOf,
  levelOf,
} from "@/lib/game";
import { DAYS, PROJECTS, TOTAL_DAYS, WEEKS, getDay, weekOf } from "@/lib/plan";
import { computeStreak, shippedCount } from "@/lib/progress";
import { currentDay, useProgress } from "@/lib/store";
import JourneyMap from "./JourneyMap";

type ThreeNS = typeof import("three");
type V3 = InstanceType<ThreeNS["Vector3"]>;

interface WorldRefs {
  renderer: InstanceType<ThreeNS["WebGLRenderer"]>;
  dispose(): void;
  selectExternally(n: number): void;
  refreshStates(done: Record<number, string>, today: number): void;
  /** Walk the explorer along the road to day n, then call onArrive. */
  walkTo(n: number, onArrive: () => void): void;
  /** Teleport to the end of the current walk (fires onArrive). */
  skipWalk(): void;
}

export default function JourneyWorld() {
  const state = useProgress();
  const router = useRouter();
  // Mounted persistently from WorldChrome — the scene always runs, but the
  // HUD/panel UI shows only while the journey route itself is active.
  const uiActive = usePathname().startsWith("/journey");
  const mountRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<WorldRefs | null>(null);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState(() =>
    Math.min(currentDay(state.checkins), TOTAL_DAYS)
  );
  const [walking, setWalking] = useState<number | null>(null);
  const [tip, setTip] = useState<{ day: number; x: number; y: number } | null>(null);

  /** Walk the explorer to day n, then open its lesson page. */
  const openDay = (n: number) => {
    if (walking) return;
    const world = worldRef.current;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!world || reduced) {
      router.push(`/day/${n}`);
      return;
    }
    setSelected(n);
    world.selectExternally(n);
    setWalking(n);
    world.walkTo(n, () => router.push(`/day/${n}`));
  };

  const today = Math.min(currentDay(state.checkins), TOTAL_DAYS);
  const doneCount = Object.keys(state.checkins).length;
  const xp = xpOf(state.checkins);
  const level = levelOf(xp);
  const streak = computeStreak(state.checkins).streak;
  const shipped = shippedCount(state.checkins);
  const checkinsRef = useRef(state.checkins);
  checkinsRef.current = state.checkins;
  const avatarId = state.avatar;

  // ── build the world once ────────────────────────────────────────────────
  useEffect(() => {
    let disposed = false;
    (async () => {
      const T = await loadThree();
      const mount = mountRef.current;
      if (disposed || !mount || worldRef.current) return;

      let renderer: InstanceType<ThreeNS["WebGLRenderer"]>;
      try {
        renderer = new T.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      } catch {
        setFailed(true);
        return;
      }
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.cursor = "grab";
      renderer.domElement.style.display = "block";
      renderer.domElement.style.touchAction = "none";

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const scene = new T.Scene();
      scene.background = new T.Color(0x0a0e15);
      scene.fog = new T.FogExp2(0x0a0e15, 0.008);
      const camera = new T.PerspectiveCamera(55, 1, 0.1, 900);

      scene.add(new T.HemisphereLight(0x33466b, 0x0a0e15, 1.0));
      const key = new T.DirectionalLight(0xbfdcff, 0.65);
      key.position.set(60, 110, 30);
      scene.add(key);
      const amber = new T.PointLight(0xf5b54b, 55, 55);
      scene.add(amber);

      const ground = new T.Mesh(
        new T.PlaneGeometry(1200, 1400),
        new T.MeshStandardMaterial({ color: 0x0c1119, roughness: 1 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.set(0, -0.15, -280);
      scene.add(ground);
      const grid = new T.GridHelper(1200, 60, 0x16203a, 0x101724);
      grid.position.set(0, -0.1, -280);
      (grid.material as { transparent: boolean; opacity: number }).transparent = true;
      (grid.material as { transparent: boolean; opacity: number }).opacity = 0.35;
      scene.add(grid);

      // the road — a real staircase: every curriculum week is a flat
      // terrace, and the road steps up onto the next one at the boundary
      const xz = [
        [0, 0], [42, -62], [-46, -132], [36, -202], [-52, -282],
        [32, -362], [-42, -442], [22, -522], [0, -580],
      ].map(([x, z]) => new T.Vector3(x, 0, z));
      const baseCurve = new T.CatmullRomCurve3(xz);
      const STEP = 3.4;
      const elevAt = (t: number) => {
        const day = Math.min(TOTAL_DAYS, Math.max(1, t * TOTAL_DAYS + 0.5));
        let y = 0;
        for (const w of WEEKS) {
          if (day >= w.end + 1) {
            y += STEP; // whole terraces already climbed
            continue;
          }
          if (day > w.end - 0.8) y += STEP * ((day - (w.end - 0.8)) / 1.8);
          break;
        }
        return y;
      };
      // bake the stepped elevation into a dense curve
      const samples: V3[] = [];
      for (let i = 0; i <= 240; i++) {
        const t = i / 240;
        const pt = baseCurve.getPoint(t);
        pt.y = elevAt(t);
        samples.push(pt);
      }
      const curve = new T.CatmullRomCurve3(samples);
      const dayT = (n: number) => (Math.min(n, TOTAL_DAYS) - 0.5) / TOTAL_DAYS;

      // the unknown road ahead — only a faint ghost line in the dark
      scene.add(
        new T.Mesh(
          new T.TubeGeometry(curve, 300, 0.28, 8),
          new T.MeshBasicMaterial({
            color: 0x1c2846,
            transparent: true,
            opacity: 0.16,
          })
        )
      );
      // the revealed road (up to a week ahead) — rebuilt as you progress
      const roadMat = new T.MeshStandardMaterial({
        color: 0x24354f,
        roughness: 0.85,
        emissive: 0x14304d,
        emissiveIntensity: 0.9,
      });
      let roadMesh: InstanceType<ThreeNS["Mesh"]> | null = null;

      // ── landmark builders ──
      const GOLD = 0xf5c518;
      const goldMat = (glow = 0.35) =>
        new T.MeshStandardMaterial({
          color: GOLD,
          metalness: 0.75,
          roughness: 0.3,
          emissive: 0xf59e0b,
          emissiveIntensity: glow,
        });

      /** A trophy cup — bowl, stem, base, two handles. Returns its glow mat. */
      const makeCup = (scale: number) => {
        const g = new T.Group();
        const mat = goldMat();
        const bowl = new T.Mesh(new T.CylinderGeometry(0.85, 0.45, 1.0, 18), mat);
        bowl.position.y = 1.15;
        g.add(bowl);
        const stem = new T.Mesh(new T.CylinderGeometry(0.14, 0.2, 0.55, 10), mat);
        stem.position.y = 0.42;
        g.add(stem);
        const base = new T.Mesh(new T.CylinderGeometry(0.5, 0.6, 0.18, 14), mat);
        base.position.y = 0.09;
        g.add(base);
        for (const side of [-1, 1]) {
          const handle = new T.Mesh(new T.TorusGeometry(0.34, 0.07, 8, 14), mat);
          handle.position.set(side * 0.92, 1.2, 0);
          g.add(handle);
        }
        g.scale.setScalar(scale);
        return { group: g, glow: mat };
      };

      /** A tiny resting bench for the project plaza. */
      const makeBench = () => {
        const g = new T.Group();
        const wood = new T.MeshStandardMaterial({ color: 0x6b4a2a, roughness: 0.85 });
        const seat = new T.Mesh(new T.BoxGeometry(1.7, 0.14, 0.55), wood);
        seat.position.y = 0.55;
        g.add(seat);
        const back = new T.Mesh(new T.BoxGeometry(1.7, 0.55, 0.1), wood);
        back.position.set(0, 0.95, -0.24);
        g.add(back);
        for (const sx of [-0.7, 0.7]) {
          const leg = new T.Mesh(new T.BoxGeometry(0.12, 0.55, 0.5), wood);
          leg.position.set(sx, 0.27, 0);
          g.add(leg);
        }
        return g;
      };

      /** The king's taj — a jeweled golden crown for the summit. */
      const makeCrown = () => {
        const g = new T.Group();
        const mat = goldMat(0.5);
        const band = new T.Mesh(new T.CylinderGeometry(2.1, 2.3, 1.1, 24), mat);
        g.add(band);
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2;
          const spike = new T.Mesh(new T.ConeGeometry(0.42, 1.7, 8), mat);
          spike.position.set(Math.cos(a) * 2.0, 1.35, Math.sin(a) * 2.0);
          g.add(spike);
          const jewel = new T.Mesh(
            new T.SphereGeometry(0.22, 10, 8),
            new T.MeshStandardMaterial({
              color: k % 2 ? 0x22d3ee : 0xef4444,
              emissive: k % 2 ? 0x22d3ee : 0xef4444,
              emissiveIntensity: 0.8,
              roughness: 0.2,
            })
          );
          jewel.position.set(Math.cos(a) * 2.25, 0, Math.sin(a) * 2.25);
          g.add(jewel);
        }
        const gem = new T.Mesh(
          new T.OctahedronGeometry(0.55),
          new T.MeshStandardMaterial({
            color: 0x22d3ee,
            emissive: 0x22d3ee,
            emissiveIntensity: 1,
            roughness: 0.15,
          })
        );
        gem.position.y = 2.5;
        g.add(gem);
        return { group: g, glow: mat };
      };
      let crown: InstanceType<ThreeNS["Group"]> | null = null;
      // ship-day order decides cup size: P1 small, growing to the capstone
      const shipOrder = [...SHIP_DAYS].sort((a, b) => a - b);

      // day markers
      type Marker = {
        g: InstanceType<ThreeNS["Group"]>;
        mat: InstanceType<ThreeNS["MeshStandardMaterial"]>;
        beacon?: InstanceType<ThreeNS["MeshStandardMaterial"]>;
        n: number;
      };
      const markerGroup = new T.Group();
      scene.add(markerGroup);
      const markers: Marker[] = [];
      for (let n = 1; n <= TOTAL_DAYS; n++) {
        const plan = DAYS[n - 1];
        const t = dayT(n);
        const pos = curve.getPointAt(t);
        const tan = curve.getTangentAt(t);
        const side = n % 2 === 0 ? 1 : -1;
        const norm = new T.Vector3(-tan.z, 0, tan.x).normalize().multiplyScalar(4.2 * side);
        const g = new T.Group();
        g.position.copy(pos).add(norm);
        const mat = new T.MeshStandardMaterial({ color: 0x151c2c, roughness: 0.6, metalness: 0.15 });
        const marker: Marker = { g, mat, n };
        if (SHIP_DAYS.has(n)) {
          const isSummit = n === TOTAL_DAYS;
          const h = isSummit ? 13 : 7;
          const tower = new T.Mesh(new T.BoxGeometry(3.6, h, 3.6), mat);
          tower.position.y = h / 2;
          g.add(tower);
          // a little plaza to breathe on, with a bench facing the road
          const plaza = new T.Mesh(
            new T.CylinderGeometry(4.4, 4.7, 0.3, 26),
            new T.MeshStandardMaterial({ color: 0x141d31, roughness: 0.9 })
          );
          plaza.position.y = 0.15;
          g.add(plaza);
          const bench = makeBench();
          bench.position.set(-3.1 * side, 0.3, 1.4);
          bench.rotation.y = side > 0 ? 0.7 : -0.7;
          g.add(bench);
          if (isSummit) {
            // the king's taj at the end of the road
            const taj = makeCrown();
            taj.group.position.y = h + 2.2;
            g.add(taj.group);
            crown = taj.group;
            marker.beacon = taj.glow;
            const halo = new T.PointLight(0xf5c518, 60, 30);
            halo.position.y = h + 5;
            g.add(halo);
          } else {
            // the trophy grows with every project you reach
            const idx = shipOrder.indexOf(n);
            const cup = makeCup(0.55 + (idx / Math.max(1, shipOrder.length - 1)) * 1.25);
            cup.group.position.y = h + 0.05;
            g.add(cup.group);
            marker.beacon = cup.glow;
          }
        } else if (plan?.isRest) {
          const pad = new T.Mesh(new T.CylinderGeometry(1.9, 2.1, 0.7, 20), mat);
          pad.position.y = 0.35;
          g.add(pad);
        } else {
          const h = 2.4 + ((weekOf(n).week - 1) % 6) * 0.3;
          const block = new T.Mesh(new T.BoxGeometry(2.1, h, 2.1), mat);
          block.position.y = h / 2;
          g.add(block);
        }
        const base = new T.Mesh(
          new T.CylinderGeometry(2.4, 2.6, 0.25, 20),
          new T.MeshStandardMaterial({ color: 0x111827, roughness: 1 })
        );
        base.position.y = 0.05;
        g.add(base);
        // stair pillar — carries the platform down to the valley floor
        if (pos.y > 0.6) {
          const col = new T.Mesh(
            new T.CylinderGeometry(1.15, 1.5, pos.y, 10),
            new T.MeshStandardMaterial({ color: 0x0f1626, roughness: 1 })
          );
          col.position.y = -pos.y / 2;
          g.add(col);
        }
        // floating day number
        const cv = document.createElement("canvas");
        cv.width = 128;
        cv.height = 64;
        const cx = cv.getContext("2d")!;
        cx.font = '700 34px "JetBrains Mono", monospace';
        cx.textAlign = "center";
        cx.textBaseline = "middle";
        cx.fillStyle = "#8fa2bd";
        cx.fillText(String(n), 64, 32);
        const sp = new T.Sprite(
          new T.SpriteMaterial({ map: new T.CanvasTexture(cv), transparent: true, opacity: 0.72 })
        );
        sp.scale.set(3.4, 1.7, 1);
        sp.position.y = SHIP_DAYS.has(n) ? (n === TOTAL_DAYS ? 20 : 11.5) : plan?.isRest ? 2.4 : 5.8;
        g.add(sp);
        g.userData.day = n;
        markerGroup.add(g);
        markers.push(marker);
      }

      // scenery per week band, seeded so it never shifts between mounts
      let seed = 7;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (const w of WEEKS) {
        const color = weekColor(w.week);
        for (let k = 0; k < 4; k++) {
          const dayF = w.start + rnd() * (w.end - w.start);
          const t = Math.min(0.999, Math.max(0.001, dayT(dayF)));
          const pos = curve.getPointAt(t);
          const tan = curve.getTangentAt(t);
          const norm = new T.Vector3(-tan.z, 0, tan.x).normalize();
          const h = 4 + rnd() * 9;
          const m = new T.Mesh(
            new T.BoxGeometry(2.5 + rnd() * 3, h, 2.5 + rnd() * 3),
            new T.MeshStandardMaterial({
              color: 0x0f1626,
              roughness: 1,
              emissive: color,
              emissiveIntensity: 0.018,
            })
          );
          m.position.copy(pos).add(norm.multiplyScalar((15 + rnd() * 38) * (rnd() > 0.5 ? 1 : -1)));
          m.position.y = h / 2;
          m.rotation.y = rnd() * Math.PI;
          scene.add(m);
        }
      }

      // ambient particles
      const pArr = new Float32Array(350 * 3);
      for (let i = 0; i < 350; i++) {
        pArr[i * 3] = (rnd() - 0.5) * 280;
        pArr[i * 3 + 1] = 2 + rnd() * 42;
        pArr[i * 3 + 2] = -rnd() * 600;
      }
      const pGeo = new T.BufferGeometry();
      pGeo.setAttribute("position", new T.BufferAttribute(pArr, 3));
      const particles = new T.Points(
        pGeo,
        new T.PointsMaterial({ color: 0x22d3ee, size: 0.9, transparent: true, opacity: 0.32 })
      );
      scene.add(particles);

      // the explorer — the user's own 3D character at today's marker
      const explorer = new T.Group();
      const { object: character, tick: charTick } = await buildAvatarObject(T, avatarId);
      if (disposed) {
        renderer.dispose();
        if (renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
        return;
      }
      character.scale.multiplyScalar(1.15);
      explorer.add(character);
      const ring = new T.Mesh(
        new T.TorusGeometry(1.5, 0.07, 8, 40),
        new T.MeshBasicMaterial({ color: 0xf5b54b, transparent: true, opacity: 0.4 })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.1;
      explorer.add(ring);
      scene.add(explorer);

      // completed-trail + revealed-guide lines, rebuilt with progress
      let doneLine: InstanceType<ThreeNS["Line"]> | null = null;
      let guideLine: InstanceType<ThreeNS["Line"]> | null = null;
      const markerPos = (n: number) => markers[n - 1].g.position as V3;

      // walking state — the explorer's position along the road [0..1]
      const startT = (Math.min(currentDay(checkinsRef.current), TOTAL_DAYS) - 0.5) / TOTAL_DAYS;
      const walk = { t: startT, target: startT, onArrive: null as null | (() => void) };

      // the whole road stays visible end to end — the guide thread and
      // marker states already tell the user where they are on it
      const LOOKAHEAD = TOTAL_DAYS;
      const refreshStates = (done: Record<number, string>, todayN: number) => {
        // rebuild the revealed stretch of road
        const revealT = dayT(Math.min(TOTAL_DAYS, todayN + LOOKAHEAD));
        if (roadMesh) {
          scene.remove(roadMesh);
          roadMesh.geometry.dispose();
        }
        const revealPts: V3[] = [];
        for (let i = 0; i <= 110; i++) {
          revealPts.push(curve.getPointAt((i / 110) * revealT));
        }
        roadMesh = new T.Mesh(
          new T.TubeGeometry(new T.CatmullRomCurve3(revealPts), 220, 0.8, 10),
          roadMat
        );
        scene.add(roadMesh);
        // dim teal thread over the not-yet-walked part of the reveal
        if (guideLine) {
          scene.remove(guideLine);
          guideLine.geometry.dispose();
        }
        const doneT = dayT(Math.max(1, Object.keys(done).length || 1));
        const guidePts: V3[] = [];
        for (let i = 0; i <= 60; i++) {
          const gp = curve.getPointAt(doneT + (i / 60) * Math.max(0, revealT - doneT));
          guidePts.push(new T.Vector3(gp.x, gp.y + 0.85, gp.z));
        }
        guideLine = new T.Line(
          new T.BufferGeometry().setFromPoints(guidePts),
          new T.LineBasicMaterial({ color: 0x0e7490, transparent: true, opacity: 0.55 })
        );
        scene.add(guideLine);

        for (const m of markers) {
          m.g.visible = true;
          const plan = DAYS[m.n - 1];
          if (done[m.n]) {
            m.mat.color.setHex(SHIP_DAYS.has(m.n) ? 0x241f42 : 0x123642);
            m.mat.emissive.setHex(SHIP_DAYS.has(m.n) ? 0xa78bfa : 0x22d3ee);
            m.mat.emissiveIntensity = 0.5;
          } else if (m.n === todayN) {
            m.mat.color.setHex(0x4a3208);
            m.mat.emissive.setHex(0xf5b54b);
            m.mat.emissiveIntensity = 0.85;
          } else {
            m.mat.color.setHex(SHIP_DAYS.has(m.n) ? 0x1a1830 : plan?.isRest ? 0x131a28 : 0x151c2c);
            m.mat.emissive.setHex(0x000000);
            m.mat.emissiveIntensity = 0;
          }
          if (m.beacon) {
            m.beacon.emissiveIntensity = done[m.n] ? 0.9 : m.n === todayN ? 0.6 : 0.12;
          }
        }
        const tp = markerPos(todayN);
        amber.position.set(tp.x, tp.y + 7, tp.z);
        // send the explorer home to today's marker — unless mid-walk
        if (!walk.onArrive && walk.t === walk.target) {
          walk.t = walk.target = dayT(todayN);
        }
        if (doneLine) {
          scene.remove(doneLine);
          doneLine.geometry.dispose();
        }
        const nDone = Object.keys(done).length;
        if (nDone > 0) {
          const frac = dayT(Math.min(nDone, TOTAL_DAYS));
          const linePts: V3[] = [];
          for (let i = 0; i <= 120; i++) {
            const p = curve.getPointAt((i / 120) * frac);
            linePts.push(new T.Vector3(p.x, p.y + 0.75, p.z));
          }
          doneLine = new T.Line(
            new T.BufferGeometry().setFromPoints(linePts),
            new T.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.85 })
          );
          scene.add(doneLine);
        }
      };
      refreshStates(checkinsRef.current, Math.min(currentDay(checkinsRef.current), TOTAL_DAYS));

      // ── camera + input ──
      const cam = { theta: 0.5, phi: 0.95, radius: 38 };
      const startFocus = markerPos(Math.min(currentDay(checkinsRef.current), TOTAL_DAYS));
      const focus = startFocus.clone();
      const focusTarget = startFocus.clone();
      const selectExternally = (n: number) => focusTarget.copy(markerPos(n));

      const raycaster = new T.Raycaster();
      const pickDay = (e: PointerEvent): number | null => {
        const r = renderer.domElement.getBoundingClientRect();
        raycaster.setFromCamera(
          new T.Vector2(
            ((e.clientX - r.left) / r.width) * 2 - 1,
            -((e.clientY - r.top) / r.height) * 2 + 1
          ),
          camera
        );
        type Node = { parent: Node | null; userData: { day?: number } };
        for (const hit of raycaster.intersectObjects(markerGroup.children, true)) {
          let o: Node | null = hit.object as unknown as Node;
          while (o && o.userData.day == null) o = o.parent;
          if (o) return o.userData.day!;
        }
        return null;
      };

      let drag: { x: number; y: number; moved: number } | null = null;
      let hoverTick = 0;
      const dom = renderer.domElement;
      const onDown = (e: PointerEvent) => {
        drag = { x: e.clientX, y: e.clientY, moved: 0 };
        dom.style.cursor = "grabbing";
      };
      const onMove = (e: PointerEvent) => {
        if (drag) {
          const dx = e.clientX - drag.x;
          const dy = e.clientY - drag.y;
          drag.x = e.clientX;
          drag.y = e.clientY;
          drag.moved += Math.abs(dx) + Math.abs(dy);
          cam.theta -= dx * 0.005;
          cam.phi = Math.max(0.28, Math.min(1.38, cam.phi - dy * 0.004));
        } else if (e.target === dom && ++hoverTick % 3 === 0) {
          const day = pickDay(e);
          dom.style.cursor = day ? "pointer" : "grab";
          const rect = mount.getBoundingClientRect();
          setTip(day ? { day, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
        }
      };
      const onUp = (e: PointerEvent) => {
        if (drag && drag.moved < 6 && e.target === dom) {
          const day = pickDay(e);
          if (day) {
            setSelected(day);
            focusTarget.copy(markerPos(day));
            setTip(null);
          }
        }
        drag = null;
        dom.style.cursor = "grab";
      };
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        cam.radius = Math.max(14, Math.min(120, cam.radius + e.deltaY * 0.05));
      };
      dom.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      dom.addEventListener("wheel", onWheel, { passive: false });

      const ro = new ResizeObserver(() => {
        const w = mount.clientWidth || 1;
        const h = mount.clientHeight || 1;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      });
      ro.observe(mount);

      let raf = 0;
      let clock = 0;
      const animate = () => {
        raf = requestAnimationFrame(animate);
        clock += 0.016;
        focus.lerp(focusTarget, reduced ? 1 : 0.06);
        camera.position.set(
          focus.x + cam.radius * Math.sin(cam.phi) * Math.sin(cam.theta),
          focus.y + cam.radius * Math.cos(cam.phi),
          focus.z + cam.radius * Math.sin(cam.phi) * Math.cos(cam.theta)
        );
        camera.lookAt(focus.x, focus.y + 2, focus.z);
        // walk the explorer toward its target along the road
        const dtw = walk.target - walk.t;
        const moving = Math.abs(dtw) > 0.00005;
        if (moving) {
          walk.t += reduced ? dtw : Math.sign(dtw) * Math.min(Math.abs(dtw), 0.0018);
          if (Math.abs(walk.target - walk.t) <= 0.00005) {
            walk.t = walk.target;
            const arrived = walk.onArrive;
            walk.onArrive = null;
            if (arrived) arrived();
          }
        }
        const wt = Math.max(0.0001, Math.min(0.9999, walk.t));
        const ap = curve.getPointAt(wt);
        explorer.position.set(
          ap.x,
          ap.y +
            (reduced ? 0 : moving ? Math.abs(Math.sin(clock * 8)) * 0.22 : Math.sin(clock * 2.2) * 0.16),
          ap.z
        );
        if (moving) {
          const tan = curve.getTangentAt(wt);
          explorer.rotation.y = Math.atan2(tan.x, tan.z) + (dtw < 0 ? Math.PI : 0);
          character.rotation.y = 0;
          focusTarget.set(ap.x, 0, ap.z); // camera follows the traveler
        } else if (!reduced) {
          character.rotation.y = Math.sin(clock * 0.4) * 0.5;
        }
        if (!reduced) {
          charTick(1 / 60);
          const todayN = Math.min(currentDay(checkinsRef.current), TOTAL_DAYS);
          const cur = markers[todayN - 1];
          if (!checkinsRef.current[todayN]) {
            cur.mat.emissiveIntensity = 0.65 + Math.sin(clock * 3) * 0.3;
          }
          particles.rotation.y = Math.sin(clock * 0.05) * 0.02;
          if (crown) crown.rotation.y = clock * 0.4;
        } else {
          charTick(0);
        }
        renderer.render(scene, camera);
      };
      animate();

      worldRef.current = {
        renderer,
        selectExternally,
        refreshStates,
        walkTo(n, onArrive) {
          walk.target = dayT(n);
          if (Math.abs(walk.target - walk.t) <= 0.00005) {
            onArrive();
            return;
          }
          walk.onArrive = onArrive;
        },
        skipWalk() {
          if (walk.onArrive) walk.t = walk.target - Math.sign(walk.target - walk.t) * 0.0001;
        },
        dispose() {
          cancelAnimationFrame(raf);
          ro.disconnect();
          dom.removeEventListener("pointerdown", onDown);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          dom.removeEventListener("wheel", onWheel);
          // GLB explorers share geometry/textures with the cached template —
          // pull the explorer out before the deep dispose below.
          scene.remove(explorer);
          scene.traverse((o) => {
            const mesh = o as { geometry?: { dispose(): void }; material?: { dispose(): void } };
            mesh.geometry?.dispose();
            mesh.material?.dispose();
          });
          renderer.dispose();
          if (dom.parentElement) dom.parentElement.removeChild(dom);
        },
      };
    })();
    return () => {
      disposed = true;
      worldRef.current?.dispose();
      worldRef.current = null;
    };
    // The world builds once per avatar; progress updates flow through refreshStates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarId]);

  // re-light markers when progress changes
  useEffect(() => {
    worldRef.current?.refreshStates(state.checkins, today);
  }, [state.checkins, today]);

  if (failed) {
    if (!uiActive) return null; // other tabs still work without WebGL
    return (
      <div className="fixed inset-x-0 bottom-0 top-[52px] z-20 overflow-y-auto bg-bg p-5 sm:p-8 lg:left-[68px] lg:top-0">
        <JourneyMap />
      </div>
    );
  }

  // ── selected-day panel data ──
  const plan = getDay(selected);
  const week = weekOf(selected);
  const wCss = weekColorCss(week.week);
  const isDone = !!state.checkins[selected];
  const isToday = selected === today && !isDone;
  const isSealed = selected > today;
  const ship = PROJECTS.find((p) => p.shipDay === selected);
  const statusColor = isDone ? "#22d3ee" : isToday ? "#f5b54b" : isSealed ? "#61708a" : "#f5b54b";

  // Full-screen game world — fills everything right of the nav rail (below
  // the mobile top bar); the context panel floats over it like the design.
  return (
    <div className="fixed inset-x-0 bottom-0 top-[52px] z-20 bg-bg lg:left-[68px] lg:top-0">
      <div ref={mountRef} className="absolute inset-0" />
      {uiActive && (
        <>

          {/* region label */}
          <div className="pointer-events-none absolute left-4 top-4">
            <div className="font-mono text-[10px] tracking-[.28em] text-mut3">
              WEEK {week.week} / {WEEKS.length}
            </div>
            <div
              className="font-display text-[19px] font-bold"
              style={{ color: wCss, textShadow: "0 2px 18px rgba(0,0,0,.6)" }}
            >
              {week.title}
            </div>
            <div className="font-mono text-[10.5px] text-mut3">
              DAYS {week.start}–{week.end}
            </div>
          </div>

          {/* hover tooltip */}
          {tip && (
            <div
              className="pointer-events-none absolute z-10 whitespace-nowrap rounded-lg border border-edge2 bg-[rgba(13,18,32,.95)] px-3 py-1.5 font-mono text-[12px]"
              style={{ left: tip.x, top: tip.y, transform: "translate(-50%,-130%)" }}
            >
              DAY {tip.day} — {getDay(tip.day)?.title}
            </div>
          )}

          {/* transit banner */}
          {walking && (
            <div className="absolute bottom-[70px] left-4 z-10 flex items-center gap-3">
              <div className="animate-pulse whitespace-nowrap font-mono text-[11px] tracking-[.14em] text-today">
                EN ROUTE TO DAY {walking}…
              </div>
              <button
                type="button"
                onClick={() => worldRef.current?.skipWalk()}
                className="cursor-pointer rounded-lg border border-edge2 bg-[rgba(13,18,32,.9)] px-3.5 py-1.5 font-mono text-[11px] text-ink hover:border-[#2A3542]"
              >
                SKIP ⏭
              </button>
            </div>
          )}

          {/* back to today */}
          {!walking && selected !== today && (
            <button
              type="button"
              onClick={() => {
                setSelected(today);
                worldRef.current?.selectExternally(today);
              }}
              className="absolute bottom-[70px] left-4 z-10 cursor-pointer rounded-[10px] border border-[rgba(245,181,75,.4)] bg-[rgba(13,18,32,.9)] px-4 py-2 font-mono text-[11px] tracking-[.08em] text-today hover:bg-[rgba(245,181,75,.12)]"
            >
              ⦿ BACK TO TODAY
            </button>
          )}

          {/* bottom HUD — hidden on phones, where the panel is a bottom sheet */}
          <div className="absolute bottom-4 left-4 z-10 hidden items-center gap-4 rounded-[14px] border border-edge2 bg-[rgba(13,18,32,.88)] px-5 py-2.5 shadow-[0_6px_24px_rgba(0,0,0,.45)] backdrop-blur-md sm:flex">
            <div className="whitespace-nowrap font-mono text-[12px]">
              DAY <span className="font-bold text-today">{today}</span> / {TOTAL_DAYS}
            </div>
            <div className="h-[5px] w-[110px] overflow-hidden rounded-[3px] bg-[#1a2338] sm:w-[150px]">
              <div
                className="h-full rounded-[3px]"
                style={{
                  width: `${Math.round((doneCount / TOTAL_DAYS) * 100)}%`,
                  background: "linear-gradient(90deg,#0e7490,#22d3ee)",
                }}
              />
            </div>
            <div className="whitespace-nowrap font-mono text-[12px] text-mut2">
              LVL <span className="text-ink">{level}</span>
            </div>
            <div className="whitespace-nowrap font-mono text-[12px] text-mut2">
              🔥 <span className="text-ink">{streak}</span>
            </div>
            <div className="hidden whitespace-nowrap font-mono text-[12px] text-mut2 sm:block">
              XP <span className="text-accent">{xp}</span>
            </div>
            <div className="hidden whitespace-nowrap font-mono text-[12px] text-mut2 sm:block">
              📦 {shipped}
            </div>
          </div>

        {/* context panel — floating right rail; bottom sheet on phones */}
        <aside className="absolute inset-x-2 bottom-2 z-10 flex max-h-[46%] flex-col gap-3 overflow-y-auto rounded-[18px] border border-edge2 bg-[rgba(13,18,32,.92)] p-4 shadow-[0_10px_36px_rgba(0,0,0,.5)] backdrop-blur-md sm:inset-x-auto sm:bottom-4 sm:right-4 sm:top-4 sm:max-h-none sm:w-[300px] sm:gap-3.5 sm:p-[20px]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: wCss }} />
            <span className="font-mono text-[10px] tracking-[.2em] text-mut3">
              WEEK {week.week} — {week.title.toUpperCase()}
            </span>
          </div>
          <div>
            <div
              className="font-mono text-[42px] font-extrabold leading-none"
              style={{ color: statusColor }}
            >
              {String(selected).padStart(2, "0")}
            </div>
            <div className="mt-2 font-display text-[18px] font-bold leading-[1.3]">
              {plan?.title}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              ship ? `SHIP ${ship.id}` : plan?.isRest ? "REST DAY" : plan?.difficulty?.toUpperCase() ?? "LESSON",
              plan?.time ? `⏱ ${plan.time}` : null,
            ]
              .filter(Boolean)
              .map((chip) => (
                <span
                  key={chip}
                  className="rounded-md border border-edge3 bg-panel px-2.5 py-1 font-mono text-[10px] tracking-[.06em] text-mut"
                >
                  {chip}
                </span>
              ))}
          </div>
          <div className="flex items-center gap-2 rounded-[9px] border border-edge3 bg-panel px-3 py-2">
            <span className="text-[13px]">{isDone ? "✓" : isToday ? "⦿" : isSealed ? "🔒" : "○"}</span>
            <span className="font-mono text-[10.5px] tracking-[.1em]" style={{ color: statusColor }}>
              {isDone
                ? "DESTINATION CLEARED"
                : isToday
                  ? "TODAY — YOUR EXPLORER AWAITS"
                  : isSealed
                    ? "SEALED · UNLOCKS IN ORDER"
                    : "OPEN — NOT CHECKED YET"}
            </span>
          </div>
          <p className="m-0 text-[13px] leading-[1.6] text-mut">
            {ship
              ? ship.blurb
              : plan?.about ??
                (isSealed
                  ? "This destination is still dark. The road lights up one day at a time — no skipping ahead."
                  : plan?.resource)}
          </p>
          <div className="flex-1" />
          {isSealed ? (
            <div className="rounded-[12px] border border-dashed border-edge3 px-3 py-3.5 text-center font-mono text-[11px] tracking-[.06em] text-mut3">
              🔒 SEALED — CLEAR DAY {today} FIRST
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openDay(selected)}
              disabled={!!walking}
              className="btn-amber block w-full cursor-pointer py-3.5 text-center text-[14.5px] disabled:opacity-60"
            >
              {walking
                ? "Traveling…"
                : isDone
                  ? `Revisit Day ${selected}`
                  : ship
                    ? `Enter ${ship.name}`
                    : `Start Day ${selected} →`}
            </button>
          )}
          <div className="hidden text-center font-mono text-[9.5px] tracking-[.1em] text-mut3 sm:block">
            DRAG TO ORBIT · SCROLL TO ZOOM · CLICK A BUILDING
          </div>
        </aside>
        </>
      )}
    </div>
  );
}
