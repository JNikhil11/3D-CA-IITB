import React, { useEffect, useRef } from 'react';
import { BeaconData } from '../pavilion/InteractiveBeacon';
import { TECHFEST_CONFIG } from '../../content/techfest';
import styles from './BeaconModal.module.css';

interface BeaconModalProps {
  beacon: BeaconData | null;
  onClose: () => void;
}

export const BeaconModal: React.FC<BeaconModalProps> = ({ beacon, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const ctaLinkRef = useRef<HTMLAnchorElement>(null);

  // Focus management, modal focus trap, and Escape key handling
  useEffect(() => {
    if (!beacon) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Accessible Focus Trap: cycle between close button and CTA link
      if (e.key === 'Tab') {
        const closeBtn = closeButtonRef.current;
        const ctaLink = ctaLinkRef.current;

        if (!closeBtn || !ctaLink) return;

        if (e.shiftKey) {
          // Shift + Tab on first element -> wrap to last element
          if (document.activeElement === closeBtn) {
            e.preventDefault();
            ctaLink.focus();
          }
        } else {
          // Tab on last element -> wrap to first element
          if (document.activeElement === ctaLink) {
            e.preventDefault();
            closeBtn.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [beacon, onClose]);

  if (!beacon) return null;

  return (
    <div
      className={styles.modalBackdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="beacon-modal-title"
      >
        <button
          ref={closeButtonRef}
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close dialog"
        >
          ✕
        </button>

        <span className={styles.categoryTag}>{beacon.category}</span>
        <h2 id="beacon-modal-title" className={styles.modalTitle}>
          {beacon.title}
        </h2>
        <p className={styles.modalSubtitle}>{beacon.subtitle}</p>

        <p className={styles.modalDescription}>{beacon.description}</p>

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Rewards & Grants</span>
            <span className={styles.detailValue}>{beacon.prizePool}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Festival Dates</span>
            <span className={styles.detailValue}>{TECHFEST_CONFIG.dates}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Location</span>
            <span className={styles.detailValue}>IIT Bombay Campus</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Verification</span>
            <span className={styles.detailValue}>Official Techfest 30</span>
          </div>
        </div>

        <div className={styles.ctaContainer}>
          <a
            ref={ctaLinkRef}
            href={beacon.verifiedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryCta}
          >
            Open Competition Portal ↗
          </a>
        </div>
      </div>
    </div>
  );
};
