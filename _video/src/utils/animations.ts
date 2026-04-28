import { Easing, interpolate, spring } from "remotion";

// 0..1 progress with crisp ease — for draw-in animations.
export const progressIn = (frame: number, start: number, duration: number): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

export const appear = (
  frame: number,
  start: number,
  fps: number,
  options?: { rise?: number },
): { opacity: number; transform: string } => {
  const rise = options?.rise ?? 8;
  const s = spring({
    frame: frame - start,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 120 },
  });
  return {
    opacity: interpolate(s, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(s, [0, 1], [rise, 0])}px)`,
  };
};

export const fadeOut = (frame: number, start: number, duration: number): number =>
  interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 1, 1),
  });

export const fadeIn = (frame: number, start: number, duration: number): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0, 0, 0.4, 1),
  });

// Smooth spring-driven 0→1 for moving head between positions
export const driveSpring = (frame: number, start: number, fps: number): number =>
  spring({
    frame: frame - start,
    fps,
    config: { damping: 22, mass: 1, stiffness: 90 },
  });
