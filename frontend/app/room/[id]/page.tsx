'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  FileText,
  Code2,
  Play,
  Radio,
  PanelRight,
  ShieldCheck,
  Zap,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';

// Module Imports
import { IncidentSpec } from '@/components/modules/IncidentSpec';
import { ApiInspector } from '@/components/modules/ApiInspector';
import { HuddleDrawer } from '@/components/modules/HuddleDrawer';
import { TestRunnerModal } from '@/components/ui/TestRunnerModal';

// Client-only dynamic imports with ssr: false for Monaco & Sandpack
const MonacoWorkspace = dynamic(
  () => import('@/components/modules/MonacoWorkspace').then((m) => m.MonacoWorkspace),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-[#08090C] flex items-center justify-center font-mono text-xs text-neutral-400">
        <span className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mr-2" />
        Loading Collaborative Monaco Workspace...
      </div>
    ),
  }
);

const SandpackPreview = dynamic(
  () => import('@/components/modules/SandpackPreview').then((m) => m.SandpackPreview),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-[#08090C] flex items-center justify-center font-mono text-xs text-neutral-400">
        <span className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mr-2" />
        Mounting Sandpack Live Iframe Runtime...
      </div>
    ),
  }
);

type ActiveTab = 'spec' | 'monaco' | 'sandpack' | 'api';

const USER_PRESENCE = [
  { id: '1', name: 'Vikram Dev (VD)', avatar: 'VD', color: '#10b981' },
  { id: '2', name: 'Alex Kumar (AK)', avatar: 'AK', color: '#06b6d4' },
];

export default function DevHuddleCockpitRoom() {
  const params = useParams();
  const roomId = (params?.id as string) || 'ENG-402';

  const [activeTab, setActiveTab] = useState<ActiveTab>('spec');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);
  const [ticketStatus, setTicketStatus] = useState<'CRITICAL' | 'RESOLVED'>('CRITICAL');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] DEVHUDDLE // OPS Cockpit Initialized`,
    `[${new Date().toLocaleTimeString()}] Room Ticket: #ENG-402 (Fix Race Condition in Checkout Hook)`,
    `[${new Date().toLocaleTimeString()}] Yjs multi-cursor CRDT provider active`,
    `[${new Date().toLocaleTimeString()}] Sandpack React 18 live iframe mounted`,
  ]);

  // Keyboard shortcut listener: Ctrl + \ toggles slide-over drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '\\') {
        e.preventDefault();
        setIsDrawerOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addLog = (log: string) => {
    setTerminalLogs((prev) => [...prev, log]);
  };

  return (
    <div className="h-screen w-screen bg-[#08090C] text-neutral-100 flex flex-col overflow-hidden select-none font-sans">
      {/* 1. TOP HUD BAR (Height 56px / h-14) */}
      <header className="h-14 bg-[#090A0E] border-b border-white/[0.08] px-5 flex items-center justify-between z-40 shrink-0">
        {/* Left: Brand & Incident Badge */}
        <div className="flex items-center gap-4">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
            title="Back to DevHuddle Operations Dashboard"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold text-xs font-mono tracking-wider text-neutral-100 flex items-center gap-1">
              DEVHUDDLE <span className="text-emerald-400">// OPS</span>
            </span>
          </Link>

          <div className="h-4 w-[1px] bg-white/[0.08] hidden sm:block" />

          {/* Active Incident Badge */}
          <div className="flex items-center gap-2">
            <span className="bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 text-xs text-neutral-300 font-mono flex items-center gap-2 rounded hidden md:flex">
              Ticket #ENG-402: Fix Race Condition in Checkout Hook
            </span>
            {ticketStatus === 'CRITICAL' ? (
              <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-mono px-2 py-0.5 rounded flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                P1 CRITICAL
              </span>
            ) : (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono px-2 py-0.5 rounded flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                RESOLVED
              </span>
            )}
          </div>
        </div>

        {/* Center: Segmented Mode Switcher Tabs */}
        <nav className="flex items-center bg-white/[0.03] border border-white/[0.06] p-1 rounded-lg gap-1">
          <button
            onClick={() => setActiveTab('spec')}
            className={`text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-2 transition ${
              activeTab === 'spec'
                ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Incident Spec</span>
          </button>

          <button
            onClick={() => setActiveTab('monaco')}
            className={`text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-2 transition ${
              activeTab === 'monaco'
                ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Collaborative Monaco</span>
          </button>

          <button
            onClick={() => setActiveTab('sandpack')}
            className={`text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-2 transition ${
              activeTab === 'sandpack'
                ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Live App Preview (Sandpack)</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-2 transition ${
              activeTab === 'api'
                ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>API Inspector</span>
          </button>
        </nav>

        {/* Right Side: Presence Stack, Drawer Toggle & Primary Test Runner */}
        <div className="flex items-center gap-3">
          {/* User presence avatar stack */}
          <div className="hidden md:flex items-center -space-x-2">
            {USER_PRESENCE.map((user) => (
              <div
                key={user.id}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-slate-950 border border-black/40 shadow-sm"
                style={{ backgroundColor: user.color }}
                title={user.name}
              >
                {user.avatar}
              </div>
            ))}
          </div>

          {/* Slide Drawer Trigger (Ctrl+\) */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="border border-white/[0.08] hover:bg-white/[0.04] text-neutral-300 text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
            title="Toggle Slide Drawer (Ctrl+\\)"
          >
            <PanelRight className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px] hidden xl:inline">Slide Drawer (Ctrl+\)</span>
          </button>

          {/* Primary Action Button: Run Test Suite */}
          <button
            onClick={() => setIsTestModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs px-3.5 py-1.5 rounded-md flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Run Test Suite</span>
          </button>
        </div>
      </header>

      {/* 2. FULL-BLEED VIEWPORT SWITCHING (display: none / block via hidden class) */}
      <main className="flex-1 w-full relative overflow-hidden bg-[#08090C]">
        {/* Module 1: Incident Spec */}
        <div className={`h-full w-full ${activeTab === 'spec' ? 'block' : 'hidden'}`}>
          <IncidentSpec />
        </div>

        {/* Module 2: Collaborative Monaco */}
        <div className={`h-full w-full ${activeTab === 'monaco' ? 'block' : 'hidden'}`}>
          <MonacoWorkspace roomId={roomId} />
        </div>

        {/* Module 3: Live App Preview (Sandpack) */}
        <div className={`h-full w-full ${activeTab === 'sandpack' ? 'block' : 'hidden'}`}>
          <SandpackPreview />
        </div>

        {/* Module 4: API Inspector */}
        <div className={`h-full w-full ${activeTab === 'api' ? 'block' : 'hidden'}`}>
          <ApiInspector />
        </div>
      </main>

      {/* 3. SLIDE-OVER RIGHT DRAWER (Ctrl+\) */}
      <HuddleDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        terminalLogs={terminalLogs}
        onClearLogs={() => setTerminalLogs([])}
      />

      {/* TEST RUNNER MODAL */}
      <TestRunnerModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onRunSuccess={() => setTicketStatus('RESOLVED')}
        onLogOutput={addLog}
      />
    </div>
  );
}
