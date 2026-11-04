/**
 * App.tsx — The Living Atlas Master 5-World Scrollytelling Architecture
 *
 * Implements:
 * 1. Pinned 500vh Storytelling Stage driven by authoritative GSAP ScrollTrigger scrub
 * 2. The Atlas as Hero & Foreground commanding 75-85% of the viewport
 * 3. 5 synchronised 3D Worlds: Grand Observatory, Subterranean Engine, Engineering Worlds,
 *    Festival Experience, Final Destination
 * 4. Ornate decorative brass filigree information frames (DecorativeGoldFrame)
 * 5. Dynamic SVG leader lines tracking projected 3D focal coordinates
 * 6. Interactive Vertical Nav Rail with direct click-to-scrub navigation
 * 7. Cinematic 1.7-second reveal curtain eliminating all FOUC
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { InitialRevealCurtain } from '../components/InitialRevealCurtain';
import { VerticalNavRail } from '../components/VerticalNavRail';
import { LeaderLine } from '../components/LeaderLine';
import { ImmersiveCanvas } from '../scene/ImmersiveCanvas';
import { ObservatoryWorldFrame } from '../sections/worlds/ObservatoryWorldFrame';
import { SubterraneanWorldFrame } from '../sections/worlds/SubterraneanWorldFrame';
import { EngineeringWorldFrame } from '../sections/worlds/EngineeringWorldFrame';
import { FestivalWorldFrame } from '../sections/worlds/FestivalWorldFrame';
import { FinalDestinationWorldFrame } from '../sections/worlds/FinalDestinationWorldFrame';
import {
  setScrollProgress,
  getActiveWorldIndex,
  WORLDS,
} from '../motion/scrollState';
import styles from './App.module.css';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const LEADER_ANCHORS = [
  { x: 28, y: 50 }, // World 01 (Left Frame)
  { x: 72, y: 45 }, // World 02 (Right Frame)
  { x: 28, y: 50 }, // World 03 (Left Frame)
  { x: 72, y: 50 }, // World 04 (Right Frame)
  { x: 50, y: 32 }, // World 05 (Center Frame)
];

export const App: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Initialize GSAP ScrollTrigger master scrub timeline
  useEffect(() => {
    if (!trackRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: trackRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: (self) => {
        const prog = self.progress;
        setScrollProgress(prog, self.getVelocity());

        // Update top progress bar
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${(prog * 100).toFixed(1)}%`;
        }

        // Update active world index
        const idx = getActiveWorldIndex(prog);
        setActiveIndex(idx);

        if (prog > 0.02) {
          setShowScrollHint(false);
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Track font decoding readiness
  useEffect(() => {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready
        .then(() => setFontsReady(true))
        .catch(() => setFontsReady(true));
    } else {
      setFontsReady(true);
    }
  }, []);

  const handleCanvasReady = useCallback(() => {
    setCanvasReady(true);
  }, []);

  const handleLoadProgress = useCallback((prog: number) => {
    setLoadProgress(prog);
  }, []);

  // Jump to specific world on dot or rail click
  const handleWorldClick = (index: number) => {
    const targetProg = WORLDS[index].range[0] + 0.01;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: targetProg * maxScroll,
      behavior: 'smooth',
    });
  };

  const isReady = canvasReady && fontsReady;

  return (
    <div className={styles.appRoot}>
      {/* Accessible skip link */}
      <a href="#story-stage" className={styles.skipLink}>
        Skip to main content
      </a>

      {/* Cinematic 1.7-second reveal curtain */}
      <InitialRevealCurtain
        isReady={isReady}
        loadProgress={loadProgress}
      />

      {/* Global Navigation — above the stage (z:50) */}
      <Navbar />

      {/* Global scroll progress line at top of viewport */}
      <div
        ref={progressBarRef}
        className={styles.storyProgressBar}
        style={{ width: '0%' }}
        aria-hidden="true"
      />

      {/* Persistent Left-Edge Vertical World Navigation Rail */}
      <VerticalNavRail onSelectWorld={handleWorldClick} />

      {/* Right-edge chapter navigation dots */}
      <nav className={styles.chapterNav} aria-label="World Navigation">
        {WORLDS.map((w, idx) => (
          <button
            key={w.id}
            type="button"
            className={`${styles.chapterDot} ${
              activeIndex === idx ? styles.chapterDotActive : ''
            }`}
            onClick={() => handleWorldClick(idx)}
            aria-label={`Jump to World ${w.number}: ${w.title}`}
            aria-current={activeIndex === idx ? 'step' : undefined}
          />
        ))}
      </nav>

      {/* 500vh Native Scroll Track */}
      <div ref={trackRef} className={styles.storyTrack} id="story-track">
        {/* Pinned 100vh Storytelling Viewport Stage */}
        <main id="story-stage" className={styles.pinnedStage}>
          {/* Fixed 3D Atlas Stage — Foreground Hero */}
          <div className={styles.canvasContainer}>
            <ImmersiveCanvas
              onCanvasReady={handleCanvasReady}
              onLoadProgress={handleLoadProgress}
            />
          </div>

          {/* Dynamic SVG Leader Line connecting Active Frame to 3D Focal Point */}
          <LeaderLine
            sourceX={LEADER_ANCHORS[activeIndex]?.x ?? 30}
            sourceY={LEADER_ANCHORS[activeIndex]?.y ?? 50}
            visible={isReady && activeIndex < 5}
          />

          {/* Synchronized Ornate Gold Information Frames Overlay */}
          <div className={styles.editorialStage}>
            {/* World 01 — The Grand Observatory */}
            <ObservatoryWorldFrame
              active={activeIndex === 0}
              onExploreClick={() => handleWorldClick(1)}
            />

            {/* World 02 — The Subterranean Engine */}
            <SubterraneanWorldFrame active={activeIndex === 1} />

            {/* World 03 — Engineering Worlds */}
            <EngineeringWorldFrame active={activeIndex === 2} />

            {/* World 04 — The Techfest Experience */}
            <FestivalWorldFrame active={activeIndex === 3} />

            {/* World 05 — The Final Destination */}
            <FinalDestinationWorldFrame active={activeIndex === 4} />
          </div>
        </main>
      </div>

      {/* Scroll indicator — fades when user starts scrolling */}
      {showScrollHint && (
        <div className={styles.scrollIndicator} aria-hidden="true">
          <div className={styles.scrollIndicatorLine} />
          <div className={styles.scrollIndicatorDot} />
        </div>
      )}

      {/* Global footer with verified attribution */}
      <Footer />
    </div>
  );
};
