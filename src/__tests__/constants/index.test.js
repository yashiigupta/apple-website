import {
  navLists,
  hightlightsSlides,
  models,
  sizes,
  footerLinks,
} from '../../constants';

describe('constants/index.js', () => {
  // ── navLists ───────────────────────────────────────────────────────────────
  describe('navLists', () => {
    it('is an array', () => {
      expect(Array.isArray(navLists)).toBe(true);
    });

    it('contains exactly 4 navigation items', () => {
      expect(navLists).toHaveLength(4);
    });

    it('includes "Store", "Mac", "iPhone", and "Support"', () => {
      expect(navLists).toEqual(
        expect.arrayContaining(['Store', 'Mac', 'iPhone', 'Support'])
      );
    });
  });

  // ── hightlightsSlides ─────────────────────────────────────────────────────
  describe('hightlightsSlides', () => {
    it('contains 4 slides', () => {
      expect(hightlightsSlides).toHaveLength(4);
    });

    it('each slide has id, textLists, video, and videoDuration', () => {
      hightlightsSlides.forEach((slide) => {
        expect(slide).toHaveProperty('id');
        expect(slide).toHaveProperty('textLists');
        expect(slide).toHaveProperty('video');
        expect(slide).toHaveProperty('videoDuration');
      });
    });

    it('slide ids are sequential starting from 1', () => {
      const ids = hightlightsSlides.map((s) => s.id);
      expect(ids).toEqual([1, 2, 3, 4]);
    });

    it('each textLists is a non-empty array of strings', () => {
      hightlightsSlides.forEach((slide) => {
        expect(Array.isArray(slide.textLists)).toBe(true);
        expect(slide.textLists.length).toBeGreaterThan(0);
        slide.textLists.forEach((text) => expect(typeof text).toBe('string'));
      });
    });

    it('each video path points to the assets directory', () => {
      hightlightsSlides.forEach((slide) => {
        expect(slide.video).toMatch(/^\/assets\/videos\//);
      });
    });

    it('all videoDurations are positive numbers', () => {
      hightlightsSlides.forEach((slide) => {
        expect(typeof slide.videoDuration).toBe('number');
        expect(slide.videoDuration).toBeGreaterThan(0);
      });
    });
  });

  // ── models ────────────────────────────────────────────────────────────────
  describe('models', () => {
    it('contains 4 iPhone models', () => {
      expect(models).toHaveLength(4);
    });

    it('each model has id, title, color, and img', () => {
      models.forEach((model) => {
        expect(model).toHaveProperty('id');
        expect(model).toHaveProperty('title');
        expect(model).toHaveProperty('color');
        expect(model).toHaveProperty('img');
      });
    });

    it('each model color is an array of exactly 3 hex strings', () => {
      models.forEach((model) => {
        expect(Array.isArray(model.color)).toBe(true);
        expect(model.color).toHaveLength(3);
        model.color.forEach((c) => {
          expect(typeof c).toBe('string');
          expect(c).toMatch(/^#[0-9a-fA-F]{3,6}$/);
        });
      });
    });

    it('each img path points to the assets directory', () => {
      models.forEach((model) => {
        expect(model.img).toMatch(/^\/assets\/images\//);
      });
    });

    it('model titles include "Titanium"', () => {
      models.forEach((model) => {
        expect(model.title).toMatch(/Titanium/);
      });
    });
  });

  // ── sizes ─────────────────────────────────────────────────────────────────
  describe('sizes', () => {
    it('contains exactly 2 size options', () => {
      expect(sizes).toHaveLength(2);
    });

    it('each size has a label and a value', () => {
      sizes.forEach((size) => {
        expect(size).toHaveProperty('label');
        expect(size).toHaveProperty('value');
      });
    });

    it('has "small" and "large" values', () => {
      const values = sizes.map((s) => s.value);
      expect(values).toContain('small');
      expect(values).toContain('large');
    });
  });

  // ── footerLinks ───────────────────────────────────────────────────────────
  describe('footerLinks', () => {
    it('is an array of strings', () => {
      expect(Array.isArray(footerLinks)).toBe(true);
      footerLinks.forEach((link) => expect(typeof link).toBe('string'));
    });

    it('contains 5 footer links', () => {
      expect(footerLinks).toHaveLength(5);
    });

    it('includes "Privacy Policy"', () => {
      expect(footerLinks).toContain('Privacy Policy');
    });

    it('includes "Terms of Use"', () => {
      expect(footerLinks).toContain('Terms of Use');
    });
  });
});
