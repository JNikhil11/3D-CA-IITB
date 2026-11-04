import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HeroChapter } from '../sections/chapters/HeroChapter';
import { WorldsChapter } from '../sections/chapters/WorldsChapter';
import { FinaleChapter } from '../sections/chapters/FinaleChapter';

describe('Component & Accessibility Verification', () => {
  it('renders Navbar with accessible brand lockup, links, and enter portal button', () => {
    render(<Navbar />);
    expect(screen.getByLabelText('Techfest 30 Home')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main Navigation' })).toBeInTheDocument();
    expect(screen.getByText('Enter Portal')).toBeInTheDocument();
  });

  it('toggles mobile menu on button click and has aria-expanded attributes', () => {
    render(<Navbar />);
    const menuBtn = screen.getByRole('button', { name: /Open Navigation Menu/i });
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(menuBtn);
    expect(menuBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders HeroChapter with headline, dates, and CTA buttons', () => {
    const onExplore = () => {};
    render(<HeroChapter onExploreClick={onExplore} />);
    expect(screen.getByText('An Aetherial Renaissance')).toBeInTheDocument();
    expect(screen.getByText(/December 16/)).toBeInTheDocument();
    expect(screen.getByText('Enter the Atlas')).toBeInTheDocument();
    expect(screen.getByText(/techfest\.org/)).toBeInTheDocument();
  });

  it('renders WorldsChapter with domain grid and competition list', () => {
    render(<WorldsChapter />);
    expect(screen.getByText('World of Engineering')).toBeInTheDocument();
    expect(screen.getByText(/Robotics/)).toBeInTheDocument();
    expect(screen.getByText(/International Robowars/)).toBeInTheDocument();
    expect(screen.getByText('All Competitions ↗')).toBeInTheDocument();
  });

  it('renders FinaleChapter with CTA to techfest.org and disclaimer', () => {
    render(<FinaleChapter />);
    expect(screen.getByText('Enter Techfest 30')).toBeInTheDocument();
    expect(screen.getByText('Register at techfest.org ↗')).toBeInTheDocument();
    expect(screen.getByText(/Independent College Ambassador concept/i)).toBeInTheDocument();
  });

  it('renders Footer with official attribution and live URLs', () => {
    render(<Footer />);
    expect(screen.getByText(/Independent College Ambassador concept/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Official Portal/i })).toHaveAttribute(
      'href',
      'https://techfest.org'
    );
  });
});
