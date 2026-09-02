# ⚡ Kinetic UI

> **AI Motion Compiler & Interactive Studio Workbench for Web Component Animations**

Kinetic UI transforms natural language descriptions into 60fps physics-driven web animations, interactive spring physics, and exportable React (Framer Motion / GSAP), Vanilla JavaScript, and Tailwind CSS code.

---

## ✨ Features

- 🪄 **AI Motion Synthesis**: Synthesize organic keyframes, layer stagger delays, and ease curves from natural language prompts.
- 🎛️ **Visual Physics Inspector**: Live parameter knobs for layer duration, delay, y-offset, scale, spring elasticity, and custom bezier profiles.
- 📐 **Responsive Viewport Canvas**: Inspect animations across Desktop (100%), Laptop (1024px), Tablet (768px), and Mobile (375px) device viewports with optional canvas grid.
- ⚡ **Multi-Target Exporter**: Instant production code generation for:
  - React + Framer Motion
  - React + GSAP (`useGSAP` / `useEffect`)
  - Vanilla JavaScript + GSAP
  - HTML + Tailwind CSS Animation Keyframes
- 🧩 **Preset Library**: Quick-start chips for Bento Grid Staggers, Magnetic Glass Cards, Elastic Pop Modals, and Kinetic Text Cascades.

---

## 📁 Repository Structure

```tree
kinetic-ui/
├── app/
│   ├── api/
│   │   └── generate-motion/
│   │       └── route.ts          # AI motion compiler endpoint (structured Zod schema)
│   ├── playground/
│   │   └── page.tsx              # Studio workbench route
│   ├── globals.css               # Core CSS & glassmorphism design tokens
│   ├── layout.tsx                # Next.js App Router root layout
│   └── page.tsx                  # Marketing / showcase landing page
├── components/
│   ├── editor/
│   │   ├── CodeEditor.tsx        # Interactive code editor for JSX & payload JSON
│   │   ├── PromptBar.tsx         # AI prompt input with quick-preset chips
│   │   └── Toolbar.tsx           # Playback, speed multiplier & multi-target exporter
│   ├── inspector/
│   │   ├── SliderControl.tsx     # Dynamic range inputs for duration, stagger, delay
│   │   ├── EasePicker.tsx        # Easing profile curve selector (Power4, Back, Elastic)
│   │   └── InspectorPanel.tsx    # Right sidebar mapping layer parameters to UI
│   ├── preview/
│   │   ├── SandboxFrame.tsx      # Interactive sandbox canvas with spring physics
│   │   └── ViewportControls.tsx  # Device size toggles (Desktop, Laptop, Tablet, Mobile)
│   └── ui/                       # Base design tokens & button components
├── lib/
│   ├── ai/
│   │   ├── motion-schema.ts      # Zod validation schema for motion payloads
│   │   └── prompts.ts            # System prompt rules & animation preset chips
│   ├── templates/
│   │   ├── initial-components.ts # Default starter components (Bento Grid, Hero Banner)
│   │   └── export-targets.ts     # Code generators for React, Tailwind, and Vanilla JS
│   └── utils.ts                  # Classname utilities & CSS easing converters
├── types/
│   └── motion.ts                 # TypeScript interfaces for motion payload & layers
├── .gitignore
├── LICENSE                       # Apache License 2.0
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `^18.17.0` or `^20.0.0`
- npm `^9.0.0` or yarn / pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/miidaystudio/kinetic-ui.git
   cd kinetic-ui
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - Marketing Showcase Page: `http://localhost:3000`
   - Studio Workbench: `http://localhost:3000/playground`

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14/15 App Router](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation Engine**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Schema Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📄 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.
