"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers, Users, PanelRightClose, ArrowRight } from "lucide-react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ArchitecturalLightEditorialPage() {
  const router = useRouter();
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const gitDiffCardRef = useRef<HTMLDivElement>(null);
  const liveSpecimenCardRef = useRef<HTMLDivElement>(null);

  const [testState, setTestState] = useState<"passing" | "failing">("passing");
  const [activeTabPreview, setActiveTabPreview] = useState<
    "spec" | "monaco" | "sandpack" | "api"
  >("monaco");
  const [customRoomInput, setCustomRoomInput] = useState<string>("");

  // Lenis Smooth Inertia Scroll & GSAP ScrollTrigger Sequences
  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // 2. GSAP Animations Sequence
    const ctx = gsap.context(() => {
      // Hero Intro Sequence on Page Load
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".hero-heading", {
        y: 40,
        opacity: 0,
        duration: 1.1,
      })
        .from(
          ".hero-meta-tag",
          {
            y: -10,
            opacity: 0,
            stagger: 0.08,
            duration: 0.6,
          },
          "-=0.7"
        )
        .from(
          ".hero-card-left, .hero-card-right",
          {
            scale: 0.96,
            opacity: 0,
            y: 30,
            duration: 0.9,
            stagger: 0.15,
            ease: "back.out(1.4)",
          },
          "-=0.5"
        );

      // Scroll-Driven Entrance for Grid Blocks (01 to 04)
      gsap.utils.toArray<HTMLElement>(".grid-block-card").forEach((block) => {
        gsap.from(block, {
          scrollTrigger: {
            trigger: block,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        // Parallax upward shift for oversized index numbers
        const num = block.querySelector(".block-index-num");
        if (num) {
          gsap.to(num, {
            scrollTrigger: {
              trigger: block,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
            yPercent: -15,
          });
        }
      });

      // Section 05 "Inside the Live Incident Room" Reveal
      gsap.from(".pillar-card-item", {
        scrollTrigger: {
          trigger: "#live-cockpit",
          start: "top 75%",
        },
        x: -20,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".live-room-specimen-card", {
        scrollTrigger: {
          trigger: "#live-cockpit",
          start: "top 75%",
        },
        scale: 0.95,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
    }, mainContainerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  // 3D Parallax Tilt Handlers
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateX(${y * -7}deg) rotateY(${
      x * 7
    }deg)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  };

  const handleCustomRoomJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (customRoomInput.trim()) {
      router.push(`/room/${encodeURIComponent(customRoomInput.trim())}`);
    }
  };

  return (
    <div
      ref={mainContainerRef}
      className="min-h-screen bg-[#F4F3EE] text-[#4A4D54] font-mono relative overflow-x-hidden selection:bg-[#1D3A2A]/20 selection:text-[#1D3A2A]"
    >
      {/* 1. ATMOSPHERIC MESH GRADIENTS & FILM GRAIN OVERLAY */}
      {/* Film Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#111215_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />
      {/* Top Hero Golden Hour Mesh Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 15%, rgba(245, 158, 11, 0.08), rgba(234, 88, 12, 0.04), transparent 65%)",
        }}
      />
      {/* Bottom Left Emerald Kinetic Beacon */}
      <div
        className="absolute bottom-1/4 left-0 w-[500px] h-[500px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 10% 70%, rgba(16, 185, 129, 0.05), transparent 50%)",
        }}
      />
      {/* 40px Drafting Paper Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none z-0" />

      {/* 2. ARCHITECTURAL LIGHT NAVBAR */}
      <nav className="h-20 border-b border-black/[0.08] bg-[#F4F3EE]/90 backdrop-blur-md sticky top-0 z-50 px-8 md:px-16 flex items-center justify-between font-mono text-xs">
        {/* Left: Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 group text-[#111215] font-bold tracking-tight"
        >
          <div className="w-8 h-8 rounded border border-black/20 bg-white flex items-center justify-center text-[#1D3A2A] group-hover:border-[#1D3A2A]/60 transition-colors shadow-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 8L3 12L7 16"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
              <path
                d="M17 8L21 12L17 16"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
              <rect x="11" y="11" width="2" height="2" fill="#1D3A2A" />
            </svg>
          </div>
          <span className="text-sm tracking-wide">
            &lt;-&gt; DevHuddle{" "}
            <span className="text-[#1D3A2A] font-normal">// KINETIC ARENA</span>
          </span>
        </Link>

        {/* Center: Editorial Index Links */}
        <div className="hidden md:flex items-center gap-10 text-[11px] text-[#7B7F88] tracking-widest uppercase">
          <a
            href="#block-01"
            className="hover:text-[#111215] transition-colors"
          >
            01. SPEC
          </a>
          <a
            href="#block-04"
            className="hover:text-[#111215] transition-colors"
          >
            02. RUNTIME
          </a>
          <a
            href="#block-03"
            className="hover:text-[#111215] transition-colors"
          >
            03. CONSOLE
          </a>
          <a
            href="#block-02"
            className="hover:text-[#111215] transition-colors"
          >
            04. NETWORK
          </a>
          <a
            href="#live-cockpit"
            className="hover:text-[#111215] transition-colors"
          >
            05. COCKPIT
          </a>
        </div>

        {/* Right: Monospace Session Trigger Button */}
        <Link
          href="/room/INC-8420"
          className="px-5 py-2.5 rounded bg-[#1e7a04] text-black font-bold text-xs hover:bg-[#03602d76] transition-colors flex items-center gap-2 shadow-md"
        >
          <span className="w-2 h-2 rounded-full bg-[#059669] animate-ping" />
          [ ENTER SESSION → ]
        </Link>
      </nav>

      {/* MACRO CONTAINER WRAPPER WITH EDITORIAL BREATHING ROOM */}
      <div className="max-w-7xl mx-auto px-4 md:px-16 py-20 lg:py-18 relative z-10">
        {/* 3. NYC EDITORIAL HERO SECTION */}
        <section className="border-b border-black/[0.08] pb-24 relative">
          {/* Top Eyebrow Track (NYC / MUM Coordinates & Soho Swatch) */}
          <div className="border-b border-black/[0.08] pb-6 flex items-center justify-between text-xs text-[#7B7F88] mb-10 flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <span className="text-[#111215] font-bold">
                [ ARCHITECTURAL PLATFORM MANIFEST ]
              </span>
              <span className="hidden sm:inline">
                NYC 40.7128° N // MUM 19.0760° N
              </span>
            </div>

            <div className="flex items-center gap-6">
              <span className="hidden md:inline text-[11px]">
                EDITION // 2026 AUTUMN RUNTIME
              </span>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-[#7B7F88]">TONE // SOHO_SPEC</span>
                <div className="flex items-center gap-1">
                  <span
                    className="w-3.5 h-3.5 bg-[#111215] rounded-xs inline-block"
                    title="#111215"
                  />
                  <span
                    className="w-3.5 h-3.5 bg-[#D97706] rounded-xs inline-block"
                    title="#D97706"
                  />
                  <span
                    className="w-3.5 h-3.5 bg-[#E5E7EB] border border-black/20 rounded-xs inline-block"
                    title="#E5E7EB"
                  />
                  <span
                    className="w-3.5 h-3.5 bg-[#F4F3EE] border border-black/20 rounded-xs inline-block"
                    title="#F4F3EE"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Eyebrow & Imposing Headline */}
          <div className="pb-12 border-b border-black/[0.08]">
            <h1 className="hero-heading tracking-[-0.04em] leading-[0.88] text-6xl md:text-8xl lg:text-9xl font-extrabold text-[#111215] uppercase font-sans">
              ENGINEERING
              <br />
              HUDDLES.
            </h1>
            <div className="hero-meta-tag mt-6 text-xs font-mono text-amber-900 bg-amber-50/50 border border-amber-500/30 inline-block px-4 py-2 shadow-sm rounded-sm">
              [ REAL-WORLD INCIDENTS // NOT DSA TOYS ]
            </div>
          </div>

          {/* Asymmetric Hero 2-Column Split */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-black/[0.08] border-b border-black/[0.08]">
            {/* Left Column (Typography & Specs inside Exhibition Plaque) */}
            <div className="hero-card-left lg:col-span-5 p-8 md:p-12 flex flex-col justify-between gap-10 bg-white/80 backdrop-blur-md border border-black/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
              {/* Exhibition Plaque Corner Ticks */}
              <div className="absolute top-3 left-3 text-xs text-neutral-400 select-none font-mono">
                ┌
              </div>
              <div className="absolute top-3 right-3 text-xs text-neutral-400 select-none font-mono">
                ┐
              </div>
              <div className="absolute bottom-3 left-3 text-xs text-neutral-400 select-none font-mono">
                └
              </div>
              <div className="absolute bottom-3 right-3 text-xs text-neutral-400 select-none font-mono">
                ┘
              </div>

              <div className="space-y-8">
                <p className="text-base text-[#4A4D54] font-sans leading-relaxed">
                  DevHuddle replaces legacy algorithm environments with
                  real-world incident specs, Yjs multi-cursor Monaco editing,
                  embedded Sandpack React runtimes, and in-browser HTTP
                  profilers.
                </p>

                <div className="space-y-3 text-xs font-mono text-[#7B7F88] border-l-2 border-[#1D3A2A] pl-5 py-2">
                  <div>• Mutex locks on checkout submit handlers</div>
                  <div>• Unique UUID x-idempotency-key header assertions</div>
                  <div>• Zero-unmount memory-persistent visibility toggles</div>
                </div>
              </div>

              {/* Luxury Obsidian Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/room/INC-8420"
                  className="px-6 py-4 bg-[#111215] text-white hover:bg-black font-bold text-xs transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:translate-y-[-2px] text-center font-mono flex items-center justify-center gap-2 rounded-sm"
                >
                  INITIALIZE ROOM [INC-8420]
                </Link>
                <a
                  href="#block-01"
                  className="px-6 py-4 bg-white border border-black/[0.12] hover:bg-gradient-to-r hover:from-white hover:to-amber-50 text-[#111215] text-xs font-mono text-center transition-all shadow-sm rounded-sm"
                >
                  INSPECT RFC SPEC // 01
                </a>
              </div>
            </div>

            {/* Right Column: MANHATTAN SKYLINE PHOTOGRAPH + GIT DIFF SPECIMEN CARD */}
            <div
              ref={gitDiffCardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="hero-card-right lg:col-span-7 bg-white/95 backdrop-blur border border-black/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-between rounded-lg transition-transform duration-200 ease-out"
            >
              {/* NYC Architectural Skyline Image Header */}
              <div className="relative w-full h-48 md:h-56 overflow-hidden border-b border-black/[0.08] group">
                <img
                  src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1200&auto=format&fit=crop"
                  alt="Manhattan Skyline Architectural Golden Hour"
                  className="w-full h-full object-cover filter contrast-105 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 text-xs font-mono font-bold text-white tracking-widest uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>MANHATTAN KINETIC LAB // INCIDENT MATRIX</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8 md:p-10 flex flex-col justify-between flex-1">
                {/* Peer Cursor Badges */}
                <div className="flex items-center justify-between border-b border-black/[0.08] pb-4 text-xs font-mono">
                  <div className="flex items-center gap-4">
                    <span className="animate-bounce px-2.5 py-1 bg-[#E8F5E9] text-[#1B5E20] border border-[#A5D6A7] text-[10px] font-bold rounded">
                      @vrushali (Driver)
                    </span>
                    <span className="animate-pulse px-2.5 py-1 bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9] text-[10px] font-bold rounded">
                      @peer (Navigator)
                    </span>
                  </div>
                  <span className="text-neutral-400 font-mono text-[11px]">
                    LIVE YJS CRDT EDIT
                  </span>
                </div>

                {/* Diff Code Box */}
                <div className="my-6 bg-[#FAF9F6] border border-black/[0.06] rounded p-6 font-mono text-xs text-neutral-800 leading-relaxed overflow-x-auto shadow-inner">
                  <div className="text-neutral-500 pb-3 border-b border-black/[0.06] mb-4 flex justify-between">
                    <span>
                      diff --git a/hooks/useCheckout.ts b/hooks/useCheckout.ts
                    </span>
                    <span className="text-[#2E7D32] font-bold">
                      PATCH APPLIED
                    </span>
                  </div>
                  <div className="text-neutral-500">
                    @@ -12,6 +12,8 @@ export function useCheckout() @@
                  </div>
                  <div className="bg-[#FFEBEE] text-[#C62828] px-2 py-0.5 rounded my-1 font-mono">
                    - await fetch(&apos;/api/v1/checkout/process&apos;, &#123;
                    method: &apos;POST&apos; &#125;);
                  </div>
                  <div className="bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded my-1 font-mono">
                    + const [isSubmitting, setIsSubmitting] = useState(false);
                  </div>
                  <div className="bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded my-1 font-mono">
                    + if (isSubmitting) return; // Alex: Fix race condition in
                    checkout hook
                  </div>
                  <div className="bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded my-1 font-mono">
                    + const idempotencyKey = crypto.randomUUID();
                  </div>
                </div>

                <div className="flex items-center justify-between text-neutral-500 font-mono text-[11px] border-t border-black/[0.08] pt-4">
                  <span>ACTIVE MODEL // MONACO VS-DARK</span>
                  <span className="text-neutral-700 font-bold">
                    STATUS // 0 ERRORS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SWISS GRID FEATURE ARCHITECTURE (SYSTEM COMPONENTS SHEET) */}
        <section className="py-16 lg:py-24 my-20 lg:my-28 relative">
          {/* Section Divider Bar */}
          <div className="mb-16 border-b border-black/[0.08] pb-4 flex items-center justify-between text-xs text-[#7B7F88]">
            <span className="text-[#111215] font-bold text-sm tracking-wider">
              [ SYSTEM COMPONENTS SHEET ]
            </span>
            <span>INTERCONNECTED BLUEPRINT // 4 MODULES</span>
          </div>

          {/* Interconnected Blueprint Grid Sheet */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-black/[0.08] border-t border-b border-black/[0.08] bg-white border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
            {/* BLOCK 01 (Col 8): INCIDENT RUNNER & RFC SPEC */}
            <div
              id="block-01"
              className="grid-block-card md:col-span-8 p-10 md:p-12 flex flex-col justify-between gap-8 bg-white relative"
            >
              <div className="absolute top-3 left-3 text-xs text-[#7B7F88] select-none">
                ┌
              </div>
              <div className="absolute bottom-3 right-3 text-xs text-[#7B7F88] select-none">
                ┘
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-[#7B7F88] mb-6 font-mono">
                  <span className="block-index-num text-black/20 text-3xl font-mono font-bold">
                    01
                  </span>
                  <span className="text-[#1D3A2A] font-bold">
                    [INCIDENT RUNNER]
                  </span>
                </div>
                <h3 className="text-3xl font-extrabold text-[#111215] uppercase font-sans tracking-tight mb-4">
                  INCIDENT RUNNER &amp; RFC SPEC
                </h3>
                <p className="text-sm text-[#4A4D54] mb-8 leading-relaxed font-sans max-w-2xl">
                  Production incident cards detailing root cause analysis, steps
                  to reproduce, and automated test assertions.
                </p>
              </div>

              {/* BLOCK 01 TEST RUNNER TERMINAL: CLEAN LIGHT-MODE WHITE CARD */}
              <div className="bg-white border border-black/[0.08] rounded p-6 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between text-neutral-700 text-xs font-mono border-b border-black/[0.08] pb-3">
                  <span>automated_test_matrix.log</span>
                  <button
                    onClick={() =>
                      setTestState(
                        testState === "passing" ? "failing" : "passing"
                      )
                    }
                    className="text-xs text-[#15803D] hover:underline cursor-pointer font-bold"
                  >
                    [ TOGGLE TEST RESULT ]
                  </button>
                </div>

                {testState === "passing" ? (
                  <div className="bg-[#E8F5E9] border border-[#A5D6A7] p-3 rounded flex flex-col gap-1">
                    <div className="text-[#15803D] font-semibold text-xs">
                      ✔ test_rapid_double_tap_mutex_lock (124ms) PASSED
                    </div>
                    <div className="text-neutral-600 text-xs font-mono mt-1 pl-4">
                      Idempotency UUID lock verified. Zero double charges under
                      50ms rapid tap test.
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#FFEBEE] border border-[#FFCDD2] p-3 rounded flex flex-col gap-1">
                    <div className="text-[#C62828] font-semibold text-xs">
                      ✖ test_rapid_double_tap_mutex_lock (450ms) FAILING
                    </div>
                    <div className="text-neutral-600 text-xs font-mono mt-1 pl-4">
                      ConcurrencyError: Double billing triggered for cart_9041!
                      2 parallel transactions.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* BLOCK 02 (Col 4): YJS CRDT KERNEL */}
            <div
              id="block-02"
              className="grid-block-card md:col-span-4 p-10 md:p-12 flex flex-col justify-between gap-8 bg-[#FAF9F6] relative"
            >
              <div className="absolute top-3 left-3 text-xs text-[#7B7F88] select-none">
                ┌
              </div>
              <div className="absolute bottom-3 right-3 text-xs text-[#7B7F88] select-none">
                ┘
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-[#7B7F88] mb-6 font-mono">
                  <span className="block-index-num text-black/20 text-3xl font-mono font-bold">
                    02
                  </span>
                  <span className="text-cyan-700 font-bold">[CRDT KERNEL]</span>
                </div>
                <h3 className="text-3xl font-extrabold text-[#111215] uppercase font-sans tracking-tight mb-4">
                  YJS CRDT KERNEL
                </h3>
                <p className="text-sm text-[#4A4D54] mb-6 leading-relaxed font-sans">
                  Real-time conflict-free state synchronization with peer
                  presence cursor tracking.
                </p>

                {/* BLOCK 02 EDITORIAL WORKSPACE IMAGE FRAME */}
                <div className="relative rounded-md overflow-hidden border border-black/[0.06] mb-1 group">
                  <div className="absolute top-1.5 left-1.5 text-[9px] text-neutral-400 font-mono select-none z-10">
                    ┌ ┐
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
                    alt="Distributed Peer State Sync Workspace"
                    className="w-full h-36 object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-6">
                  fig 2.1 — distributed peer state sync
                </div>
              </div>

              <div className="bg-white border border-black/[0.08] p-6 rounded-xl font-mono text-xs flex flex-col gap-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse" />
                  <span className="text-[#1D3A2A] font-bold">
                    @alex (Editing PayButton.tsx)
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                  <span className="text-cyan-800 font-bold">
                    @devlekar (Inspecting API Payload)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Block 03 & Block 04 */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-black/[0.08] border-b border-black/[0.08] bg-white border-x border-black/[0.08]">
            {/* BLOCK 03 (Col 4): IN-BROWSER API PROFILER */}
            <div
              id="block-03"
              className="grid-block-card md:col-span-4 p-10 md:p-12 flex flex-col justify-between gap-8 bg-[#FAF9F6] relative"
            >
              <div className="absolute top-3 left-3 text-xs text-[#7B7F88] select-none">
                ┌
              </div>
              <div className="absolute bottom-3 right-3 text-xs text-[#7B7F88] select-none">
                ┘
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-[#7B7F88] mb-6 font-mono">
                  <span className="block-index-num text-black/20 text-3xl font-mono font-bold">
                    03
                  </span>
                  <span className="text-purple-700 font-bold">
                    [HTTP PROFILER]
                  </span>
                </div>
                <h3 className="text-3xl font-extrabold text-[#111215] uppercase font-sans tracking-tight mb-4">
                  IN-BROWSER API PROFILER
                </h3>
                <p className="text-sm text-[#4A4D54] mb-8 leading-relaxed font-sans">
                  Mini HTTP client to send real mock payloads, test headers, and
                  measure server latency.
                </p>
              </div>

              <div className="bg-white border border-black/[0.08] p-5 rounded-xl font-mono text-xs flex flex-col gap-3 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#1D3A2A] font-bold">
                    POST /v1/order/dispatch
                  </span>
                  <span className="text-[#7B7F88]">42ms</span>
                </div>
                <div className="text-xs text-[#111215] bg-[#F4F3EE] p-3 rounded border border-black/[0.08]">
                  HTTP 200 OK — 1.2KB Payload
                </div>
              </div>
            </div>

            {/* BLOCK 04 (Col 8): LIVE SANDPACK REACT RUNTIME */}
            <div
              id="block-04"
              className="grid-block-card md:col-span-8 p-10 md:p-12 flex flex-col justify-between gap-8 bg-white relative"
            >
              <div className="absolute top-3 left-3 text-xs text-[#7B7F88] select-none">
                ┌
              </div>
              <div className="absolute bottom-3 right-3 text-xs text-[#7B7F88] select-none">
                ┘
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-[#7B7F88] mb-6 font-mono">
                  <span className="block-index-num text-black/20 text-3xl font-mono font-bold">
                    04
                  </span>
                  <span className="text-amber-700 font-bold">
                    [SANDPACK RUNTIME]
                  </span>
                </div>
                <h3 className="text-3xl font-extrabold text-[#111215] uppercase font-sans tracking-tight mb-4">
                  LIVE SANDPACK REACT RUNTIME
                </h3>
                <p className="text-sm text-[#4A4D54] mb-6 leading-relaxed font-sans max-w-2xl">
                  Embedded browser preview iframe running live React/Tailwind
                  application state with zero unmounting lag.
                </p>

                {/* BLOCK 04 EDITORIAL RUNTIME UI IMAGE FRAME */}
                <div className="relative rounded-md overflow-hidden border border-black/[0.06] mb-1 group">
                  <div className="absolute top-1.5 left-1.5 text-[9px] text-neutral-400 font-mono select-none z-10">
                    ┌ ┐
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop"
                    alt="Sandpack Reactive Preview Engine UI"
                    className="w-full h-44 object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-6">
                  fig 4.1 — sandpack reactive preview engine
                </div>
              </div>

              {/* Segmented Mode Selector Bar */}
              <div className="bg-[#FAF9F6] border border-black/[0.08] p-4 rounded-xl flex items-center justify-between font-mono text-xs overflow-x-auto shadow-sm">
                <button
                  onClick={() => setActiveTabPreview("spec")}
                  className={`px-4 py-2 rounded transition-all ${
                    activeTabPreview === "spec"
                      ? "bg-white border-2 border-black text-black font-semibold shadow-xs"
                      : "text-[#7B7F88] hover:text-[#111215]"
                  }`}
                >
                  01. SPEC
                </button>
                <button
                  onClick={() => setActiveTabPreview("monaco")}
                  className={`px-4 py-2 rounded transition-all ${
                    activeTabPreview === "monaco"
                      ? "bg-white border-2 border-black text-black font-semibold shadow-xs"
                      : "text-[#7B7F88] hover:text-[#111215]"
                  }`}
                >
                  02. MONACO
                </button>
                <button
                  onClick={() => setActiveTabPreview("sandpack")}
                  className={`px-4 py-2 rounded transition-all ${
                    activeTabPreview === "sandpack"
                      ? "bg-white border-2 border-black text-black font-semibold shadow-xs"
                      : "text-[#7B7F88] hover:text-[#111215]"
                  }`}
                >
                  03. SANDPACK
                </button>
                <button
                  onClick={() => setActiveTabPreview("api")}
                  className={`px-4 py-2 rounded transition-all ${
                    activeTabPreview === "api"
                      ? "bg-white border-2 border-black text-black font-semibold shadow-xs"
                      : "text-[#7B7F88] hover:text-[#111215]"
                  }`}
                >
                  04. API CONSOLE
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. SECTION: [ 05 // THE LIVE ROOM COCKPIT ] WITH NYC GRADIENT TRACK */}
        <section
          id="live-cockpit"
          className="py-20 border-t border-black/[0.08] relative rounded-2xl bg-gradient-to-b from-transparent via-amber-500/[0.03] to-transparent p-6 md:p-8"
        >
          {/* Section Header & Index */}
          <div className="mb-12 border-b border-black/[0.08] pb-6">
            <div className="text-xs text-[#1D3A2A] mb-2 font-bold tracking-widest uppercase">
              [ SESSION ARCHITECTURE // ROOM_ENGINE ]
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#111215] tracking-tight uppercase font-sans">
              Inside the Live Incident Room.
            </h2>
            <p className="text-sm text-[#4A4D54] mt-3 max-w-3xl leading-relaxed font-sans">
              What happens when you launch a session at{" "}
              <code className="bg-white border border-black/[0.08] px-2 py-0.5 rounded font-mono text-[#111215]">
                /room/[id]
              </code>
              . A distraction-free, zero-unmount multiplayer workspace
              engineered for real debugging.
            </p>
          </div>

          {/* 2-Column Asymmetric Grid Layout (40% / 60%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Side (40% - 5 Cols): 3 Interactive Pillars */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {/* Pillar 1 */}
              <div className="pillar-card-item p-6 bg-white/80 backdrop-blur-md border border-black/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-xl flex flex-col gap-2 transition-all hover:border-black/30">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111215] uppercase tracking-wide">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-black/[0.08] flex items-center justify-center">
                    <Layers className="w-4 h-4 text-neutral-800" />
                  </div>
                  <span>Dynamic HUD Mode Switcher</span>
                </div>
                <p className="text-xs text-[#4A4D54] leading-relaxed pl-10 font-sans">
                  Toggle between RFC specs, full-bleed Monaco, Sandpack runtime,
                  and API console without losing editor state, undo history, or
                  active sockets.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="pillar-card-item p-6 bg-white/80 backdrop-blur-md border border-black/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-xl flex flex-col gap-2 transition-all hover:border-black/30">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111215] uppercase tracking-wide">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-black/[0.08] flex items-center justify-center">
                    <Users className="w-4 h-4 text-neutral-800" />
                  </div>
                  <span>Yjs Multi-Cursor CRDT Synchronization</span>
                </div>
                <p className="text-xs text-[#4A4D54] leading-relaxed pl-10 font-sans">
                  Sub-20ms peer presence, custom color-coded cursors, and
                  conflict-free code syncing powered by distributed CRDT
                  documents.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="pillar-card-item p-6 bg-white/80 backdrop-blur-md border border-black/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-xl flex flex-col gap-2 transition-all hover:border-black/30">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111215] uppercase tracking-wide">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-black/[0.08] flex items-center justify-center">
                    <PanelRightClose className="w-4 h-4 text-neutral-800" />
                  </div>
                  <span>Slide-Over Huddle Drawer (Ctrl + \)</span>
                </div>
                <p className="text-xs text-[#4A4D54] leading-relaxed pl-10 font-sans">
                  Non-blocking team chat, thread discussions, and terminal
                  output that slide out without stealing your editor viewport.
                </p>
              </div>
            </div>

            {/* Right Side (60% - 7 Cols): Interactive Room Session Card WITH NYC EDITORIAL GRADIENT */}
            <div
              ref={liveSpecimenCardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="live-room-specimen-card lg:col-span-7 bg-white/90 backdrop-blur-md border border-black/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-xl p-6 sm:p-8 flex flex-col justify-between gap-6 transition-transform duration-200 ease-out"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-black/[0.08] pb-4 text-xs font-mono flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-bold text-[#111215]">
                    SESSION: /room/INC-8420
                  </span>
                </div>
                <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-mono px-2.5 py-0.5 rounded font-bold">
                  P1 CRITICAL // MUTEX RACE CONDITION
                </span>
              </div>

              {/* HARDWARE TELEMETRY EDITORIAL IMAGE FRAME */}
              <div className="relative rounded-lg overflow-hidden border border-black/[0.06] mb-1 group">
                <div className="absolute top-1.5 left-1.5 text-[9px] text-neutral-400 font-mono select-none z-10">
                  ┌ ┐
                </div>
                <img
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"
                  alt="Live Room Session Hardware Telemetry"
                  className="w-full h-32 object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-2">
                fig 5.1 — live room session hardware telemetry
              </div>

              {/* Mini Mock Cockpit Window */}
              <div className="bg-[#FAF9F6] border border-black/[0.08] rounded-lg p-5 flex flex-col gap-4 font-mono text-xs">
                {/* Tab Bar */}
                <div className="flex items-center gap-2 text-[11px] border-b border-black/[0.06] pb-3">
                  <span className="bg-white border border-black/20 text-[#111215] px-2.5 py-1 rounded font-bold shadow-xs">
                    [ Incident Spec ]
                  </span>
                  <span className="text-neutral-500 px-2 py-1">
                    [ Monaco IDE ]
                  </span>
                  <span className="text-neutral-500 px-2 py-1">
                    [ Live Runtime ]
                  </span>
                  <span className="text-neutral-500 px-2 py-1">
                    [ API Console ]
                  </span>
                </div>

                {/* Brief Summary */}
                <p className="text-[#4A4D54] font-sans text-xs leading-relaxed">
                  Reproduce and patch duplicate Stripe webhook execution during
                  simulated 400ms network spikes.
                </p>

                {/* Active Peers Pill Stack */}
                <div className="flex items-center gap-3 pt-1">
                  <span className="animate-bounce px-2.5 py-1 bg-[#E8F5E9] text-[#1B5E20] border border-[#A5D6A7] text-[10px] font-bold rounded">
                    @vrushali (Driver)
                  </span>
                  <span className="animate-pulse px-2.5 py-1 bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9] text-[10px] font-bold rounded">
                    @peer (Navigator)
                  </span>
                </div>
              </div>

              {/* CTA Bar Inside Card with NYC Gradient Hover */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-black/[0.08]">
                <Link
                  href="/room/INC-8420"
                  className="bg-[#111215] hover:bg-gradient-to-r hover:from-neutral-900 hover:via-neutral-800 hover:to-amber-950 text-white font-mono text-xs px-5 py-3 rounded flex items-center justify-center gap-2 font-bold shadow-md transition-all active:scale-95"
                >
                  <span>[ LAUNCH LIVE ROOM: INC-8420 → ]</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Custom ID Input Field */}
                <form
                  onSubmit={handleCustomRoomJoin}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={customRoomInput}
                    onChange={(e) => setCustomRoomInput(e.target.value)}
                    placeholder="Enter custom session ID..."
                    className="bg-[#FAF9F6] border border-black/[0.15] px-3 py-2.5 rounded text-xs font-mono text-[#111215] focus:outline-none focus:border-black w-48"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2.5 bg-white border border-black/20 hover:border-black text-[#111215] text-xs font-mono font-bold rounded shadow-xs"
                  >
                    Join
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FOOTER & END OF SHEET */}
        <footer className="py-20 border-t border-black/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7B7F88] bg-[#F4F3EE]">
          <div>DevHuddle / Kinetic Arena — Swiss Editorial Architecture</div>
          <div className="text-[#111215] font-bold mt-3 sm:mt-0">
            [ END OF SHEET ]
          </div>
        </footer>
      </div>
    </div>
  );
}
