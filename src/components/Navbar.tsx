import React, { useState, useEffect } from 'react';
import { TECHFEST_CONFIG } from '../content/techfest';
import { subscribeScroll, WORLDS } from '../motion/scrollState';
import styles from './Navbar.module.css';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Opening', href: '#hero' },
  { label: 'The Engine', href: '#enter-engine' },
  { label: 'Engineering', href: '#worlds' },
  { label: 'Festival', href: '#festival' },
  { label: 'Enter Techfest', href: '#finale' },
];

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeWorldIdx, setActiveWorldIdx] = useState<number>(0);

  useEffect(() => {
    return subscribeScroll((state) => {
      setActiveWorldIdx(state.activeWorldIndex);
    });
  }, []);

  const activeWorld = WORLDS[activeWorldIdx] || WORLDS[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle escape key closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <div className={`container ${styles.navInner}`}>
        {/* Brand Lockup */}
        <a href="#hero" className={styles.brand} aria-label="Techfest 30 Home">
          <span className={styles.brandEmblem}>✦</span>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>TECHFEST 30</span>
            <span className={styles.brandSub}>IIT BOMBAY · 2026</span>
          </div>
        </a>

        {/* Live Active World Pill Tracker */}
        <div className={styles.worldPill} aria-live="polite">
          <span className={styles.pulseDot} aria-hidden="true" />
          <span>
            World {activeWorld.number}: {activeWorld.title}
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={styles.navLink}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Header Actions */}
        <div className={styles.headerActions}>
          <a
            href={TECHFEST_CONFIG.urls.officialSite}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryCta}
          >
            <span>Enter Portal</span>
            <span className={styles.ctaArrow} aria-hidden="true">→</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          >
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.line1Open : ''}`} />
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.line2Open : ''}`} />
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.line3Open : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!isMenuOpen}
      >
        <div className={styles.mobileMenuBackdrop} onClick={() => setIsMenuOpen(false)} />
        <div className={styles.mobileMenuPanel}>
          <div className={styles.mobileMenuHeader}>
            <span className="calibration-badge">CHAPTER INDEX</span>
            <button
              type="button"
              className={styles.mobileCloseBtn}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav aria-label="Mobile Navigation">
            <ul className={styles.mobileNavList}>
              {NAV_ITEMS.map((item, index) => (
                <li key={item.href} className={styles.mobileNavItem}>
                  <a
                    href={item.href}
                    className={styles.mobileNavLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className={styles.mobileIndex}>0{index + 1}</span>
                    <span className={styles.mobileLabel}>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.mobileMenuFooter}>
            <a
              href={TECHFEST_CONFIG.urls.officialSite}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileCtaBtn}
              onClick={() => setIsMenuOpen(false)}
            >
              Official Techfest Portal ↗
            </a>
            <p className={styles.mobileFootnote}>
              December 16–18, 2026 · IIT Bombay
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
