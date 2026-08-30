import { MotionPayload } from '@/types/motion';

export const INITIAL_BENTO_GRID: MotionPayload = {
  id: 'template-bento-grid',
  title: 'Bento Grid Entrance',
  description: 'Staggered 3D glassmorphic card sequence with smooth spring entry and dynamic hover elevation.',
  engine: 'framer-motion',
  componentName: 'KineticBentoGrid',
  controllableProps: [
    {
      id: 'staggerTime',
      name: 'Stagger Delay',
      type: 'number',
      value: 0.12,
      min: 0.02,
      max: 0.4,
      step: 0.02,
      unit: 's',
      description: 'Delay between consecutive card animations'
    },
    {
      id: 'cardDuration',
      name: 'Card Duration',
      type: 'number',
      value: 0.7,
      min: 0.2,
      max: 2.0,
      step: 0.1,
      unit: 's',
      description: 'Animation duration for individual card reveals'
    },
    {
      id: 'glowIntensity',
      name: 'Glow Intensity',
      type: 'number',
      value: 0.6,
      min: 0,
      max: 1.0,
      step: 0.1,
      description: 'Opacity of ambient background glow'
    }
  ],
  layers: [
    {
      id: 'header-layer',
      selector: '.bento-header',
      name: 'Header & Badge',
      opacity: 1,
      y: -25,
      duration: 0.6,
      delay: 0,
      ease: 'power3.out'
    },
    {
      id: 'grid-cards',
      selector: '.bento-card',
      name: 'Bento Grid Cards',
      opacity: 1,
      scale: 1,
      y: 40,
      duration: 0.7,
      delay: 0.15,
      stagger: 0.12,
      ease: 'back.out'
    }
  ],
  jsxCode: `export default function KineticBentoGrid() {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6 bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl">
      <div className="bento-header flex items-center justify-between">
        <div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Kinetic Engine v2.0
          </span>
          <h2 className="text-2xl font-bold text-slate-100 mt-2">AI Motion Workbench</h2>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-all rounded-lg shadow-lg shadow-indigo-500/25">
          Deploy Motion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bento-card col-span-1 md:col-span-2 p-6 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800/60 hover:border-indigo-500/50 transition-all">
          <h3 className="text-lg font-semibold text-white">3D Realtime Compiler</h3>
          <p className="text-slate-400 text-sm mt-1">Instant layout keyframing & WebGL shader parameter controls.</p>
          <div className="mt-6 h-32 rounded-lg bg-slate-950/50 border border-slate-800/50 flex items-center justify-center text-xs text-indigo-400 font-mono">
            // Render Stream Ready
          </div>
        </div>

        <div className="bento-card p-6 rounded-xl bg-gradient-to-br from-slate-900 to-purple-950/30 border border-slate-800/60 hover:border-purple-500/50 transition-all">
          <h3 className="text-lg font-semibold text-white">Ease Curves</h3>
          <p className="text-slate-400 text-sm mt-1">Power4, Elastic, and Custom Bezier curves.</p>
          <div className="mt-6 h-32 rounded-lg bg-slate-950/50 border border-slate-800/50 flex items-center justify-center text-purple-400 font-mono text-xs">
            back.out(1.7)
          </div>
        </div>
      </div>
    </div>
  );
}`
};

export const INITIAL_HERO_CARD: MotionPayload = {
  id: 'template-hero-card',
  title: 'Glassmorphic Hero Banner',
  description: 'High-impact CTA banner with kinetic typography, floating badges, and dynamic iris blur.',
  engine: 'gsap',
  componentName: 'KineticHeroBanner',
  controllableProps: [
    {
      id: 'titleDuration',
      name: 'Title Duration',
      type: 'number',
      value: 0.8,
      min: 0.3,
      max: 2.0,
      step: 0.1,
      unit: 's'
    },
    {
      id: 'bounceElasticity',
      name: 'Elasticity',
      type: 'number',
      value: 1.2,
      min: 0.5,
      max: 2.5,
      step: 0.1
    }
  ],
  layers: [
    {
      id: 'hero-title',
      selector: '.hero-title',
      name: 'Kinetic Title',
      opacity: 1,
      y: -30,
      duration: 0.8,
      delay: 0,
      ease: 'power4.out'
    },
    {
      id: 'hero-badge',
      selector: '.hero-badge',
      name: 'Floating Pill',
      opacity: 1,
      scale: 1.05,
      duration: 0.6,
      delay: 0.2,
      ease: 'elastic.out'
    }
  ],
  jsxCode: `export default function KineticHeroBanner() {
  return (
    <div className="relative w-full max-w-4xl mx-auto p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl pointer-events-none" />
      <span className="hero-badge inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 mb-4">
        ⚡ Next-Gen Animation Compiler
      </span>
      <h1 className="hero-title text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-300 leading-tight">
        Build Physics-Driven UI in Seconds
      </h1>
      <p className="mt-4 text-slate-400 text-base max-w-xl mx-auto">
        Transform static components into silky 60fps interactive experiences using AI prompt engineering.
      </p>
    </div>
  );
}`
};

export const DEFAULT_TEMPLATES = [INITIAL_BENTO_GRID, INITIAL_HERO_CARD];
