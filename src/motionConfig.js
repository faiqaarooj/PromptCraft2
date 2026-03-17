// ─────────────────────────────────────────────────────────────
//  MOTION CONFIG — all Framer Motion variants live here.
//  Kept separate from functional logic per the "modular code"
//  requirement so animation tuning never touches business logic.
// ─────────────────────────────────────────────────────────────

/** Tab content fade + subtle Y slide */
export const tabVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -6 },
};

export const tabTransition = {
  duration: 0.22,
  ease: [0.4, 0, 0.2, 1],
};

/**
 * Builder phase directional slide.
 * Pass the direction integer as the `custom` prop:
 *   +1 → forward (left-to-right slide out, right-to-left slide in)
 *   -1 → backward
 */
export const phaseVariants = {
  initial: (dir) => ({ opacity: 0, x: dir > 0 ? 32 : -32 }),
  animate: { opacity: 1, x: 0 },
  exit:    (dir) => ({ opacity: 0, x: dir > 0 ? -32 : 32 }),
};

export const phaseTransition = {
  duration: 0.24,
  ease: [0.4, 0, 0.2, 1],
};

/** Toast notification spring pop */
export const toastVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0,  scale: 1    },
  exit:    { opacity: 0, y: 12, scale: 0.97 },
};

export const toastTransition = {
  type: "spring",
  stiffness: 420,
  damping: 28,
};

/**
 * Props to spread onto any <motion.button> or <motion.div> to give a
 * tactile "press down" depth effect on click.
 */
export const pressProps = {
  whileTap: { scale: 0.96, y: 1 },
  transition: { type: "spring", stiffness: 600, damping: 30 },
};

/** Subtle lift on hover for cards */
export const cardHoverProps = {
  whileHover: { y: -2, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" },
  transition: { type: "spring", stiffness: 400, damping: 30 },
};
