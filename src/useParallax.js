import { useRef, useCallback, useEffect } from "react";

/**
 * useParallax
 *
 * Tracks mouse position relative to a container and applies a CSS 3D
 * perspective transform (rotateX / rotateY) that creates a Z-axis depth
 * parallax effect — the "living" spatial feel described in the spec.
 *
 * All animation runs inside requestAnimationFrame so it never causes
 * React re-renders. The rAF loop is cancelled on unmount to prevent
 * memory leaks (same intent as Three.js dispose()).
 *
 * @param {number} strength   Max rotation in degrees (default 8)
 * @param {number} perspective CSS perspective in px (default 900)
 */
export function useParallax(strength = 8, perspective = 900) {
  const elRef    = useRef(null);
  const frameRef = useRef(null);
  const current  = useRef({ x: 0, y: 0 });
  const target   = useRef({ x: 0, y: 0 });

  const onMouseMove = useCallback(
    (e) => {
      const el = elRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      target.current = {
        x: ((e.clientX - rect.left - rect.width  / 2) / rect.width)  * strength,
        y: ((e.clientY - rect.top  - rect.height / 2) / rect.height) * strength,
      };
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => {
    target.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    let active = true;
    // Snapshot the DOM element at mount time so the cleanup closure can
    // safely reference it even after the component unmounts
    // (react-hooks/exhaustive-deps recommends this pattern).
    const el = elRef.current;

    function tick() {
      if (!active) return;
      const { x: tx, y: ty } = target.current;
      const { x: cx, y: cy } = current.current;
      // Lerp for smooth easing toward target
      const nx = cx + (tx - cx) * 0.1;
      const ny = cy + (ty - cy) * 0.1;
      current.current = { x: nx, y: ny };

      if (el) {
        el.style.transform =
          `perspective(${perspective}px) rotateY(${nx}deg) rotateX(${-ny}deg) translateZ(0)`;
      }
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);

    // Cleanup — cancels the rAF loop on unmount (equivalent to Three.js dispose)
    return () => {
      active = false;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      // Reset transform so the element doesn't freeze in a rotated state
      if (el) {
        el.style.transform = "";
      }
    };
  }, [perspective]);

  return { ref: elRef, onMouseMove, onMouseLeave };
}
