'use client';

import React from 'react';
import { EaseType } from '@/types/motion';
import { formatEaseName } from '@/lib/utils';
import { Activity } from 'lucide-react';

interface EasePickerProps {
  value: EaseType;
  onChange: (ease: EaseType) => void;
}

const EASE_OPTIONS: { type: EaseType; label: string; desc: string }[] = [
  { type: 'power1.out', label: 'Power1 (Soft)', desc: 'Gentle deceleration' },
  { type: 'power2.out', label: 'Power2 (Medium)', desc: 'Standard UI motion' },
  { type: 'power3.out', label: 'Power3 (Crisp)', desc: 'Fast, responsive snap' },
  { type: 'power4.out', label: 'Power4 (Dramatic)', desc: 'High energy impact' },
  { type: 'back.out', label: 'Back (Overshoot)', desc: 'Pops past target then settles' },
  { type: 'elastic.out', label: 'Elastic (Spring)', desc: 'Organic spring oscillation' },
  { type: 'bounce.out', label: 'Bounce (Physics)', desc: 'Impact bounce physics' },
  { type: 'sine.inOut', label: 'Sine (Wave)', desc: 'Smooth sine wave oscillation' },
];

export function EasePicker({ value, onChange }: EasePickerProps) {
  return (
    <div className="space-y-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
        <span className="flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-indigo-400" /> Easing Curve
        </span>
        <span className="text-[11px] text-indigo-400 font-mono">{value}</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 pt-1">
        {EASE_OPTIONS.map((opt) => (
          <button
            key={opt.type}
            onClick={() => onChange(opt.type)}
            className={`p-2 rounded-md text-left transition-all text-xs ${
              value === opt.type
                ? 'bg-indigo-600/30 border border-indigo-500/60 text-white shadow-md'
                : 'bg-slate-950/60 border border-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="font-medium truncate">{opt.label}</div>
            <div className="text-[10px] text-slate-500 truncate">{opt.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
