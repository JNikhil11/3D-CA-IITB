import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { InitialRevealCurtain } from '../components/InitialRevealCurtain';
import { DiscoveryChapter } from '../sections/chapters/DiscoveryChapter';
import { RoboticsChapter } from '../sections/chapters/RoboticsChapter';
import { FinaleChapter } from '../sections/chapters/FinaleChapter';

describe('Component & Accessibility Verification', () => {
  it('renders Navbar with accessible brand lockup, links, and enter portal button', () => {
    render(<Navbar />);
    expect(screen.getByLabelText('Techfest 30 Home')).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Main Navigation' })
    ).toBeInTheDocument();
    expect(screen.getByText('Enter Portal')).toBeInTheDocument();
  });

  it('toggles mobile menu on button click and has aria-expanded attributes', () => {
    render(<Navbar />);
    const menuBtn = screen.getByRole('button', {
      name: /Open Navigation Menu/i,
    });
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(menuBtn);
    expect(menuBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders DiscoveryChapter with headline, dates, and CTA buttons', () => {
    const onExplore = () => {};
    render(<DiscoveryChapter active={true} onExploreClick={onExplore} />);
    expect(screen.getByText('An Aetherial Renaissance')).toBeInTheDocument();
    expect(screen.getByText(/December 16/)).toBeInTheDocument();
    expect(screen.getByText('Explore the Atlas')).toBeInTheDocument();
    expect(screen.getByText(/techfest\.org/)).toBeInTheDocument();
  });

  it('renders RoboticsChapter with flagship competitions and arena links', () => {
    render(<RoboticsChapter active={true} />);
    expect(screen.getByText('Robotics & Kinetic Systems')).toBeInTheDocument();
    expect(screen.getByText(/International Robowars/)).toBeInTheDocument();
    expect(screen.getByText('Robotics Arenas ↗')).toBeInTheDocument();
  });

  it('renders FinaleChapter with CTA to techfest.org and disclaimer', () => {
    render(<FinaleChapter active={true} />);
    expect(screen.getByText('Enter Techfest 30')).toBeInTheDocument();
    expect(screen.getByText('Register at techfest.org ↗')).toBeInTheDocument();
    expect(
      screen.getByText(/Independent College Ambassador concept/i)
    ).toBeInTheDocument();
  });

  it('renders Footer with official attribution and live URLs', () => {
    render(<Footer />);
    expect(
      screen.getByText(/Independent College Ambassador concept/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Official Portal/i })
    ).toHaveAttribute('href', 'https://techfest.org');
  });

  it('renders InitialRevealCurtain with brand title, astrolabe rings, and calibration status', () => {
    render(<InitialRevealCurtain isReady={false} loadProgress={45} />);
    expect(screen.getByText('The Living Atlas')).toBeInTheDocument();
    expect(screen.getByText('Techfest 30 · IIT Bombay')).toBeInTheDocument();
    expect(
      screen.getByRole('status', {
        name: /Calibrating Celestial Instruments/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
  });
});
