import { NextRequest, NextResponse } from 'next/server';
import { MotionPayload } from '@/types/motion';
import { MotionPayloadSchema } from '@/lib/ai/motion-schema';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Determine animation parameters intelligently based on prompt keywords
    const lowerPrompt = prompt.toLowerCase();
    
    const isElastic = lowerPrompt.includes('elastic') || lowerPrompt.includes('spring') || lowerPrompt.includes('pop');
    const isBento = lowerPrompt.includes('bento') || lowerPrompt.includes('grid');
    const isHero = lowerPrompt.includes('hero') || lowerPrompt.includes('title') || lowerPrompt.includes('text');

    const ease = isElastic ? 'elastic.out' : isBento ? 'back.out' : 'power4.out';

    const generatedPayload: MotionPayload = {
      id: `generated-${Date.now()}`,
      title: isBento ? 'Dynamic Bento Grid Motion' : isHero ? 'Kinetic Hero Cascade' : 'AI Compiled Motion Component',
      description: `Structured animation compiled for prompt: "${prompt}"`,
      engine: 'framer-motion',
      componentName: 'KineticGeneratedComponent',
      controllableProps: [
        {
          id: 'duration',
          name: 'Layer Duration',
          type: 'number',
          value: isElastic ? 0.9 : 0.65,
          min: 0.2,
          max: 2.5,
          step: 0.1,
          unit: 's'
        },
        {
          id: 'stagger',
          name: 'Stagger Interval',
          type: 'number',
          value: 0.1,
          min: 0.02,
          max: 0.5,
          step: 0.02,
          unit: 's'
        }
      ],
      layers: [
        {
          id: 'header-layer',
          selector: '.hero-title',
          name: 'Primary Title & Badge',
          opacity: 1,
          y: -35,
          duration: 0.7,
          delay: 0,
          ease: ease
        },
        {
          id: 'cards-layer',
          selector: '.bento-card',
          name: 'Interactive Cards Stack',
          opacity: 1,
          scale: 1,
          y: 45,
          duration: 0.85,
          delay: 0.15,
          stagger: 0.12,
          ease: 'back.out'
        }
      ],
      jsxCode: `export default function KineticGeneratedComponent() {
  return (
    <div className="w-full max-w-4xl p-8 bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl space-y-6">
      <div className="hero-title text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">${prompt}</h2>
        <p className="text-sm text-slate-400">AI Motion Compiled Layer Sequence</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bento-card p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <h4 className="font-bold text-indigo-400">Primary Keyframe</h4>
        </div>
        <div className="bento-card p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <h4 className="font-bold text-purple-400">Spring Physics</h4>
        </div>
        <div className="bento-card p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <h4 className="font-bold text-emerald-400">Ease Curve</h4>
        </div>
      </div>
    </div>
  );
}`
    };

    // Validate payload against schema
    const validated = MotionPayloadSchema.parse(generatedPayload);

    return NextResponse.json({ payload: validated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Compilation failed' }, { status: 500 });
  }
}
