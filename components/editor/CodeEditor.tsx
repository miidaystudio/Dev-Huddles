'use client';

import React, { useState } from 'react';
import { Code2, Copy, Check, Eye } from 'lucide-react';
import { MotionPayload } from '@/types/motion';

interface CodeEditorProps {
  payload: MotionPayload;
  onChangeCode?: (newCode: string) => void;
}

export function CodeEditor({ payload, onChangeCode }: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState<'jsx' | 'json'>('jsx');
  const [copied, setCopied] = useState(false);

  const currentContent = activeTab === 'jsx' 
    ? payload.jsxCode 
    : JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800">
      {/* Editor Header */}
      <div className="h-10 px-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('jsx')}
            className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'jsx'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> Component.tsx
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'json'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> MotionPayload.json
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-all text-xs flex items-center gap-1"
          title="Copy Code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-3 overflow-auto font-mono text-xs text-indigo-100 leading-relaxed scrollbar-thin">
        <textarea
          value={currentContent}
          onChange={(e) => onChangeCode && activeTab === 'jsx' && onChangeCode(e.target.value)}
          readOnly={activeTab === 'json'}
          className="w-full h-full bg-transparent resize-none focus:outline-none text-slate-300 font-mono text-xs leading-relaxed"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
