import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AstrolabeCanvas } from '../scene/AstrolabeCanvas';
import { BeaconModal } from '../scene/components/BeaconModal';
import { BeaconData } from '../scene/pavilion/InteractiveBeacon';
import { HeroSection } from '../sections/HeroSection';
import { StorySection } from '../sections/StorySection';
import { AtlasSection } from '../sections/AtlasSection';
import { CompetitionsSection } from '../sections/CompetitionsSection';
import { LearningSection } from '../sections/LearningSection';
import { AtmosphereSection } from '../sections/AtmosphereSection';
import { FinaleSection } from '../sections/FinaleSection';
import { DOMAINS, DomainItem } from '../content/techfest';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useWindowSize } from '../hooks/useWindowSize';
import { initEditorialScrollMotion } from '../motion/scrollChoreography';
import styles from './App.module.css';

export const App: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<DomainItem>(DOMAINS[0]);
  const [selectedBeacon, setSelectedBeacon] = useState<BeaconData | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { isDesktop } = useWindowSize();

  // Passive scroll progress tracking without scroll-jacking
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
          setScrollProgress(Math.min(1, Math.max(0, current)));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize GSAP scroll animation context
  useEffect(() => {
    const cleanup = initEditorialScrollMotion(mainRef.current, reducedMotion);
    return cleanup;
  }, [reducedMotion]);

  const handleExploreClick = () => {
    const storyElem = document.getElementById('story');
    if (storyElem) {
      storyElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRingSelect = (ringIndex: number) => {
    const matched = DOMAINS.find((d) => d.astrolabeTargetRing === ringIndex);
    if (matched) {
      setSelectedDomain(matched);
    }
  };

  return (
    <div className={styles.appRoot}>
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Persistent Global Navigation */}
      <Navbar />

      {/* Main Semantic Page Content */}
      <main id="main-content" ref={mainRef} className={styles.mainContent}>
        {/* Unified 5-Chapter Interactive Stage & Editorial Architecture */}
        <div className={styles.stageJourneySection}>
          {/* Scrollable Editorial Column (Chapters 01 - 07) */}
          <div className={styles.editorialColumn}>
            <HeroSection
              onExploreClick={handleExploreClick}
              mobile3DStage={
                !isDesktop ? (
                  <div className={styles.mobileCanvasStage}>
                    <AstrolabeCanvas
                      scrollProgress={scrollProgress}
                      activeDomain={selectedDomain.id}
                      activeDomainRing={selectedDomain.astrolabeTargetRing}
                      onRingSelect={handleRingSelect}
                      onSelectBeacon={setSelectedBeacon}
                    />
                  </div>
                ) : null
              }
            />

            <StorySection />

            <AtlasSection
              selectedDomain={selectedDomain.id}
              onSelectDomain={setSelectedDomain}
            />

            <CompetitionsSection />
            <LearningSection />
            <AtmosphereSection />
            <FinaleSection />
          </div>

          {/* Desktop Sticky 3D Stage (Right Column, 100vh Sticky for full user journey) */}
          {isDesktop && (
            <aside
              className={styles.desktopStickyCanvas}
              aria-label="3D Interactive Aether Engine Stage"
            >
              <AstrolabeCanvas
                scrollProgress={scrollProgress}
                activeDomain={selectedDomain.id}
                activeDomainRing={selectedDomain.astrolabeTargetRing}
                onRingSelect={handleRingSelect}
                onSelectBeacon={setSelectedBeacon}
              />
            </aside>
          )}
        </div>
      </main>

      {/* Accessible Holographic Event Details Modal */}
      <BeaconModal
        beacon={selectedBeacon}
        onClose={() => setSelectedBeacon(null)}
      />

      {/* Global Colophon & Disclaimer Footer */}
      <Footer />
    </div>
  );
};
