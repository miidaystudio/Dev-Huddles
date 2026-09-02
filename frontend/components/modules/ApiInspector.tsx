'use client';

import React, { useState } from 'react';
import {
  Send,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Code2,
} from 'lucide-react';

export function ApiInspector() {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT'>('POST');
  const [endpoint, setEndpoint] = useState<string>('/api/v1/checkout/process');
  const [latencyInput, setLatencyInput] = useState<number>(42);
  const [requestBody, setRequestBody] = useState<string>(
    JSON.stringify(
      {
        cartId: 'cart_devhuddle_9041',
        amount: 149.00,
        currency: 'USD',
        idempotencyKey: `idemp_${Math.random().toString(36).substring(2, 9)}`,
      },
      null,
      2
    )
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(200);
  const [responseStatusText, setResponseStatusText] = useState<string>('OK');
  const [responseLatency, setResponseLatency] = useState<number | null>(42);
  const [responseData, setResponseData] = useState<any>({
    status: 'SUCCESS',
    statusCode: 200,
    transaction: {
      id: 'tx_devhuddle_40291',
      cartId: 'cart_devhuddle_9041',
      amount: 149.00,
      currency: 'USD',
      settledAt: new Date().toISOString(),
      latencyMs: 42,
    },
    auditLog: {
      idempotencyLockAcquired: true,
      clusterRegion: 'us-east-1',
    },
  });
  const [copied, setCopied] = useState<boolean>(false);

  const handleSendRequest = async () => {
    setIsLoading(true);
    const startTime = performance.now();

    try {
      const targetUrl = endpoint.startsWith('http')
        ? endpoint
        : `/api/mock/checkout?latency=${latencyInput}`;

      const res = await fetch(targetUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'GET' ? requestBody : undefined,
      });

      const endTime = performance.now();
      const actualLatency = Math.round(endTime - startTime);

      setResponseLatency(actualLatency);
      setResponseStatus(res.status);
      setResponseStatusText(res.statusText || (res.status === 200 ? 'OK' : 'Status'));

      const json = await res.json().catch(() => ({ message: 'Received non-JSON response' }));
      setResponseData(json);
    } catch (err: any) {
      const endTime = performance.now();
      setResponseLatency(Math.round(endTime - startTime));
      setResponseStatus(500);
      setResponseStatusText('Network Error');
      setResponseData({ error: 'FETCH_FAILED', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponse = () => {
    if (responseData) {
      navigator.clipboard.writeText(JSON.stringify(responseData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-full w-full bg-[#08090C] text-slate-100 p-6 overflow-y-auto scrollbar-thin flex flex-col gap-6 font-sans">
      {/* Top Header Card */}
      <div className="p-4 rounded-2xl bg-[#111318] border border-[#1F242F] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              DevHuddle In-Browser API Inspector
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                POSTMAN-LITE RUNNER
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Execute live endpoint payloads, inspect HTTP status codes, latency metrics, and JSON data.
            </p>
          </div>
        </div>
      </div>

      {/* HTTP Request URL Runner Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-[#111318] p-3 rounded-2xl border border-[#1F242F]">
        {/* Method Selector */}
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as any)}
          className={`px-3.5 py-2.5 rounded-xl font-mono font-bold text-xs border focus:outline-none cursor-pointer ${
            method === 'GET'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
              : method === 'POST'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
        </select>

        {/* Endpoint URL Input */}
        <div className="flex-1 flex items-center bg-[#08090C] border border-[#1F242F] rounded-xl px-3.5 py-2.5 text-xs font-mono focus-within:border-emerald-500 transition-colors">
          <span className="text-slate-500 select-none mr-1">https://api.devhuddle.internal</span>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="/api/v1/checkout/process"
            className="w-full bg-transparent text-slate-200 outline-none font-mono"
          />
        </div>

        {/* Simulated Latency Controls */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#08090C] border border-[#1F242F] text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Latency:</span>
          <input
            type="number"
            value={latencyInput}
            onChange={(e) => setLatencyInput(parseInt(e.target.value || '0', 10))}
            className="w-14 bg-[#111318] border border-[#1F242F] rounded px-1.5 py-0.5 text-slate-200 text-center outline-none font-mono text-xs"
          />
          <span className="text-slate-500">ms</span>
        </div>

        {/* Send Request Button */}
        <button
          onClick={handleSendRequest}
          disabled={isLoading}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 ${
            isLoading
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
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
              Send Request
            </>
          )}
        </button>
      </div>

      {/* Grid: Request Payload vs Response Payload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
        {/* Request JSON Editor */}
        <div className="p-5 rounded-2xl bg-[#111318] border border-[#1F242F] flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#1F242F] pb-3 text-xs font-mono">
            <span className="font-bold text-slate-200">Request Body (JSON)</span>
            <span className="text-slate-400">Content-Type: application/json</span>
          </div>

          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            className="w-full flex-1 min-h-[260px] bg-[#08090C] border border-[#1F242F] rounded-xl p-3 text-xs font-mono text-emerald-300 outline-none focus:border-emerald-500 scrollbar-thin resize-none"
          />
        </div>

        {/* Response Viewer */}
        <div className="p-5 rounded-2xl bg-[#111318] border border-[#1F242F] flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#1F242F] pb-3">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-200 font-bold">
              <Code2 className="w-4 h-4 text-emerald-400" />
              Response Payload
            </div>

            {responseStatus !== null && (
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold flex items-center gap-1 border ${
                    responseStatus >= 200 && responseStatus < 300
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  HTTP {responseStatus} {responseStatusText}
                </span>

                {responseLatency !== null && (
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {responseLatency} ms
                  </span>
                )}

                <button
                  onClick={copyResponse}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Copy Response JSON"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 bg-[#08090C] rounded-xl p-4 border border-[#1F242F] font-mono text-xs overflow-auto max-h-[340px] scrollbar-thin">
            {responseData ? (
              <pre className="text-emerald-300 leading-relaxed">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 py-12 text-xs">
                Click &quot;Send Request&quot; to execute payload.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
