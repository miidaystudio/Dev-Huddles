'use client';

import React from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  description?: string;
}

export function SliderControl({
  label,
  value,
  min = 0,
  max = 10,
  step = 0.1,
  unit = '',
  onChange,
  description,
}: SliderControlProps) {
  return (
    <div className="space-y-1.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="font-mono text-indigo-400 font-semibold">
          {value}
          {unit}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
      />

      {description && (
        <p className="text-[10px] text-slate-500 leading-tight">{description}</p>
      )}
    </div>
  );
}
