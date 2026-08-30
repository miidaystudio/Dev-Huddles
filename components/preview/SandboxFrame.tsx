'use client';

import React, { keyframes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MotionPayload, ViewportMode } from '@/types/motion';
import { getEaseCSS } from '@/lib/utils';
import { Sparkles, Layers, CheckCircle2, Zap, ArrowUpRight } from 'lucide-react';

interface SandboxFrameProps {
  payload: MotionPayload;
  viewportMode: ViewportMode;
  showGrid: boolean;
  isPlaying: boolean;
  playbackSpeed: number;
  renderKey: number;
}

export function SandboxFrame({
  payload,
  viewportMode,
  showGrid,
  isPlaying,
  playbackSpeed,
  renderKey,
}: SandboxFrameProps) {
  const getWidth = () => {
    switch (viewportMode) {
      case 'laptop': return 'max-w-[1024px]';
      case 'tablet': return 'max-w-[768px]';
      case 'mobile': return 'max-w-[375px]';
      default: return 'w-full max-w-5xl';
    }
  };

  // Find layer configs for live animation mapping
  const headerLayer = payload.layers.find(l => l.id.includes('header') || l.id.includes('title')) || payload.layers[0];
  const cardLayer = payload.layers.find(l => l.id.includes('card') || l.id.includes('grid') || l.id.includes('badge')) || payload.layers[1] || payload.layers[0];

  const durationMultiplier = 1 / (playbackSpeed || 1);

  return (
    <div className={`relative flex-1 w-full h-full overflow-auto flex items-center justify-center p-8 transition-all ${
      showGrid ? 'bg-grid-pattern' : 'bg-slate-950'
    }`}>
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/20 via-purple-950/20 to-slate-950 blur-3xl pointer-events-none" />

      {/* Frame Container */}
      <div
        className={`w-full transition-all duration-300 ${getWidth()} mx-auto relative z-10 flex items-center justify-center`}
      >
        <AnimatePresence mode="wait">
          {isPlaying && (
            <motion.div
              key={renderKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              {/* Dynamic Workbench Live Preview */}
              <div className="w-full bg-slate-900/90 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-8 shadow-2xl space-y-6">
                
                {/* Header Layer Animated */}
                <motion.div
                  initial={{
                    opacity: headerLayer?.opacity ?? 0,
                    y: headerLayer?.y ?? -30,
                    scale: headerLayer?.scale ?? 0.95
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  transition={{
                    duration: (headerLayer?.duration ?? 0.7) * durationMultiplier,
                    delay: (headerLayer?.delay ?? 0) * durationMultiplier,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="bento-header flex items-center justify-between border-b border-slate-800/80 pb-6"
                >
                  <div className="space-y-1">
                    <span className="hero-badge px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5 w-fit">
                      <Sparkles className="w-3.5 h-3.5" /> {payload.engine.toUpperCase()} Engine Active
                    </span>
                    <h2 className="hero-title text-3xl font-extrabold text-slate-100 mt-2 tracking-tight">
                      {payload.title}
                    </h2>
                    <p className="text-slate-400 text-sm">{payload.description}</p>
                  </div>

                  <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all active:scale-95">
                    Launch Motion <ArrowUpRight className="w-4 h-4" />
                  </button>
                </motion.div>

                {/* Grid / Cards Layer Animated */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { title: 'Interactive Stagger', icon: <Layers className="w-5 h-5 text-indigo-400" />, desc: 'Silky 60fps frame interpolation with zero main thread layout thrashing.' },
                    { title: 'Dynamic Inspector', icon: <Zap className="w-5 h-5 text-purple-400" />, desc: 'Tweak easing profiles & physics parameters live in real-time.' },
                    { title: 'Production Export', icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />, desc: 'Instant code generation for Framer Motion, GSAP, and Tailwind keyframes.' }
                  ].map((card, idx) => (
                    <motion.div
                      key={idx}
                      initial={{
                        opacity: cardLayer?.opacity ?? 0,
                        y: (cardLayer?.y ?? 40) + idx * 10,
                        scale: cardLayer?.scale ?? 0.9
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1
                      }}
                      transition={{
                        duration: (cardLayer?.duration ?? 0.6) * durationMultiplier,
                        delay: ((cardLayer?.delay ?? 0.1) + idx * (cardLayer?.stagger ?? 0.12)) * durationMultiplier,
                        ease: [0.34, 1.56, 0.64, 1] // spring overshoot
                      }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      className="bento-card p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 hover:border-indigo-500/50 shadow-xl transition-colors cursor-pointer group"
                    >
                      <div className="p-2.5 w-fit rounded-xl bg-slate-800/80 border border-slate-700/60 mb-4 group-hover:bg-indigo-600/20 group-hover:border-indigo-500/40 transition-colors">
                        {card.icon}
                      </div>
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                        {card.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
