import { motion, useReducedMotion } from 'motion/react';

export function AnimatedGradientBackground() {
  const reduce = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-emerald-50" />

      {/* Moving gradient orbs */}
      {!reduce && (
        <>
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
            style={{
              background: 'linear-gradient(135deg, #235347 0%, #8EB69B 50%, #DAF1DE 100%)',
              top: '-150px',
              right: '-150px',
            }}
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -40, 30, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-25"
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #6ee7b7 100%)',
              bottom: '-100px',
              left: '-100px',
            }}
            animate={{
              x: [0, -40, 30, 0],
              y: [0, 50, -20, 0],
              scale: [1, 1.05, 0.98, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 5,
            }}
          />

          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
            style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #86efac 100%)',
              top: '40%',
              left: '50%',
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -30, 20, 0],
              scale: [1, 1.08, 0.97, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
        </>
      )}

      {/* Subtle mesh gradient overlay */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 20% 20%, rgba(35, 83, 71, 0.25) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 80%, rgba(16, 185, 129, 0.18) 0%, transparent 50%),
          radial-gradient(ellipse 50% 30% at 50% 50%, rgba(218, 241, 222, 0.3) 0%, transparent 60%)
        `
      }} />

      {/* Subtle animated shimmer sweep */}
      {!reduce && (
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
            transform: 'rotate(-15deg) translateX(-200%)',
          }}
          animate={{
            transform: ['rotate(-15deg) translateX(-200%)', 'rotate(-15deg) translateX(200%)'],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
            delay: 1,
          }}
        />
      )}
    </div>
  );
}