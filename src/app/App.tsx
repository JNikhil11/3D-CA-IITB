/**
 * App.tsx — Immersive Full-Bleed 3D Architecture
 *
 * Performance & Visual Delivery:
 * 1. Coordinated 1.7-second cinematic reveal curtain (no FOUC, no pop-in)
 * 2. High-performance scroll tracking decoupled from React state (zero DOM re-renders on scroll)
 * 3. Translucent Renaissance vellum content panels revealing 3D atlas behind
 * 4. High-contrast carbon ink typography for AAA legibility
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { InitialRevealCurtain } from '../components/InitialRevealCurtain';
import { ImmersiveCanvas } from '../scene/ImmersiveCanvas';
import { HeroChapter } from '../sections/chapters/HeroChapter';
import { EnterEngineChapter } from '../sections/chapters/EnterEngineChapter';
import { WorldsChapter } from '../sections/chapters/WorldsChapter';
import { FestivalChapter } from '../sections/chapters/FestivalChapter';
import { FinaleChapter } from '../sections/chapters/FinaleChapter';
import { initScrollListener, subscribeScroll } from '../motion/scrollState';
import styles from './App.module.css';

export const App: React.FC = () => {
  const [canvasReady, setCanvasReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Initialize decoupled scroll listener
  useEffect(() => {
    const cleanupScroll = initScrollListener();
    const cleanupSub = subscribeScroll((state) => {
      if (state.scrollY > 80) {
        setShowScrollHint(false);
      }
    });

    return () => {
      cleanupScroll();
      cleanupSub();
    };
  }, []);

  // Track font loading
  useEffect(() => {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready
        .then(() => setFontsReady(true))
        .catch(() => setFontsReady(true)); // Fallback if font API errors
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

  const handleCurtainExited = useCallback(() => {
    setIsRevealed(true);
  }, []);

  // Reveal experience when assets and canvas are confirmed ready
  const isReady = canvasReady && fontsReady;

  return (
    <div className={styles.appRoot}>
      {/* Accessible skip link */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      {/* Cinematic 1.7-second reveal curtain */}
      <InitialRevealCurtain
        isReady={isReady}
        loadProgress={loadProgress}
        onExited={handleCurtainExited}
      />

      {/* Global Navigation — above the canvas (z:50) */}
      <Navbar />

      {/* Fixed 3D Canvas — lives behind everything at z:0 */}
      <ImmersiveCanvas
        onCanvasReady={handleCanvasReady}
        onLoadProgress={handleLoadProgress}
      />

      {/* Scroll-driven editorial chapters — z:10, scroll over canvas with vellum cards */}
      <main
        id="main-content"
        className={`${styles.scrollStream} ${isRevealed ? styles.scrollStreamRevealed : ''}`}
      >
        {/* Chapter 00 — Opening: The Aether Engine */}
        <section
          id="hero"
          className={`${styles.chapterPanel} ${styles.heroPanel} ${styles.leftPanel}`}
          aria-label="Opening: The Aether Engine"
        >
          <div className={styles.glassCard}>
            <HeroChapter
              onExploreClick={() => {
                document
                  .getElementById('enter-engine')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        </section>

        {/* Chapter 01 — Enter the Engine */}
        <section
          id="enter-engine"
          className={`${styles.chapterPanel} ${styles.rightPanel}`}
          aria-label="Chapter 01: Enter the Engine"
        >
          <div className={styles.glassCard}>
            <EnterEngineChapter />
          </div>
        </section>

        {/* Chapter 02 — The World of Engineering */}
        <section
          id="worlds"
          className={`${styles.chapterPanel} ${styles.leftPanel}`}
          aria-label="Chapter 02: The World of Engineering"
        >
          <div className={styles.glassCard}>
            <WorldsChapter />
          </div>
        </section>

        {/* Chapter 03 — The Techfest Experience */}
        <section
          id="festival"
          className={`${styles.chapterPanel} ${styles.rightPanel}`}
          aria-label="Chapter 03: The Techfest Experience"
        >
          <div className={styles.glassCard}>
            <FestivalChapter />
          </div>
        </section>

        {/* Final Chapter — Enter Techfest */}
        <section
          id="finale"
          className={`${styles.chapterPanel} ${styles.centrePanel}`}
          aria-label="Final Chapter: Enter Techfest"
        >
          <div className={`${styles.glassCard} ${styles.parchmentCard}`}>
            <FinaleChapter />
          </div>
        </section>

        {/* Footer transition zone — fades canvas into deep cosmic void */}
        <div className={styles.footerSpacer} />
      </main>

      {/* Scroll indicator — fades when user starts scrolling */}
      {showScrollHint && isRevealed && (
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
