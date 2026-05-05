import gsap from 'gsap';
import { animateWithGsap, animateWithGsapTimeline } from '../../utils/animations';

describe('animations.js – utility functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── animateWithGsap ──────────────────────────────────────────────────────
  describe('animateWithGsap', () => {
    it('calls gsap.to with the target and animation props', () => {
      animateWithGsap('#hero', { opacity: 1 });

      expect(gsap.to).toHaveBeenCalledTimes(1);
      expect(gsap.to).toHaveBeenCalledWith(
        '#hero',
        expect.objectContaining({ opacity: 1 })
      );
    });

    it('merges scrollTrigger defaults with provided scrollProps', () => {
      animateWithGsap('#hero', { opacity: 1 }, { start: 'top 50%' });

      const call = gsap.to.mock.calls[0];
      expect(call[1].scrollTrigger).toMatchObject({
        trigger: '#hero',
        toggleActions: 'restart reverse restart reverse',
        start: 'top 50%', // overrides the default "top 85%"
      });
    });

    it('uses default start "top 85%" when no scrollProps provided', () => {
      animateWithGsap('.section', { y: 0 });

      const call = gsap.to.mock.calls[0];
      expect(call[1].scrollTrigger.start).toBe('top 85%');
    });

    it('attaches the correct trigger element', () => {
      animateWithGsap('.my-target', { opacity: 1 });

      const call = gsap.to.mock.calls[0];
      expect(call[1].scrollTrigger.trigger).toBe('.my-target');
    });
  });

  // ── animateWithGsapTimeline ──────────────────────────────────────────────
  describe('animateWithGsapTimeline', () => {
    let mockTimeline;
    let mockRotationRef;

    beforeEach(() => {
      mockTimeline = {
        to: jest.fn().mockReturnThis(),
      };

      mockRotationRef = {
        current: {
          rotation: { y: 0 },
        },
      };
    });

    it('adds a rotation tween to the timeline', () => {
      animateWithGsapTimeline(
        mockTimeline,
        mockRotationRef,
        Math.PI,
        '.first',
        '.second',
        { opacity: 1, duration: 1 }
      );

      expect(mockTimeline.to).toHaveBeenCalledWith(
        mockRotationRef.current.rotation,
        expect.objectContaining({ y: Math.PI, duration: 1 })
      );
    });

    it('adds tweens for both firstTarget and secondTarget', () => {
      animateWithGsapTimeline(
        mockTimeline,
        mockRotationRef,
        0,
        '.first',
        '.second',
        { opacity: 0.5 }
      );

      // Called 3 times: rotation + firstTarget + secondTarget
      expect(mockTimeline.to).toHaveBeenCalledTimes(3);

      const calls = mockTimeline.to.mock.calls;
      expect(calls[1][0]).toBe('.first');
      expect(calls[2][0]).toBe('.second');
    });

    it('applies ease power2.inOut to target tweens', () => {
      animateWithGsapTimeline(
        mockTimeline,
        mockRotationRef,
        1,
        '.a',
        '.b',
        { x: 100 }
      );

      const calls = mockTimeline.to.mock.calls;
      expect(calls[1][1]).toMatchObject({ ease: 'power2.inOut' });
      expect(calls[2][1]).toMatchObject({ ease: 'power2.inOut' });
    });

    it('passes the "<" position parameter to sync tweens', () => {
      animateWithGsapTimeline(
        mockTimeline,
        mockRotationRef,
        0,
        '.a',
        '.b',
        {}
      );

      const calls = mockTimeline.to.mock.calls;
      expect(calls[1][2]).toBe('<');
      expect(calls[2][2]).toBe('<');
    });
  });
});
