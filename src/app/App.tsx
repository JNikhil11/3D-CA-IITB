import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AstrolabeCanvas } from '../scene/AstrolabeCanvas';
import { HeroSection } from '../sections/HeroSection';
import { StorySection } from '../sections/StorySection';
import { AtlasSection } from '../sections/AtlasSection';
import { CompetitionsSection } from '../sections/CompetitionsSection';
import { LearningSection } from '../sections/LearningSection';
import { AtmosphereSection } from '../sections/AtmosphereSection';
import { FinaleSection } from '../sections/FinaleSection';
import { DOMAINS, DomainItem } from '../content/techfest';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { initEditorialScrollMotion } from '../motion/scrollChoreography';
import styles from './App.module.css';

export const App: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<DomainItem>(DOMAINS[0]);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

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

  return (
    <div className={styles.appRoot}>
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Persistent Global Navigation */}
      <Navbar />

      {/* Hero 3D Astrolabe / Armillary Orrery Experience */}
      <div className={styles.canvasWrapper} aria-hidden="true">
        <AstrolabeCanvas
          scrollProgress={scrollProgress}
          activeDomainRing={selectedDomain.astrolabeTargetRing}
        />
      </div>

      {/* Main Semantic Page Content */}
      <main id="main-content" ref={mainRef} className={styles.mainContent}>
        <HeroSection onExploreClick={handleExploreClick} />
        <StorySection />
        <AtlasSection
          selectedDomain={selectedDomain.id}
          onSelectDomain={setSelectedDomain}
        />
        <CompetitionsSection />
        <LearningSection />
        <AtmosphereSection />
        <FinaleSection />
      </main>

      {/* Global Colophon & Disclaimer Footer */}
      <Footer />
    </div>
  );
};
