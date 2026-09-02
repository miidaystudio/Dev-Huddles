'use client';

import React, { useState } from 'react';
import { Sliders, Layers, Settings2, Sparkles, RefreshCw } from 'lucide-react';
import { MotionPayload, MotionLayer, EaseType } from '@/types/motion';
import { SliderControl } from './SliderControl';
import { EasePicker } from './EasePicker';

interface InspectorPanelProps {
  payload: MotionPayload;
  onUpdatePayload: (updated: MotionPayload) => void;
}

export function InspectorPanel({ payload, onUpdatePayload }: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<'props' | 'layers'>('layers');
  const [selectedLayerId, setSelectedLayerId] = useState<string>(
    payload.layers[0]?.id || ''
  );

  const selectedLayer = payload.layers.find((l) => l.id === selectedLayerId);

  const handlePropChange = (propId: string, newValue: any) => {
    const updatedProps = payload.controllableProps.map((p) =>
      p.id === propId ? { ...p, value: newValue } : p
    );
    onUpdatePayload({ ...payload, controllableProps: updatedProps });
  };

  const handleLayerChange = (layerId: string, updates: Partial<MotionLayer>) => {
    const updatedLayers = payload.layers.map((l) =>
      l.id === layerId ? { ...l, ...updates } : l
    );
    onUpdatePayload({ ...payload, layers: updatedLayers });
  };

  return (
    <aside className="w-80 border-l border-slate-800 bg-slate-950 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="h-12 border-b border-slate-800 px-4 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2 text-slate-100 font-semibold text-xs uppercase tracking-wider">
          <Settings2 className="w-4 h-4 text-indigo-400" /> Motion Inspector
        </div>
        <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('layers')}
            className={`px-2.5 py-1 text-xs font-medium rounded ${
              activeTab === 'layers'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Layers ({payload.layers.length})
          </button>
          <button
            onClick={() => setActiveTab('props')}
            className={`px-2.5 py-1 text-xs font-medium rounded ${
              activeTab === 'props'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Props ({payload.controllableProps.length})
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {activeTab === 'layers' && (
          <div className="space-y-4">
            {/* Layer List Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> Animation Layers
              </label>
              <div className="space-y-1">
                {payload.layers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayerId(layer.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                      selectedLayerId === layer.id
                        ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-200'
                        : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-medium truncate">{layer.name}</span>
                    <span className="font-mono text-[10px] text-slate-500 truncate">{layer.selector}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Layer Controls */}
            {selectedLayer ? (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>Layer Parameters</span>
                  <span className="text-indigo-400 font-mono text-[10px]">{selectedLayer.selector}</span>
                </div>

                <SliderControl
                  label="Duration"
                  value={selectedLayer.duration}
                  min={0.1}
                  max={3.0}
                  step={0.05}
                  unit="s"
                  onChange={(val) => handleLayerChange(selectedLayer.id, { duration: val })}
                />

                <SliderControl
                  label="Delay"
                  value={selectedLayer.delay}
                  min={0}
                  max={2.0}
                  step={0.05}
                  unit="s"
                  onChange={(val) => handleLayerChange(selectedLayer.id, { delay: val })}
                />

                <SliderControl
                  label="Y Offset"
                  value={selectedLayer.y ?? 0}
                  min={-100}
                  max={100}
                  step={5}
                  unit="px"
                  onChange={(val) => handleLayerChange(selectedLayer.id, { y: val })}
                />

                <SliderControl
                  label="Initial Scale"
                  value={selectedLayer.scale ?? 1}
                  min={0.5}
                  max={1.5}
                  step={0.05}
                  onChange={(val) => handleLayerChange(selectedLayer.id, { scale: val })}
                />

                <EasePicker
                  value={selectedLayer.ease}
                  onChange={(ease: EaseType) => handleLayerChange(selectedLayer.id, { ease })}
                />
              </div>
            ) : (
              <div className="text-xs text-slate-500 text-center py-6">Select a layer to edit properties.</div>
            )}
          </div>
        )}

        {activeTab === 'props' && (
          <div className="space-y-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Dynamic Knobs
            </div>

            {payload.controllableProps.length > 0 ? (
              payload.controllableProps.map((prop) => (
                <SliderControl
                  key={prop.id}
                  label={prop.name}
                  value={prop.value as number}
                  min={prop.min ?? 0}
                  max={prop.max ?? 10}
                  step={prop.step ?? 0.1}
                  unit={prop.unit || ''}
                  description={prop.description}
                  onChange={(val) => handlePropChange(prop.id, val)}
                />
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">No custom controllable props for this component.</p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
