import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AtlasSection } from '../sections/AtlasSection';
import { DOMAINS } from '../content/techfest';

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

  it('renders AtlasSection with interactive domain tabs and handles domain selection', () => {
    let selectedId = DOMAINS[0].id;
    const onSelect = (d: typeof DOMAINS[0]) => {
      selectedId = d.id;
    };

    const { rerender } = render(
      <AtlasSection selectedDomain={selectedId} onSelectDomain={onSelect} />
    );

    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(4);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // Click on domain 2 (Aerospace)
    fireEvent.click(tabs[1]);
    expect(selectedId).toBe(DOMAINS[1].id);

    // Re-render with updated selection
    rerender(<AtlasSection selectedDomain={selectedId} onSelectDomain={onSelect} />);
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('ORBITAL PLANE 2')).toBeInTheDocument();
  });

  it('renders Footer with official attribution note and live URLs', () => {
    render(<Footer />);
    expect(screen.getByText(/Independent College Ambassador concept/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Official Portal/i })).toHaveAttribute(
      'href',
      'https://techfest.org'
    );
  });
});
