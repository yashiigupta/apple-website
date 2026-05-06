/* eslint-disable testing-library/no-render-in-setup */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../../components/Navbar';

describe('Navbar component', () => {
  beforeEach(() => {
    render(<Navbar />);
  });

  it('renders a <header> element', () => {
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders the Apple logo image', () => {
    // All three images share alt="Apple" in the component
    const images = screen.getAllByAltText('Apple');
    const logo = images.find((img) =>
      img.getAttribute('src')?.includes('apple.svg')
    );
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/assets/images/apple.svg');
  });

  it('renders all four navigation links', () => {
    expect(screen.getByText('Store')).toBeInTheDocument();
    expect(screen.getByText('Mac')).toBeInTheDocument();
    expect(screen.getByText('iPhone')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders search and bag icon images', () => {
    // Icons share alt="Apple" with the logo — query all images by alt
    const images = screen.getAllByAltText('Apple');
    const srcs = images.map((img) => img.getAttribute('src'));
    expect(srcs).toContain('/assets/images/search.svg');
    expect(srcs).toContain('/assets/images/bag.svg');
  });
});
