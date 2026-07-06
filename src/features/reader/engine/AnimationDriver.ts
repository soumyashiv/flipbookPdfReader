import { AnimationStylesConfig } from './easings';
import type { AnimationStyle } from '@/types';

type AnimationCallback = (progress: number) => void;
type CompletionCallback = () => void;

export class AnimationDriver {
  private rAF: number | null = null;
  private startTime: number = 0;
  private startProgress: number = 0;
  private targetProgress: number = 1;
  private baseDuration: number = 500;
  private duration: number = 500;
  private easingFn: (t: number) => number;
  private onTick: AnimationCallback;
  private onComplete: CompletionCallback;

  constructor(
    style: AnimationStyle,
    speedMultiplier: number,
    onTick: AnimationCallback,
    onComplete: CompletionCallback
  ) {
    const config = AnimationStylesConfig[style] || AnimationStylesConfig.book;
    this.baseDuration = config.duration;
    this.duration = this.baseDuration / speedMultiplier;
    this.easingFn = config.easing;
    this.onTick = onTick;
    this.onComplete = onComplete;
  }

  public setStyle(style: AnimationStyle, speedMultiplier: number) {
    const config = AnimationStylesConfig[style] || AnimationStylesConfig.book;
    this.baseDuration = config.duration;
    this.duration = this.baseDuration / speedMultiplier;
    this.easingFn = config.easing;
  }

  public animate(from: number, to: number) {
    this.stop();
    this.startProgress = from;
    this.targetProgress = to;
    this.startTime = performance.now();
    this.tick(this.startTime);
  }

  public updateTarget(to: number) {
    if (this.rAF === null) {
      this.animate(this.startProgress, to);
    } else {
      // Re-route animation mid-flight
      const currentProgress = this.getCurrentProgress(performance.now());
      this.startProgress = currentProgress;
      this.targetProgress = to;
      this.startTime = performance.now();
    }
  }

  private getCurrentProgress(now: number): number {
    const elapsed = now - this.startTime;
    const t = Math.min(Math.max(elapsed / this.duration, 0), 1);
    const easedT = this.easingFn(t);
    return this.startProgress + (this.targetProgress - this.startProgress) * easedT;
  }

  private tick = (timestamp: number) => {
    const progress = this.getCurrentProgress(timestamp);
    
    this.onTick(progress);

    if (timestamp - this.startTime < this.duration) {
      this.rAF = requestAnimationFrame(this.tick);
    } else {
      this.onTick(this.targetProgress); // ensure exact finish
      this.stop();
      this.onComplete();
    }
  };

  public stop() {
    if (this.rAF !== null) {
      cancelAnimationFrame(this.rAF);
      this.rAF = null;
    }
  }

  public destroy() {
    this.stop();
  }
}
