'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import { useRef, useMemo, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

const EARTH_RADIUS = 2.0;

// Exact geographic coordinates of Pune, Maharashtra
const PUNE_LAT = 18.5204;
const PUNE_LON = 73.8567;

function latLonToVector3(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
}

/* ------------------------------------------------------------------ */
/*  Deep Space Starfield (Subtle & Natural)                           */
/* ------------------------------------------------------------------ */
function StarField() {
  const points = useMemo(() => {
    const coords = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500 * 3; i += 3) {
      coords[i] = (Math.random() - 0.5) * 140;
      coords[i + 1] = (Math.random() - 0.5) * 140;
      coords[i + 2] = -15 - Math.random() * 90;
    }
    return coords;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/*  Earth Scene with Precision Zoom to Pune                           */
/* ------------------------------------------------------------------ */
function GlobeScene({ scrollProgress }: { scrollProgress: { get: () => number } }) {
  const { gl } = useThree();
  const earthGroupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  // Load high-resolution multi-layer planet textures
  const [nasaMap, normalMap, cloudsMap, nightMap, specularMap] = useTexture([
    '/textures/earth_nasa_5k.jpg',
    '/textures/earth_normal.jpg',
    '/textures/earth_clouds_4k.png',
    '/textures/earth_night.jpg',
    '/textures/earth_specular.png',
  ]);

  // Maximize texture sharpness using 16x Anisotropic filtering
  useEffect(() => {
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
    [nasaMap, normalMap, cloudsMap, nightMap, specularMap].forEach((tex) => {
      tex.anisotropy = maxAnisotropy;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
    });

    nasaMap.colorSpace = THREE.SRGBColorSpace;
    cloudsMap.colorSpace = THREE.SRGBColorSpace;
    nightMap.colorSpace = THREE.SRGBColorSpace;
  }, [gl, nasaMap, normalMap, cloudsMap, nightMap, specularMap]);

  // Exact Cartesian coordinates for Pune on Earth's surface
  const punePosition = useMemo(
    () => latLonToVector3(PUNE_LAT, PUNE_LON, EARTH_RADIUS + 0.012),
    []
  );

  // Rotation angles that position Pune directly center-front to the camera lens
  const targetRotationY = useMemo(() => {
    return -((PUNE_LON + 90) * (Math.PI / 180));
  }, []);
  const targetRotationX = useMemo(() => {
    return (PUNE_LAT * (Math.PI / 180));
  }, []);

  useFrame((state, delta) => {
    const rawProgress = scrollProgress.get();
    const p = THREE.MathUtils.clamp(rawProgress, 0, 1);

    // Smooth cubic easing curve
    const easeP = p * p * (3 - 2 * p);

    // Initial gentle drift at scroll=0, smoothly rotating to align Pune front and center
    const initialSpin = state.clock.getElapsedTime() * 0.025;
    const currentRotY = THREE.MathUtils.lerp(initialSpin, targetRotationY, easeP);
    const currentRotX = THREE.MathUtils.lerp(0.04, targetRotationX, easeP);

    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y = currentRotY;
      earthGroupRef.current.rotation.x = currentRotX;
      earthGroupRef.current.position.set(0, 0, 0);
    }

    // Clouds atmospheric drift
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.009;
    }

    // Camera Zoom:
    // Starts at full orbit (z=4.75)
    // Zooms in smoothly and halts directly over Pune (z=2.70)
    const targetZ = THREE.MathUtils.lerp(4.75, 2.70, easeP);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 8, delta);
    state.camera.position.y = 0;
    state.camera.lookAt(0, 0, 0);

    // Pulsing green beacon on Pune
    if (beaconRef.current) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 4.5) * 0.35;
      beaconRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={earthGroupRef}>
      {/* Photorealistic Earth Surface (Natural, NO artificial blue ring) */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
        <meshStandardMaterial
          map={nasaMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.4, 0.4)}
          roughnessMap={specularMap}
          roughness={0.65}
          metalness={0.1}
          emissiveMap={nightMap}
          emissive="#f59e0b" // Warm city lights
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* 4K Translucent Cloud Layer */}
      <mesh ref={cloudsRef} scale={[1.008, 1.008, 1.008]}>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Pune Geographic Marker - Clean Green & White Theme */}
      <group position={punePosition}>
        {/* Pulsing Beacon Dot */}
        <mesh ref={beaconRef}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="#8EB69B" />
        </mesh>

        {/* Clean Pill Label - Green & White Palette */}
        <Html
          position={[0, 0.055, 0]}
          center
          style={{
            pointerEvents: 'none',
            transform: 'translate3d(0, 0, 0)',
            transition: 'opacity 0.3s ease',
          }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#051F20]/90 border border-[#8EB69B]/50 shadow-[0_0_15px_rgba(142,182,155,0.35)] backdrop-blur-md whitespace-nowrap select-none">
            <span className="w-2 h-2 rounded-full bg-[#8EB69B] animate-ping" />
            <div className="text-left">
              <p className="text-[11px] font-bold text-white tracking-wider">PUNE, MH</p>
              <p className="text-[9px] text-[#8EB69B] font-mono">18.52° N, 73.85° E</p>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component - Strict Green & White Brand Theme                 */
/* ------------------------------------------------------------------ */
export function EarthAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const reduceMotion = useReducedMotion();

  // Arrival destination overlay appears strictly at the final locked state
  const endOverlayOpacity = useTransform(scrollYProgress, [0.85, 0.98], [0, 1]);
  const endOverlayY = useTransform(scrollYProgress, [0.85, 0.98], [20, 0]);

  if (reduceMotion) {
    return (
      <div className="relative h-screen w-full bg-[#051F20] flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">CarbonIQ</h1>
          <p className="text-lg text-[#8EB69B] max-w-xl mx-auto">
            Urban household energy &amp; carbon intelligence platform.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[220vh] w-full bg-[#051F20]">
      {/* Fixed Fullscreen 3D Canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#051F20]">
        <Canvas
          camera={{ position: [0, 0, 4.75], fov: 42, near: 0.1, far: 200 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          className="w-full h-full"
        >
          {/* Deep Space Background - Dark Forest Brand Base */}
          <color attach="background" args={['#051F20']} />
          <ambientLight intensity={0.25} />

          {/* Crisp Directional Sunlight */}
          <directionalLight
            position={[10, 4, 6]}
            intensity={3.2}
            color="#ffffff"
          />
          {/* Subtle celestial fill light */}
          <directionalLight
            position={[-8, -2, -5]}
            intensity={0.08}
            color="#8EB69B"
          />

          <StarField />

          <Suspense fallback={null}>
            <GlobeScene scrollProgress={scrollYProgress} />
          </Suspense>
        </Canvas>

        {/* Arrival Card Overlay - Strict Green & White Brand Theme */}
        <motion.div
          style={{
            opacity: endOverlayOpacity,
            y: endOverlayY,
          }}
          className="absolute inset-x-0 bottom-8 flex justify-center px-6 pointer-events-auto"
        >
          <div className="max-w-2xl w-full p-6 md:p-8 rounded-2xl bg-[#051F20]/90 border border-[#8EB69B]/35 shadow-[0_0_40px_rgba(142,182,155,0.25)] backdrop-blur-xl text-center">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#235347]/60 border border-[#8EB69B]/40 text-[#8EB69B] text-xs font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8EB69B] animate-pulse" />
              DESTINATION: PUNE, MAHARASHTRA
            </div>

            {/* Main Headline - Crisp White & Brand Mint */}
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Urban Household Energy &amp; <span className="text-[#8EB69B]">Carbon Analytics</span>
            </h2>

            {/* Explanatory Text */}
            <p className="mt-2.5 text-sm md:text-base text-[#DAF1DE]/90 leading-relaxed max-w-lg mx-auto">
              Precision machine learning models calibrated with regional grid emission standards (CEA v22.0) and seasonal consumption dynamics.
            </p>

            {/* CTAs - Green and White Palette */}
            <div className="mt-5 flex flex-wrap gap-3 justify-center">
              <a
                href="/forecast"
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#8EB69B] text-[#051F20] hover:bg-[#B8D4C0] shadow-lg shadow-[#8EB69B]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Launch Energy Forecast
              </a>
              <a
                href="/electricity"
                className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Explore Analytics
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}