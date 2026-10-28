import { motion, useReducedMotion } from 'motion/react';

export function AnimatedGradientBackground() {
  const reduce = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base gradient layer - more prominent */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 25%, #047857 50%, #059669 75%, #10b981 100%)',
        opacity: 0.15,
      }} />

      {/* Moving gradient orbs - vibrant and visible */}
      {!reduce && (
        <>
          {/* Orb 1 - Deep emerald, top right */}
          <motion.div
            className="absolute w-[700px] h-[700px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #10b981 0%, #059669 40%, #047857 70%, #064e3b 100%)',
              top: '-200px',
              right: '-200px',
              opacity: 0.45,
            }}
            animate={{
              x: [0, 60, -40, 20, 0],
              y: [0, -50, 30, -15, 0],
              scale: [1, 1.12, 0.93, 1.05, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Orb 2 - Bright emerald, bottom left */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle at 70% 70%, #34d399 0%, #10b981 35%, #059669 65%, #047857 100%)',
              bottom: '-150px',
              left: '-150px',
              opacity: 0.4,
            }}
            animate={{
              x: [0, -50, 35, -20, 0],
              y: [0, 55, -25, 15, 0],
              scale: [1, 1.1, 0.95, 1.03, 1],
            }}
            transition={{
              duration: 26,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 3,
            }}
          />

          {/* Orb 3 - Vivid green, center */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle at 50% 50%, #22c55e 0%, #16a34a 40%, #15803d 70%, #166534 100%)',
              top: '40%',
              left: '50%',
              opacity: 0.35,
            }}
            animate={{
              x: [0, 35, -25, 10, 0],
              y: [0, -35, 25, -10, 0],
              scale: [1, 1.15, 0.92, 1.05, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />

          {/* Orb 4 - Lime accent, top left */}
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle at 40% 60%, #65a30d 0%, #4d7c0f 50%, #3f6212 100%)',
              top: '10%',
              left: '10%',
              opacity: 0.3,
            }}
            animate={{
              x: [0, -30, 20, -10, 0],
              y: [0, 40, -20, 10, 0],
              scale: [1, 1.08, 0.96, 1.02, 1],
            }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 6,
            }}
          />
        </>
      )}

      {/* Strong mesh gradient overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(ellipse 90% 60% at 15% 15%, rgba(16, 185, 129, 0.35) 0%, transparent 55%),
          radial-gradient(ellipse 70% 50% at 85% 85%, rgba(5, 150, 105, 0.3) 0%, transparent 55%),
          radial-gradient(ellipse 60% 40% at 50% 50%, rgba(34, 197, 94, 0.25) 0%, transparent 65%),
          radial-gradient(ellipse 80% 50% at 80% 20%, rgba(21, 128, 61, 0.2) 0%, transparent 50%)
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