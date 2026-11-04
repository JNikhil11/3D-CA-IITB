/**
 * scrollState.ts — Authoritative 5-World Scrollytelling State Manager
 *
 * Coordinates:
 * - GSAP ScrollTrigger scrub progress [0.0, 1.0] across 5 monumental worlds
 * - R3F camera positions & lookAt targets
 * - Screen-space projected focal point for dynamic SVG leader lines
 * - Zero React DOM re-renders on high-frequency scroll ticks
 */

export interface WorldDef {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  range: [number, number]; // [startProgress, endProgress]
  focalPoint3D: [number, number, number];
}

export const WORLDS: WorldDef[] = [
  {
    id: 'observatory',
    number: '01',
    title: 'The Grand Observatory',
    subtitle: 'Celestial Vault & Astrolabe Rotunda',
    range: [0.0, 0.2],
    focalPoint3D: [0.0, 0.5, 0.0],
  },
  {
    id: 'subterranean-engine',
    number: '02',
    title: 'The Subterranean Engine',
    subtitle: 'Kinematic Machine & Control Deck',
    range: [0.2, 0.4],
    focalPoint3D: [0.0, -1.2, 1.4],
  },
  {
    id: 'engineering-worlds',
    number: '03',
    title: 'Engineering Worlds',
    subtitle: 'Robotics, Aerospace, Computing & Earth',
    range: [0.4, 0.65],
    focalPoint3D: [1.2, 1.2, 0.0],
  },
  {
    id: 'festival-experience',
    number: '04',
    title: 'The Techfest Experience',
    subtitle: 'Technoholix Lasers & Ozone Arena',
    range: [0.65, 0.85],
    focalPoint3D: [-1.4, 0.4, 0.0],
  },
  {
    id: 'final-destination',
    number: '05',
    title: 'The Final Destination',
    subtitle: 'Sky Beacon & Registration Portal',
    range: [0.85, 1.0],
    focalPoint3D: [0.0, 1.8, 0.0],
  },
];

export type ChapterDef = WorldDef;
export const CHAPTERS = WORLDS;
export const getActiveChapterIndex = getActiveWorldIndex;

export interface ScrollState {
  progress: number;
  scrollY: number;
  maxScroll: number;
  velocity: number;
  activeWorldIndex: number;
  activeChapterIndex: number;
  projectedFocalPoint: { x: number; y: number };
}

export const scrollState: ScrollState = {
  progress: 0,
  scrollY: 0,
  maxScroll: 1,
  velocity: 0,
  activeWorldIndex: 0,
  activeChapterIndex: 0,
  projectedFocalPoint: { x: 50, y: 50 },
};

export function getActiveWorldIndex(prog: number): number {
  for (let i = 0; i < WORLDS.length; i++) {
    const [start, end] = WORLDS[i].range;
    if (prog >= start && (prog < end || (i === WORLDS.length - 1 && prog <= end))) {
      return i;
    }
  }
  return 0;
}

export function getWorldProgress(prog: number, worldIndex: number): number {
  const [start, end] = WORLDS[worldIndex].range;
  if (prog < start) return 0;
  if (prog > end) return 1;
  return (prog - start) / (end - start);
}

type ScrollListener = (state: Readonly<ScrollState>) => void;
const listeners = new Set<ScrollListener>();

export function setScrollProgress(prog: number, vel = 0): void {
  const clamped = Math.min(1, Math.max(0, prog));
  scrollState.velocity = vel || clamped - scrollState.progress;
  scrollState.progress = clamped;
  scrollState.activeWorldIndex = getActiveWorldIndex(clamped);
  scrollState.activeChapterIndex = scrollState.activeWorldIndex;

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
