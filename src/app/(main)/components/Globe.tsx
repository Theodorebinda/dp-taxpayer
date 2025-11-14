"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import type { Object3D } from "three";

const RANDOM_POINTS: { lat: number; lng: number; size: number }[] = Array.from(
  { length: 2000 },
  () => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    size: Math.random() * 0.6 + 0.2,
  })
);

export default function DPGlobe() {
  const [globeObject, setGlobeObject] = useState<Object3D | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { default: ThreeGlobe } = await import("three-globe");
      const globeInstance = new ThreeGlobe()
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
        .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
        .pointsData(RANDOM_POINTS)
        .pointAltitude(0.01)
        .pointColor(() => "#21ff63") //  points verts DigiPublic
        .pointRadius(0.6);
      if (isMounted) {
        setGlobeObject(globeInstance as unknown as Object3D);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 20] }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[1, 1, 1]} intensity={1.2} />

      {/* Globe */}
      {globeObject && <primitive object={globeObject} scale={1.4} />}

      {/* Controls */}
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
