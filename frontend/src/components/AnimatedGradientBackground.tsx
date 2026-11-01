import { motion, useReducedMotion } from 'motion/react';

export function AnimatedGradientBackground() {
  const reduce = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base rich deep contrast gradient layer */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #022c22 0%, #064e3b 25%, #047857 50%, #059669 75%, #10b981 100%)',
        opacity: 0.35,
      }} />

      {/* Dynamic moving high-contrast gradient orbs */}
      {!reduce && (
        <>
          {/* Orb 1 - Deep vibrant emerald, top right */}
          <motion.div
            className="absolute w-[850px] h-[850px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #10b981 0%, #059669 40%, #047857 65%, #022c22 100%)',
              top: '-180px',
              right: '-180px',
              opacity: 0.7,
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
            animate={{
              x: [0, 140, -90, 60, 0],
              y: [0, -120, 80, -40, 0],
              scale: [1, 1.2, 0.95, 1.1, 1],
            }}
            transition={{
              duration: 13,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Orb 2 - Luminous bright mint, bottom left */}
          <motion.div
            className="absolute w-[750px] h-[750px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle at 65% 65%, #34d399 0%, #10b981 35%, #059669 65%, #064e3b 100%)',
              bottom: '-120px',
              left: '-120px',
              opacity: 0.65,
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
            animate={{
              x: [0, -130, 90, -50, 0],
              y: [0, 130, -70, 40, 0],
              scale: [1, 1.18, 0.92, 1.08, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.5,
            }}
          />

          {/* Orb 3 - Radiant spring green, center-right */}
          <motion.div
            className="absolute w-[650px] h-[650px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle at 50% 50%, #22c55e 0%, #16a34a 40%, #15803d 70%, #14532d 100%)',
              top: '30%',
              left: '45%',
              opacity: 0.6,
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
            animate={{
              x: [0, 100, -80, 40, 0],
              y: [0, -90, 70, -30, 0],
              scale: [1, 1.22, 0.94, 1.12, 1],
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.8,
            }}
          />

          {/* Orb 4 - High-contrast electric teal accent, top-center */}
          <motion.div
            className="absolute w-[550px] h-[550px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle at 45% 55%, #2dd4bf 0%, #0d9488 40%, #115e59 80%, #042f2e 100%)',
              top: '5%',
              left: '15%',
              opacity: 0.55,
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
            animate={{
              x: [0, -90, 70, -35, 0],
              y: [0, 110, -60, 30, 0],
              scale: [1, 1.16, 0.92, 1.06, 1],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 3,
            }}
          />
        </>
      )}

      {/* High-contrast mesh gradient overlay for depth */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(ellipse 90% 60% at 15% 15%, rgba(16, 185, 129, 0.45) 0%, transparent 60%),
          radial-gradient(ellipse 70% 50% at 85% 85%, rgba(5, 150, 105, 0.4) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 50% 50%, rgba(34, 197, 94, 0.35) 0%, transparent 65%),
          radial-gradient(ellipse 80% 50% at 80% 20%, rgba(21, 128, 61, 0.3) 0%, transparent 55%)
        `
      }} />

      {/* Animated shimmer sweep - more visible */}
      {!reduce && (
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
            transform: 'rotate(-12deg) translateX(-200%)',
          }}
          animate={{
            transform: ['rotate(-12deg) translateX(-200%)', 'rotate(-12deg) translateX(200%)'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
            delay: 0.5,
          }}
        />
      )}

      {/* Second shimmer sweep - opposite direction */}
      {!reduce && (
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.15) 50%, transparent 100%)',
            transform: 'rotate(12deg) translateX(200%)',
          }}
          animate={{
            transform: ['rotate(12deg) translateX(200%)', 'rotate(12deg) translateX(-200%)'],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'linear',
            delay: 4,
          }}
        />
      )}
    </div>
  );
}