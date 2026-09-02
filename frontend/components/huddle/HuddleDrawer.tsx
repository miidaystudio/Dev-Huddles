'use client';

import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Users,
  Terminal,
  Send,
  Sparkles,
  ShieldCheck,
  Circle,
  Copy,
  Check,
  Maximize2,
  Trash2,
  Code,
  ThumbsUp,
  Heart,
  Flame,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  terminalLogs: string[];
  onClearLogs?: () => void;
}

interface ChatMessage {
  id: string;
  user: string;
  color: string;
  avatar: string;
  time: string;
  text: string;
  isCode?: boolean;
  reactions?: Record<string, number>;
}

const DEFAULT_PEERS = [
  { name: 'Sarah Chen', role: 'Staff SRE', color: '#10b981', status: 'In Shared IDE', active: true },
  { name: 'Alex Rivera', role: 'Frontend Lead', color: '#06b6d4', status: 'In Sandpack Preview', active: true },
  { name: 'Marcus Vance', role: 'Backend Security', color: '#a855f7', status: 'Inspecting API Payload', active: true },
  { name: 'You (DevHuddle)', role: 'Contributor', color: '#f59e0b', status: 'Live Session', active: true },
];

export function HuddleDrawer({ isOpen, onClose, terminalLogs, onClearLogs }: Props) {
  const [activeTab, setActiveTab] = useState<'chat' | 'peers' | 'terminal'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      user: 'Sarah Chen',
      color: '#10b981',
      avatar: 'SC',
      time: '09:38 AM',
      text: 'Hey team, double-check line 24 of PayButton.tsx. The idempotency header key must be passed on the initial fetch!',
      reactions: { '👍': 3, '🔥': 2 },
    },
    {
      id: 'm2',
      user: 'Alex Rivera',
      color: '#06b6d4',
      avatar: 'AR',
      time: '09:40 AM',
      text: 'const idempotencyKey = crypto.randomUUID();\nfetch("/api/mock/checkout", { headers: { "x-idempotency-key": idempotencyKey } });',
      isCode: true,
      reactions: { '🚀': 4 },
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      user: 'You (DevHuddle)',
      color: '#f59e0b',
      avatar: 'YOU',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputMsg,
      isCode: inputMsg.includes('{') || inputMsg.includes('const') || inputMsg.includes('function'),
      reactions: {},
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
  };

  const addReaction = (msgId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        const currentCount = m.reactions?.[emoji] || 0;
        return {
          ...m,
          reactions: { ...m.reactions, [emoji]: currentCount + 1 },
        };
      })
    );
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#121318] border-l border-slate-800 shadow-2xl flex flex-col transition-all duration-300">
      {/* Drawer Header */}
      <div className="h-14 border-b border-slate-800 px-4 flex items-center justify-between bg-[#161822]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-slate-100 font-mono">DevHuddle Live Sidecar</h2>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
            Ctrl+\
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="grid grid-cols-3 border-b border-slate-800 text-xs font-mono bg-[#0e0f14]">
        <button
          onClick={() => setActiveTab('chat')}
          className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'chat'
              ? 'text-emerald-400 border-emerald-400 font-semibold bg-[#121318]'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Chat ({messages.length})
        </button>

        <button
          onClick={() => setActiveTab('peers')}
          className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'peers'
              ? 'text-emerald-400 border-emerald-400 font-semibold bg-[#121318]'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Peers ({DEFAULT_PEERS.length})
        </button>

        <button
          onClick={() => setActiveTab('terminal')}
          className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'terminal'
              ? 'text-emerald-400 border-emerald-400 font-semibold bg-[#121318]'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Logs ({terminalLogs.length})
        </button>
      </div>

      {/* Tab 1: Room Chat Feed */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#0a0a0c]">
          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin flex flex-col gap-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 group">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-950 shrink-0 font-mono"
                  style={{ backgroundColor: msg.color }}
                >
                  {msg.avatar}
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{msg.user}</span>
                    <span className="text-[10px] font-mono text-slate-500">{msg.time}</span>
                  </div>

                  {msg.isCode ? (
                    <div className="bg-[#12141d] p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre">
                      {msg.text}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-300 bg-[#141620] p-2.5 rounded-lg border border-slate-800/60 leading-relaxed">
                      {msg.text}
                    </p>
                  )}

                  {/* Reaction Pills */}
                  <div className="flex items-center gap-1.5 mt-1">
                    {msg.reactions &&
                      Object.entries(msg.reactions).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => addReaction(msg.id, emoji)}
                          className="px-2 py-0.5 rounded-full bg-[#1a1c28] border border-slate-700 text-[11px] text-slate-300 flex items-center gap-1 hover:border-slate-500"
                        >
                          <span>{emoji}</span>
                          <span className="font-mono text-[10px] font-bold">{count}</span>
                        </button>
                      ))}

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-1">
                      <button
                        onClick={() => addReaction(msg.id, '👍')}
                        className="p-1 text-slate-500 hover:text-amber-400 text-xs"
                      >
                        👍
                      </button>
                      <button
                        onClick={() => addReaction(msg.id, '🚀')}
                        className="p-1 text-slate-500 hover:text-emerald-400 text-xs"
                      >
                        🚀
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#121318] border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Send message or paste snippet..."
              className="flex-1 bg-[#090a0f] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Presence List */}
      {activeTab === 'peers' && (
        <div className="flex-1 p-4 overflow-y-auto scrollbar-thin bg-[#0a0a0c] flex flex-col gap-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            Active Huddle Members ({DEFAULT_PEERS.length})
          </div>

          {DEFAULT_PEERS.map((peer, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[#12141d] border border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-slate-950 font-mono"
                    style={{ backgroundColor: peer.color }}
                  >
                    {peer.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#12141d] absolute bottom-0 right-0" />
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    {peer.name}
                    <span className="text-[10px] text-slate-400 font-mono">({peer.role})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{peer.status}</div>
                </div>
              </div>

              <div
                className="w-3 h-3 rounded-full border-2 border-white/20"
                style={{ backgroundColor: peer.color }}
                title={`Cursor Color: ${peer.color}`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Terminal Output Logs */}
      {activeTab === 'terminal' && (
        <div className="flex-1 flex flex-col bg-[#06070a] overflow-hidden">
          <div className="h-9 px-3 bg-[#0e0f14] border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>stdout / stderr console</span>
            {onClearLogs && (
              <button
                onClick={onClearLogs}
                className="hover:text-slate-200 flex items-center gap-1 text-[10px]"
              >
                <Trash2 className="w-3 h-3" /> Clear Logs
              </button>
            )}
          </div>

          <div className="flex-1 p-3 font-mono text-[11px] overflow-y-auto scrollbar-thin text-slate-300 flex flex-col gap-1">
            {terminalLogs.length === 0 ? (
              <span className="text-slate-600 italic">No output logged yet. Run tests to stream logs.</span>
            ) : (
              terminalLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`${
                    log.includes('PASSED') || log.includes('SUCCESS')
                      ? 'text-emerald-400 font-bold'
                      : log.includes('FAIL') || log.includes('ERROR')
                      ? 'text-red-400 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
