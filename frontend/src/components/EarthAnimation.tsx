'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
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
/*  Deep Space Starfield (Lightweight 60fps)                          */
/* ------------------------------------------------------------------ */
function StarField() {
  const points = useMemo(() => {
    const coords = new Float32Array(500 * 3);
    for (let i = 0; i < 500 * 3; i += 3) {
      coords[i] = (Math.random() - 0.5) * 120;
      coords[i + 1] = (Math.random() - 0.5) * 120;
      coords[i + 2] = -15 - Math.random() * 80;
    }
    return coords;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color="#ffffff"
        transparent
        opacity={0.65}
        sizeAttenuation={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/*  Earth Scene with Precision Zoom to Pune (Optimized 60fps)         */
/* ------------------------------------------------------------------ */
function GlobeScene({ scrollProgress }: { scrollProgress: { get: () => number } }) {
  const { gl } = useThree();
  const earthGroupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  // Load lean textures: sharp 4K day map + lightweight clouds
  const [dayMap, cloudsMap] = useTexture([
    '/textures/earth_day_4k.jpg',
    '/textures/earth_clouds.png',
  ]);

  useEffect(() => {
    [dayMap, cloudsMap].forEach((tex) => {
      tex.anisotropy = 2;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
    });

    dayMap.colorSpace = THREE.SRGBColorSpace;
    cloudsMap.colorSpace = THREE.SRGBColorSpace;
  }, [gl, dayMap, cloudsMap]);

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
    const easeP = p * p * (3 - 2 * p);

    const initialSpin = state.clock.getElapsedTime() * 0.02;
    const currentRotY = THREE.MathUtils.lerp(initialSpin, targetRotationY, easeP);
    const currentRotX = THREE.MathUtils.lerp(0.04, targetRotationX, easeP);

    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y = currentRotY;
      earthGroupRef.current.rotation.x = currentRotX;
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.008;
    }

    const targetZ = THREE.MathUtils.lerp(4.8, 3.85, easeP);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 8, delta);
    state.camera.position.y = THREE.MathUtils.lerp(0, 0.25, easeP);
    state.camera.lookAt(0, 0, 0);

    if (beaconRef.current) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 4.5) * 0.35;
      beaconRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={earthGroupRef}>
      {/* 4K High-Performance Earth Globe */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshStandardMaterial
          map={dayMap}
          roughness={0.4}
          metalness={0.05}
          color="#ffffff"
        />
      </mesh>

      {/* Atmospheric Horizon Rim Glow */}
      <mesh scale={[1.025, 1.025, 1.025]}>
        <sphereGeometry args={[EARTH_RADIUS, 48, 48]} />
        <shaderMaterial
          side={THREE.BackSide}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uniforms={{
            glowColor: { value: new THREE.Color('#38bdf8') },
          }}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            uniform vec3 glowColor;
            void main() {
              float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
              gl_FragColor = vec4(glowColor, intensity * 1.2);
            }
          `}
        />
      </mesh>

      {/* Cloud Layer */}
      <mesh ref={cloudsRef} scale={[1.012, 1.012, 1.012]}>
        <sphereGeometry args={[EARTH_RADIUS, 48, 48]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          color="#ffffff"
        />
      </mesh>

      {/* Pune Geographic Marker - Pulsing Green Beacon */}
      <group position={punePosition}>
        <mesh ref={beaconRef}>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshBasicMaterial color="#34d399" />
        </mesh>
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
    <div ref={containerRef} className="relative h-[220vh] w-full bg-[#031516]">
      {/* Fixed Fullscreen 3D Canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#031516]">
        {/* Soft celestial atmospheric aura behind Earth for organic depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(6, 78, 59, 0.4) 0%, rgba(3, 23, 24, 0.65) 55%, #031516 100%)',
          }}
        />

        <Canvas
          camera={{ position: [0, 0, 4.75], fov: 42, near: 0.1, far: 200 }}
          dpr={1}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.35,
          }}
          className="w-full h-full"
        >
          {/* Deep Space Background matching unified brand palette */}
          <color attach="background" args={['#031516']} />
          <ambientLight intensity={1.5} color="#f8fafc" />

          {/* Key Sun Light illuminating Earth */}
          <directionalLight
            position={[12, 6, 8]}
            intensity={3.4}
            color="#ffffff"
          />

          <StarField />

          <Suspense fallback={null}>
            <GlobeScene scrollProgress={scrollYProgress} />
          </Suspense>
        </Canvas>

        {/* Deep atmospheric horizon transition blending into page content */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[#031516]/60 to-[#02201d] pointer-events-none z-10" />

        {/* Open, Cinematic Hero Content (No AI capsule box, solid unified typography) */}
        <motion.div
          style={{
            opacity: endOverlayOpacity,
            y: endOverlayY,
          }}
          className="absolute inset-x-0 bottom-10 md:bottom-16 flex flex-col items-center justify-center px-4 md:px-6 pointer-events-auto z-20 text-center"
        >
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Unified Solid Color Headline - Clean, Authoritative, No 2-tone split */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight [text-shadow:_0_2px_24px_rgba(0,0,0,0.85)]">
              Urban Household Energy as One Carbon System
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-white/85 font-normal max-w-xl mx-auto leading-relaxed [text-shadow:_0_1px_16px_rgba(0,0,0,0.85)]">
              Precision machine learning models calibrated with regional grid emission standards (CEA v22.0) and seasonal consumption dynamics.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/forecast"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-white text-brand-950 hover:bg-emerald-50 shadow-xl shadow-black/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Launch Forecast</span>
                <span className="w-5 h-5 rounded-full bg-brand-950 text-white flex items-center justify-center text-xs">
                  ↗
                </span>
              </a>

              <a
                href="/electricity"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white hover:text-white bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
              >
                <span>Explore Analytics</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}