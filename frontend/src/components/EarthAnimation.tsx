'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useRef } from 'react';
import { Group } from 'three';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

function Earth() {
  const groupRef = useRef<Group>(null);
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();

  const rotationY = useTransform(scrollY, [0, 3000], [0, Math.PI * 4]);
  const puneScale = useTransform(scrollY, [2000, 3000], [0.5, 2]);
  const puneOpacity = useTransform(scrollY, [2000, 3000], [0, 1]);

  if (reduce) return null;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationY.get();
    }
  });

  return (
    <group ref={groupRef} rotation={[0, rotationY.get(), 0]}>
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial color={0x1a5f7a} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.01, 64, 64]} />
        <meshStandardMaterial color={0x0d4a6b} transparent opacity={0.6} roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.04, 64, 64]} />
        <meshStandardMaterial color={0xffffff} transparent opacity={0.15} roughness={1} metalness={0} />
      </mesh>
      <group position={[-1.38, 0.65, 1.45]} scale={puneScale}>
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={0xff6b35} emissive={0xff6b35} emissiveIntensity={0.5} />
        </mesh>
        <Html position={[0, 0.15, 0]} style={{ opacity: puneOpacity, transform: 'translate(-50%, -100%)', pointerEvents: 'none' }}>
          <div className="px-2 py-1 bg-brand-950/90 text-white text-xs font-medium rounded shadow-lg backdrop-blur-sm">Pune, Maharashtra</div>
        </Html>
      </group>
      <mesh>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshStandardMaterial color={0x4da8da} transparent opacity={0.08} side={2} />
      </mesh>
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();

  const zoom = useTransform(scrollY, [0, 3000], [5, 1.5]);
  const cameraY = useTransform(scrollY, [0, 3000], [0, 2]);
  const lookAtY = useTransform(scrollY, [0, 3000], [0, -0.5]);

  useFrame(() => {
    if (reduce) return;
    camera.position.z = zoom.get();
    camera.position.y = cameraY.get();
    camera.lookAt(0, lookAtY.get(), 0);
  });
  return null;
}

function Stars() {
  const { scrollY } = useScroll();
  const rotation = useTransform(scrollY, [0, 3000], [0, Math.PI * 0.5]);
  const starsRef = useRef<Group>(null);
  useFrame(() => { if (starsRef.current) starsRef.current.rotation.y = rotation.get(); });
  return <group ref={starsRef} rotation={[0, rotation, 0]}>{Array.from({ length: 2000 }, () => <mesh key={Math.random()} position={[(Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100]}><sphereGeometry args={[0.02, 4, 4]} /><meshBasicMaterial color={0xffffff} /></mesh>)}</group>;
}

function CameraController() {
  const { camera } = useThree();
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();

  const zoom = useTransform(scrollY, [0, 3000], [5, 1.5]);
  const cameraY = useTransform(scrollY, [0, 3000], [0, 2]);
  const lookAtY = useTransform(scrollY, [0, 3000], [0, -0.5]);

  useFrame(() => {
    if (reduce) return;
    camera.position.z = zoom.get();
    camera.position.y = cameraY.get();
    camera.lookAt(0, lookAtY.get(), 0);
  });
  return null;
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <pointLight position={[-3, 2, -3]} intensity={0.5} color={0x4da8da} />
    </>
  );
}

function Earth() {
  const groupRef = useRef<Group>(null);
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();

  const rotationY = useTransform(scrollY, [0, 3000], [0, Math.PI * 4]);
  const puneScale = useTransform(scrollY, [2000, 3000], [0.5, 2]);
  const puneOpacity = useTransform(scrollY, [2000, 3000], [0, 1]);

  if (reduce) return null;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationY.get();
    }
  });

  return (
    <group ref={groupRef} rotation={[0, rotationY.get(), 0]}>
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial color={0x1a5f7a} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.01, 64, 64]} />
        <meshStandardMaterial color={0x0d4a6b} transparent opacity={0.6} roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.04, 64, 64]} />
        <meshStandardMaterial color={0xffffff} transparent opacity={0.15} roughness={1} metalness={0} />
      </mesh>
      <group position={[-1.38, 0.65, 1.45]} scale={puneScale}>
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={0xff6b35} emissive={0xff6b35} emissiveIntensity={0.5} />
        </mesh>
        <Html position={[0, 0.15, 0]} style={{ opacity: puneOpacity, transform: 'translate(-50%, -100%)', pointerEvents: 'none' }}>
          <div className="px-2 py-1 bg-brand-950/90 text-white text-xs font-medium rounded shadow-lg backdrop-blur-sm">Pune, Maharashtra</div>
        </Html>
      </group>
      <mesh>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshStandardMaterial color={0x4da8da} transparent opacity={0.08} side={2} />
      </mesh>
    </group>
  );
}

function Stars() {
  const { scrollY } = useScroll();
  const rotation = useTransform(scrollY, [0, 3000], [0, Math.PI * 0.5]);
  const starsRef = useRef<Group>(null);
  useFrame(() => { if (starsRef.current) starsRef.current.rotation.y = rotation.get(); });
  return <group ref={starsRef} rotation={[0, rotation, 0]}>{Array.from({ length: 2000 }, () => <mesh key={Math.random()} position={[(Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100]}><sphereGeometry args={[0.02, 4, 4]} /><meshBasicMaterial color={0xffffff} /></mesh>)}</group>;
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <pointLight position={[-3, 2, -3]} intensity={0.5} color={0x4da8da} />
    </>
  );
}

function Earth() {
  const groupRef = useRef<Group>(null);
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();

  const rotationY = useTransform(scrollY, [0, 3000], [0, Math.PI * 4]);
  const puneScale = useTransform(scrollY, [2000, 3000], [0.5, 2]);
  const puneOpacity = useTransform(scrollY, [2000, 3000], [0, 1]);

  if (reduce) return null;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationY.get();
    }
  });

  return (
    <group ref={groupRef} rotation={[0, rotationY.get(), 0]}>
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial color={0x1a5f7a} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.01, 64, 64]} />
        <meshStandardMaterial color={0x0d4a6b} transparent opacity={0.6} roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.04, 64, 64]} />
        <meshStandardMaterial color={0xffffff} transparent opacity={0.15} roughness={1} metalness={0} />
      </mesh>
      <group position={[-1.38, 0.65, 1.45]} scale={puneScale}>
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={0xff6b35} emissive={0xff6b35} emissiveIntensity={0.5} />
        </mesh>
        <Html position={[0, 0.15, 0]} style={{ opacity: puneOpacity, transform: 'translate(-50%, -100%)', pointerEvents: 'none' }}>
          <div className="px-2 py-1 bg-brand-950/90 text-white text-xs font-medium rounded shadow-lg backdrop-blur-sm">Pune, Maharashtra</div>
        </Html>
      </group>
      <mesh>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshStandardMaterial color={0x4da8da} transparent opacity={0.08} side={2} />
      </mesh>
    </group>
  );
}

export function EarthAnimation() {
  const reduce = useReducedMotion();
  if (reduce) return <div className="relative h-[100vh] w-full bg-brand-950 flex items-center justify-center"><div className="text-center px-6"><h1 className="text-4xl md:text-6xl font-semibold text-white mb-4">CarbonIQ</h1><p className="text-lg text-brand-300 max-w-2xl mx-auto">Household energy & carbon intelligence for Pune and beyond.</p></div></div>;

  return (
    <div className="relative h-[300vh] w-full overflow-hidden bg-brand-950">
      <motion.div className="fixed top-4 right-6 z-50 text-white/50 text-sm font-mono"><div className="flex flex-col items-end gap-1"><span>Scroll to explore</span><motion.div className="w-px h-20 bg-white/20 relative overflow-hidden" style={{height:'100px'}}><motion.div className="w-full bg-white h-4 rounded-full" animate={{y:[0,100]}} transition={{duration:20,ease:'linear'}} /></motion.div></div></motion.div>
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">{['Space View','Approach','Pune Focus','Details'].map(l=><motion.div key={l} className="text-white/50 text-xs font-mono text-right pr-2 w-32" style={{opacity:0.5}}>{l}</motion.div>)}</div>
      <Canvas className="fixed inset-0" camera={{position:[0,0,5],fov:50}} onCreated={({gl})=>{gl.setPixelRatio(Math.min(window.devicePixelRatio,2));gl.outputColorSpace='srgb';}}><fog attach="fog" args={[0x051f20,0,50]} /><Stars /><Earth /><CameraController /><Lighting /><OrbitControls enableZoom={false} enablePan={false} enableRotate={false} /></Canvas>
      <div className="relative z-10 pt-[280vh] pb-20 px-6"><motion.div className="max-w-4xl mx-auto text-center" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-200px'}} transition={{duration:1,delay:0.5}}><h1 className="text-4xl md:text-6xl font-semibold text-white mb-6">Welcome to <span className="text-brand-300">Pune</span></h1><p className="text-lg md:text-xl text-brand-300 mb-8 max-w-2xl mx-auto leading-relaxed">From satellite view to your doorstep. CarbonIQ brings household energy intelligence to every home in Pune, Maharashtra.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><motion.a href="/forecast" className="px-8 py-3 bg-brand-300 text-brand-950 font-semibold rounded-full hover:bg-brand-400 transition-colors" whileHover={{scale:1.02}} whileTap={{scale:0.98}}>Create Your Forecast</motion.a><motion.a href="/electricity" className="px-8 py-3 bg-white/10 text-white font-semibold rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors" whileHover={{scale:1.02}} whileTap={{scale:0.98}}>Learn More</motion.a></div></motion.div></div></div>
    </div>
  );
}