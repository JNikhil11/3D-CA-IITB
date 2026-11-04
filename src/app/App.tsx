/**
 * App.tsx — The Living Atlas Master Pinned Scrollytelling Architecture
 *
 * Architecture:
 * 1. Pinned 600vh Storytelling Stage driven by authoritative GSAP ScrollTrigger scrub
 * 2. The Atlas as Hero & Foreground commanding 75-85% of the viewport
 * 3. 6 synchronised chapters: Discovery, Robotics, Aerospace, Computing, Sustainability, Finale
 * 4. Zero rectangular card boxes: pure negative space editorial typography with SVG leader lines
 * 5. Full backwards scrub capability with natural reverse animations
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { InitialRevealCurtain } from '../components/InitialRevealCurtain';
import { ImmersiveCanvas } from '../scene/ImmersiveCanvas';
import { DiscoveryChapter } from '../sections/chapters/DiscoveryChapter';
import { RoboticsChapter } from '../sections/chapters/RoboticsChapter';
import { AerospaceChapter } from '../sections/chapters/AerospaceChapter';
import { ComputingChapter } from '../sections/chapters/ComputingChapter';
import { SustainabilityChapter } from '../sections/chapters/SustainabilityChapter';
import { FinaleChapter } from '../sections/chapters/FinaleChapter';
import {
  setScrollProgress,
  getActiveChapterIndex,
  CHAPTERS,
} from '../motion/scrollState';
import styles from './App.module.css';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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

        // Update active chapter index
        const idx = getActiveChapterIndex(prog);
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

  // Jump to specific chapter on dot click
  const handleChapterClick = (index: number) => {
    const targetProg = CHAPTERS[index].range[0] + 0.01;
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

      {/* Right-edge chapter navigation dots */}
      <nav className={styles.chapterNav} aria-label="Chapter Navigation">
        {CHAPTERS.map((ch, idx) => (
          <button
            key={ch.id}
            type="button"
            className={`${styles.chapterDot} ${activeIndex === idx ? styles.chapterDotActive : ''}`}
            onClick={() => handleChapterClick(idx)}
            aria-label={`Jump to Chapter ${ch.number}: ${ch.title}`}
            aria-current={activeIndex === idx ? 'step' : undefined}
          />
        ))}
      </nav>

      {/* 600vh Native Scroll Track */}
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

          {/* Synchronized Negative Space Editorial Chapters Overlay */}
          <div className={styles.editorialStage}>
            {/* Chapter 00 — The Discovery */}
            <DiscoveryChapter
              active={activeIndex === 0}
              onExploreClick={() => handleChapterClick(1)}
            />

            {/* Chapter 01 — Robotics & Kinetic Systems */}
            <RoboticsChapter active={activeIndex === 1} />

            {/* Chapter 02 — Aerospace & Orbital Dynamics */}
            <AerospaceChapter active={activeIndex === 2} />

            {/* Chapter 03 — Cognitive Computing & Intelligence */}
            <ComputingChapter active={activeIndex === 3} />

            {/* Chapter 04 — Sustainable Earth Systems */}
            <SustainabilityChapter active={activeIndex === 4} />

            {/* Chapter 05 — Enter Techfest 30 Grand Finale */}
            <FinaleChapter active={activeIndex === 5} />
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
