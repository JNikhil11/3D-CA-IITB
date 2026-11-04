/**
 * App.tsx — Immersive Full-Bleed 3D Architecture
 *
 * The ImmersiveCanvas is FIXED at z:0 behind all content.
 * Editorial chapter panels scroll over it with glassmorphic cards.
 * No two-column grid. No right-side sticky panel. No HUD buttons.
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ImmersiveCanvas } from '../scene/ImmersiveCanvas';
import { HeroChapter } from '../sections/chapters/HeroChapter';
import { EnterEngineChapter } from '../sections/chapters/EnterEngineChapter';
import { WorldsChapter } from '../sections/chapters/WorldsChapter';
import { FestivalChapter } from '../sections/chapters/FestivalChapter';
import { FinaleChapter } from '../sections/chapters/FinaleChapter';
import styles from './App.module.css';

export const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Passive scroll progress tracker
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;
          const prog = maxScroll > 0 ? window.scrollY / maxScroll : 0;
          setScrollProgress(Math.min(1, Math.max(0, prog)));
          if (window.scrollY > 80) setShowScrollHint(false);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.appRoot}>
      {/* Accessible skip link */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      {/* Global Navigation — above the canvas (z:50) */}
      <Navbar />

      {/* Fixed 3D Canvas — lives behind everything at z:0 */}
      <ImmersiveCanvas scrollProgress={scrollProgress} />

      {/* Scroll-driven editorial chapters — z:10, scroll over canvas */}
      <main id="main-content" className={styles.scrollStream}>

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

        {/* Footer transition zone — fades canvas to dark */}
        <div className={styles.footerSpacer} />
      </main>

      {/* Scroll indicator — fades when user starts scrolling */}
      {showScrollHint && (
        <div className={styles.scrollIndicator} aria-hidden="true">
          <div className={styles.scrollIndicatorLine} />
          <div className={styles.scrollIndicatorDot} />
        </div>
      )}

      {/* Global footer */}
      <Footer />
    </div>
  );
};
