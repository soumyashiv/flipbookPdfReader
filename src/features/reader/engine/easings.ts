import { AnimationStyle } from '@/types';

// Bezier Curve calculations
// cubic-bezier(x1, y1, x2, y2)
export function cubicBezier(t: number, p1x: number, p1y: number, p2x: number, p2y: number): number {
  // Simplified approximation for fast animation loops, or we could use standard formulas
  // For production 60FPS we should ideally use a robust bezier solver,
  // but for our rAF loop a pre-calculated or precise solver is needed.
  
  // A simple accurate bezier solver
  function calcBezier(aT: number, aA1: number, aA2: number) {
    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
  }
  
  function A(aA1: number, aA2: number) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
  function B(aA1: number, aA2: number) { return 3.0 * aA2 - 6.0 * aA1; }
  function C(aA1: number) { return 3.0 * aA1; }
  
  function getSlope(aT: number, aA1: number, aA2: number) {
    return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
  }
  
  function getTForX(aX: number) {
    let aGuessT = aX;
    for (let i = 0; i < 4; ++i) {
      const currentSlope = getSlope(aGuessT, p1x, p2x);
      if (currentSlope === 0.0) return aGuessT;
      const currentX = calcBezier(aGuessT, p1x, p2x) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }
  
  if (p1x === p1y && p2x === p2y) return t; // linear
  return calcBezier(getTForX(t), p1y, p2y);
}

// 5 Animation Styles predefined easing curves
const EasingCurves = {
  hardcover: (t: number) => cubicBezier(t, 0.25, 0.46, 0.45, 0.94),
  magazine: (t: number) => cubicBezier(t, 0.165, 0.84, 0.44, 1),
  book: (t: number) => cubicBezier(t, 0.4, 0, 0.2, 1),
  notebook: (t: number) => cubicBezier(t, 0.34, 1.56, 0.64, 1),
  minimal: (t: number) => cubicBezier(t, 0.4, 0, 0.2, 1), // ease
  softCurl: (t: number) => cubicBezier(t, 0.25, 0.1, 0.25, 1),
  fastFlip: (t: number) => cubicBezier(t, 0.1, 0.9, 0.2, 1),
  elasticFlip: (t: number) => cubicBezier(t, 0.68, -0.55, 0.265, 1.55),
  vintagePaper: (t: number) => cubicBezier(t, 0.42, 0, 1, 1),
  luxuryMagazine: (t: number) => cubicBezier(t, 0.25, 1, 0.5, 1),
};

export const AnimationStylesConfig = {
  hardcover: {
    duration: 600,
    easing: EasingCurves.hardcover,
    shadowIntensity: 0.6,
    curvature: 0.15, // Hardcovers barely bend
  },
  magazine: {
    duration: 350,
    easing: EasingCurves.magazine,
    shadowIntensity: 0.3,
    curvature: 0.5, // High bend
  },
  book: {
    duration: 500,
    easing: EasingCurves.book,
    shadowIntensity: 0.4,
    curvature: 0.3, // Medium bend
  },
  notebook: {
    duration: 400,
    easing: EasingCurves.notebook,
    shadowIntensity: 0.2,
    curvature: 0.4, // Bouncy bend
  },
  minimal: {
    duration: 250,
    easing: EasingCurves.minimal,
    shadowIntensity: 0.1,
    curvature: 0, // Flat
  },
  softCurl: {
    duration: 650,
    easing: EasingCurves.softCurl,
    shadowIntensity: 0.5,
    curvature: 0.8, // Very high bend
  },
  fastFlip: {
    duration: 200,
    easing: EasingCurves.fastFlip,
    shadowIntensity: 0.2,
    curvature: 0.2, // Small bend
  },
  elasticFlip: {
    duration: 550,
    easing: EasingCurves.elasticFlip,
    shadowIntensity: 0.4,
    curvature: 0.4, // Bouncy
  },
  vintagePaper: {
    duration: 800,
    easing: EasingCurves.vintagePaper,
    shadowIntensity: 0.7,
    curvature: 0.6, // Heavy drag
  },
  luxuryMagazine: {
    duration: 450,
    easing: EasingCurves.luxuryMagazine,
    shadowIntensity: 0.35,
    curvature: 0.45, // Glossy bend
  },
};

export function getEasingFn(style: AnimationStyle) {
  return AnimationStylesConfig[style]?.easing || EasingCurves.book;
}
