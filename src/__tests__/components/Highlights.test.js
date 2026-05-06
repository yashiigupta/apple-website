/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-render-in-setup */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Highlights from '../../components/Highlights';

// VideoCarousel imports complex GSAP + media — mock it for isolation
jest.mock('../../components/VideoCarousel', () => () => (
  <div data-testid="video-carousel">VideoCarousel</div>
));

describe('Highlights component', () => {
  beforeEach(() => {
    render(<Highlights />);
  });

  it('renders the section with id="highlights"', () => {
    const section = document.querySelector('#highlights');
    expect(section).toBeInTheDocument();
  });

  it('renders the section heading', () => {
    expect(screen.getByText('Get the highlights.')).toBeInTheDocument();
  });

  it('renders "Watch the film" link text', () => {
    expect(screen.getByText(/Watch the film/i)).toBeInTheDocument();
  });

  it('renders "Watch the event" link text', () => {
    expect(screen.getByText(/Watch the event/i)).toBeInTheDocument();
  });

  it('renders the VideoCarousel component', () => {
    expect(screen.getByTestId('video-carousel')).toBeInTheDocument();
  });
});
