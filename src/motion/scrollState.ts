/**
 * scrollState.ts — Authoritative Scrollytelling State Manager
 *
 * Single authoritative source of truth for the master pinned scrollytelling timeline.
 * Synchronizes:
 * - GSAP ScrollTrigger scrub progress [0.0, 1.0]
 * - 6 distinct chapter ranges
 * - R3F camera positions & lookAt targets
 * - Screen-space projected focal point for dynamic SVG leader lines
 * - Zero React DOM re-renders on scroll ticks
 */

export interface ChapterDef {
  id: string;
  number: string;
  title: string;
  range: [number, number]; // [startProgress, endProgress]
  focalPoint3D: [number, number, number];
}

export const CHAPTERS: ChapterDef[] = [
  {
    id: 'discovery',
    number: '00',
    title: 'The Discovery',
    range: [0.0, 0.16],
    focalPoint3D: [0.0, 0.5, 0.0],
  },
  {
    id: 'robotics',
    number: '01',
    title: 'Robotics & Kinetic Systems',
    range: [0.16, 0.34],
    focalPoint3D: [-0.4, -0.8, 0.3],
  },
  {
    id: 'aerospace',
    number: '02',
    title: 'Aerospace & Orbital Dynamics',
    range: [0.34, 0.5],
    focalPoint3D: [1.3, 1.4, -0.2],
  },
  {
    id: 'computing',
    number: '03',
    title: 'Cognitive Computing & Intelligence',
    range: [0.5, 0.68],
    focalPoint3D: [0.0, 0.55, 0.0],
  },
  {
    id: 'sustainability',
    number: '04',
    title: 'Sustainable Earth Systems',
    range: [0.68, 0.84],
    focalPoint3D: [-0.8, -1.2, 0.5],
  },
  {
    id: 'finale',
    number: '05',
    title: 'Enter Techfest 30',
    range: [0.84, 1.0],
    focalPoint3D: [0.0, 1.4, 0.0],
  },
];

export interface ScrollState {
  progress: number;
  scrollY: number;
  maxScroll: number;
  velocity: number;
  activeChapterIndex: number;
  projectedFocalPoint: { x: number; y: number };
}

export const scrollState: ScrollState = {
  progress: 0,
  scrollY: 0,
  maxScroll: 1,
  velocity: 0,
  activeChapterIndex: 0,
  projectedFocalPoint: { x: 50, y: 50 },
};

export function getActiveChapterIndex(prog: number): number {
  for (let i = 0; i < CHAPTERS.length; i++) {
    const [start, end] = CHAPTERS[i].range;
    if (prog >= start && (prog < end || (i === CHAPTERS.length - 1 && prog <= end))) {
      return i;
    }
  }
  return 0;
}

type ScrollListener = (state: Readonly<ScrollState>) => void;
const listeners = new Set<ScrollListener>();

export function setScrollProgress(prog: number, vel = 0): void {
  const clamped = Math.min(1, Math.max(0, prog));
  scrollState.velocity = vel || clamped - scrollState.progress;
  scrollState.progress = clamped;
  scrollState.activeChapterIndex = getActiveChapterIndex(clamped);

  listeners.forEach((fn) => {
    try {
      fn(scrollState);
    } catch (e) {
      console.error('Error in scroll listener', e);
    }
  });
}

export function setProjectedFocalPoint(x: number, y: number): void {
  scrollState.projectedFocalPoint.x = x;
  scrollState.projectedFocalPoint.y = y;
}

export function subscribeScroll(listener: ScrollListener): () => void {
  listeners.add(listener);
  listener(scrollState);
  return () => {
    listeners.delete(listener);
  };
}
