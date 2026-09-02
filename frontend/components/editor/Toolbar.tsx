'use client';

import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Download, Sparkles, Code2, Layers, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExportFormat, MotionPayload } from '@/types/motion';
import { generateExportCode } from '@/lib/templates/export-targets';

interface ToolbarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReplay: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  payload: MotionPayload;
  onTemplateSelect: (id: string) => void;
}

export function Toolbar({
  isPlaying,
  onTogglePlay,
  onReplay,
  playbackSpeed,
  onSpeedChange,
  payload,
  onTemplateSelect,
}: ToolbarProps) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('react-framer');
  const [copied, setCopied] = useState(false);

  const exportedCode = generateExportCode(payload, exportFormat);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(exportedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between z-20">
        {/* Left Branding & Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 leading-tight">
                Kinetic UI <span className="px-1.5 py-0.5 text-[10px] font-mono bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded">Studio</span>
              </h1>
              <p className="text-[11px] text-slate-400">{payload.title}</p>
            </div>
          </div>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <Button variant="ghost" size="icon" onClick={onReplay} title="Replay Animation">
            <RotateCcw className="w-4 h-4 text-slate-300" />
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onTogglePlay}
            className="px-4 py-1.5"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Play
              </>
            )}
          </Button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
            {[0.5, 1, 2].map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-2 py-0.5 text-xs font-mono rounded ${
                  playbackSpeed === speed
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="sm"
            onClick={() => setIsExportOpen(true)}
            className="gap-1.5"
          >
            <Download className="w-4 h-4 text-indigo-400" /> Export Code
          </Button>
        </div>
      </header>

      {/* Export Modal */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-100">Export Component Motion</h3>
              </div>
              <button
                onClick={() => setIsExportOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Target Selector */}
            <div className="flex gap-2 border-b border-slate-800 pb-3">
              {[
                { id: 'react-framer', label: 'React + Framer Motion' },
                { id: 'react-gsap', label: 'React + GSAP' },
                { id: 'vanilla-gsap', label: 'Vanilla JS + GSAP' },
                { id: 'tailwind-css', label: 'Tailwind / CSS' },
              ].map((target) => (
                <button
                  key={target.id}
                  onClick={() => setExportFormat(target.id as ExportFormat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    exportFormat === target.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {target.label}
                </button>
              ))}
            </div>

            {/* Code View */}
            <div className="relative">
              <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-indigo-200 overflow-x-auto max-h-80 border border-slate-800">
                {exportedCode}
              </pre>
              <button
                onClick={handleCopyCode}
                className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-md flex items-center gap-1.5 border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setIsExportOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
