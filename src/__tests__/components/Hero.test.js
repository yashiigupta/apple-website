/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '../../components/Hero';

// Mock gsap and @gsap/react already set in setupTests.js

describe('Hero component', () => {
  it('renders the iPhone 15 Pro title', () => {
    render(<Hero />);
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
  });

  it('renders the hero section', () => {
    render(<Hero />);
    const section = document.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('renders a Buy link pointing to #highlights', () => {
    render(<Hero />);
    const buyLink = screen.getByRole('link', { name: /buy/i });
    expect(buyLink).toBeInTheDocument();
    expect(buyLink).toHaveAttribute('href', '#highlights');
  });

  it('renders the pricing text', () => {
    render(<Hero />);
    expect(
      screen.getByText(/From \$199\/month or \$999/i)
    ).toBeInTheDocument();
  });

  it('renders a video element for the hero section', () => {
    render(<Hero />);
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
  });

  it('uses the desktop video source for wide viewports', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1280,
    });
    render(<Hero />);
    const source = document.querySelector('video source');
    expect(source?.getAttribute('src')).toContain('hero.mp4');
  });

  it('uses the small video source for narrow viewports', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 480,
    });
    render(<Hero />);
    const source = document.querySelector('video source');
    expect(source?.getAttribute('src')).toContain('smallHero.mp4');
  });
});
