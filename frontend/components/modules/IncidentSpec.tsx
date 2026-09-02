'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  GitCommit,
  Copy,
  Check,
  Terminal,
} from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  passed: boolean;
  errorTrace?: string;
}

export function IncidentSpec() {
  const [copiedPatch, setCopiedPatch] = useState(false);
  const [testCases] = useState<TestCase[]>([
    {
      id: '1',
      name: 'unit_checkout_payload_validation',
      passed: true,
    },
    {
      id: '2',
      name: 'integration_idempotency_key_header_gen',
      passed: true,
    },
    {
      id: '3',
      name: 'e2e_single_click_payment_settlement',
      passed: true,
    },
    {
      id: '4',
      name: 'e2e_rapid_double_tap_race_condition',
      passed: false,
      errorTrace:
        'ConcurrencyError: Double charge detected for cart_9041!\n  at processPayment (services/checkout.ts:42:11)\n  at POST /api/v1/checkout/process (route.ts:18:5)\n  Expected 1 charge transaction, but found 2 parallel settlements.',
    },
  ]);

  const copyPatch = () => {
    const patch = `// Recommended Idempotency Fix
const [isSubmitting, setIsSubmitting] = useState(false);

async function handlePay() {
  if (isSubmitting) return;
  setIsSubmitting(true);
  try {
    const idempotencyKey = crypto.randomUUID();
    await fetch('/api/v1/checkout/process', {
      method: 'POST',
      headers: { 'x-idempotency-key': idempotencyKey }
    });
  } finally {
    setIsSubmitting(false);
  }
}`;
    navigator.clipboard.writeText(patch);
    setCopiedPatch(true);
    setTimeout(() => setCopiedPatch(false), 2000);
  };

  const passingCount = testCases.filter((t) => t.passed).length;

  return (
    <div className="h-full w-full bg-[#08090C] text-neutral-100 p-6 overflow-y-auto font-sans">
      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6">
        {/* Incident Banner (Top Row - Col 12) */}
        <div className="col-span-12 bg-[#0D0E13] border border-white/[0.08] rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-mono px-2 py-0.5 rounded font-bold">
                  INCIDENT SEVERITY: P1 CRITICAL
                </span>
                <span className="text-xs text-neutral-400 font-mono">TICKET #ENG-402</span>
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE INVESTIGATION
                </span>
              </div>
              <h1 className="text-lg font-semibold tracking-tight text-white mt-2">
                Fix Race Condition in Checkout Hook
              </h1>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed max-w-3xl">
                Concurrent payment requests during network latency spikes cause duplicate Stripe authorization tokens to execute simultaneously.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end lg:self-center font-mono text-xs">
            <div className="text-right">
              <div className="text-neutral-400">Reporter: <span className="text-neutral-200">PaymentOps</span></div>
              <div className="text-neutral-400">Affected Service: <span className="text-emerald-400">Checkout Service</span></div>
            </div>
          </div>
        </div>

        {/* Left Column (Col 8) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Behavior Breakdown Card */}
          <div className="bg-[#0D0E13] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-neutral-200 flex items-center gap-2 mb-4">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              Behavior Breakdown &amp; Root Cause
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Expected Behavior */}
              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-4 flex flex-col gap-2">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Expected Behavior
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Upon user click, the checkout hook locks the button state, generates a unique <code className="text-emerald-300 font-mono bg-emerald-950/40 px-1 py-0.5 rounded">x-idempotency-key</code> header, and blocks secondary clicks until request completion.
                </p>
              </div>

              {/* Actual Behavior */}
              <div className="bg-rose-950/20 border border-rose-500/20 rounded-lg p-4 flex flex-col gap-2">
                <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" /> Actual Behavior (Bug)
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  When API latency spikes above 300ms, users double-tap the button. Two HTTP POST payloads enter the queue without mutex locks, executing 2 parallel charges.
                </p>
              </div>
            </div>
          </div>

          {/* Target Patch Snippet */}
          <div className="bg-[#0D0E13] border border-white/[0.08] rounded-xl p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-emerald-400" />
                Target Patch Snippet
              </h2>
              <button
                onClick={copyPatch}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                {copiedPatch ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
                {copiedPatch ? 'Copied Snippet' : 'Copy Solution'}
              </button>
            </div>

            <div className="bg-[#07080B] border border-white/[0.06] rounded-lg p-4 font-mono text-xs leading-relaxed text-neutral-300 overflow-x-auto">
              <div className="text-neutral-500 pb-1.5 border-b border-white/[0.06] mb-2.5">// hooks/useCheckout.ts</div>
              <div className="text-emerald-400">+ const [isSubmitting, setIsSubmitting] = useState(false);</div>
              <div className="text-emerald-400">+ if (isSubmitting) return; // Mutex Lock</div>
              <div className="text-emerald-400">+ const idempotencyKey = crypto.randomUUID();</div>
              <div className="text-neutral-400">  await fetch(&apos;/api/v1/checkout/process&apos;, &#123;</div>
              <div className="text-emerald-400">+   headers: &#123; &apos;x-idempotency-key&apos;: idempotencyKey &#125;</div>
              <div className="text-neutral-400">  &#125;);</div>
            </div>
          </div>
        </div>

        {/* Right Column (Col 4 - Test Suite Matrix) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col">
          <div className="bg-[#0D0E13] border border-white/[0.08] rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-neutral-400" />
                Test Suite Matrix
              </h2>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                {passingCount}/{testCases.length} Passing
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {testCases.map((tc) =>
                tc.passed ? (
                  <div
                    key={tc.id}
                    className="bg-[#090A0E] border border-white/[0.04] rounded-lg px-3.5 py-2.5 flex items-center justify-between text-xs font-mono text-neutral-300"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{tc.name}</span>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded font-mono font-semibold">
                      PASSED
                    </span>
                  </div>
                ) : (
                  <div
                    key={tc.id}
                    className="bg-rose-950/20 border border-rose-500/30 rounded-lg p-3.5 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="text-rose-300 font-bold">{tc.name}</span>
                      </div>
                      <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                        FAILING
                      </span>
                    </div>

                    {tc.errorTrace && (
                      <div className="mt-2 bg-[#07080B] p-3 rounded border border-rose-500/20 text-rose-300/90 text-[11px] leading-relaxed whitespace-pre-wrap">
                        {tc.errorTrace}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
