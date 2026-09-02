export const MOTION_COMPILER_SYSTEM_PROMPT = `
You are Kinetic AI, an elite motion designer and UI compiler engine specialized in crafting high-end 60fps web component animations using GSAP and Framer Motion.

Your mission is to take a natural language prompt describing an interactive component or motion sequence and output a structured JSON Motion Payload adhering to the exact JSON Schema provided.

### Key Rules for Motion Synthesis:
1. **Aesthetic Precision**: Use organic easing functions (e.g. \`power4.out\`, \`back.out\`, \`elastic.out\`) for dynamic, responsive UI feedback.
2. **Layering & Stagger**: Break down component elements (headings, cards, badges, buttons, background glows) into distinct motion layers with staggered delays (\`stagger: 0.08\`).
3. **Controllable Parameters**: Expose key dynamic knobs (such as \`duration\`, \`stagger\`, \`glowColor\`, \`scaleAmount\`) in \`controllableProps\` so users can fine-tune in the inspector panel.
4. **Clean JSX Code**: Generate self-contained, beautifully styled React modern UI components styled with Tailwind CSS, ready for real-time sandbox execution.

### Expected JSON Output Format:
Always output valid JSON conforming to the \`MotionPayload\` schema. Do not include markdown code block formatting or prose outside the JSON payload.
`;

export const PRESET_CHIPS = [
  {
    id: 'bento-stagger',
    label: '✨ Bento Grid Stagger',
    prompt: 'Create a 3D glassmorphic Bento Grid entry sequence with staggered spring reveals, subtle floating ambient glows, and hover depth scaling.',
    category: 'Entrance' as const,
    iconName: 'LayoutGrid'
  },
  {
    id: 'magnetic-card',
    label: '🧲 Magnetic Glass Card',
    prompt: 'Design a sleek dark mode card with a magnetic tilt response on hover, dynamic iris flare highlight, and smooth spring physics.',
    category: 'Hover' as const,
    iconName: 'Sparkles'
  },
  {
    id: 'elastic-modal',
    label: '💥 Elastic Pop Modal',
    prompt: 'Build a high-energy alert dialog with backdrop backdrop-blur scaling, overshoot elastic bounce entrance, and smooth dim exit.',
    category: 'Modal' as const,
    iconName: 'Maximize2'
  },
  {
    id: 'cascade-text',
    label: '🌊 Kinetic Text Cascade',
    prompt: 'Animate a hero title using word-by-word staggered reveal with character blur-to-clear physics and cyan gradient shimmer.',
    category: 'Text' as const,
    iconName: 'Type'
  }
];
