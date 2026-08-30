export type EaseType = 
  | 'power1.out' 
  | 'power2.out' 
  | 'power3.out' 
  | 'power4.out' 
  | 'back.out' 
  | 'elastic.out' 
  | 'bounce.out' 
  | 'sine.inOut'
  | 'cubic-bezier';

export type ExportFormat = 'react-framer' | 'react-gsap' | 'vanilla-gsap' | 'tailwind-css';

export type ViewportMode = 'desktop' | 'laptop' | 'tablet' | 'mobile';

export interface ControllableProp {
  id: string;
  name: string;
  type: 'number' | 'string' | 'boolean' | 'select';
  value: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  unit?: string;
  description?: string;
}

export interface MotionLayer {
  id: string;
  selector: string;
  name: string;
  opacity?: number;
  scale?: number;
  x?: number;
  y?: number;
  rotate?: number;
  skewX?: number;
  blur?: number;
  duration: number;
  delay: number;
  stagger?: number;
  ease: EaseType;
  cubicBezier?: [number, number, number, number];
  repeat?: number;
  yoyo?: boolean;
}

export interface MotionPayload {
  id: string;
  title: string;
  description: string;
  engine: 'gsap' | 'framer-motion';
  componentName: string;
  layers: MotionLayer[];
  controllableProps: ControllableProp[];
  jsxCode: string;
  cssCode?: string;
}

export interface PresetChip {
  id: string;
  label: string;
  prompt: string;
  category: 'Entrance' | 'Hover' | 'Scroll' | 'Modal' | 'Text';
  iconName?: string;
}

export interface ComponentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultPayload: MotionPayload;
}
