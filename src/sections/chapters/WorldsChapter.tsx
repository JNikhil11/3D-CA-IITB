/**
 * WorldsChapter — Chapter 02: The World of Engineering
 *
 * Archival Exhibition Folio:
 * - Asymmetric layout with monumental numerals (01, 02, 03, 04)
 * - Four curated engineering domains with technical aspects
 * - Verified flagship competitions (International Robowars, Aeromodelling, InnovateX, ICC)
 * - Zero generic small boxes
 */
import React from 'react';
import { DOMAINS, COMPETITIONS, TECHFEST_CONFIG } from '../../content/techfest';
import ed from '../../styles/editorial.module.css';

export const WorldsChapter: React.FC = () => (
  <div>
    <div className={ed.folioEyebrow}>Chapter 02 · The Four Quadrants</div>

    <span className={ed.headlineSub}>Exhibition Folio</span>
    <h2 className={ed.headlineVellum}>
      World of Engineering
    </h2>

    <div className={ed.goldRule} />

    <p className={ed.bodyVellum}>
      Four calibrated orbital rings of the Aether Engine represent the four
      primary quadrants of modern scientific and technological enquiry. Each domain
      hosts dedicated international competitions, technical workshops, and research showcases at Techfest 30.
    </p>

    {/* Archival Exhibition Folio Layout (Replaces generic small box pills) */}
    <div className={ed.exhibitionFolio}>
      {DOMAINS.map((domain) => (
        <div key={domain.id} className={ed.exhibitionRow}>
          <span className={ed.monumentalNumeral}>{domain.number}</span>
          <div className={ed.exhibitionContent}>
            <div className={ed.exhibitionTitle}>{domain.title}</div>
            <div className={ed.exhibitionTagline}>{domain.tagline}</div>
            <div className={ed.exhibitionAspects}>
              {domain.keyAspects.map((aspect) => (
                <span key={aspect} className={ed.aspectTag}>
                  {aspect}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className={ed.brassHairline} />

    <p className={ed.headlineSub} style={{ marginBottom: '0.4rem' }}>
      Verified Flagship Arenas:
    </p>
    <ul className={ed.compList}>
      {COMPETITIONS.slice(0, 4).map((c) => (
        <li key={c.id}>
          <span>
            <strong className={ed.compName}>{c.name}</strong>
            {' — '}{c.summary.split('.')[0]}.
          </span>
        </li>
      ))}
    </ul>

    <div className={ed.btnRow}>
      <a
        href={TECHFEST_CONFIG.urls.competitions}
        target="_blank"
        rel="noopener noreferrer"
        className={ed.btnPrimary}
      >
        All Competitions ↗
      </a>
      <a
        href={TECHFEST_CONFIG.urls.workshops}
        target="_blank"
        rel="noopener noreferrer"
        className={ed.btnSecondary}
      >
        Workshops ↗
      </a>
    </div>
  </div>
);
