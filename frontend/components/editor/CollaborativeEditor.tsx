'use client';

import React, { useEffect, useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { FileCode, Users, Wifi, WifiOff, CheckCircle2, Copy } from 'lucide-react';
import { CustomYMonacoBinding } from '@/lib/y-monaco-binding';

interface FileState {
  id: string;
  name: string;
  language: string;
  content: string;
}

const DEFAULT_FILES: FileState[] = [
  {
    id: 'pay-button',
    name: 'PayButton.tsx',
    language: 'typescript',
    content: `'use client';

import React, { useState } from 'react';

interface PayButtonProps {
  cartId: string;
  amount: number;
  onSuccess?: (txId: string) => void;
}

export function PayButton({ cartId, amount, onSuccess }: PayButtonProps) {
  // INCIDENT FIX: Track submission state & idempotency token to prevent double-charges
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const idempotencyKey = \`idemp_\${cartId}_\${Date.now()}_\${Math.random().toString(36).substring(2, 7)}\`;

    try {
      const response = await fetch('/api/mock/checkout?latency=400', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-idempotency-key': idempotencyKey,
        },
        body: JSON.stringify({
          cartId,
          amount,
          currency: 'USD',
          paymentMethod: 'credit_card',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment processing failed');
      }

      const txId = data.transaction?.id || data.transactionId;
      setLastTxId(txId);
      if (onSuccess) onSuccess(txId);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-white w-full max-w-md">
      <div className="flex justify-between items-center text-sm font-semibold">
        <span className="text-slate-400">Order #8420 Total</span>
        <span className="text-emerald-400 text-lg font-mono">\${amount.toFixed(2)}</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isSubmitting}
        className={\`w-full py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 \${
          isSubmitting
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed animate-pulse'
            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-[0.98]'
        }\`}
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            Processing Order Lock...
          </>
        ) : (
          \`Pay \${amount.toFixed(2)} Now\`
        )}
      </button>

      {lastTxId && (
        <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          ✓ Success! Transaction ID: {lastTxId}
        </div>
      )}

      {errorMessage && (
        <div className="p-2.5 rounded bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono">
          ⚠ {errorMessage}
        </div>
      )}
    </div>
  );
}
`,
  },
];

interface Props {
  roomId?: string;
  userName?: string;
  userColor?: string;
}

export function CollaborativeEditor({
  roomId = 'devhuddle-room-1',
  userName = 'Developer',
  userColor = '#10b981',
}: Props) {
  const [files, setFiles] = useState<FileState[]>(DEFAULT_FILES);
  const [activeFileId, setActiveFileId] = useState<string>('pay-button');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [peerCount, setPeerCount] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const editorRef = useRef<any>(null);
  const ydocRef = useRef<any>(null);
  const providerRef = useRef<any>(null);
  const bindingRef = useRef<CustomYMonacoBinding | null>(null);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  const handleEditorMount: OnMount = async (editor) => {
    editorRef.current = editor;

    try {
      const Y = await import('yjs');
      const { WebsocketProvider } = await import('y-websocket');

      const ydoc = new Y.Doc();
      ydocRef.current = ydoc;

      const wsProvider = new WebsocketProvider(
        'wss://demos.yjs.dev',
        `devhuddle-room-${roomId}`,
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
        setPeerCount(states.length);
      });

      const ytext = ydoc.getText(`monaco-${activeFile.id}`);

      const binding = new CustomYMonacoBinding(ytext, editor, wsProvider.awareness);
      bindingRef.current = binding;
    } catch (err) {
      console.warn('Yjs websocket connection fallback to local state:', err);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    return () => {
      if (bindingRef.current) bindingRef.current.destroy();
      if (providerRef.current) providerRef.current.destroy();
      if (ydocRef.current) ydocRef.current.destroy();
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
    <div className="h-full w-full bg-[#0a0a0c] flex flex-col overflow-hidden">
      {/* Editor Sub-Header Toolbar */}
      <div className="h-11 bg-[#121318] border-b border-slate-800 flex items-center justify-between px-4 select-none shrink-0">
        {/* File Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {files.map((file) => {
            const isActive = file.id === activeFileId;
            return (
              <button
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-t-md text-xs font-mono transition-all border-b-2 ${
                  isActive
                    ? 'bg-[#0a0a0c] text-emerald-400 border-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                {file.name}
              </button>
            );
          })}
        </div>

        {/* Real-time Collaboration Status & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181a22] border border-slate-800 text-[11px] font-mono">
            {isConnected ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Wifi className="w-3 h-3 animate-pulse" />
                Yjs Live CRDT Sync
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400">
                <WifiOff className="w-3 h-3" />
                Offline Mode (Local Doc)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#181a22] border border-slate-800 text-[11px] font-mono text-slate-300">
            <Users className="w-3 h-3 text-cyan-400" />
            <span>{peerCount} Active Peers</span>
          </div>

          <button
            onClick={handleCopyCode}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Copy Editor Code"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full bg-[#0a0a0c] relative">
        <Editor
          height="100%"
          language={activeFile.language}
          value={activeFile.content}
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
