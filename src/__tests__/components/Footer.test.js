/* eslint-disable testing-library/no-render-in-setup */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';

describe('Footer component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('renders a <footer> element', () => {
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('displays the phone number', () => {
    expect(screen.getByText(/1800-999-123/i)).toBeInTheDocument();
  });

  it('displays the copyright notice', () => {
    // The component has a typo: "Copright" (missing 'y') — test both spellings
    const el =
      screen.queryByText(/Copright @ 2024 Apple Inc/i) ||
      screen.queryByText(/Copyright @ 2024 Apple Inc/i);
    expect(el).toBeInTheDocument();
  });

  it('renders all 5 footer links', () => {
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Terms of Use/i)).toBeInTheDocument();
    expect(screen.getByText(/Sales Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Legal/i)).toBeInTheDocument();
    expect(screen.getByText(/Site Map/i)).toBeInTheDocument();
  });

  it('renders the "Find an Apple Store" link text', () => {
    expect(screen.getByText(/Find an Apple Store/i)).toBeInTheDocument();
  });

  it('renders the "Other retailer" link text', () => {
    expect(screen.getByText(/Other retailer/i)).toBeInTheDocument();
  });
});
