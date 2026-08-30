import { z } from 'zod';

export const ControllablePropSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['number', 'string', 'boolean', 'select']),
  value: z.union([z.number(), z.string(), z.boolean()]),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  options: z.array(z.string()).optional(),
  unit: z.string().optional(),
  description: z.string().optional(),
});

export const MotionLayerSchema = z.object({
  id: z.string(),
  selector: z.string(),
  name: z.string(),
  opacity: z.number().optional(),
  scale: z.number().optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  rotate: z.number().optional(),
  skewX: z.number().optional(),
  blur: z.number().optional(),
  duration: z.number(),
  delay: z.number(),
  stagger: z.number().optional(),
  ease: z.enum([
    'power1.out',
    'power2.out',
    'power3.out',
    'power4.out',
    'back.out',
    'elastic.out',
    'bounce.out',
    'sine.inOut',
    'cubic-bezier'
  ]),
  cubicBezier: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
  repeat: z.number().optional(),
  yoyo: z.boolean().optional(),
});

export const MotionPayloadSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  engine: z.enum(['gsap', 'framer-motion']),
  componentName: z.string(),
  layers: z.array(MotionLayerSchema),
  controllableProps: z.array(ControllablePropSchema),
  jsxCode: z.string(),
  cssCode: z.string().optional(),
});

export type MotionPayloadZod = z.infer<typeof MotionPayloadSchema>;
