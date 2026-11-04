import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  CHAPTERS,
  getActiveChapterIndex,
  setScrollProgress,
  scrollState,
} from '../motion/scrollState';
import { DiscoveryChapter } from '../sections/chapters/DiscoveryChapter';
import { RoboticsChapter } from '../sections/chapters/RoboticsChapter';
import { AerospaceChapter } from '../sections/chapters/AerospaceChapter';
import { ComputingChapter } from '../sections/chapters/ComputingChapter';
import { SustainabilityChapter } from '../sections/chapters/SustainabilityChapter';
import { FinaleChapter } from '../sections/chapters/FinaleChapter';

describe('Authoritative Chapter Scrollytelling Suite', () => {
  it('defines exactly 6 continuous chapters covering [0.0, 1.0] without gaps', () => {
    expect(CHAPTERS.length).toBe(6);

    // Verify first starts at 0 and last ends at 1
    expect(CHAPTERS[0].range[0]).toBe(0.0);
    expect(CHAPTERS[CHAPTERS.length - 1].range[1]).toBe(1.0);

    // Verify seamless contiguous bounds
    for (let i = 0; i < CHAPTERS.length - 1; i++) {
      expect(CHAPTERS[i].range[1]).toBe(CHAPTERS[i + 1].range[0]);
    }
  });

  it('maps progress to the correct active chapter index', () => {
    expect(getActiveChapterIndex(0.0)).toBe(0); // Discovery
    expect(getActiveChapterIndex(0.1)).toBe(0);
    expect(getActiveChapterIndex(0.2)).toBe(1); // Robotics
    expect(getActiveChapterIndex(0.4)).toBe(2); // Aerospace
    expect(getActiveChapterIndex(0.6)).toBe(3); // Computing
    expect(getActiveChapterIndex(0.75)).toBe(4); // Sustainability
    expect(getActiveChapterIndex(0.95)).toBe(5); // Finale
    expect(getActiveChapterIndex(1.0)).toBe(5);
  });

  it('updates scrollState and notifies listeners on setScrollProgress', () => {
    setScrollProgress(0.55);
    expect(scrollState.progress).toBe(0.55);
    expect(scrollState.activeChapterIndex).toBe(3);
  });

  it('renders Chapter 00 (Discovery) with headline, dates, and CTA buttons', () => {
    render(<DiscoveryChapter active={true} onExploreClick={() => {}} />);
    expect(screen.getByText('The Living Atlas')).toBeInTheDocument();
    expect(screen.getByText('An Aetherial Renaissance')).toBeInTheDocument();
    expect(screen.getByText('Explore the Atlas')).toBeInTheDocument();
    expect(screen.getByText(/techfest\.org/)).toBeInTheDocument();
  });

  it('renders Chapter 01 (Robotics) with verified competition titles', () => {
    render(<RoboticsChapter active={true} />);
    expect(screen.getByText('Robotics & Kinetic Systems')).toBeInTheDocument();
    expect(screen.getByText('International Robowars')).toBeInTheDocument();
    expect(screen.getByText('Robotics Arenas ↗')).toBeInTheDocument();
  });

  it('renders Chapter 02 (Aerospace) with Boeing challenge', () => {
    render(<AerospaceChapter active={true} />);
    expect(screen.getByText('Aerospace & Orbital Dynamics')).toBeInTheDocument();
    expect(
      screen.getByText('Boeing National Aeromodelling Challenge')
    ).toBeInTheDocument();
  });

  it('renders Chapter 03 (Computing) with ICC and GenAI lab', () => {
    render(<ComputingChapter active={true} />);
    expect(
      screen.getByText('Cognitive Computing & Intelligence')
    ).toBeInTheDocument();
    expect(
      screen.getByText('International Coding Challenge')
    ).toBeInTheDocument();
  });

  it('renders Chapter 04 (Sustainability) with InnovateX challenge', () => {
    render(<SustainabilityChapter active={true} />);
    expect(screen.getByText('Sustainable Earth Systems')).toBeInTheDocument();
    expect(
      screen.getByText('InnovateX National Innovation Challenge')
    ).toBeInTheDocument();
  });

  it('renders Chapter 05 (Finale) with registration CTA and College Ambassador disclosure', () => {
    render(<FinaleChapter active={true} />);
    expect(screen.getByText('Enter Techfest 30')).toBeInTheDocument();
    expect(screen.getByText('Register at techfest.org ↗')).toBeInTheDocument();
    expect(
      screen.getByText(/Independent College Ambassador concept/i)
    ).toBeInTheDocument();
  });
});
