"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/* ---------- Palette (limited on purpose) ---------- */
const C = {
  red: "#D40511",
  redDark: "#900B18",
  redBright: "#E32936",
  redSoft: "#FCE8EA",
  cream: "#FFFFFF",
  white: "#FFFFFF",
  slab: "#F3C9CE",
  road: "#4B3F42",
  glass: "#2A2326",
  grey: "#6E6366",
  blue: "#7DB8D6", // Kazakhstan hub accent
};

/* ---------- Route ---------- */
const A = 5.2; // half-length of the loop
const B = 2.9; // half-width of the loop
const ROAD_HALF = 0.62;

/** Closed loop in the XZ plane; θ in radians. Slight asymmetry avoids a mechanical look. */
function routePoint(theta: number, out = new THREE.Vector3()) {
  const x = A * Math.cos(theta);
  const z = B * Math.sin(theta) * (1 + 0.08 * Math.cos(theta));
  return out.set(x, 0, z);
}

function useRoadGeometry() {
  return useMemo(() => {
    const N = 160;
    const pos: number[] = [];
    const idx: number[] = [];
    const p = new THREE.Vector3();
    const q = new THREE.Vector3();
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      routePoint(t, p);
      routePoint(t + 0.001, q);
      const tx = q.x - p.x;
      const tz = q.z - p.z;
      const len = Math.hypot(tx, tz) || 1;
      const nx = -tz / len;
      const nz = tx / len;
      pos.push(p.x + nx * ROAD_HALF, 0, p.z + nz * ROAD_HALF, p.x - nx * ROAD_HALF, 0, p.z - nz * ROAD_HALF);
      if (i < N) {
        const a = i * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    // Flip winding if needed so the top face points up.
    const n = g.getAttribute("normal");
    if (n.getY(0) < 0) {
      const index = g.getIndex()!;
      for (let i = 0; i < index.count; i += 3) {
        const t = index.getX(i + 1);
        index.setX(i + 1, index.getX(i + 2));
        index.setX(i + 2, t);
      }
      g.computeVertexNormals();
    }
    return g;
  }, []);
}

/* ---------- Static scenery ---------- */
function Ground() {
  const road = useRoadGeometry();
  const dashes = useRef<THREE.InstancedMesh>(null);
  const DASH_COUNT = 46;

  useLayoutEffect(() => {
    const m = dashes.current;
    if (!m) return;
    const o = new THREE.Object3D();
    const p = new THREE.Vector3();
    const q = new THREE.Vector3();
    for (let i = 0; i < DASH_COUNT; i++) {
      const t = (i / DASH_COUNT) * Math.PI * 2;
      routePoint(t, p);
      routePoint(t + 0.001, q);
      o.position.set(p.x, 0.172, p.z);
      o.rotation.set(0, Math.atan2(-(q.z - p.z), q.x - p.x), 0);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group>
      {/* base slab */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[14.4, 0.4, 8.6]} />
        <meshStandardMaterial color={C.slab} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[14.0, 0.04, 8.2]} />
        <meshStandardMaterial color={C.cream} roughness={0.95} />
      </mesh>
      {/* road */}
      <mesh geometry={road} position={[0, 0.16, 0]} receiveShadow>
        <meshStandardMaterial color={C.road} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* centre dashes */}
      <instancedMesh ref={dashes} args={[undefined, undefined, DASH_COUNT]}>
        <boxGeometry args={[0.28, 0.01, 0.06]} />
        <meshStandardMaterial color={C.white} roughness={0.7} />
      </instancedMesh>
    </group>
  );
}

function Parcel({ position, size = 0.4, color = C.redSoft, rotY = 0 }: { position: [number, number, number]; size?: number; color?: string; rotY?: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh position={[0, size / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[size, size, size * 1.15]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0, size / 2, 0]}>
        <boxGeometry args={[size * 1.02, size * 1.02, size * 0.2]} />
        <meshStandardMaterial color={C.red} roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Chinese sender warehouse: stacked hip roofs hint at a pagoda without being a caricature. */
function ChinaWarehouse() {
  return (
    <group position={[-2.7, 0.03, -0.45]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 1.0, 1.6]} />
        <meshStandardMaterial color={C.white} roughness={0.85} />
      </mesh>
      {/* red band */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <boxGeometry args={[2.34, 0.14, 1.64]} />
        <meshStandardMaterial color={C.red} roughness={0.8} />
      </mesh>
      {/* lower roof */}
      <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1.75, 0.4, 1.2]} castShadow>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color={C.redDark} roughness={0.8} />
      </mesh>
      {/* upper tier */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <boxGeometry args={[0.9, 0.35, 0.7]} />
        <meshStandardMaterial color={C.cream} roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.95, 0]} rotation={[0, Math.PI / 4, 0]} scale={[0.95, 0.42, 0.72]} castShadow>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color={C.redDark} roughness={0.8} />
      </mesh>
      {/* gate */}
      <mesh position={[0, 0.34, 0.81]}>
        <boxGeometry args={[0.9, 0.62, 0.04]} />
        <meshStandardMaterial color={C.glass} roughness={0.7} />
      </mesh>
      <mesh position={[-0.62, 0.34, 0.82]}>
        <boxGeometry args={[0.1, 0.7, 0.08]} />
        <meshStandardMaterial color={C.red} roughness={0.7} />
      </mesh>
      <mesh position={[0.62, 0.34, 0.82]}>
        <boxGeometry args={[0.1, 0.7, 0.08]} />
        <meshStandardMaterial color={C.red} roughness={0.7} />
      </mesh>
      {/* loading pad + parcels */}
      <mesh position={[0, 0.02, 1.35]} receiveShadow>
        <boxGeometry args={[2.0, 0.03, 0.9]} />
        <meshStandardMaterial color={C.redSoft} roughness={0.95} />
      </mesh>
      <Parcel position={[-0.7, 0.03, 1.3]} size={0.34} />
      <Parcel position={[-0.3, 0.03, 1.5]} size={0.28} color={C.white} rotY={0.4} />
      <Parcel position={[0.55, 0.03, 1.35]} size={0.38} color={C.white} rotY={-0.2} />
      <Html position={[0, 2.75, 0]} center zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
        <span className="scene-label">КИТАЙ</span>
      </Html>
    </group>
  );
}

/** Kazakhstan distribution hub: low sorting hall with a yurt-inspired dome. */
function KazakhstanHub() {
  return (
    <group position={[2.7, 0.03, -0.45]}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 0.9, 1.6]} />
        <meshStandardMaterial color={C.white} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.92, 0]} castShadow>
        <boxGeometry args={[2.38, 0.1, 1.68]} />
        <meshStandardMaterial color={C.red} roughness={0.8} />
      </mesh>
      {/* yurt-like drum + dome */}
      <mesh position={[0.35, 1.2, -0.05]} castShadow>
        <cylinderGeometry args={[0.62, 0.66, 0.5, 24]} />
        <meshStandardMaterial color={C.cream} roughness={0.85} />
      </mesh>
      <mesh position={[0.35, 1.45, -0.05]} castShadow>
        <sphereGeometry args={[0.66, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={C.blue} roughness={0.7} />
      </mesh>
      <mesh position={[0.35, 2.12, -0.05]}>
        <cylinderGeometry args={[0.03, 0.03, 0.24, 8]} />
        <meshStandardMaterial color={C.redDark} roughness={0.7} />
      </mesh>
      {/* dock doors */}
      {[-0.7, -0.15].map((x) => (
        <mesh key={x} position={[x, 0.3, 0.81]}>
          <boxGeometry args={[0.42, 0.5, 0.04]} />
          <meshStandardMaterial color={C.glass} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0.62, 0.3, 0.81]}>
        <boxGeometry args={[0.36, 0.5, 0.04]} />
        <meshStandardMaterial color={C.redDark} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.02, 1.35]} receiveShadow>
        <boxGeometry args={[2.0, 0.03, 0.9]} />
        <meshStandardMaterial color={C.redSoft} roughness={0.95} />
      </mesh>
      <Parcel position={[-0.6, 0.03, 1.35]} size={0.36} color={C.white} rotY={0.2} />
      <Parcel position={[0.2, 0.03, 1.4]} size={0.3} rotY={-0.5} />
      <Html position={[0, 2.75, 0]} center zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
        <span className="scene-label">КАЗАХСТАН</span>
      </Html>
    </group>
  );
}

/* ---------- Van ---------- */
const WHEEL_R = 0.17;

function Wheel({ position, setRef }: { position: [number, number, number]; setRef: (g: THREE.Group | null) => void }) {
  return (
    <group position={position}>
      <group ref={setRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[WHEEL_R, WHEEL_R, 0.16, 14]} />
          <meshStandardMaterial color="#2B2427" roughness={0.9} />
        </mesh>
        {/* hub + spoke so rotation is visible */}
        <mesh position={[0, 0, 0.085]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.02, 10]} />
          <meshStandardMaterial color="#D9CFD1" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[0.16, 0.035, 0.01]} />
          <meshStandardMaterial color={C.grey} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

interface VanProps {
  animate: boolean;
}

function Van({ animate }: VanProps) {
  const root = useRef<THREE.Group>(null);
  const wheels = useRef<(THREE.Group | null)[]>([]);
  const theta = useRef(-Math.PI * 0.12);
  const spin = useRef(0);
  const prev = useRef(new THREE.Vector3());
  const cur = useMemo(() => new THREE.Vector3(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);

  const place = (th: number, advance: boolean) => {
    const g = root.current;
    if (!g) return;
    routePoint(th, cur);
    routePoint(th + 0.01, ahead);
    g.position.set(cur.x, 0.16, cur.z);
    g.rotation.y = Math.atan2(-(ahead.z - cur.z), ahead.x - cur.x);
    if (advance) {
      spin.current += cur.distanceTo(prev.current) / WHEEL_R;
      for (const w of wheels.current) if (w) w.rotation.z = -spin.current;
    }
    prev.current.copy(cur);
  };

  // Static pose (also used for reduced motion).
  useLayoutEffect(() => {
    place(theta.current, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    if (!animate) return;
    const dt = Math.min(delta, 0.05);
    // ~17 s per lap, easing down near the two buildings and up on the straights.
    const omega = (Math.PI * 2) / 17;
    theta.current += dt * omega * (1 - 0.32 * Math.cos(2 * theta.current));
    place(theta.current, true);
  });

  const setW = (i: number) => (g: THREE.Group | null) => {
    wheels.current[i] = g;
  };

  return (
    <group ref={root} scale={1.3}>
      {/* cargo box */}
      <mesh position={[-0.2, 0.58, 0]} castShadow>
        <boxGeometry args={[0.95, 0.7, 0.74]} />
        <meshStandardMaterial color={C.red} roughness={0.55} />
      </mesh>
      <mesh position={[-0.2, 0.5, 0]}>
        <boxGeometry args={[0.96, 0.08, 0.75]} />
        <meshStandardMaterial color={C.white} roughness={0.6} />
      </mesh>
      {/* cab */}
      <mesh position={[0.52, 0.45, 0]} castShadow>
        <boxGeometry args={[0.5, 0.46, 0.72]} />
        <meshStandardMaterial color={C.redBright} roughness={0.55} />
      </mesh>
      <mesh position={[0.7, 0.6, 0]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[0.04, 0.3, 0.6]} />
        <meshStandardMaterial color={C.glass} roughness={0.25} metalness={0.2} />
      </mesh>
      <mesh position={[0.52, 0.6, 0.365]}>
        <boxGeometry args={[0.28, 0.17, 0.01]} />
        <meshStandardMaterial color={C.glass} roughness={0.25} metalness={0.2} />
      </mesh>
      <mesh position={[0.52, 0.6, -0.365]}>
        <boxGeometry args={[0.28, 0.17, 0.01]} />
        <meshStandardMaterial color={C.glass} roughness={0.25} metalness={0.2} />
      </mesh>
      {/* chassis, bumpers, lamps */}
      <mesh position={[0.1, 0.24, 0]}>
        <boxGeometry args={[1.5, 0.12, 0.7]} />
        <meshStandardMaterial color="#3A3033" roughness={0.8} />
      </mesh>
      <mesh position={[0.79, 0.28, 0]}>
        <boxGeometry args={[0.06, 0.1, 0.76]} />
        <meshStandardMaterial color="#D9CFD1" roughness={0.6} />
      </mesh>
      <mesh position={[0.78, 0.4, 0.26]}>
        <boxGeometry args={[0.04, 0.07, 0.12]} />
        <meshStandardMaterial color="#FFF3C9" emissive="#FFE9A0" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.78, 0.4, -0.26]}>
        <boxGeometry args={[0.04, 0.07, 0.12]} />
        <meshStandardMaterial color="#FFF3C9" emissive="#FFE9A0" emissiveIntensity={0.4} />
      </mesh>
      {/* wheels */}
      <Wheel position={[0.5, WHEEL_R, 0.36]} setRef={setW(0)} />
      <Wheel position={[0.5, WHEEL_R, -0.36]} setRef={setW(1)} />
      <Wheel position={[-0.5, WHEEL_R, 0.36]} setRef={setW(2)} />
      <Wheel position={[-0.5, WHEEL_R, -0.36]} setRef={setW(3)} />
    </group>
  );
}

/* ---------- Scene rig ---------- */
function Rig() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.OrthographicCamera;
    // Fit the isometric footprint of the slab into the canvas.
    const zoom = Math.min(size.width / 13.2, size.height / 9.6);
    cam.zoom = zoom;
    cam.position.set(9, 8.4, 9);
    cam.lookAt(0, 0.35, 0.3);
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export interface SceneCanvasProps {
  animate: boolean;
  visible: boolean;
  onReady: () => void;
  onFail: () => void;
}

export default function SceneCanvas({ animate, visible, onReady, onFail }: SceneCanvasProps) {
  return (
    <Canvas
      orthographic
      shadows
      dpr={[1, 1.75]}
      frameloop={animate && visible ? "always" : "demand"}
      camera={{ position: [9, 8.4, 9], near: 0.1, far: 60, zoom: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "default" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onFail();
        });
        onReady();
      }}
    >
      <Rig />
      <hemisphereLight args={["#ffffff", "#f3cfd3", 1.05]} />
      <directionalLight
        position={[6, 10, 4]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-bias={-0.0005}
      />
      <Ground />
      <ChinaWarehouse />
      <KazakhstanHub />
      <Van animate={animate && visible} />
    </Canvas>
  );
}
