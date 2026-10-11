'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Pulsing Electrical Power Grid Lines (Green & White Theme)         */
/* ------------------------------------------------------------------ */
function ElectricPowerGrid({ workload }: { workload: number }) {
  const lineRef = useRef<THREE.LineSegments>(null);

  const linePositions = useMemo(() => {
    const points: number[] = [
      // Main Station to Pylon 1
      -0.6, 0.45, -0.4, 0.2, 0.85, -0.6,
      // Pylon 1 to Pylon 2
      0.2, 0.85, -0.6, 0.85, 0.75, 0.1,
      // Pylon 2 to Wind Turbine generator
      0.85, 0.75, 0.1, 0.4, 0.95, 0.7,
      // Wind Turbine to Solar Array
      0.4, 0.95, 0.7, -0.5, 0.26, 0.5,
      // Solar Array back to Main Power Station
      -0.5, 0.26, 0.5, -0.6, 0.45, -0.4,
    ];
    return new Float32Array(points);
  }, []);

  useFrame((state) => {
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      const speed = 2.5 + workload * 8;
      mat.opacity = 0.45 + Math.sin(state.clock.getElapsedTime() * speed) * 0.45;
    }
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color={workload > 0.75 ? '#DAF1DE' : '#8EB69B'}
        transparent
        opacity={0.85}
      />
    </lineSegments>
  );
}

/* ------------------------------------------------------------------ */
/*  Cooling Chimney Steam Particles                                   */
/* ------------------------------------------------------------------ */
function ChimneySteam({ workload }: { workload: number }) {
  const count = 35;
  const steamRef = useRef<THREE.Points>(null);

  const steamCoords = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      coords[i] = -0.76 + (Math.random() - 0.5) * 0.08;
      coords[i + 1] = 0.55 + Math.random() * 0.6;
      coords[i + 2] = -0.5 + (Math.random() - 0.5) * 0.08;
    }
    return coords;
  }, [count]);

  useFrame((_, delta) => {
    if (!steamRef.current) return;
    const array = steamRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 1; i < count * 3; i += 3) {
      array[i] += delta * (0.35 + workload * 0.9);
      if (array[i] > 1.3) {
        array[i] = 0.55;
        array[i - 1] = -0.76 + (Math.random() - 0.5) * 0.06;
        array[i + 1] = -0.5 + (Math.random() - 0.5) * 0.06;
      }
    }
    steamRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={steamRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[steamCoords, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#DAF1DE"
        transparent
        opacity={0.25 + workload * 0.4}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/*  Miniature 3D Land with Windmill & Power Station                   */
/* ------------------------------------------------------------------ */
function IslandScene({ workload }: { workload: number }) {
  const islandRef = useRef<THREE.Group>(null);
  const turbineRotorRef = useRef<THREE.Group>(null);
  const generatorCoreRef = useRef<THREE.Mesh>(null);
  const sparksRef = useRef<THREE.Points>(null);

  const sparkCoords = useMemo(() => {
    const coords = new Float32Array(80 * 3);
    for (let i = 0; i < 80 * 3; i += 3) {
      coords[i] = (Math.random() - 0.5) * 2.2;
      coords[i + 1] = 0.2 + Math.random() * 0.8;
      coords[i + 2] = (Math.random() - 0.5) * 2.2;
    }
    return coords;
  }, []);

  useFrame((state, delta) => {
    if (islandRef.current) {
      islandRef.current.rotation.y = state.clock.getElapsedTime() * 0.12;
    }

    if (turbineRotorRef.current) {
      const spinSpeed = 2.5 + workload * 9.5;
      turbineRotorRef.current.rotation.z += delta * spinSpeed;
    }

    if (generatorCoreRef.current) {
      const pulseSpeed = 3 + workload * 8;
      const s = 1 + Math.sin(state.clock.getElapsedTime() * pulseSpeed) * (0.04 + workload * 0.08);
      generatorCoreRef.current.scale.set(s, s, s);
    }

    if (sparksRef.current) {
      const positions = sparksRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += delta * (0.3 + workload * 0.8);
        if (positions[i] > 1.25) positions[i] = 0.2;
      }
      sparksRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={islandRef}>
      {/* Floating Island - Brand Forest Green Terrain */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.35, 0.4, 32]} />
        <meshStandardMaterial color="#235347" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Bedrock */}
      <mesh position={[0, -0.32, 0]}>
        <cylinderGeometry args={[1.35, 0.6, 0.35, 32]} />
        <meshStandardMaterial color="#0B2B26" roughness={0.9} />
      </mesh>

      {/* --- Power Substation Main Building --- */}
      <group position={[-0.6, 0.35, -0.4]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.55, 0.3, 0.4]} />
          <meshStandardMaterial color="#163832" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Generator Transformer with Brand Mint Glow */}
        <mesh ref={generatorCoreRef} position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
          <meshStandardMaterial
            color="#235347"
            emissive="#8EB69B"
            emissiveIntensity={0.8 + workload * 1.5}
          />
        </mesh>
        {/* Cooling Chimney */}
        <mesh position={[-0.16, 0.25, -0.1]}>
          <cylinderGeometry args={[0.06, 0.08, 0.3, 16]} />
          <meshStandardMaterial color="#3B5A4E" />
        </mesh>
      </group>

      <ChimneySteam workload={workload} />

      {/* --- Transmission Pylon 1 --- */}
      <group position={[0.2, 0.2, -0.6]}>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.02, 0.06, 0.7, 8]} />
          <meshStandardMaterial color="#B8D4C0" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.4, 0.02, 0.04]} />
          <meshStandardMaterial color="#B8D4C0" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[0.28, 0.02, 0.04]} />
          <meshStandardMaterial color="#B8D4C0" metalness={0.8} />
        </mesh>
      </group>

      {/* --- Transmission Pylon 2 --- */}
      <group position={[0.85, 0.2, 0.1]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.02, 0.05, 0.6, 8]} />
          <meshStandardMaterial color="#B8D4C0" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.48, 0]}>
          <boxGeometry args={[0.35, 0.02, 0.04]} />
          <meshStandardMaterial color="#B8D4C0" metalness={0.8} />
        </mesh>
      </group>

      {/* --- Solar Farm Array --- */}
      <group position={[-0.5, 0.24, 0.5]}>
        {[-0.15, 0.15].map((xOffset) => (
          <mesh key={xOffset} position={[xOffset, 0, 0]} rotation={[0.4, 0.2, 0]}>
            <boxGeometry args={[0.24, 0.02, 0.32]} />
            <meshStandardMaterial
              color="#0B2B26"
              metalness={0.9}
              roughness={0.1}
              emissive="#8EB69B"
              emissiveIntensity={0.25}
            />
          </mesh>
        ))}
      </group>

      {/* --- AERO WIND TURBINE GENERATOR (Crisp White) --- */}
      <group position={[0.4, 0.2, 0.7]}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.022, 0.045, 0.9, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>

        <mesh position={[0, 0.9, -0.04]}>
          <boxGeometry args={[0.07, 0.07, 0.16]} />
          <meshStandardMaterial color="#EDF6EF" metalness={0.4} />
        </mesh>

        <mesh position={[0, 0.9, 0.06]}>
          <sphereGeometry args={[0.038, 16, 16]} />
          <meshStandardMaterial color="#8EB69B" metalness={0.5} />
        </mesh>

        <group ref={turbineRotorRef} position={[0, 0.9, 0.06]}>
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
            <group key={i} rotation={[0, 0, angle]}>
              <mesh position={[0, 0.22, 0]}>
                <boxGeometry args={[0.022, 0.44, 0.005]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* Electric Power Grid Lines */}
      <ElectricPowerGrid workload={workload} />

      {/* Spark Particles */}
      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sparkCoords, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color={workload > 0.75 ? '#DAF1DE' : '#8EB69B'}
          transparent
          opacity={0.85}
        />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported Component - Strict Green & White Palette                 */
/* ------------------------------------------------------------------ */
interface PowerGridIslandProps {
  usageKwh?: number;
}

export function PowerGridIsland({ usageKwh = 110 }: PowerGridIslandProps) {
  const normalizedWorkload = useMemo(() => {
    const clamped = Math.max(30, Math.min(usageKwh, 320));
    return (clamped - 30) / (320 - 30);
  }, [usageKwh]);

  const [manualOverride, setManualOverride] = useState<number | null>(null);
  const activeWorkload = manualOverride !== null ? manualOverride : normalizedWorkload;

  useEffect(() => {
    setManualOverride(null);
  }, [usageKwh]);

  const simulatedKw = Math.round(30 + activeWorkload * 290);
  const hourlyEmission = (simulatedKw * 0.675).toFixed(1);

  return (
    <div className="relative w-full h-80 md:h-96 rounded-2xl bg-gradient-to-b from-[#051F20] via-[#0B2B26] to-[#051F20] border border-[#8EB69B]/30 shadow-xl overflow-hidden flex flex-col">
      {/* Top Banner & Dynamic Load Control */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#051F20]/80 border border-[#8EB69B]/40 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#8EB69B] animate-ping" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            {activeWorkload > 0.75 ? 'Peak Load Generation' : 'Live Grid Workload'}
          </span>
        </div>

        {/* Load Control Slider */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#051F20]/80 border border-[#8EB69B]/30 backdrop-blur-md">
          <span className="text-[11px] text-[#DAF1DE] font-medium">Input Power:</span>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={activeWorkload}
            onChange={(e) => setManualOverride(parseFloat(e.target.value))}
            className="w-20 md:w-28 accent-[#8EB69B] cursor-pointer h-1.5 bg-[#163832] rounded-lg"
          />
          <span className="text-xs font-mono font-bold text-[#8EB69B]">
            {simulatedKw} kWh
          </span>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full flex-1">
        <Canvas camera={{ position: [0, 2.2, 3.4], fov: 42 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 5, 3]} intensity={2.2} color="#ffffff" />
          <pointLight
            position={[-0.6, 0.8, -0.4]}
            intensity={1.5 + activeWorkload * 2.0}
            color="#8EB69B"
          />

          <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
            <IslandScene workload={activeWorkload} />
          </Float>

          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 4}
            autoRotate={false}
          />
        </Canvas>
      </div>

      {/* Bottom Live Generation & Emission Metrics Bar */}
      <div className="px-4 py-2 bg-[#051F20]/90 border-t border-[#8EB69B]/25 backdrop-blur-md flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4 text-[#DAF1DE]">
          <span>
            Simulated Load: <strong className="text-white">{simulatedKw} kWh</strong>
          </span>
          <span className="hidden sm:inline">
            Carbon Rate: <strong className="text-[#8EB69B]">{hourlyEmission} kg CO₂</strong>
          </span>
          <span className="hidden md:inline">
            Turbine RPM: <strong className="text-white">{Math.round(18 + activeWorkload * 42)} rpm</strong>
          </span>
        </div>
        <span className="text-[#8EB69B] font-semibold">Synced to Input</span>
      </div>
    </div>
  );
}
