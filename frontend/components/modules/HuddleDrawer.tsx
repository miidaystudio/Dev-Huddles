'use client';

import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Users,
  Terminal,
  Send,
  Sparkles,
  Mic,
  MicOff,
  Activity,
  Trash2,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  terminalLogs: string[];
  onClearLogs?: () => void;
}

interface Peer {
  id: string;
  name: string;
  avatar: string;
  color: string;
  muted: boolean;
  role: string;
}

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  color: string;
  text: string;
  time: string;
}

export function HuddleDrawer({ isOpen, onClose, terminalLogs, onClearLogs }: Props) {
  const [activeTab, setActiveTab] = useState<'chat' | 'peers' | 'logs'>('chat');
  const [peers, setPeers] = useState<Peer[]>([
    { id: '1', name: 'Vikram Dev (VD)', avatar: 'VD', color: '#10b981', muted: false, role: 'Staff SRE' },
    { id: '2', name: 'Alex Kumar (AK)', avatar: 'AK', color: '#06b6d4', muted: true, role: 'Lead Architect' },
    { id: '3', name: 'Sarah Chen (SC)', avatar: 'SC', color: '#a855f7', muted: false, role: 'Frontend Security' },
  ]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'Vikram Dev (VD)',
      avatar: 'VD',
      color: '#10b981',
      text: 'Inspecting ticket #ENG-402. The idempotency lock header needs to be generated on initial button tap!',
      time: '09:54 AM',
    },
    {
      id: '2',
      user: 'Alex Kumar (AK)',
      avatar: 'AK',
      color: '#06b6d4',
      text: 'Verified in Sandpack preview. Mutex lock prevents double billing under 400ms latency spikes.',
      time: '09:56 AM',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  if (!isOpen) return null;

  const toggleMute = (id: string) => {
    setPeers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, muted: !p.muted } : p))
    );
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        user: 'You (DevHuddle)',
        avatar: 'YOU',
        color: '#f59e0b',
        text: inputMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputMsg('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[380px] bg-[#111318] border-l border-[#1F242F] shadow-2xl flex flex-col transition-all duration-300 font-sans">
      {/* Drawer Header */}
      <div className="h-14 border-b border-[#1F242F] px-4 flex items-center justify-between bg-[#161922]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-white font-mono">DevHuddle Cockpit Sidecar</h2>
          <span className="text-[10px] text-slate-400 font-mono bg-[#08090C] px-2 py-0.5 rounded border border-[#1F242F]">
            Ctrl+\
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#08090C] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 border-b border-[#1F242F] text-xs font-mono bg-[#08090C]">
        <button
          onClick={() => setActiveTab('chat')}
          className={`py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'chat'
              ? 'text-emerald-400 border-emerald-400 font-semibold bg-[#111318]'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Chat ({messages.length})
        </button>

        <button
          onClick={() => setActiveTab('peers')}
          className={`py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'peers'
              ? 'text-emerald-400 border-emerald-400 font-semibold bg-[#111318]'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Peers ({peers.length})
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'logs'
              ? 'text-emerald-400 border-emerald-400 font-semibold bg-[#111318]'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Logs ({terminalLogs.length})
        </button>
      </div>

      {/* Tab Content 1: Chat */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#08090C]">
          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin flex flex-col gap-4">
            {messages.map((m) => (
              <div key={m.id} className="flex items-start gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-950 font-mono shrink-0"
                  style={{ backgroundColor: m.color }}
                >
                  {m.avatar}
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{m.user}</span>
                    <span className="text-[10px] font-mono text-slate-500">{m.time}</span>
                  </div>
                  <div className="bg-[#111318] p-2.5 rounded-xl border border-[#1F242F] text-xs text-slate-300 leading-relaxed">
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-[#111318] border-t border-[#1F242F] flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Send message or snippet..."
              className="flex-1 bg-[#08090C] border border-[#1F242F] rounded-xl px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Tab Content 2: Participant Presence & Audio Toggles */}
      {activeTab === 'peers' && (
        <div className="flex-1 p-4 overflow-y-auto scrollbar-thin bg-[#08090C] flex flex-col gap-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            Active Room Participants ({peers.length})
          </div>

          {peers.map((peer) => (
            <div
              key={peer.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#111318] border border-[#1F242F]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-950 font-mono"
                  style={{ backgroundColor: peer.color }}
                >
                  {peer.avatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">{peer.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{peer.role}</div>
                </div>
              </div>

              {/* Audio Mute Toggle */}
              <button
                onClick={() => toggleMute(peer.id)}
                className={`p-2 rounded-lg border text-xs transition-colors ${
                  peer.muted
                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}
                title={peer.muted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {peer.muted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 3: Latency & Terminal Logs */}
      {activeTab === 'logs' && (
        <div className="flex-1 flex flex-col bg-[#040507] overflow-hidden font-mono text-[11px]">
          <div className="h-9 px-3 bg-[#111318] border-b border-[#1F242F] flex items-center justify-between text-slate-400">
            <span>Latency & System Log Stream</span>
            {onClearLogs && (
              <button onClick={onClearLogs} className="hover:text-slate-200 flex items-center gap-1 text-[10px]">
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="flex-1 p-3 overflow-y-auto scrollbar-thin flex flex-col gap-1 text-slate-300">
            {terminalLogs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.includes('PASSED') || log.includes('SUCCESS')
                    ? 'text-emerald-400 font-bold'
                    : log.includes('FAIL') || log.includes('ERROR')
                    ? 'text-red-400 font-bold'
                    : 'text-slate-400'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
