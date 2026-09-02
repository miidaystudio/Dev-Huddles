Markdown
# DevHuddle (Kinetic Arena)

> Collaborative engineering workspace for real-world production incident debugging—featuring Yjs CRDT multi-cursor Monaco editing, in-browser React runtimes via Sandpack, and live HTTP API profiling.

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-VS_Code_Core-007ACC?style=flat-square&logo=visualstudiocode)
![Yjs](https://img.shields.io/badge/CRDT-Yjs_Sync-orange?style=flat-square)
![Sandpack](https://img.shields.io/badge/Sandpack-React_Runtime-24292e?style=flat-square&logo=codesandbox)
![License](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)

---

## Overview

Most technical assessment platforms rely on artificial, single-file DSA puzzles. **DevHuddle** replaces toy environments with realistic, production-grade engineering workspaces:

* **Intent-Driven HUD**: A persistent cockpit that switches between RFC specs, code, browser runtime, and API inspection without unmounting components or dropping socket connections.
* **Yjs CRDT Real-Time Sync**: Conflict-free collaborative Monaco editor with sub-20ms multi-cursor awareness and remote peer presence.
* **In-Browser React Runtime**: Embedded live frontend sandboxes powered by Sandpack to debug UI states and race conditions on the fly.
* **Built-in API Console**: Postman-lite HTTP inspector to test headers, execute mock payloads, and analyze server latency.
* **Collapsible War Room (`Ctrl + \`)**: Non-blocking slide-over drawer for team discussions, threads, and terminal test traces.

---

## Architecture

                   ┌──────────────────────────────────────────────┐
                   │           DevHuddle Workspace Shell          │
                   │           (Persistent Memory State)          │
                   └──────────────────────┬───────────────────────┘
                                          │
     ┌──────────────────┬─────────────────┼─────────────────┬──────────────────┐
     ▼                  ▼                 ▼                 ▼                  ▼
[ Ticket Spec ]   [ Monaco IDE ]   [ Sandpack Preview ] [ API Inspector ] [ Slide Drawer ]
RFC & Bug Log     Yjs CRDT Sync     Live React Engine   HTTP Console       Live Chat / WS
│                  │                 │                 │                  │
└─────────────┬────┴─────────────────┴─────────────────┴──────────────────┘
│
▼
Distributed State Brokers (Local / Cloud)
├── y-websocket server (CRDT document provider)
└── Next.js App Router client state


---

## Quick Start

### Prerequisites
* Node.js 18.18+ or 20+
* npm, pnpm, or bun

### Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/miidaystudio/Dev-Huddles.git](https://github.com/miidaystudio/Dev-Huddles.git)
   cd Dev-Huddles
### Install dependencies:

```bash
npm install
```
### Start the local Yjs WebSocket sync server (Terminal 1):

```bash
npx y-websocket
(Runs on ws://localhost:1234 by default)
```
### Run the Next.js development server (Terminal 2):

```bash
npm run dev
```
Open the workspace:
Visit http://localhost:3000 or launch the test incident room directly at http://localhost:3000/room/INC-8420.

### Tech Stack
* Framework: Next.js 15 (App Router)
* Realtime Sync: Yjs, y-websocket, y-monaco
* Code Editor: @monaco-editor/react
* Preview Runtime: @codesandbox/sandpack-react
* Styling & Icons: Tailwind CSS, Lucide React
*Motion: Lenis, GSAP ScrollTrigger

License
Distributed under the MIT License. See LICENSE for details.
