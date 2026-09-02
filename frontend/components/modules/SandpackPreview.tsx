'use client';

import React, { useState } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview as SandpackFrame,
} from '@codesandbox/sandpack-react';
import { Cpu, Code, Eye, Layers } from 'lucide-react';

const SANDPACK_APP_CODE = `import React, { useState } from 'react';

export default function CheckoutCockpitApp() {
  const [loading, setLoading] = useState(false);
  const [chargeCount, setChargeCount] = useState(0);
  const [isIdempotentFixed, setIsIdempotentFixed] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleCheckout = async () => {
    // Check mutex lock
    if (isIdempotentFixed && loading) {
      setLogs((prev) => [...prev, '🔒 MUTEX LOCK: Blocked secondary click attempt!']);
      return;
    }

    setLoading(true);
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, \`[\${timestamp}] 🚀 POST /api/v1/checkout/process\`]);

    try {
      await new Promise((res) => setTimeout(res, 500));
      setChargeCount((prev) => prev + 1);
      setLogs((prev) => [...prev, \`[\${timestamp}] ✅ Charge Approved! Total Charges: \${chargeCount + 1}\`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 p-6 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-md bg-[#111318] border border-[#1F242F] rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            DevHuddle Sandpack Iframe
          </span>
          <span className="text-xs text-slate-400 font-mono">ENG-402</span>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Enterprise Tier License</h2>
          <p className="text-xs text-slate-400 mt-1">Multi-node cluster authorization</p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-[#08090C] border border-[#1F242F]">
          <span className="text-sm font-medium text-slate-300">Total Billed</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono">$149.00</span>
        </div>

        {/* Idempotent Fix Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#161922] border border-[#1F242F] text-xs">
          <span className="text-slate-300 font-medium font-mono">Mutex Lock (Fix):</span>
          <button
            onClick={() => setIsIdempotentFixed(!isIdempotentFixed)}
            className={\`px-3 py-1.5 rounded-lg font-mono font-bold transition-all \${
              isIdempotentFixed
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }\`}
          >
            {isIdempotentFixed ? 'PATCHED (Locked)' : 'BUGGY (Double Charge)'}
          </button>
        </div>

        {/* Submit Pay Button */}
        <button
          onClick={handleCheckout}
          className={\`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 \${
            loading && isIdempotentFixed
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-80'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95 shadow-emerald-500/20'
          }\`}
        >
          {loading ? 'Executing Payment Lock...' : 'Pay $149.00 Now'}
        </button>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 font-mono text-center">
          <div className="p-3 rounded-xl bg-[#08090C] border border-[#1F242F]">
            <div className="text-[10px] text-slate-400 uppercase">Charges Executed</div>
            <div className={\`text-lg font-bold mt-0.5 \${chargeCount > 1 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}\`}>
              {chargeCount} {chargeCount > 1 ? '⚠️ DUPLICATE' : ''}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#08090C] border border-[#1F242F]">
            <div className="text-[10px] text-slate-400 uppercase">In-flight State</div>
            <div className="text-xs font-bold mt-1 text-slate-200">
              {loading ? 'BUSY (500ms)' : 'IDLE'}
            </div>
          </div>
        </div>

        {/* Live Event Stream */}
        <div className="bg-[#040507] p-3 rounded-xl border border-[#1F242F] font-mono text-[11px] h-24 overflow-y-auto text-slate-300 flex flex-col gap-1">
          {logs.length === 0 ? (
            <span className="text-slate-600 italic">Click pay button to log event stream...</span>
          ) : (
            logs.map((log, idx) => <div key={idx}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  );
}
`;

export function SandpackPreview() {
  const [viewMode, setViewMode] = useState<'split' | 'code' | 'preview'>('split');

  return (
    <div className="h-full w-full bg-[#08090C] flex flex-col overflow-hidden">
      {/* Sub-Header Controls */}
      <div className="h-11 bg-[#111318] border-b border-[#1F242F] flex items-center justify-between px-4 select-none shrink-0">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-200">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">Sandpack React 18 Live Runtime</span>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center gap-1 bg-[#08090C] p-1 rounded-lg border border-[#1F242F] text-xs font-mono">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              viewMode === 'split' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Split
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              viewMode === 'code' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Code
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              viewMode === 'preview' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>
      </div>

      {/* Main Sandpack Instance */}
      <div className="flex-1 w-full overflow-hidden">
        <SandpackProvider
          template="react-ts"
          theme="dark"
          files={{
            '/App.tsx': SANDPACK_APP_CODE,
          }}
          options={{
            externalResources: ['https://cdn.tailwindcss.com'],
          }}
        >
          <SandpackLayout className="h-full border-none rounded-none bg-[#08090C]">
            {(viewMode === 'split' || viewMode === 'code') && (
              <SandpackCodeEditor
                showLineNumbers
                showInlineErrors
                wrapContent
                className="h-full flex-1 font-mono text-xs border-r border-[#1F242F]"
              />
            )}
            {(viewMode === 'split' || viewMode === 'preview') && (
              <div className="h-full flex-1 flex flex-col bg-[#08090C]">
                <SandpackFrame
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
