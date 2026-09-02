'use client';

import React, { useState } from 'react';
import {
  Send,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Copy,
  Check,
  Code2,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';

interface HeaderItem {
  key: string;
  value: string;
  enabled: boolean;
}

const PRESET_ENDPOINTS = [
  { label: 'Checkout API (POST)', url: '/api/mock/checkout', method: 'POST' },
  { label: 'Checkout Status (GET)', url: '/api/mock/checkout', method: 'GET' },
  { label: 'Auth Token (POST)', url: '/api/mock/auth', method: 'POST' },
  { label: 'Auth Profile (GET)', url: '/api/mock/auth', method: 'GET' },
];

const DEFAULT_POST_BODY = JSON.stringify(
  {
    cartId: 'cart_devhuddle_9921',
    amount: 149.00,
    currency: 'USD',
    paymentMethod: 'credit_card',
  },
  null,
  2
);

export function ApiInspector() {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('POST');
  const [url, setUrl] = useState('/api/mock/checkout');
  const [latencyParam, setLatencyParam] = useState<number>(350);
  const [headers, setHeaders] = useState<HeaderItem[]>([
    { key: 'Content-Type', value: 'application/json', enabled: true },
    { key: 'x-idempotency-key', value: `idemp_${Math.random().toString(36).substring(2, 9)}`, enabled: true },
    { key: 'Authorization', value: 'Bearer jwt_devhuddle_demo', enabled: true },
  ]);
  const [requestBody, setRequestBody] = useState(DEFAULT_POST_BODY);

  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseStatusText, setResponseStatusText] = useState<string>('');
  const [responseLatency, setResponseLatency] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseData, setResponseData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'body' | 'headers' | 'params'>('body');

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value' | 'enabled', val: any) => {
    const updated = [...headers];
    updated[index] = { ...updated[index], [field]: val };
    setHeaders(updated);
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponseData(null);
    const startTime = performance.now();

    try {
      // Build header object
      const reqHeaders: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.enabled && h.key.trim() !== '') {
          reqHeaders[h.key.trim()] = h.value.trim();
        }
      });

      // Construct target URL with optional latency param
      const targetUrl = url.includes('?')
        ? `${url}&latency=${latencyParam}`
        : `${url}?latency=${latencyParam}`;

      const options: RequestInit = {
        method,
        headers: reqHeaders,
      };

      if (method !== 'GET' && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(targetUrl, options);
      const endTime = performance.now();

      setResponseLatency(Math.round(endTime - startTime));
      setResponseStatus(res.status);
      setResponseStatusText(res.statusText || (res.status === 200 ? 'OK' : res.status === 409 ? 'Conflict' : 'Status'));

      const resHeadersObj: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        resHeadersObj[k] = v;
      });
      setResponseHeaders(resHeadersObj);

      const json = await res.json().catch(() => ({ rawText: 'Non-JSON response' }));
      setResponseData(json);
    } catch (err: any) {
      const endTime = performance.now();
      setResponseLatency(Math.round(endTime - startTime));
      setResponseStatus(500);
      setResponseStatusText('Network Exception');
      setResponseData({ error: 'FETCH_ERROR', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewIdempotencyKey = () => {
    const newKey = `idemp_${Math.random().toString(36).substring(2, 9)}`;
    setHeaders(
      headers.map((h) => (h.key === 'x-idempotency-key' ? { ...h, value: newKey } : h))
    );
  };

  const copyResponse = () => {
    if (responseData) {
      navigator.clipboard.writeText(JSON.stringify(responseData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-full w-full bg-[#0a0a0c] text-slate-100 flex flex-col p-6 overflow-y-auto scrollbar-thin gap-6">
      {/* Top Header / Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#121318] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-bold text-slate-100">DevHuddle In-Browser API Inspector</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              POSTMAN-LITE RUNTIME
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Send real HTTP payloads to backend endpoints, test idempotency headers, simulate network latency spikes, and inspect response metrics.
          </p>
        </div>

        {/* Quick Presets Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Quick Preset:</span>
          <select
            onChange={(e) => {
              const preset = PRESET_ENDPOINTS[parseInt(e.target.value, 10)];
              if (preset) {
                setMethod(preset.method as any);
                setUrl(preset.url);
              }
            }}
            className="bg-[#181a22] border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:border-emerald-500"
          >
            {PRESET_ENDPOINTS.map((p, idx) => (
              <option key={idx} value={idx}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* HTTP Request URL Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-[#121318] p-3 rounded-xl border border-slate-800">
        {/* Method Selector */}
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as any)}
          className={`px-3 py-2 rounded-lg font-mono font-bold text-xs border focus:outline-none transition-colors ${
            method === 'GET'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
              : method === 'POST'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : method === 'PUT'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-red-500/10 text-red-400 border-red-500/30'
          }`}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        {/* URL Input */}
        <div className="flex-1 flex items-center bg-[#090a0f] border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono focus-within:border-emerald-500 transition-colors">
          <span className="text-slate-500 select-none mr-1">http://localhost:3000</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/api/mock/checkout"
            className="w-full bg-transparent text-slate-200 outline-none font-mono"
          />
        </div>

        {/* Latency Simulation Slider */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#181a22] border border-slate-800 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Delay:</span>
          <input
            type="number"
            min={0}
            max={2000}
            step={50}
            value={latencyParam}
            onChange={(e) => setLatencyParam(parseInt(e.target.value || '0', 10))}
            className="w-16 bg-[#090a0f] border border-slate-800 rounded px-1.5 py-0.5 text-slate-200 text-center outline-none font-mono"
          />
          <span className="text-slate-500">ms</span>
        </div>

        {/* Send Request Button */}
        <button
          onClick={handleSendRequest}
          disabled={isLoading}
          className={`px-6 py-2 rounded-lg font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 ${
            isLoading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95'
          }`}
        >
          {isLoading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Send Payload
            </>
          )}
        </button>
      </div>

      {/* Main Inspector Split: Request Config vs Response Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[420px]">
        {/* Left Column: Request Configurations */}
        <div className="p-5 rounded-xl bg-[#121318] border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => setActiveTab('body')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  activeTab === 'body'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Request Body (JSON)
              </button>
              <button
                onClick={() => setActiveTab('headers')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  activeTab === 'headers'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Headers ({headers.length})
              </button>
            </div>

            {activeTab === 'headers' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={generateNewIdempotencyKey}
                  className="px-2.5 py-1 rounded bg-[#181a22] hover:bg-slate-800 text-[11px] font-mono text-cyan-400 border border-slate-700 flex items-center gap-1"
                  title="Generate Fresh Idempotency Token"
                >
                  <Zap className="w-3 h-3" />
                  New Token
                </button>
                <button
                  onClick={addHeader}
                  className="p-1 rounded bg-[#181a22] hover:bg-slate-800 text-slate-300 border border-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Tab 1: Request Body */}
          {activeTab === 'body' && (
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>JSON Payload Editor</span>
                <span>Content-Type: application/json</span>
              </div>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                placeholder="{}"
                className="w-full flex-1 min-h-[260px] bg-[#090a0f] border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-300 outline-none focus:border-emerald-500 scrollbar-thin resize-none"
              />
            </div>
          )}

          {/* Tab 2: Request Headers Editor */}
          {activeTab === 'headers' && (
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-thin">
              {headers.map((h, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#090a0f] p-2 rounded-lg border border-slate-800">
                  <input
                    type="checkbox"
                    checked={h.enabled}
                    onChange={(e) => updateHeader(idx, 'enabled', e.target.checked)}
                    className="accent-emerald-500 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={h.key}
                    onChange={(e) => updateHeader(idx, 'key', e.target.value)}
                    placeholder="Header Key (e.g. x-idempotency-key)"
                    className="flex-1 bg-transparent text-xs font-mono text-slate-200 outline-none px-2 py-1 border border-transparent focus:border-slate-700 rounded"
                  />
                  <input
                    type="text"
                    value={h.value}
                    onChange={(e) => updateHeader(idx, 'value', e.target.value)}
                    placeholder="Header Value"
                    className="flex-1 bg-transparent text-xs font-mono text-emerald-400 outline-none px-2 py-1 border border-transparent focus:border-slate-700 rounded"
                  />
                  <button
                    onClick={() => removeHeader(idx)}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Response Viewer */}
        <div className="p-5 rounded-xl bg-[#121318] border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              Response Payload Output
            </h2>

            {responseStatus !== null && (
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold flex items-center gap-1 border ${
                    responseStatus >= 200 && responseStatus < 300
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : responseStatus === 409
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}
                >
                  {responseStatus >= 200 && responseStatus < 300 ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {responseStatus} {responseStatusText}
                </span>

                {responseLatency !== null && (
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {responseLatency} ms
                  </span>
                )}

                <button
                  onClick={copyResponse}
                  className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Copy Response JSON"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Response Output Container */}
          <div className="flex-1 bg-[#090a0f] rounded-lg p-4 border border-slate-800 font-mono text-xs overflow-auto max-h-[360px] scrollbar-thin">
            {responseData ? (
              <pre className="text-emerald-300 leading-relaxed">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 gap-2">
                <Globe className="w-8 h-8 opacity-40" />
                <p className="text-xs">No response payload yet. Click &quot;Send Payload&quot; above to execute.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
