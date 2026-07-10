// Low-poly 3D character builders — one voxel-style person per avatar id
// (postman, police officer, girl, builder, robot), assembled from boxes so
// no model files are needed. Also provides a cached snapshot renderer that
// turns each character into a small transparent PNG for cheap placements
// (sidebar, leaderboard) — only "live" views run a real-time canvas.

type ThreeNS = typeof import("three");

let threePromise: Promise<ThreeNS> | null = null;
export function loadThree(): Promise<ThreeNS> {
  if (!threePromise) threePromise = import("three");
  return threePromise;
}

function part(
  T: ThreeNS,
  w: number,
  h: number,
  d: number,
  color: number,
  x: number,
  y: number,
  z: number,
  extra?: {
    emissive?: number;
    emissiveIntensity?: number;
    metalness?: number;
    roughness?: number;
    rotZ?: number;
  }
) {
  const mesh = new T.Mesh(
    new T.BoxGeometry(w, h, d),
    new T.MeshStandardMaterial({
      color,
      roughness: extra?.roughness ?? 0.65,
      metalness: extra?.metalness ?? 0.1,
      emissive: extra?.emissive ?? 0x000000,
      emissiveIntensity: extra?.emissiveIntensity ?? 0.7,
    })
  );
  mesh.position.set(x, y, z);
  if (extra?.rotZ) mesh.rotation.z = extra.rotZ;
  return mesh;
}

export function buildAvatarModel(T: ThreeNS, id: string) {
  const g = new T.Group();
  const SKIN = 0xe8b48c;
  const EYE = 0x1d2430;

  const humanoid = (o: {
    skin?: number;
    shirt: number;
    sleeves?: number;
    legs: number;
  }) => {
    const skin = o.skin ?? SKIN;
    const sleeves = o.sleeves ?? o.shirt;
    g.add(part(T, 0.3, 0.8, 0.34, o.legs, -0.2, 0.4, 0)); // legs
    g.add(part(T, 0.3, 0.8, 0.34, o.legs, 0.2, 0.4, 0));
    g.add(part(T, 0.92, 1.0, 0.52, o.shirt, 0, 1.3, 0)); // torso
    g.add(part(T, 0.24, 0.9, 0.28, sleeves, -0.6, 1.32, 0)); // arms
    g.add(part(T, 0.24, 0.9, 0.28, sleeves, 0.6, 1.32, 0));
    g.add(part(T, 0.22, 0.18, 0.24, skin, -0.6, 0.82, 0)); // hands
    g.add(part(T, 0.22, 0.18, 0.24, skin, 0.6, 0.82, 0));
    g.add(part(T, 0.74, 0.72, 0.7, skin, 0, 2.22, 0)); // head
    g.add(part(T, 0.09, 0.1, 0.03, EYE, -0.16, 2.28, 0.36)); // eyes
    g.add(part(T, 0.09, 0.1, 0.03, EYE, 0.16, 2.28, 0.36));
  };

  switch (id) {
    case "postman": {
      humanoid({ shirt: 0xd84a4a, legs: 0x2a3550 });
      g.add(part(T, 0.78, 0.2, 0.76, 0xc03d3d, 0, 2.68, 0)); // cap
      g.add(part(T, 0.78, 0.07, 0.35, 0xc03d3d, 0, 2.6, 0.5)); // brim
      g.add(part(T, 0.14, 1.25, 0.05, 0x6f451f, 0.2, 1.5, 0.28, { rotZ: 0.55 })); // strap
      g.add(part(T, 0.26, 0.46, 0.42, 0x8a5a2c, 0.72, 1.05, 0.05)); // satchel
      g.add(part(T, 0.2, 0.14, 0.04, 0xf5efe0, 0.72, 1.12, 0.28)); // envelope
      break;
    }
    case "police": {
      humanoid({ shirt: 0x27418f, legs: 0x1c2638 });
      g.add(part(T, 0.78, 0.22, 0.76, 0x1d326e, 0, 2.69, 0)); // cap
      g.add(part(T, 0.78, 0.07, 0.35, 0x14244f, 0, 2.6, 0.48)); // brim
      g.add(part(T, 0.14, 0.12, 0.05, 0xf5c142, 0, 2.68, 0.39)); // cap badge
      g.add(part(T, 0.16, 0.18, 0.05, 0xf5c142, -0.22, 1.5, 0.28)); // chest badge
      g.add(part(T, 0.96, 0.13, 0.56, 0x11161f, 0, 0.86, 0)); // duty belt
      break;
    }
    case "girl": {
      humanoid({
        skin: 0xf1c6a0,
        shirt: 0xe86fa4,
        legs: 0xf1c6a0,
      });
      g.add(part(T, 1.12, 0.42, 0.68, 0xd85f96, 0, 0.86, 0)); // skirt
      g.add(part(T, 0.32, 0.16, 0.4, 0xd84a7d, -0.2, 0.08, 0.03)); // shoes
      g.add(part(T, 0.32, 0.16, 0.4, 0xd84a7d, 0.2, 0.08, 0.03));
      g.add(part(T, 0.82, 0.24, 0.78, 0x5d3a1e, 0, 2.6, 0)); // hair top
      g.add(part(T, 0.82, 0.92, 0.22, 0x5d3a1e, 0, 2.05, -0.34)); // hair back
      g.add(part(T, 0.14, 0.7, 0.68, 0x5d3a1e, -0.45, 2.12, -0.04)); // sides
      g.add(part(T, 0.14, 0.7, 0.68, 0x5d3a1e, 0.45, 2.12, -0.04));
      g.add(part(T, 0.2, 0.15, 0.15, 0xf5c142, 0.32, 2.74, 0)); // bow
      break;
    }
    case "builder": {
      humanoid({ shirt: 0x3e5f8a, legs: 0x35506e });
      g.add(part(T, 0.98, 0.66, 0.58, 0xf07c2e, 0, 1.4, 0)); // vest
      g.add(part(T, 1.0, 0.11, 0.6, 0xf5e05a, 0, 1.4, 0)); // hi-vis stripe
      g.add(part(T, 0.8, 0.3, 0.78, 0xf5c518, 0, 2.7, 0)); // hard hat
      g.add(part(T, 1.0, 0.07, 0.96, 0xf5c518, 0, 2.55, 0.04)); // hat brim
      break;
    }
    default: {
      // robot
      const METAL = 0x9aa8ba;
      const DARK = 0x39424f;
      g.add(part(T, 0.3, 0.8, 0.34, DARK, -0.2, 0.4, 0, { metalness: 0.5, roughness: 0.4 }));
      g.add(part(T, 0.3, 0.8, 0.34, DARK, 0.2, 0.4, 0, { metalness: 0.5, roughness: 0.4 }));
      g.add(part(T, 0.95, 1.0, 0.55, METAL, 0, 1.3, 0, { metalness: 0.6, roughness: 0.35 }));
      g.add(part(T, 0.24, 0.9, 0.28, DARK, -0.62, 1.32, 0, { metalness: 0.5, roughness: 0.4 }));
      g.add(part(T, 0.24, 0.9, 0.28, DARK, 0.62, 1.32, 0, { metalness: 0.5, roughness: 0.4 }));
      g.add(part(T, 0.3, 0.3, 0.07, 0x0c1116, 0, 1.42, 0.29));
      g.add(part(T, 0.18, 0.18, 0.06, 0x22d3ee, 0, 1.42, 0.32, { emissive: 0x22d3ee, emissiveIntensity: 0.9 })); // core
      g.add(part(T, 0.8, 0.7, 0.72, METAL, 0, 2.24, 0, { metalness: 0.6, roughness: 0.35 })); // head
      g.add(part(T, 0.62, 0.24, 0.06, 0x0c1116, 0, 2.28, 0.36)); // visor
      g.add(part(T, 0.13, 0.1, 0.05, 0x22d3ee, -0.16, 2.28, 0.39, { emissive: 0x22d3ee, emissiveIntensity: 1 }));
      g.add(part(T, 0.13, 0.1, 0.05, 0x22d3ee, 0.16, 2.28, 0.39, { emissive: 0x22d3ee, emissiveIntensity: 1 }));
      g.add(part(T, 0.07, 0.3, 0.07, DARK, 0, 2.72, 0)); // antenna
      g.add(part(T, 0.13, 0.13, 0.13, 0xf59e0b, 0, 2.92, 0, { emissive: 0xf59e0b, emissiveIntensity: 0.9 }));
      break;
    }
  }
  return g;
}

// ── GLB avatars ─────────────────────────────────────────────────────────
// Real rigged characters served from /public/avatars — Ahmad's Avaturn
// scan (.glb, About page) and the Viverse user avatars (.vrm). GLB files
// are parsed once into a cached template and SkeletonUtils-cloned per
// placement; VRM instances load fresh per placement (spring bones and
// expressions bind to their own nodes, so they can't be cloned) with the
// bytes coming from the browser HTTP cache after the first fetch.

const FILE_AVATARS: Record<string, string> = {
  ahmad: "/avatars/ahmad.glb",
  explorer: "/avatars/explorer.vrm",
  voyager: "/avatars/voyager.vrm",
  pioneer: "/avatars/pioneer.vrm",
};

export function isFileAvatar(id: string): boolean {
  return id in FILE_AVATARS;
}

type Object3DT = InstanceType<ThreeNS["Object3D"]>;
type ClipT = InstanceType<ThreeNS["AnimationClip"]>;

/** Wrap a character in a root group scaled to the voxel frame: ~3 units tall, feet at y=0. */
function normalize(T: ThreeNS, object: Object3DT) {
  const box = new T.Box3().setFromObject(object);
  const height = Math.max(0.001, box.max.y - box.min.y);
  const s = 3.05 / height;
  object.scale.multiplyScalar(s);
  object.position.set(
    -((box.min.x + box.max.x) / 2) * s,
    -box.min.y * s,
    -((box.min.z + box.max.z) / 2) * s
  );
  const root = new T.Group();
  root.add(object);
  return root as Object3DT;
}

const glbCache = new Map<string, Promise<{ template: Object3DT; clips: ClipT[] }>>();

async function loadGlbTemplate(T: ThreeNS, id: string) {
  let hit = glbCache.get(id);
  if (!hit) {
    hit = (async () => {
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const gltf = await new GLTFLoader().loadAsync(FILE_AVATARS[id]);
      return { template: normalize(T, gltf.scene), clips: gltf.animations };
    })();
    glbCache.set(id, hit);
  }
  return hit;
}

async function loadVrm(T: ThreeNS, id: string) {
  const [{ GLTFLoader }, vrmLib] = await Promise.all([
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("@pixiv/three-vrm"),
  ]);
  const loader = new GLTFLoader();
  loader.register((parser) => new vrmLib.VRMLoaderPlugin(parser));
  const gltf = await loader.loadAsync(FILE_AVATARS[id]);
  const vrm = gltf.userData.vrm as import("@pixiv/three-vrm").VRM;
  vrmLib.VRMUtils.removeUnnecessaryVertices(gltf.scene);
  vrmLib.VRMUtils.rotateVRM0(vrm); // 0.x models face backwards otherwise
  // VRM files ship in a stiff T-pose with no animation — pose the arms
  // down and let tick() add blinking + breathing.
  const left = vrm.humanoid.getNormalizedBoneNode("leftUpperArm");
  const right = vrm.humanoid.getNormalizedBoneNode("rightUpperArm");
  if (left) left.rotation.z = 1.15;
  if (right) right.rotation.z = -1.15;
  const chest = vrm.humanoid.getNormalizedBoneNode("chest");
  let clock = 0;
  let nextBlink = 2.4;
  const tick = (dt: number) => {
    clock += dt;
    if (chest) chest.rotation.x = Math.sin(clock * 1.4) * 0.02; // breathing
    const em = vrm.expressionManager;
    if (em) {
      const sinceBlink = clock - nextBlink;
      if (sinceBlink >= 0) {
        if (sinceBlink > 0.18) nextBlink = clock + 2.2 + Math.random() * 2.4;
        em.setValue("blink", Math.sin(Math.min(sinceBlink / 0.18, 1) * Math.PI));
      }
    }
    vrm.update(Math.max(dt, 0.0001));
  };
  return { object: normalize(T, vrm.scene as Object3DT), tick };
}

/**
 * Any avatar as a scene object plus a per-frame `tick(dt)` that drives its
 * animation (GLB clips, VRM blink/breath/spring-bones; no-op for voxels).
 * Call `tick(0.6)` once for a natural static pose.
 */
export async function buildAvatarObject(
  T: ThreeNS,
  id: string
): Promise<{ object: Object3DT; tick: (dt: number) => void }> {
  const url = FILE_AVATARS[id];
  if (!url) return { object: buildAvatarModel(T, id), tick: () => {} };
  if (url.endsWith(".vrm")) return loadVrm(T, id);
  const { template, clips } = await loadGlbTemplate(T, id);
  const { clone } = await import("three/examples/jsm/utils/SkeletonUtils.js");
  const object = clone(template);
  if (!clips.length) return { object, tick: () => {} };
  const mixer = new T.AnimationMixer(object);
  mixer.clipAction(clips[0]).play();
  return { object, tick: (dt) => mixer.update(dt) };
}

/** Shared scene setup for both snapshots and live views. */
export async function stageFor(T: ThreeNS, id: string) {
  const scene = new T.Scene();
  scene.add(new T.HemisphereLight(0xffffff, 0x28303c, 1.2));
  const key = new T.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 5, 4);
  scene.add(key);
  const { object: model, tick } = await buildAvatarObject(T, id);
  scene.add(model);
  const camera = new T.PerspectiveCamera(34, 1, 0.1, 50);
  camera.position.set(0, 2.3, 4.9);
  camera.lookAt(0, 1.4, 0);
  return { scene, model, camera, tick };
}

// ── snapshot cache ──────────────────────────────────────────────────────
// One offscreen renderer turns each character into a 256px transparent PNG
// exactly once per session; every <img> placement reuses it.

const snapCache = new Map<string, string>();
let snapRenderer: InstanceType<ThreeNS["WebGLRenderer"]> | null = null;

export async function avatarSnapshot(id: string): Promise<string> {
  const hit = snapCache.get(id);
  if (hit) return hit;
  const T = await loadThree();
  const again = snapCache.get(id);
  if (again) return again;
  if (!snapRenderer) {
    snapRenderer = new T.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    snapRenderer.setSize(256, 256);
    snapRenderer.setClearColor(0x000000, 0);
  }
  const { scene, model, camera, tick } = await stageFor(T, id);
  model.rotation.y = 0.5; // three-quarter view
  tick(0.6); // settle animated characters out of the bind pose
  snapRenderer.render(scene, camera);
  const url = snapRenderer.domElement.toDataURL("image/png");
  snapCache.set(id, url);
  // File avatars share geometry/textures (GLB template) or may be shown
  // again (VRM) — never dispose those, or later renders go black.
  if (!isFileAvatar(id)) {
    model.traverse((o) => {
      const mesh = o as { geometry?: { dispose(): void }; material?: { dispose(): void } };
      mesh.geometry?.dispose();
      mesh.material?.dispose();
    });
  }
  return url;
}
