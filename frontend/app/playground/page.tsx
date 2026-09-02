'use client';

import React, { useState } from 'react';
import { Toolbar } from '@/components/editor/Toolbar';
import { PromptBar } from '@/components/editor/PromptBar';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { SandboxFrame } from '@/components/preview/SandboxFrame';
import { ViewportControls } from '@/components/preview/ViewportControls';
import { InspectorPanel } from '@/components/inspector/InspectorPanel';
import { INITIAL_BENTO_GRID, INITIAL_HERO_CARD, DEFAULT_TEMPLATES } from '@/lib/templates/initial-components';
import { MotionPayload, ViewportMode } from '@/types/motion';

export default function PlaygroundPage() {
  const [payload, setPayload] = useState<MotionPayload>(INITIAL_BENTO_GRID);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [renderKey, setRenderKey] = useState<number>(0);

  const handleReplay = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setRenderKey(prev => prev + 1);
      setIsPlaying(true);
    }, 50);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-motion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.payload) {
        setPayload(data.payload);
        handleReplay();
      }
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const found = DEFAULT_TEMPLATES.find(t => t.id === templateId);
    if (found) {
      setPayload(found);
      handleReplay();
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Top Main Toolbar */}
      <Toolbar
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onReplay={handleReplay}
        playbackSpeed={playbackSpeed}
        onSpeedChange={setPlaybackSpeed}
        payload={payload}
        onTemplateSelect={handleTemplateSelect}
      />

      {/* AI Prompt Header Bar */}
      <PromptBar onGenerate={handleGenerate} isLoading={isGenerating} />

      {/* Main 3-Column Studio Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Column: Code Editor */}
        <div className="w-[340px] shrink-0 border-r border-slate-800 hidden lg:block">
          <CodeEditor
            payload={payload}
            onChangeCode={(newJsx) => setPayload({ ...payload, jsxCode: newJsx })}
          />
        </div>

        {/* Center Column: Sandbox Preview Canvas */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
          <ViewportControls
            mode={viewportMode}
            onModeChange={setViewportMode}
            showGrid={showGrid}
            onToggleGrid={() => setShowGrid(!showGrid)}
            onRefresh={handleReplay}
          />
          
          <SandboxFrame
            payload={payload}
            viewportMode={viewportMode}
            showGrid={showGrid}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            renderKey={renderKey}
          />
        </div>

        {/* Right Column: Motion Inspector Panel */}
        <div className="shrink-0">
          <InspectorPanel
            payload={payload}
            onUpdatePayload={(updated) => {
              setPayload(updated);
            }}
          />
        </div>
      </div>
    </div>
  );
}
