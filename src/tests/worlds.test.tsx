import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DecorativeGoldFrame } from '../components/DecorativeGoldFrame';
import { VerticalNavRail } from '../components/VerticalNavRail';
import { TopHUDBar } from '../components/TopHUDBar';
import { ObservatoryWorldFrame } from '../sections/worlds/ObservatoryWorldFrame';
import { SubterraneanWorldFrame } from '../sections/worlds/SubterraneanWorldFrame';
import { EngineeringWorldFrame } from '../sections/worlds/EngineeringWorldFrame';
import { FestivalWorldFrame } from '../sections/worlds/FestivalWorldFrame';
import { FinalDestinationWorldFrame } from '../sections/worlds/FinalDestinationWorldFrame';
import { WORLD_DATA, TECHFEST_CONFIG } from '../content/techfest';
import { WORLDS } from '../motion/scrollState';

describe('5-World Scrollytelling Suite', () => {
  it('defines 5 distinct worlds with continuous progress ranges covering [0, 1]', () => {
    expect(WORLDS.length).toBe(5);
    expect(WORLDS[0].range[0]).toBe(0.0);
    expect(WORLDS[WORLDS.length - 1].range[1]).toBe(1.0);

    for (let i = 0; i < WORLDS.length - 1; i++) {
      expect(WORLDS[i].range[1]).toBe(WORLDS[i + 1].range[0]);
    }
  });

  it('renders DecorativeGoldFrame with corner brackets and telemetry', () => {
    render(
      <DecorativeGoldFrame
        worldNumber="01"
        badge="WORLD 01 // TEST"
        coordinates="19°08′00″N 72°54′50″E"
        sector="TEST SECTOR"
        active={true}
      >
        <p>Test Content</p>
      </DecorativeGoldFrame>
    );

    expect(screen.getByText('WORLD 01 // TEST')).toBeInTheDocument();
    expect(screen.getByText('№ 01')).toBeInTheDocument();
    expect(screen.getByText('19°08′00″N 72°54′50″E')).toBeInTheDocument();
    expect(screen.getByText('TEST SECTOR')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders VerticalNavRail with 5 world buttons and handles clicks', () => {
    const handleSelect = vi.fn();
    render(<VerticalNavRail onSelectWorld={handleSelect} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(5);

    fireEvent.click(buttons[1]);
    expect(handleSelect).toHaveBeenCalledWith(1);
  });

  it('renders TopHUDBar with brand lockup and audio control', () => {
    render(<TopHUDBar />);
    expect(screen.getByText('Techfest 30')).toBeInTheDocument();
    expect(screen.getByText(/IIT Bombay • Powai/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /celestial ambience/i })).toBeInTheDocument();
  });

  it('renders ObservatoryWorldFrame with verified title and explore CTA', () => {
    const onExplore = vi.fn();
    render(<ObservatoryWorldFrame active={true} onExploreClick={onExplore} />);
    expect(screen.getByText(WORLD_DATA['observatory'].title)).toBeInTheDocument();
    expect(screen.getByText(WORLD_DATA['observatory'].subtitle)).toBeInTheDocument();

    const exploreBtn = screen.getByText('Explore the Atlas');
    fireEvent.click(exploreBtn);
    expect(onExplore).toHaveBeenCalled();
  });

  it('renders SubterraneanWorldFrame with Robowars and machine pit telemetry', () => {
    render(<SubterraneanWorldFrame active={true} />);
    expect(screen.getByText(WORLD_DATA['subterranean-engine'].title)).toBeInTheDocument();
    expect(screen.getByText(/International Robowars/)).toBeInTheDocument();
    expect(screen.getByText(/View Robowars ↗/)).toBeInTheDocument();
  });

  it('renders EngineeringWorldFrame with aerospace, computing, and earth systems', () => {
    render(<EngineeringWorldFrame active={true} />);
    expect(screen.getByText(WORLD_DATA['engineering-worlds'].title)).toBeInTheDocument();
    expect(screen.getByText(/Aerospace Dynamics/)).toBeInTheDocument();
    expect(screen.getByText(/Cognitive Computing/)).toBeInTheDocument();
    expect(screen.getByText(/Sustainable Earth/)).toBeInTheDocument();
  });

  it('renders FestivalWorldFrame with Technoholix and Ozone', () => {
    render(<FestivalWorldFrame active={true} />);
    expect(screen.getByText(WORLD_DATA['festival-experience'].title)).toBeInTheDocument();
    expect(screen.getByText(/Technoholix Night Show/)).toBeInTheDocument();
    expect(screen.getByText(/Ozone Science Playground/)).toBeInTheDocument();
  });

  it('renders FinalDestinationWorldFrame with official dates, registration CTA, and CA attribution', () => {
    render(<FinalDestinationWorldFrame active={true} />);
    expect(screen.getByText(WORLD_DATA['final-destination'].title)).toBeInTheDocument();
    expect(screen.getByText(/December 16–18, 2026/)).toBeInTheDocument();
    expect(screen.getByText('Register at techfest.org ↗')).toBeInTheDocument();
    expect(
      screen.getByText(TECHFEST_CONFIG.disclaimer)
    ).toBeInTheDocument();
  });
});
