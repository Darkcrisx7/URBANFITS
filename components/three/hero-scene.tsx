"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Shard({
  position,
  geometry,
  scale,
  speed,
  color,
}: {
  position: [number, number, number];
  geometry: "icosahedron" | "octahedron" | "torus";
  scale: number;
  speed: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + seed;
    ref.current.rotation.x = t * 0.22;
    ref.current.rotation.y = t * 0.3;
    ref.current.position.y = position[1] + Math.sin(t * 0.6) * 0.35;

    // Subtle parallax toward pointer, eased — the "mouse-reactive" requirement,
    // done cheaply via position lerp rather than a full raycaster.
    const targetX = position[0] + state.pointer.x * 0.6;
    const targetZ = position[2] + state.pointer.y * 0.3;
    ref.current.position.x += (targetX - ref.current.position.x) * 0.02;
    ref.current.position.z += (targetZ - ref.current.position.z) * 0.02;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {geometry === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
      {geometry === "octahedron" && <octahedronGeometry args={[1, 0]} />}
      {geometry === "torus" && <torusGeometry args={[0.7, 0.26, 16, 32]} />}
      <meshPhysicalMaterial
        color={color}
        metalness={0.9}
        roughness={0.15}
        clearcoat={1}
        clearcoatRoughness={0.1}
        transmission={0.55}
        thickness={1.2}
        envMapIntensity={1.4}
      />
    </mesh>
  );
}

function Rig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    // Whole-scene camera drift toward the cursor — the cinematic parallax.
    camera.position.x += (pointer.x * 0.4 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.25 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

const SHARDS: { position: [number, number, number]; geometry: "icosahedron" | "octahedron" | "torus"; scale: number; speed: number; color: string }[] = [
  { position: [-2.4, 0.6, -1], geometry: "icosahedron", scale: 1.15, speed: 0.35, color: "#B8C0D4" },
  { position: [2.2, -0.3, -0.6], geometry: "octahedron", scale: 0.95, speed: 0.28, color: "#8B93A6" },
  { position: [0.3, 1.1, -2], geometry: "torus", scale: 0.85, speed: 0.4, color: "#C7C9CC" },
  { position: [-1.1, -1.2, -1.4], geometry: "octahedron", scale: 0.6, speed: 0.5, color: "#5B6273" },
  { position: [2.6, 1.3, -2.2], geometry: "icosahedron", scale: 0.5, speed: 0.45, color: "#8B93A6" },
];

export default function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 6], fov: 42 }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#8B93A6" />
      <Rig />
      {SHARDS.map((s, i) => (
        <Shard key={i} {...s} />
      ))}
    </Canvas>
  );
}
