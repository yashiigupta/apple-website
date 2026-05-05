import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App';

// ─── Mock all heavy/animated components ──────────────────────────────────────
jest.mock('../../components/Navbar', () => () => (
  <nav data-testid="navbar">Navbar</nav>
));
jest.mock('../../components/Hero', () => () => (
  <section data-testid="hero">Hero</section>
));
jest.mock('../../components/Highlights', () => () => (
  <section data-testid="highlights">Highlights</section>
));
jest.mock('../../components/Model', () => () => (
  <section data-testid="model">Model</section>
));
jest.mock('../../components/Features', () => () => (
  <section data-testid="features">Features</section>
));
jest.mock('../../components/HowItWorks', () => () => (
  <section data-testid="howitworks">HowItWorks</section>
));
jest.mock('../../components/Footer', () => () => (
  <footer data-testid="footer">Footer</footer>
));

describe('App – integration', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders without crashing', () => {
    expect(document.querySelector('main')).toBeInTheDocument();
  });

  it('root element has a black background class', () => {
    const main = document.querySelector('main');
    expect(main).toHaveClass('bg-black');
  });

  it('renders the Navbar', () => {
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders the Hero section', () => {
    expect(screen.getByTestId('hero')).toBeInTheDocument();
  });

  it('renders the Highlights section', () => {
    expect(screen.getByTestId('highlights')).toBeInTheDocument();
  });

  it('renders the Model section', () => {
    expect(screen.getByTestId('model')).toBeInTheDocument();
  });

  it('renders the Features section', () => {
    expect(screen.getByTestId('features')).toBeInTheDocument();
  });

  it('renders the HowItWorks section', () => {
    expect(screen.getByTestId('howitworks')).toBeInTheDocument();
  });

  it('renders the Footer', () => {
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders all 7 sections in the correct order', () => {
    const testIds = [
      'navbar',
      'hero',
      'highlights',
      'model',
      'features',
      'howitworks',
      'footer',
    ];

    const elements = testIds.map((id) => screen.getByTestId(id));
    // Verify all exist
    elements.forEach((el) => expect(el).toBeInTheDocument());

    // Verify DOM order using compareDocumentPosition
    for (let i = 0; i < elements.length - 1; i++) {
      const position = elements[i].compareDocumentPosition(elements[i + 1]);
      // DOCUMENT_POSITION_FOLLOWING = 4
      expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
  });
});
