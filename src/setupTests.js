// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// ─── Mock window.matchMedia ───────────────────────────────────────────────────
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ─── Mock window.innerWidth ───────────────────────────────────────────────────
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

// ─── Mock ResizeObserver ──────────────────────────────────────────────────────
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// ─── Mock IntersectionObserver ────────────────────────────────────────────────
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// ─── Mock HTMLMediaElement (video/audio) ─────────────────────────────────────
window.HTMLMediaElement.prototype.load = jest.fn();
window.HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
window.HTMLMediaElement.prototype.pause = jest.fn();

// ─── Mock GSAP ───────────────────────────────────────────────────────────────
jest.mock('gsap', () => ({
  to: jest.fn(),
  from: jest.fn(),
  fromTo: jest.fn(),
  set: jest.fn(),
  timeline: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    fromTo: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    kill: jest.fn(),
  })),
  registerPlugin: jest.fn(),
}));

jest.mock('gsap/all', () => ({
  ScrollTrigger: {
    create: jest.fn(),
    refresh: jest.fn(),
    kill: jest.fn(),
    getAll: jest.fn(() => []),
  },
  ScrollToPlugin: {},
}));

// ─── Mock @gsap/react ────────────────────────────────────────────────────────
jest.mock('@gsap/react', () => ({
  useGSAP: jest.fn((cb) => cb && cb()),
}));

// ─── Mock @react-three/fiber & drei ──────────────────────────────────────────
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => children,
  useFrame: jest.fn(),
  useThree: jest.fn(() => ({ camera: {}, gl: { domElement: {} } })),
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: jest.fn(() => null),
  Environment: jest.fn(() => null),
  Lightformer: jest.fn(() => null),
  View: jest.fn(({ children }) => children),
  PerspectiveCamera: jest.fn(() => null),
  useGLTF: jest.fn(() => ({
    scene: { clone: jest.fn(() => ({ traverse: jest.fn() })) },
  })),
}));

// ─── Suppress console.error for known React/Three.js noise ───────────────────
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    const msg = args[0]?.toString() ?? '';
    if (
      msg.includes('Warning:') ||
      msg.includes('ReactDOM.render') ||
      msg.includes('act(')
    )
      return;
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});
