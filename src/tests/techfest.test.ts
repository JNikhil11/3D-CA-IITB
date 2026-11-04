import { describe, it, expect } from 'vitest';
import {
  TECHFEST_CONFIG,
  DOMAINS,
  COMPETITIONS,
  LEARNING_OFFERINGS,
  FESTIVAL_ATMOSPHERE,
} from '../content/techfest';

describe('Techfest Sourced Content & Link Registry', () => {
  it('has verified metadata matching official 30th edition specifications', () => {
    expect(TECHFEST_CONFIG.edition).toBe('30th Edition');
    expect(TECHFEST_CONFIG.theme).toBe('An Aetherial Renaissance');
    expect(TECHFEST_CONFIG.institution).toBe('IIT Bombay');
    expect(TECHFEST_CONFIG.dates).toContain('December 16–18, 2026');
  });

  it('contains valid, explicit official destination URLs with HTTPS', () => {
    const urls = Object.values(TECHFEST_CONFIG.urls);
    expect(urls.length).toBeGreaterThanOrEqual(6);
    urls.forEach((url) => {
      expect(url).toMatch(/^https:\/\//);
      expect(url).not.toBe('#');
      expect(url).not.toContain('javascript:');
    });
  });

  it('contains mandatory College Ambassador disclaimer', () => {
    expect(TECHFEST_CONFIG.disclaimer).toContain('Independent College Ambassador concept');
    expect(TECHFEST_CONFIG.disclaimer).toContain('IIT Bombay');
  });

  it('defines 4 structured engineering domains with target astrolabe rings', () => {
    expect(DOMAINS.length).toBe(4);
    DOMAINS.forEach((domain, idx) => {
      expect(domain.astrolabeTargetRing).toBe(idx);
      expect(domain.keyAspects.length).toBeGreaterThanOrEqual(3);
      expect(domain.officialUrl).toMatch(/^https:\/\/techfest\.org/);
    });
  });

  it('defines verified flagship competitions with factual summaries and official links', () => {
    expect(COMPETITIONS.length).toBeGreaterThanOrEqual(4);
    const robowars = COMPETITIONS.find((c) => c.id === 'robowars');
    expect(robowars).toBeDefined();
    expect(robowars?.name).toBe('International Robowars');
    expect(robowars?.officialUrl).toBe(TECHFEST_CONFIG.urls.competitions);
  });

  it('contains distinct learning offerings separating workshops, exhibitions, and lectures', () => {
    const types = new Set(LEARNING_OFFERINGS.map((o) => o.type));
    expect(types.has('Workshop')).toBe(true);
    expect(types.has('Exhibition')).toBe(true);
    expect(types.has('Lecture')).toBe(true);
  });

  it('defines festival atmosphere highlights for Technoholix, Ozone, and campus grounds', () => {
    expect(FESTIVAL_ATMOSPHERE.length).toBe(3);
    const technoholix = FESTIVAL_ATMOSPHERE.find((a) => a.id === 'technoholix');
    expect(technoholix).toBeDefined();
  });
});
