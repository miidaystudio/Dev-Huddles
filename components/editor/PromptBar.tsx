'use client';

import React, { useState } from 'react';
import { Sparkles, Wand2, ArrowRight, RefreshCw, LayoutGrid, Maximize2, Type } from 'lucide-react';
import { PRESET_CHIPS } from '@/lib/ai/prompts';
import { cn } from '@/lib/utils';

interface PromptBarProps {
  onGenerate: (prompt: string) => Promise<void>;
  isLoading?: boolean;
}

export function PromptBar({ onGenerate, isLoading = false }: PromptBarProps) {
  const [promptText, setPromptText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim() || isLoading) return;
    onGenerate(promptText);
  };

  const handleSelectPreset = (presetPrompt: string) => {
    setPromptText(presetPrompt);
    onGenerate(presetPrompt);
  };

  const getIcon = (name?: string) => {
    switch (name) {
      case 'LayoutGrid': return <LayoutGrid className="w-3.5 h-3.5" />;
      case 'Maximize2': return <Maximize2 className="w-3.5 h-3.5" />;
      case 'Type': return <Type className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 p-4 space-y-3">
      {/* Preset Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
          <Wand2 className="w-3.5 h-3.5 text-indigo-400" /> Presets:
        </span>
        {PRESET_CHIPS.map((chip) => (
          <button
            key={chip.id}
            onClick={() => handleSelectPreset(chip.prompt)}
            disabled={isLoading}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 flex items-center gap-1.5",
              "bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 border border-slate-700/60 hover:border-indigo-500/50 hover:text-white"
            )}
          >
            {getIcon(chip.iconName)}
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-indigo-400">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <input
          type="text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Describe component animation... (e.g. 'Staggered 3D glass card with elastic spring entrance')"
          disabled={isLoading}
          className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl pl-12 pr-32 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={isLoading || !promptText.trim()}
          className="absolute right-2.5 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 transition-all"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Compiling...
            </>
          ) : (
            <>
              Generate <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
