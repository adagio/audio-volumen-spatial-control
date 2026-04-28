export const COLORS = {
  paper: "#FAF7F2",
  ink: "#1A1A1A",
  cyan: "#7DD3D8",
  muted: "#9CA3AF",
  paperShadow: "#EDE7DC",
} as const;

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1080;

export const SCENE_DURATIONS = {
  s1: 120,
  s2: 150,
  s3: 180,
  s4: 240,
  s5: 150,
  s6: 60,
} as const;

export const TOTAL_FRAMES =
  SCENE_DURATIONS.s1 +
  SCENE_DURATIONS.s2 +
  SCENE_DURATIONS.s3 +
  SCENE_DURATIONS.s4 +
  SCENE_DURATIONS.s5 +
  SCENE_DURATIONS.s6;

export const STROKE_WIDTH = 4;
export const STROKE_THIN = 2.5;
