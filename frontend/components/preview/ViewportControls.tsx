'use client';

import React from 'react';
import { Monitor, Laptop, Tablet, Smartphone, Grid, RefreshCw } from 'lucide-react';
import { ViewportMode } from '@/types/motion';

interface ViewportControlsProps {
  mode: ViewportMode;
  onModeChange: (mode: ViewportMode) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  onRefresh: () => void;
}

export function ViewportControls({
  mode,
  onModeChange,
  showGrid,
  onToggleGrid,
  onRefresh,
}: ViewportControlsProps) {
  const devices: { id: ViewportMode; label: string; icon: React.ReactNode; width: string }[] = [
    { id: 'desktop', label: 'Desktop', icon: <Monitor className="w-3.5 h-3.5" />, width: '100%' },
    { id: 'laptop', label: 'Laptop', icon: <Laptop className="w-3.5 h-3.5" />, width: '1024px' },
    { id: 'tablet', label: 'Tablet', icon: <Tablet className="w-3.5 h-3.5" />, width: '768px' },
    { id: 'mobile', label: 'Mobile', icon: <Smartphone className="w-3.5 h-3.5" />, width: '375px' },
  ];

  return (
    <div className="h-10 px-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between z-10">
      {/* Device toggles */}
      <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
        {devices.map((device) => (
          <button
            key={device.id}
            onClick={() => onModeChange(device.id)}
            className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-all ${
              mode === device.id
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={`${device.label} (${device.width})`}
          >
            {device.icon}
            <span className="hidden sm:inline">{device.label}</span>
          </button>
        ))}
      </div>

      {/* Grid and Refresh */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleGrid}
          className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all border ${
            showGrid
              ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
          title="Toggle Canvas Grid"
        >
          <Grid className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden md:inline">Grid</span>
        </button>

        <button
          onClick={onRefresh}
          className="p-1.5 bg-slate-900/60 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs transition-all"
          title="Re-render Canvas"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
