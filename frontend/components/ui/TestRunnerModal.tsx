'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Zap,
  Check,
  X,
  Terminal,
} from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'passed' | 'failed';
  durationMs?: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRunSuccess: () => void;
  onLogOutput: (log: string) => void;
}

export function TestRunnerModal({ isOpen, onClose, onRunSuccess, onLogOutput }: Props) {
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: 'tc1',
      name: 'test_idempotency_header_presence',
      description: 'Asserts x-idempotency-key UUID header attached to /api/mock/checkout requests',
      status: 'idle',
    },
    {
      id: 'tc2',
      name: 'test_rapid_double_tap_mutex_lock',
      description: 'Simulates 50ms rapid double-click; asserts UI lock blocks secondary HTTP trigger',
      status: 'idle',
    },
    {
      id: 'tc3',
      name: 'test_conflict_409_graceful_recovery',
      description: 'Verifies backend 409 Conflict return returns idempotent receipt without double charge',
      status: 'idle',
    },
    {
      id: 'tc4',
      name: 'test_network_timeout_fallback',
      description: 'Ensures button lock resets gracefully after 10s if network drops',
      status: 'idle',
    },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [allPassed, setAllPassed] = useState(false);

  if (!isOpen) return null;

  const runSuite = async () => {
    setIsRunning(true);
    setAllPassed(false);
    onLogOutput(`[${new Date().toLocaleTimeString()}] 🧪 STARTING DEVHUDDLE AUTOMATED TEST SUITE v2.4.0`);

    const updated = [...testCases];

    for (let i = 0; i < updated.length; i++) {
      updated[i].status = 'running';
      setTestCases([...updated]);
      onLogOutput(`[RUNNING] ${updated[i].name}...`);

      const latency = Math.floor(Math.random() * 200) + 150;
      await new Promise((resolve) => setTimeout(resolve, latency));

      updated[i].status = 'passed';
      updated[i].durationMs = latency;
      setTestCases([...updated]);
      onLogOutput(`[PASSED] ${updated[i].name} (${latency}ms)`);
    }

    setIsRunning(false);
    setAllPassed(true);
    onLogOutput(`[SUCCESS] 4/4 Integration assertions PASSED. Ready for Production Deployment!`);
    onRunSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#121318] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#161822]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">DevHuddle Automated Test Runner</h2>
              <p className="text-xs text-slate-400 font-mono">Order Checkout Idempotency Suite #8420</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex flex-col gap-4 bg-[#0a0a0c]">
          <div className="flex flex-col gap-2">
            {testCases.map((tc) => (
              <div
                key={tc.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  tc.status === 'passed'
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : tc.status === 'running'
                    ? 'bg-cyan-950/20 border-cyan-500/40 animate-pulse'
                    : 'bg-[#12141d] border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  {tc.status === 'passed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  ) : tc.status === 'running' ? (
                    <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mt-0.5 shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-600 mt-0.5 shrink-0" />
                  )}

                  <div>
                    <div className="text-xs font-mono font-bold text-slate-200">{tc.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{tc.description}</div>
                  </div>
                </div>

                {tc.durationMs && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {tc.durationMs}ms
                  </span>
                )}
              </div>
            ))}
          </div>

          {allPassed && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold">ALL VERIFICATION TESTS PASSED!</div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Ticket INC-8420 marked as RESOLVED. Solution deployment verified against race condition bugs.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-[#161822] flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            {isRunning ? 'Running integration tests...' : allPassed ? 'Status: 4/4 Passed' : 'Ready to execute'}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={runSuite}
              disabled={isRunning}
              className={`px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                isRunning
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              {isRunning ? 'Executing...' : 'Run Integration Suite'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
