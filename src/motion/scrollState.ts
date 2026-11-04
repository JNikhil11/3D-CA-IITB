/**
 * scrollState.ts — Zero-Re-render Scroll State Manager
 *
 * Keeps scroll metrics in a lightweight mutable singleton.
 * R3F useFrame loops read scrollState.progress directly without triggering
 * React DOM reconciliations or component re-renders.
 */

export interface ScrollState {
  progress: number;
  scrollY: number;
  maxScroll: number;
  velocity: number;
}

export const scrollState: ScrollState = {
  progress: 0,
  scrollY: 0,
  maxScroll: 1,
  velocity: 0,
};

type ScrollListener = (state: Readonly<ScrollState>) => void;
const listeners = new Set<ScrollListener>();

let initialized = false;
let ticking = false;

export function updateScrollState(): void {
  if (typeof window === 'undefined') return;

  const scrollY = window.scrollY || window.pageYOffset || 0;
  const maxScroll = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

  scrollState.velocity = progress - scrollState.progress;
  scrollState.progress = progress;
  scrollState.scrollY = scrollY;
  scrollState.maxScroll = maxScroll;

  listeners.forEach((fn) => {
    try {
      fn(scrollState);
    } catch (e) {
      console.error('Error in scroll listener', e);
    }
  });
}

export function initScrollListener(): () => void {
  if (typeof window === 'undefined' || initialized) {
    return () => {};
  }

  initialized = true;

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollState();
        ticking = false;
      });
      ticking = true;
    }
  };

  const onResize = () => {
    updateScrollState();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });

  // Initial calculation
  updateScrollState();

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', onResize);
    initialized = false;
  };
}

export function subscribeScroll(listener: ScrollListener): () => void {
  listeners.add(listener);
  listener(scrollState);
  return () => {
    listeners.delete(listener);
  };
}
