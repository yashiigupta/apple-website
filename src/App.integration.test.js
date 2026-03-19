import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mock GSAP and ScrollTrigger - Replace GSAP functions with dummy functions
jest.mock("gsap", () => ({
  to: jest.fn(),
  from: jest.fn(),
  timeline: jest.fn(() => ({
    to: jest.fn(),
    from: jest.fn(),
  })),
  registerPlugin: jest.fn(),
}));


// Executes GSAP hook without real animations
jest.mock("gsap/all", () => ({
  ScrollTrigger: jest.fn(),
}));

jest.mock("./constants/animations", () => ({
  animateWithGsap: jest.fn(),
  animateWithGsapTimeline: jest.fn(),
}));

jest.mock("@gsap/react", () => ({
  useGSAP: jest.fn((fn) => fn()),
}));

// Mock Three.js and related fiber/drei components as they require WebGL - Replace WebGL canvas with simple <div>
jest.mock("@react-three/fiber", () => ({
  Canvas: ({ children }) => <div data-testid="canvas">{children}</div>,
}));

jest.mock("@react-three/drei", () => {
  const useGLTF = () => ({
    nodes: new Proxy({}, { get: () => ({ geometry: {} }) }),
    materials: {},
  });
  useGLTF.preload = () => {};

  const View = ({ children, index, ...props }) => <div {...props}>{children}</div>;
  View.Port = () => <div data-testid="view-port" />;

  return {
    View,
    OrbitControls: () => <div data-testid="orbit-controls" />,
    PerspectiveCamera: () => <div data-testid="perspective-camera" />,
    Environment: ({ children }) => <div data-testid="environment">{children}</div>,
    Lightformer: () => <div data-testid="lightformer" />,
    Html: ({ children }) => <div>{children}</div>,
    Loader: () => null,
    useGLTF: useGLTF,
    useTexture: () => ({}),
  };
});

// Mock VideoCarousel to simplify the test - Replaces complex 3D rendering with simple HTML for testing
jest.mock("./components/VideoCarousel", () => () => <div data-testid="video-carousel" />);

describe("App Integration Test", () => {
  test("renders all major sections of the application", () => {
    render(<App />);

    // 1. Navbar (Header)
    const header = screen.getByRole("banner");
    expect(within(header).getAllByAltText(/apple/i)[0]).toBeInTheDocument();
    expect(within(header).getByText(/store/i)).toBeInTheDocument();
    expect(within(header).getByText(/mac/i)).toBeInTheDocument();
    expect(within(header).getByText(/iphone/i)).toBeInTheDocument();

    // 2. Hero
    const heroTitle = screen.getByText(/iphone 15 pro/i, { selector: ".hero-title" });
    expect(heroTitle).toBeInTheDocument();
    const heroSection = heroTitle.closest("section");
    expect(within(heroSection).getByText(/from \$199\/month or \$999/i)).toBeInTheDocument();
    expect(within(heroSection).getByRole("link", { name: /buy/i })).toBeInTheDocument();

    // 3. Highlights
    expect(screen.getByText(/get the highlights\./i)).toBeInTheDocument();
    expect(screen.getByText(/watch the film/i)).toBeInTheDocument();
    expect(screen.getByTestId("video-carousel")).toBeInTheDocument();

    // 4. Model
    expect(screen.getByText(/take a closer look\./i)).toBeInTheDocument();
    expect(screen.getByTestId("canvas")).toBeInTheDocument();

    // 5. Features
    expect(screen.getByText(/explore the full story\./i)).toBeInTheDocument();
    expect(screen.getByText(/forged in titanium\./i)).toBeInTheDocument();

    // 6. HowItWorks
    expect(screen.getByText(/a17 pro chip\./i)).toBeInTheDocument();
    expect(screen.getByText(/a monster win for gaming\./i)).toBeInTheDocument();

    // 7. Footer
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText(/all rights reserved/i)).toBeInTheDocument();
  });
});