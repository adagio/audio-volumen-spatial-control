import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, HEIGHT, WIDTH } from "../constants";
import { fadeIn, fadeOut, progressIn } from "../utils/animations";
import { SketchyRect } from "../components/SketchyRect";
import { MixerSlider } from "../components/MixerSlider";
import { CAVEAT } from "../font";
import { DrawnText } from "../components/DrawnText";

const MIXER = { x: 220, y: 180, w: 640, h: 620 };
const SLIDER_TOP = MIXER.y + 130;
const SLIDER_HEIGHT = 380;
const SLIDER_LABELS = ["System", "Spotify", "Discord", "Chrome"];
const SLIDER_X = SLIDER_LABELS.map((_, i) => MIXER.x + 110 + i * 140);

// Cursor path keyframes (frame, x, y); uses absolute coords inside the SVG.
const CURSOR_PATH: Array<[number, number, number]> = [
  [0, 1100, 1100], // off-screen bottom-right
  [40, SLIDER_X[1] + 30, SLIDER_TOP + 100], // arrive at Spotify thumb
  [60, SLIDER_X[1] + 30, SLIDER_TOP + 280], // drag down
  [80, SLIDER_X[2] + 30, SLIDER_TOP + 280], // jump to Discord
  [100, SLIDER_X[2] + 30, SLIDER_TOP + 80], // drag up
  [120, SLIDER_X[1] + 30, SLIDER_TOP + 80], // back to Spotify
  [140, SLIDER_X[1] + 30, SLIDER_TOP + 200], // adjust again
];

const interpKeyframes = (frame: number, kf: Array<[number, number, number]>) => {
  const frames = kf.map((k) => k[0]);
  const xs = kf.map((k) => k[1]);
  const ys = kf.map((k) => k[2]);
  const x = interpolate(frame, frames, xs, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const y = interpolate(frame, frames, ys, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  return { x, y };
};

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneIn = fadeIn(frame, 0, 10);
  const sceneOut = fadeOut(frame, 138, 12);
  const mixerProgress = progressIn(frame, 0, 25);

  // slider values: 1 = full
  const slider0 = 0.7; // System (static)
  const slider1 = interpolate(
    frame,
    [0, 40, 60, 120, 140],
    [0.85, 0.85, 0.4, 0.4, 0.7],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const slider2 = interpolate(
    frame,
    [0, 80, 100],
    [0.3, 0.3, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const slider3 = 0.55;

  const cursor = interpKeyframes(frame, CURSOR_PATH);
  const cursorOpacity = fadeIn(frame, 26, 12) * fadeOut(frame, 138, 10);

  // determine which slider the cursor is currently dragging — simple highlight
  const distSq = (i: number) =>
    (SLIDER_X[i] + 30 - cursor.x) ** 2 + (SLIDER_TOP + 200 - cursor.y) ** 2;
  const focusIdx = [1, 2].reduce(
    (best, i) => (distSq(i) < distSq(best) ? i : best),
    1,
  );

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        {/* mixer frame */}
        <SketchyRect
          x={MIXER.x}
          y={MIXER.y}
          w={MIXER.w}
          h={MIXER.h}
          radius={28}
          seed={42}
          drawProgress={mixerProgress}
          fill={COLORS.paper}
        />
        {/* header */}
        <text
          x={MIXER.x + MIXER.w / 2}
          y={MIXER.y + 72}
          textAnchor="middle"
          fontFamily={CAVEAT}
          fontWeight={700}
          fontSize={42}
          fill={COLORS.ink}
          opacity={mixerProgress}
        >
          Volume Mixer
        </text>
        <line
          x1={MIXER.x + 30}
          y1={MIXER.y + 96}
          x2={MIXER.x + MIXER.w - 30}
          y2={MIXER.y + 96}
          stroke={COLORS.ink}
          strokeWidth={2}
          opacity={mixerProgress * 0.6}
        />

        {/* sliders */}
        {[slider0, slider1, slider2, slider3].map((v, i) => (
          <MixerSlider
            key={i}
            cx={SLIDER_X[i]}
            topY={SLIDER_TOP}
            height={SLIDER_HEIGHT}
            value={v}
            label={SLIDER_LABELS[i]}
            drawProgress={progressIn(frame, 8 + i * 4, 20)}
            highlight={cursorOpacity > 0.3 && (i === focusIdx) && (i === 1 || i === 2)}
          />
        ))}

        {/* cursor */}
        <g
          transform={`translate(${cursor.x} ${cursor.y}) rotate(-12)`}
          opacity={cursorOpacity}
        >
          <path
            d="M 0 0 L 0 30 L 8 22 L 14 36 L 20 32 L 14 18 L 26 18 Z"
            fill={COLORS.ink}
            stroke={COLORS.paper}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </g>
      </svg>

      {/* Staggered text */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 90,
          display: "flex",
          justifyContent: "center",
          gap: 28,
        }}
      >
        <DrawnText start={80} size={62}>
          Ajustar.
        </DrawnText>
        <DrawnText start={100} size={62}>
          Volver.
        </DrawnText>
        <DrawnText start={120} size={62} color={COLORS.cyan}>
          Reajustar.
        </DrawnText>
      </div>
    </AbsoluteFill>
  );
};
