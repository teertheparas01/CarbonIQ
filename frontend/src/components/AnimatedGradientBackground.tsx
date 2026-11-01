import { useReducedMotion } from 'motion/react';

export function AnimatedGradientBackground() {
  const reduce = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base rich gradient layer — static, no blur needed */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #022c22 0%, #064e3b 25%, #047857 50%, #059669 75%, #10b981 100%)',
        opacity: 0.35,
      }} />

      {/* Animated orbs — use CSS animations instead of Framer Motion for GPU compositing.
          Only opacity + transform are animated (compositor-only, no layout/paint).
          Reduced blur from blur-3xl (64px) to blur-2xl (40px) for perf. */}
      {!reduce && (
        <>
          {/* Orb 1 - Deep vibrant emerald, top right */}
          <div
            className="absolute w-[850px] h-[850px] rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #10b981 0%, #059669 40%, #047857 65%, #022c22 100%)',
              top: '-180px',
              right: '-180px',
              opacity: 0.7,
              filter: 'blur(40px)',
              animation: 'orbFloat1 18s ease-in-out infinite',
              willChange: 'transform',
              contain: 'layout style paint',
            }}
          />

          {/* Orb 2 - Luminous bright mint, bottom left */}
          <div
            className="absolute w-[750px] h-[750px] rounded-full"
            style={{
              background: 'radial-gradient(circle at 65% 65%, #34d399 0%, #10b981 35%, #059669 65%, #064e3b 100%)',
              bottom: '-120px',
              left: '-120px',
              opacity: 0.65,
              filter: 'blur(40px)',
              animation: 'orbFloat2 20s ease-in-out infinite',
              animationDelay: '1.5s',
              willChange: 'transform',
              contain: 'layout style paint',
            }}
          />

          {/* Orb 3 - Radiant spring green, center */}
          <div
            className="absolute w-[650px] h-[650px] rounded-full"
            style={{
              background: 'radial-gradient(circle at 50% 50%, #22c55e 0%, #16a34a 40%, #15803d 70%, #14532d 100%)',
              top: '30%',
              left: '45%',
              opacity: 0.6,
              filter: 'blur(40px)',
              animation: 'orbFloat3 16s ease-in-out infinite',
              animationDelay: '0.8s',
              willChange: 'transform',
              contain: 'layout style paint',
            }}
          />
        </>
      )}

      {/* Static mesh gradient overlay for depth — no animation needed */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(ellipse 90% 60% at 15% 15%, rgba(16, 185, 129, 0.45) 0%, transparent 60%),
          radial-gradient(ellipse 70% 50% at 85% 85%, rgba(5, 150, 105, 0.4) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 50% 50%, rgba(34, 197, 94, 0.35) 0%, transparent 65%)
        `
      }} />

      {/* Single subtle CSS shimmer sweep — no Framer Motion overhead */}
      {!reduce && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
            animation: 'shimmerSweep 12s linear infinite',
            willChange: 'transform',
          }}
        />
      )}
    </div>
  );
}
