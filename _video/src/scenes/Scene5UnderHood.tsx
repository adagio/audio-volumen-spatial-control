import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, HEIGHT, WIDTH } from "../constants";
import { fadeIn, fadeOut, progressIn } from "../utils/animations";
import { Field, Bubble } from "../components/Field";
import { Head } from "../components/Head";
import { MixerSlider } from "../components/MixerSlider";
import { CAVEAT } from "../font";
import { SketchyRect } from "../components/SketchyRect";
import { curvedArrow } from "../utils/paths";

const LEFT_FIELD = { cx: 280, cy: HEIGHT / 2, w: 460, h: 180 };
const RIGHT_MIXER = { x: 620, y: HEIGHT / 2 - 240, w: 360, h: 480 };
const RIGHT_SLIDER_TOP = RIGHT_MIXER.y + 100;
const RIGHT_SLIDER_HEIGHT = 300;
const RIGHT_SLIDER_X = [
  RIGHT_MIXER.x + 110,
  RIGHT_MIXER.x + 250,
];

export const Scene5UnderHood: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneIn = fadeIn(frame, 0, 14);
  const sceneOut = fadeOut(frame, 130, 18);

  const splitProgress = progressIn(frame, 0, 22);
  const arrowProgress = progressIn(frame, 22, 28);
  const mixerProgress = progressIn(frame, 8, 22);

  // head oscillates ±0.6
  const headX = Math.sin((frame - 50) * 0.05) * 0.6;
  const headOscOpacity = fadeIn(frame, 30, 12);
  const headPx = LEFT_FIELD.cx + (LEFT_FIELD.w / 2 - 60) * headX;

  // sliders mirror head: left high when headX = -1
  const spotifyVal = interpolate(headX, [-1, 1], [0.95, 0.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const discordVal = interpolate(headX, [-1, 1], [0.1, 0.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // arrow path
  const arrowPath = curvedArrow(
    LEFT_FIELD.cx + LEFT_FIELD.w / 2 + 20,
    LEFT_FIELD.cy - 90,
    RIGHT_MIXER.x - 10,
    RIGHT_MIXER.y + 60,
    -120,
  );

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        {/* Left mini-field */}
        <g
          opacity={splitProgress}
          transform={`translate(${interpolate(splitProgress, [0, 1], [-80, 0])} 0)`}
        >
          <Field
            cx={LEFT_FIELD.cx}
            cy={LEFT_FIELD.cy}
            width={LEFT_FIELD.w}
            height={LEFT_FIELD.h}
            drawProgress={splitProgress}
            seed={31}
            axisProgress={progressIn(frame, 18, 18)}
          />
          <Bubble
            cx={LEFT_FIELD.cx - LEFT_FIELD.w / 2 + 60}
            cy={LEFT_FIELD.cy}
            r={36}
            label=""
            glyph="spotify"
          />
          <Bubble
            cx={LEFT_FIELD.cx + LEFT_FIELD.w / 2 - 60}
            cy={LEFT_FIELD.cy}
            r={36}
            label=""
            glyph="discord"
          />
          <g opacity={headOscOpacity}>
            <Head cx={headPx} cy={LEFT_FIELD.cy} r={28} />
          </g>
        </g>

        {/* Curved arrow */}
        <g opacity={arrowProgress}>
          <path
            d={arrowPath}
            fill="none"
            stroke={COLORS.cyan}
            strokeWidth={4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - arrowProgress}
          />
          {/* arrowhead */}
          <g
            transform={`translate(${RIGHT_MIXER.x - 10} ${RIGHT_MIXER.y + 60}) rotate(60)`}
            opacity={interpolate(arrowProgress, [0.85, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          >
            <path
              d="M 0 0 L -16 -8 M 0 0 L -16 8"
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth={4}
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Right mini-mixer */}
        <g
          opacity={splitProgress}
          transform={`translate(${interpolate(splitProgress, [0, 1], [80, 0])} 0)`}
        >
          <SketchyRect
            x={RIGHT_MIXER.x}
            y={RIGHT_MIXER.y}
            w={RIGHT_MIXER.w}
            h={RIGHT_MIXER.h}
            radius={24}
            seed={91}
            drawProgress={mixerProgress}
            fill={COLORS.paper}
          />
          <text
            x={RIGHT_MIXER.x + RIGHT_MIXER.w / 2}
            y={RIGHT_MIXER.y + 60}
            textAnchor="middle"
            fontFamily={CAVEAT}
            fontWeight={700}
            fontSize={32}
            fill={COLORS.ink}
            opacity={mixerProgress}
          >
            Volume Mixer
          </text>
          <MixerSlider
            cx={RIGHT_SLIDER_X[0]}
            topY={RIGHT_SLIDER_TOP}
            height={RIGHT_SLIDER_HEIGHT}
            value={spotifyVal}
            label="Spotify"
            drawProgress={mixerProgress}
            highlight
          />
          <MixerSlider
            cx={RIGHT_SLIDER_X[1]}
            topY={RIGHT_SLIDER_TOP}
            height={RIGHT_SLIDER_HEIGHT}
            value={discordVal}
            label="Discord"
            drawProgress={mixerProgress}
            highlight
          />
        </g>
      </svg>

      {/* WASAPI badge */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 90,
          display: "flex",
          justifyContent: "center",
          opacity: fadeIn(frame, 50, 16),
        }}
      >
        <div
          style={{
            border: `3px solid ${COLORS.ink}`,
            borderRadius: 999,
            padding: "14px 36px",
            fontFamily: CAVEAT,
            fontWeight: 700,
            fontSize: 38,
            color: COLORS.ink,
            backgroundColor: COLORS.paper,
            transform: "rotate(-1.5deg)",
            boxShadow: `4px 4px 0 ${COLORS.ink}`,
          }}
        >
          WASAPI · por PID · tiempo real
        </div>
      </div>
    </AbsoluteFill>
  );
};
