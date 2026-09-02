'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckSquare, 
  Square, 
  GitCommit, 
  Clock, 
  Server, 
  Terminal, 
  ShieldAlert, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  User,
  Zap
} from 'lucide-react';

interface AcceptanceCriteria {
  id: string;
  text: string;
  completed: boolean;
}

export function TicketSpecView() {
  const [copiedDiff, setCopiedDiff] = useState(false);
  const [criteria, setCriteria] = useState<AcceptanceCriteria[]>([
    { id: '1', text: 'Disable checkout button immediately upon initial click (pending request state)', completed: false },
    { id: '2', text: 'Generate and pass unique x-idempotency-key header for every checkout request', completed: false },
    { id: '3', text: 'Handle 409 Conflict gracefully by presenting user with idempotent receipt without re-billing', completed: false },
    { id: '4', text: 'Add client-side timeout fallback (10s) to reset loading lock if network drops', completed: false },
    { id: '5', text: 'Verify zero double-charges occur under 50ms rapid double-tap simulation', completed: false },
  ]);

  const toggleCriteria = (id: string) => {
    setCriteria((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const copyGitDiff = () => {
    const diffText = `--- a/components/checkout/PayButton.tsx
+++ b/components/checkout/PayButton.tsx
@@ -14,6 +14,8 @@ export function PayButton({ cartId, amount }: Props) {
-  const handlePay = async () => {
-    await fetch('/api/mock/checkout', { method: 'POST', body: JSON.stringify({ cartId, amount }) });
+  const [isSubmitting, setIsSubmitting] = useState(false);
+  const handlePay = async () => {
+    if (isSubmitting) return;
+    setIsSubmitting(true);
+    const idempotencyKey = crypto.randomUUID();
+    try {
+      await fetch('/api/mock/checkout', {
+        method: 'POST',
+        headers: { 'Content-Type': 'application/json', 'x-idempotency-key': idempotencyKey },
+        body: JSON.stringify({ cartId, amount })
+      });
+    } finally {
+      setIsSubmitting(false);
+    }
   };`;
    navigator.clipboard.writeText(diffText);
    setCopiedDiff(true);
    setTimeout(() => setCopiedDiff(false), 2000);
  };

  const completedCount = criteria.filter((c) => c.completed).length;

  return (
    <div className="h-full w-full bg-[#0a0a0c] text-slate-100 overflow-y-auto scrollbar-thin p-6 flex flex-col gap-6">
      {/* Top Banner / Ticket Metadata */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-xl bg-[#121318] border border-red-500/30 bg-gradient-to-r from-red-950/20 via-[#121318] to-[#121318]">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                P0 - CRITICAL INCIDENT
              </span>
              <span className="text-xs text-slate-400 font-mono">INC-8420</span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ACTIVE INVESTIGATION
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-100 mt-1">
              Double-Charge Race Condition in Production Checkout Flow
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Users rapidly clicking the &quot;Pay Now&quot; button trigger concurrent HTTP POST requests, resulting in duplicate charges in Stripe/Braintree payment gateway.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-center">
          <div className="text-right font-mono text-xs">
            <div className="text-slate-400">Reporter: <span className="text-slate-200">SRE-Oncall</span></div>
            <div className="text-slate-400">Impact: <span className="text-amber-400 font-semibold">$42,800 Reversals</span></div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Context & Reproduction */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Incident Overview Card */}
          <div className="p-5 rounded-xl bg-[#121318] border border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
                Root Cause Analysis & Incident Context
              </h2>
              <span className="text-xs text-slate-400 font-mono">Commit hash: <code className="text-emerald-400 font-bold">a9f82d1</code></span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              When network latency exceeds 300ms, the payment UI button remains interactive. Customers double-tap or click repeatedly during the request lifecycle. Because no client-side locking or idempotency header (`x-idempotency-key`) is attached, the backend processes both concurrent requests independently.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-1">
              <div className="p-3 rounded-lg bg-[#181a22] border border-slate-800">
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Avg Latency Spikes
                </div>
                <div className="text-lg font-bold text-slate-100 font-mono mt-1">480 ms</div>
              </div>
              <div className="p-3 rounded-lg bg-[#181a22] border border-slate-800">
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Rapid Taps / Sec
                </div>
                <div className="text-lg font-bold text-amber-400 font-mono mt-1">3.4 clicks</div>
              </div>
              <div className="p-3 rounded-lg bg-[#181a22] border border-slate-800">
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Server className="w-3.5 h-3.5 text-emerald-400" /> Affected API
                </div>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-1 truncate">POST /api/checkout</div>
              </div>
            </div>

            {/* Steps to Reproduce */}
            <div className="mt-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Steps to Reproduce</h3>
              <ol className="list-decimal list-inside text-sm text-slate-300 flex flex-col gap-1.5 bg-[#0e0f14] p-3.5 rounded-lg border border-slate-800/80 font-mono text-xs">
                <li>Open Sandbox Mode or API Console mode.</li>
                <li>Set simulated network latency to <span className="text-cyan-400">400ms</span>.</li>
                <li>Click &quot;Pay Now&quot; button 3 times in rapid succession (within 100ms window).</li>
                <li>Observe network inspector firing 3 parallel POST requests with status 200 OK.</li>
                <li>Database logs confirm 3 distinct charges executed for a single order payload.</li>
              </ol>
            </div>
          </div>

          {/* Git Diff & Suggested Fix */}
          <div className="p-5 rounded-xl bg-[#121318] border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <GitCommit className="w-5 h-5 text-emerald-400" />
                Proposed Fix Patch (Git Diff)
              </h2>
              <button
                onClick={copyGitDiff}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                {copiedDiff ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedDiff ? 'Copied!' : 'Copy Patch'}
              </button>
            </div>

            <div className="bg-[#090a0f] p-4 rounded-lg border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300">
              <div className="text-slate-500 border-b border-slate-800 pb-2 mb-2">
                diff --git a/components/checkout/PayButton.tsx b/components/checkout/PayButton.tsx
              </div>
              <div className="text-slate-500">@@ -14,6 +14,8 @@ export function PayButton() @@</div>
              <div className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded my-0.5">
                - await fetch(&apos;/api/mock/checkout&apos;, &#123; method: &apos;POST&apos;, body: JSON.stringify(&#123; cartId, amount &#125;) &#125;);
              </div>
              <div className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded my-0.5">
                + const [isSubmitting, setIsSubmitting] = useState(false);
              </div>
              <div className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded my-0.5">
                + const handlePay = async () =&gt; &#123;
              </div>
              <div className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded my-0.5">
                +   if (isSubmitting) return;
              </div>
              <div className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded my-0.5">
                +   setIsSubmitting(true);
              </div>
              <div className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded my-0.5">
                +   const idempotencyKey = crypto.randomUUID();
              </div>
              <div className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded my-0.5">
                +   await fetch(&apos;/api/mock/checkout&apos;, &#123; headers: &#123; &apos;x-idempotency-key&apos;: idempotencyKey &#125;, body ... &#125;);
              </div>
              <div className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded my-0.5">
                + &#125; finally &#123; setIsSubmitting(false); &#125;
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Acceptance Criteria & Simulated Logs */}
        <div className="flex flex-col gap-6">
          {/* Verification Criteria Checklist */}
          <div className="p-5 rounded-xl bg-[#121318] border border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-400" />
                Acceptance Criteria
              </h2>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {completedCount}/{criteria.length} Done
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${(completedCount / criteria.length) * 100}%` }}
              />
            </div>

            <div className="flex flex-col gap-2.5 mt-1">
              {criteria.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleCriteria(item.id)}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                    item.completed
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : 'bg-[#181a22] border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  {item.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                  )}
                  <span className={`text-xs leading-relaxed ${item.completed ? 'line-through opacity-80' : ''}`}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Network & Production Log Timeline */}
          <div className="p-5 rounded-xl bg-[#121318] border border-slate-800 flex flex-col gap-3">
            <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              Live Incident Log Feed
            </h2>

            <div className="bg-[#090a0f] p-3.5 rounded-lg border border-slate-800 font-mono text-[11px] flex flex-col gap-2 max-h-[300px] overflow-y-auto scrollbar-thin">
              <div className="text-slate-500">[09:40:12.102] POST /api/mock/checkout payload=&#123;cartId:&quot;c_99&quot;, amount:149&#125;</div>
              <div className="text-amber-400">[09:40:12.145] POST /api/mock/checkout payload=&#123;cartId:&quot;c_99&quot;, amount:149&#125; (RAPID CLICK #2)</div>
              <div className="text-red-400 font-bold">[09:40:12.180] POST /api/mock/checkout payload=&#123;cartId:&quot;c_99&quot;, amount:149&#125; (RAPID CLICK #3)</div>
              <div className="text-emerald-400">[09:40:12.450] HTTP 200 OK - Charge tx_9841 settled $149.00</div>
              <div className="text-red-400 font-bold">[09:40:12.490] HTTP 409 CONFLICT - DUPLICATE_CHARGE_DETECTED ($149.00 refunded)</div>
              <div className="text-slate-400">[09:40:13.010] Audit log updated: 1 transaction failed idempotency assertion.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
