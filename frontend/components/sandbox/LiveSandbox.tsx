'use client';

import React, { useState } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
} from '@codesandbox/sandpack-react';
import { Play, RotateCcw, AlertTriangle, ShieldCheck, Cpu, Code, Eye } from 'lucide-react';

const BUGGY_CHECKOUT_CODE = `import React, { useState } from 'react';

export default function CheckoutCard() {
  const [loading, setLoading] = useState(false);
  const [chargeCount, setChargeCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isIdempotentFixed, setIsIdempotentFixed] = useState(false);

  const triggerPayment = async () => {
    // BUGGY PATH: No lock check when isIdempotentFixed is false!
    if (isIdempotentFixed && loading) {
      setLogs((prev) => [...prev, '🔒 Lock Active: Blocked rapid double-click attempt!']);
      return;
    }

    setLoading(true);
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, \`[\${timestamp}] 🚀 Initiating payment payload...\`]);

    try {
      // Simulate 600ms API latency
      await new Promise((resolve) => setTimeout(resolve, 600));
      setChargeCount((prev) => prev + 1);
      setLogs((prev) => [...prev, \`[\${timestamp}] ✅ Charge Approved! Total Charges: \${chargeCount + 1}\`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 p-6 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-md bg-[#12141d] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            DevHuddle Live Sandbox
          </span>
          <span className="text-xs text-slate-400 font-mono">Order #8420</span>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Enterprise License Upgrade</h2>
          <p className="text-xs text-slate-400 mt-1">1x Annual Tier (Production Multi-node cluster)</p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-[#1a1d2b] border border-slate-800">
          <span className="text-sm font-medium text-slate-300">Total Amount Due</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono">$149.00</span>
        </div>

        {/* Idempotency Fix Mode Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#161824] border border-slate-800 text-xs">
          <span className="text-slate-300 font-medium">Idempotency Lock (Fix):</span>
          <button
            onClick={() => setIsIdempotentFixed(!isIdempotentFixed)}
            className={\`px-3 py-1 rounded-md font-mono font-bold transition-all \${
              isIdempotentFixed
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }\`}
          >
            {isIdempotentFixed ? 'ENABLED (Patched)' : 'DISABLED (Buggy)'}
          </button>
        </div>

        {/* Main Pay Button */}
        <button
          onClick={triggerPayment}
          className={\`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 \${
            loading && isIdempotentFixed
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-80'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95 shadow-emerald-500/20'
          }\`}
        >
          {loading ? 'Processing Payment...' : 'Pay $149.00 Now'}
        </button>

        {/* Diagnostic Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-[#161824] border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-mono text-slate-400">Total Billed Count</div>
            <div className={\`text-xl font-bold font-mono mt-0.5 \${chargeCount > 1 ? 'text-red-400 animate-pulse' : 'text-slate-100'}\`}>
              {chargeCount} {chargeCount > 1 ? '⚠️ DUPLICATE!' : ''}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#161824] border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-mono text-slate-400">Request Lock State</div>
            <div className="text-xs font-bold font-mono mt-1 text-emerald-400">
              {loading ? 'BUSY (350ms)' : 'IDLE'}
            </div>
          </div>
        </div>

        {/* Real-time Log Stream */}
        <div className="flex flex-col gap-1.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Sandbox Stream Log</div>
          <div className="bg-[#0c0d13] p-3 rounded-lg border border-slate-800 font-mono text-[11px] h-28 overflow-y-auto text-slate-300 flex flex-col gap-1">
            {logs.length === 0 ? (
              <span className="text-slate-600 italic">Click the pay button to record events...</span>
            ) : (
              logs.map((log, idx) => <div key={idx}>{log}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
`;

export function LiveSandbox() {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'split'>('split');

  return (
    <div className="h-full w-full bg-[#0a0a0c] flex flex-col overflow-hidden">
      {/* Sandbox Sub-Header Control Bar */}
      <div className="h-11 bg-[#121318] border-b border-slate-800 flex items-center justify-between px-4 select-none shrink-0">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold font-mono text-slate-200">
            Sandpack React 18 Runtime
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Vite Hot Reload
          </span>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1 bg-[#181a22] p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('split')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'split' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Split View
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'editor' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Code Only
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview Only
          </button>
        </div>
      </div>

      {/* Main Sandpack Instance */}
      <div className="flex-1 w-full overflow-hidden">
        <SandpackProvider
          template="react-ts"
          theme="dark"
          files={{
            '/App.tsx': BUGGY_CHECKOUT_CODE,
          }}
          options={{
            externalResources: ['https://cdn.tailwindcss.com'],
          }}
        >
          <SandpackLayout className="h-full border-none rounded-none bg-[#0a0a0c]">
            {(activeTab === 'split' || activeTab === 'editor') && (
              <SandpackCodeEditor
                showLineNumbers
                showInlineErrors
                wrapContent
                className="h-full flex-1 font-mono text-xs border-r border-slate-800"
              />
            )}
            {(activeTab === 'split' || activeTab === 'preview') && (
              <div className="h-full flex-1 flex flex-col bg-[#090a0f]">
                <SandpackPreview
                  showNavigator={false}
                  showOpenInCodeSandbox={false}
                  className="h-full flex-1"
                />
              </div>
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
}
