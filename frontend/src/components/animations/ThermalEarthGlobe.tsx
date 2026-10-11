'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Rising Convective Heatwave Particles & Energy Shimmer             */
/* ------------------------------------------------------------------ */
function RisingHeatwaves({ intensity }: { intensity: number }) {
  const count = 120;
  const particlesRef = useRef<THREE.Points>(null);

  // Initial distribution of rising heat particles around the globe
  const initialPositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const radius = 1.05 + Math.random() * 0.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pos[i] = radius * Math.cos(phi) * Math.sin(theta);
      pos[i + 1] = radius * Math.sin(phi); // Y coordinate
      pos[i + 2] = radius * Math.cos(phi) * Math.cos(theta);
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    const array = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count * 3; i += 3) {
      // Heat rises upward along +Y
      array[i + 1] += delta * (0.4 + intensity * 0.8);
      // Subtle convective wave flutter (X and Z shimmer)
      array[i] += Math.sin(array[i + 1] * 6) * delta * 0.15;
      array[i + 2] += Math.cos(array[i + 1] * 6) * delta * 0.15;

      // Reset when particle floats high into atmosphere
      if (array[i + 1] > 2.0) {
        const radius = 1.05;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * 0.8;
        array[i] = radius * Math.cos(phi) * Math.sin(theta);
        array[i + 1] = -0.6 + Math.random() * 0.4;
        array[i + 2] = radius * Math.cos(phi) * Math.cos(theta);
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[initialPositions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color={intensity > 0.6 ? '#ff4500' : '#f59e0b'}
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/*  Miniature Globe with Thermal Radiance                             */
/* ------------------------------------------------------------------ */
function ThermalGlobeScene({ intensity }: { intensity: number }) {
  const globeRef = useRef<THREE.Group>(null);
  const thermalHaloRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.2;
    }
    if (thermalHaloRef.current) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * (2 + intensity * 3)) * 0.04;
      thermalHaloRef.current.scale.set(pulse * 1.12, pulse * 1.12, pulse * 1.12);
    }
  });

  return (
    <group ref={globeRef}>
      {/* Base Earth Core Sphere */}
      <mesh>
        <sphereGeometry args={[1.0, 48, 48]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.6}
          metalness={0.2}
          emissive={intensity > 0.6 ? '#dc2626' : '#ea580c'}
          emissiveIntensity={0.3 + intensity * 0.7}
        />
      </mesh>

      {/* Continents Wireframe / Surface Topology */}
      <mesh scale={[1.005, 1.005, 1.005]}>
        <sphereGeometry args={[1.0, 24, 24]} />
        <meshBasicMaterial
          color="#f97316"
          wireframe
          transparent
          opacity={0.3 + intensity * 0.3}
        />
      </mesh>

      {/* Pulsing Thermal Heat Aura / Atmosphere */}
      <mesh ref={thermalHaloRef}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshBasicMaterial
          color={intensity > 0.6 ? '#ef4444' : '#f59e0b'}
          transparent
          opacity={0.18 + intensity * 0.25}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Rising Heatwaves */}
      <RisingHeatwaves intensity={intensity} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported Interactive Component                                    */
/* ------------------------------------------------------------------ */
export function ThermalEarthGlobe() {
  const [thermalIntensity, setThermalIntensity] = useState<number>(0.55);

  return (
    <div className="relative w-full h-80 md:h-96 rounded-2xl bg-gradient-to-b from-[#051F20] via-[#0B2B26] to-[#051F20] border border-[#8EB69B]/30 shadow-xl overflow-hidden flex flex-col">
      {/* Top Controls */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#051F20]/80 border border-[#8EB69B]/40 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            Thermal Heat Convection
          </span>
        </div>

        {/* Heat Intensity Slider */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#051F20]/80 border border-[#8EB69B]/30 backdrop-blur-md">
          <span className="text-[11px] text-[#DAF1DE] font-medium">Heat Flux:</span>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={thermalIntensity}
            onChange={(e) => setThermalIntensity(parseFloat(e.target.value))}
            className="w-20 md:w-28 accent-amber-500 cursor-pointer h-1.5 bg-[#163832] rounded-lg"
          />
          <span className="text-xs font-mono font-bold text-[#8EB69B]">
            +{Math.round(thermalIntensity * 4.2 * 10) / 10}°C
          </span>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full flex-1">
        <Canvas camera={{ position: [0, 1.2, 2.9], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[3, 3, 3]} intensity={2.0} color="#ffedd5" />
          <pointLight position={[-3, -1, -2]} intensity={1.0} color="#f97316" />

          <Float speed={2} rotationIntensity={0.25} floatIntensity={0.4}>
            <ThermalGlobeScene intensity={thermalIntensity} />
          </Float>

          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>

      {/* Bottom Thermal Feedback Bar */}
      <div className="px-4 py-2 bg-[#051F20]/90 border-t border-[#8EB69B]/25 backdrop-blur-md flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4 text-[#DAF1DE]">
          <span>Heat Release: <strong className="text-white">{(46.1 * thermalIntensity * 1.4).toFixed(1)} MJ/kg</strong></span>
          <span className="hidden sm:inline">Combustion Mode: <strong className="text-[#8EB69B]">{thermalIntensity > 0.6 ? 'High Energy Convection' : 'Baseline Thermal'}</strong></span>
        </div>
        <span className="text-[#8EB69B] font-semibold">LPG &amp; Thermal Impact</span>
      </div>
    </div>
  );
}
