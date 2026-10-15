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
    // Starts at wide orbit (z=4.8)
    // Zooms smoothly to a high-altitude cinematic orbital view of the subcontinent (z=3.85)
    // Halting at z=3.85 preserves full texture clarity and prevents single-pixel stretching
    const targetZ = THREE.MathUtils.lerp(4.8, 3.85, easeP);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 7, delta);
    state.camera.position.y = THREE.MathUtils.lerp(0, 0.25, easeP);
    state.camera.lookAt(0, 0, 0);

    // Pulsing green beacon on Pune
    if (beaconRef.current) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 4.5) * 0.35;
      beaconRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={earthGroupRef}>
      {/* 5K Multi-layer Day & Night Earth: Deep Blue Oceans + Illuminated Continents + Golden Night Cities */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 128, 128]} />
        <meshStandardMaterial
          map={nasaMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          roughnessMap={specularMap}
          roughness={0.75}
          metalness={0.1}
          emissiveMap={nightMap}
          emissive="#fbbf24" // Clear golden-amber city lights
          emissiveIntensity={2.8} // Strong glow for urban networks
          color="#1e293b" // Deep atmospheric navy for continental clarity
        />
      </mesh>

      {/* Atmospheric Horizon Rim / Cyan-Blue Limb Glow */}
      <mesh scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <shaderMaterial
          side={THREE.BackSide}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uniforms={{
            glowColor: { value: new THREE.Color('#38bdf8') }, // Crisp cyan orbital atmosphere
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
              float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
              gl_FragColor = vec4(glowColor, intensity * 0.85);
            }
          `}
        />
      </mesh>

      {/* 4K Cloud Wisps */}
      <mesh ref={cloudsRef} scale={[1.008, 1.008, 1.008]}>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          color="#f8fafc"
        />
      </mesh>

      {/* Pune Geographic Marker - Subtle Golden Beacon */}
      <group position={punePosition}>
        {/* Pulsing Beacon Dot */}
        <mesh ref={beaconRef}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshBasicMaterial color="#fef08a" />
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
          {/* Deep Space Background */}
          <color attach="background" args={['#030712']} />
          <ambientLight intensity={1.1} color="#e2e8f0" />

          {/* Sun / Key Light illuminating continents and oceans */}
          <directionalLight
            position={[10, 5, 8]}
            intensity={2.8}
            color="#ffffff"
          />
          {/* Subtle celestial cool fill light for blue ocean luster */}
          <directionalLight
            position={[-8, -3, -5]}
            intensity={0.6}
            color="#38bdf8"
          />

          <StarField />

          <Suspense fallback={null}>
            <GlobeScene scrollProgress={scrollYProgress} />
          </Suspense>
        </Canvas>

        {/* Arrival Card Overlay - Modern Frosted Glass Aesthetic matching reference */}
        <motion.div
          style={{
            opacity: endOverlayOpacity,
            y: endOverlayY,
          }}
          className="absolute inset-x-0 bottom-6 md:bottom-10 flex justify-center px-4 md:px-6 pointer-events-auto"
        >
          <div className="max-w-4xl w-full p-8 md:p-12 rounded-3xl bg-white/10 border border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl text-center relative overflow-hidden">
            {/* Subtle frosted glow gradient behind card */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/25 border border-white/20 text-emerald-200 text-xs font-medium tracking-wide mb-5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>DESTINATION: PUNE, MAHARASHTRA</span>
            </div>

            {/* Main Headline - Elegant, Light/Medium Weight with Accent word */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight leading-[1.15] max-w-2xl mx-auto font-['Plus_Jakarta_Sans',sans-serif]">
              Urban Household Energy as <span className="font-semibold text-emerald-300">One Carbon System</span>
            </h1>

            {/* Explanatory Subtitle - Light and crisp */}
            <p className="mt-4 text-sm sm:text-base text-emerald-100/80 font-light leading-relaxed max-w-xl mx-auto">
              Precision machine learning models calibrated with regional grid emission standards (CEA v22.0) and seasonal consumption dynamics.
            </p>

            {/* CTAs - Clean pill action button matching reference pill button with arrow */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/forecast"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-white text-slate-900 hover:bg-emerald-50 shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Launch Forecast</span>
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                  ↗
                </span>
              </a>

              <a
                href="/electricity"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white/90 hover:text-white bg-black/20 hover:bg-black/30 border border-white/15 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Explore Analytics</span>
              </a>
            </div>

            {/* Subtle bottom meta bar reflecting reference style */}
            <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40 tracking-wider uppercase font-mono px-2">
              <span>CEA v22.0 Standard</span>
              <span className="hidden sm:inline">Scope 2 Indirect</span>
              <span>18.52° N, 73.85° E</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}