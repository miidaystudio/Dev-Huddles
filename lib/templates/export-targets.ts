import { MotionPayload, ExportFormat } from '@/types/motion';
import { getEaseCSS } from '@/lib/utils';

export function generateExportCode(payload: MotionPayload, format: ExportFormat): string {
  switch (format) {
    case 'react-framer':
      return generateReactFramer(payload);
    case 'react-gsap':
      return generateReactGSAP(payload);
    case 'vanilla-gsap':
      return generateVanillaGSAP(payload);
    case 'tailwind-css':
      return generateTailwindCSS(payload);
    default:
      return payload.jsxCode;
  }
}

function generateReactFramer(payload: MotionPayload): string {
  const layerVariants = payload.layers.map(layer => {
    return `
  const ${layer.id.replace(/-/g, '_')}Variants = {
    hidden: { 
      opacity: ${layer.opacity ?? 0}, 
      y: ${layer.y ?? 0}, 
      scale: ${layer.scale ?? 1}, 
      rotate: ${layer.rotate ?? 0} 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      rotate: 0,
      transition: { 
        duration: ${layer.duration}, 
        delay: ${layer.delay}, 
        ease: "${layer.ease}" 
      }
    }
  };`;
  }).join('\n');

  return `import React from 'react';
import { motion } from 'framer-motion';

${layerVariants}

export default function ${payload.componentName || 'KineticComponent'}() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="kinetic-container"
    >
      ${payload.jsxCode}
    </motion.div>
  );
}`;
}

function generateReactGSAP(payload: MotionPayload): string {
  const gsapTimelineSteps = payload.layers.map(layer => {
    return `    gsap.fromTo(
      "${layer.selector}", 
      { opacity: ${layer.opacity ?? 0}, y: ${layer.y ?? 30}, scale: ${layer.scale ?? 0.95} },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: ${layer.duration}, 
        delay: ${layer.delay}, 
        stagger: ${layer.stagger ?? 0},
        ease: "${layer.ease}" 
      }
    );`;
  }).join('\n');

  return `import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function ${payload.componentName || 'KineticComponent'}() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
${gsapTimelineSteps}
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      ${payload.jsxCode}
    </div>
  );
}`;
}

function generateVanillaGSAP(payload: MotionPayload): string {
  const gsapSteps = payload.layers.map(layer => {
    return `gsap.fromTo('${layer.selector}', 
  { opacity: ${layer.opacity ?? 0}, y: ${layer.y ?? 30} },
  { opacity: 1, y: 0, duration: ${layer.duration}, delay: ${layer.delay}, ease: '${layer.ease}' }
);`;
  }).join('\n\n');

  return `<!-- Include GSAP CDN in <head> -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

<!-- Component Markup -->
<div id="kinetic-app">
  ${payload.jsxCode}
</div>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    ${gsapSteps}
  });
</script>`;
}

function generateTailwindCSS(payload: MotionPayload): string {
  const cssRules = payload.layers.map(layer => {
    const easeCSS = getEaseCSS(layer.ease);
    return `
/* Layer: ${layer.name} (${layer.selector}) */
${layer.selector} {
  animation: ${layer.id}-fade-in ${layer.duration}s ${easeCSS} ${layer.delay}s forwards;
  opacity: ${layer.opacity ?? 0};
}

@keyframes ${layer.id}-fade-in {
  from {
    opacity: ${layer.opacity ?? 0};
    transform: translateY(${layer.y ?? 0}px) scale(${layer.scale ?? 1});
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}`;
  }).join('\n');

  return `/* Add to your tailwind or global CSS file */
${cssRules}`;
}
