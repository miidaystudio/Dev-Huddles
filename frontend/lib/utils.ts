import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEaseName(ease: string): string {
  switch (ease) {
    case 'power1.out': return 'Smooth Soft (Power1)';
    case 'power2.out': return 'Standard Ease Out (Power2)';
    case 'power3.out': return 'Crisp Ease Out (Power3)';
    case 'power4.out': return 'Dramatic Snap (Power4)';
    case 'back.out': return 'Overshoot Pop (Back)';
    case 'elastic.out': return 'Spring Bounce (Elastic)';
    case 'bounce.out': return 'Impact Bounce';
    case 'sine.inOut': return 'Sine Smooth Wave';
    default: return ease;
  }
}

export function getEaseCSS(ease: string): string {
  switch (ease) {
    case 'power1.out': return 'cubic-bezier(0.25, 1, 0.5, 1)';
    case 'power2.out': return 'cubic-bezier(0.16, 1, 0.3, 1)';
    case 'power3.out': return 'cubic-bezier(0.215, 0.61, 0.355, 1)';
    case 'power4.out': return 'cubic-bezier(0.075, 0.82, 0.165, 1)';
    case 'back.out': return 'cubic-bezier(0.34, 1.56, 0.64, 1)';
    case 'elastic.out': return 'cubic-bezier(0.68, -0.6, 0.32, 1.6)';
    case 'sine.inOut': return 'cubic-bezier(0.37, 0, 0.63, 1)';
    default: return 'ease-out';
  }
}
