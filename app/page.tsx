'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Wand2, Layers, Code2, ArrowRight, Play, CheckCircle, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Navigation */}
      <nav className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-white">
            Kinetic <span className="text-indigo-400">UI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/playground"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all active:scale-95"
          >
            Launch Playground <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-6xl mx-auto text-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-indigo-500/30 text-indigo-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" /> Generative Motion Compiler Engine
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-300 leading-tight">
            Compile Silky 60fps UI Animations with AI
          </h1>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Transform simple natural language prompts into production-grade Motion Payloads, interactive spring physics, and exportable React & GSAP code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/playground"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Open Studio Workbench <Wand2 className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100">
            Engineered for Modern Web Motion
          </h2>
          <p className="text-slate-400 text-sm">Everything you need to orchestrate complex UI component keyframes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">AI Prompt Compiler</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Synthesize organic easing profiles, staggered delays, and layer parameters directly from plain text prompts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Visual Easing Inspector</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Fine-tune duration, delay, y-offsets, spring elasticity, and custom bezier curves with real-time feedback.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Multi-Target Code Export</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              One-click code generation for Framer Motion, GSAP, Vanilla JavaScript, and Tailwind CSS keyframe rules.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-slate-500 text-xs">
        <p>Kinetic UI — AI Motion Compiler & Interactive Studio Workbench</p>
      </footer>
    </div>
  );
}
