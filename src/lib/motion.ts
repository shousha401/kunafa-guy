/**
 * CSS transition presets — hand-rolled, no framer-motion.
 * Duration law: 200ms UI, 400ms section reveals, 600ms cheese-pull max.
 */
export const reveal = (inView: boolean, reduced: boolean, delayMs = 0) =>
  reduced
    ? { opacity: inView ? 1 : 0, transition: 'opacity 0.01ms' }
    : {
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 400ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms, transform 400ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms`,
      };
