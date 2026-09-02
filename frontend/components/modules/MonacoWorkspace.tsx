'use client';

import React, { useEffect, useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { FileCode, Users, Wifi, WifiOff, Code2, Copy, CheckCircle2 } from 'lucide-react';
import { CustomYMonacoBinding } from '@/lib/y-monaco-binding';

interface Props {
  roomId?: string;
  userName?: string;
  userColor?: string;
}

const DEFAULT_INCIDENT_CODE = `'use client';

import { useState, useCallback } from 'react';

/**
 * TICKET #ENG-402: Idempotent Checkout Hook Fix
 * Ensures single-flight execution for payment submit actions.
 */
export function useIdempotentCheckout() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processPayment = useCallback(async (cartId: string, amount: number) => {
    // 1. Concurrency Guard (Mutex lock)
    if (isSubmitting) {
      console.warn('[DEVHUDDLE OPS] Payment request already in-flight. Blocking duplicate click.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // 2. Generate unique idempotency key for payload header lock
    const idempotencyKey = \`idemp_\${cartId}_\${Date.now()}_\${Math.random().toString(36).substring(2, 7)}\`;

    try {
      const response = await fetch('/api/v1/checkout/process?latency=350', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-idempotency-key': idempotencyKey,
        },
        body: JSON.stringify({ cartId, amount, currency: 'USD' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment processing failed');
      }

      setLastTxId(data.transaction?.id || data.transactionId);
      return data;
    } catch (err: any) {
      setError(err.message || 'Payment execution error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  return { processPayment, isSubmitting, lastTxId, error };
}
`;

export function MonacoWorkspace({
  roomId = 'ENG-402',
  userName = 'DevHuddle Ops',
  userColor = '#10b981',
}: Props) {
  const [language, setLanguage] = useState<string>('typescript');
  const [code, setCode] = useState<string>(DEFAULT_INCIDENT_CODE);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [peerCount, setPeerCount] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);

  const editorRef = useRef<any>(null);
  const ydocRef = useRef<any>(null);
  const providerRef = useRef<any>(null);
  const bindingRef = useRef<CustomYMonacoBinding | null>(null);

  const handleEditorMount: OnMount = async (editor) => {
    editorRef.current = editor;

    try {
      const Y = await import('yjs');
      const { WebsocketProvider } = await import('y-websocket');

      const ydoc = new Y.Doc();
      ydocRef.current = ydoc;

      const wsProvider = new WebsocketProvider(
        'wss://demos.yjs.dev',
        `devhuddle-cockpit-${roomId}`,
        ydoc
      );

      providerRef.current = wsProvider;

      wsProvider.on('status', (event: { status: string }) => {
        setIsConnected(event.status === 'connected');
      });

      wsProvider.awareness.setLocalStateField('user', {
        name: userName,
        color: userColor,
      });

      wsProvider.awareness.on('change', () => {
        const states = Array.from(wsProvider.awareness.getStates().values());
        setPeerCount(states.length || 2);
      });

      const ytext = ydoc.getText(`monaco-doc-${roomId}`);

      // Instantiate Custom Yjs Monaco binding
      const binding = new CustomYMonacoBinding(ytext, editor, wsProvider.awareness);
      bindingRef.current = binding;
    } catch (err) {
      console.warn('Yjs CRDT initialization fallback:', err);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
      if (providerRef.current && typeof providerRef.current.destroy === 'function') {
        providerRef.current.destroy();
      }
      if (ydocRef.current && typeof ydocRef.current.destroy === 'function') {
        ydocRef.current.destroy();
      }
    };
  }, []);

  const handleCopyCode = () => {
    if (editorRef.current) {
      const val = editorRef.current.getValue();
      navigator.clipboard.writeText(val);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-full w-full bg-[#08090C] flex flex-col overflow-hidden">
      {/* Monaco Sub-Header Toolbar */}
      <div className="h-11 bg-[#111318] border-b border-[#1F242F] flex items-center justify-between px-4 select-none shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-200">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">useIdempotentCheckout.ts</span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-[#08090C] px-2.5 py-1 rounded-lg border border-[#1F242F] text-xs font-mono">
            <Code2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="json">JSON</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>
          </div>
        </div>

        {/* Real-time CRDT & Presence Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08090C] border border-[#1F242F] text-[11px] font-mono">
            {isConnected ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Wifi className="w-3 h-3 animate-pulse" />
                Yjs Live CRDT Active
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400">
                <WifiOff className="w-3 h-3" />
                Offline Mode (Local Doc)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08090C] border border-[#1F242F] text-[11px] font-mono text-slate-300">
            <Users className="w-3 h-3 text-cyan-400" />
            <span>{peerCount} Multi-cursors Active</span>
          </div>

          <button
            onClick={handleCopyCode}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#111318] rounded transition-colors"
            title="Copy Monaco Code"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Monaco Editor Component with MINIMAP DISABLED */}
      <div className="flex-1 w-full bg-[#08090C] relative">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onMount={handleEditorMount}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            lineNumbersMinChars: 3,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'all',
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}
