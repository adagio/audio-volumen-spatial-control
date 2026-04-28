import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, HEIGHT, WIDTH } from "../constants";
import { driveSpring, fadeIn, fadeOut, progressIn } from "../utils/animations";
import { Field, Bubble } from "../components/Field";
import { Head } from "../components/Head";
import { Wave } from "../components/Wave";
import { CAVEAT } from "../font";
import { DrawnText } from "../components/DrawnText";

const FIELD = { cx: WIDTH / 2, cy: HEIGHT / 2 + 40, w: 880, h: 240 };

// piecewise spring-driven head position in [-1, 1]
const headPosition = (frame: number, fps: number): number => {
  if (frame < 95) {
    // 20→95: 0 → -1
    return 0 - driveSpring(frame, 20, fps) * 1;
  }
  if (frame < 125) {
    return -1;
  }
  if (frame < 200) {
    // 125→200: -1 → +1
    return -1 + driveSpring(frame, 125, fps) * 2;
  }
  return 1;
};

export const Scene4Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = fadeIn(frame, 0, 12);
  const sceneOut = fadeOut(frame, 225, 15);

  const headX = headPosition(frame, fps);
  const headPx = FIELD.cx + (FIELD.w / 2 - 100) * headX;

  // amplitude reactivity (clamped via interpolate)
  const spotifyAmp = interpolate(headX, [-1, 1], [60, 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const discordAmp = interpolate(headX, [-1, 1], [4, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // readout %
  const spotifyPct = Math.round(interpolate(headX, [-1, 1], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  const discordPct = 100 - spotifyPct;

  const ticksProgress = progressIn(frame, 0, 25);

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        {/* Field with ticks */}
        <Field
          cx={FIELD.cx}
          cy={FIELD.cy}
          width={FIELD.w}
          height={FIELD.h}
          drawProgress={1}
          axisProgress={ticksProgress}
          showTicks
        />

        {/* Bubbles always present */}
        <Bubble
          cx={FIELD.cx - FIELD.w / 2 + 100}
          cy={FIELD.cy}
          r={62}
          label="Spotify"
          glyph="spotify"
        />
        <Bubble
          cx={FIELD.cx + FIELD.w / 2 - 100}
          cy={FIELD.cy}
          r={62}
          label="Discord"
          glyph="discord"
        />

        {/* Sound waves emanating from each bubble (above + below the field axis) */}
        <g opacity={0.85}>
          <Wave
            cx={FIELD.cx - FIELD.w / 2 + 100}
            cy={FIELD.cy - 130}
            width={260}
            amplitude={spotifyAmp * 0.5}
            frequency={3}
            phase={frame * 0.2}
            color={COLORS.cyan}
            strokeWidth={3}
          />
          <Wave
            cx={FIELD.cx + FIELD.w / 2 - 100}
            cy={FIELD.cy - 130}
            width={260}
            amplitude={discordAmp * 0.5}
            frequency={3}
            phase={frame * 0.22 + 1.1}
            color={COLORS.cyan}
            strokeWidth={3}
          />
        </g>

        {/* Head */}
        <Head cx={headPx} cy={FIELD.cy} r={44} />
      </svg>

      {/* Readout */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 56,
          fontFamily: CAVEAT,
          opacity: fadeIn(frame, 30, 14),
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, color: COLORS.muted, fontWeight: 400 }}>Spotify</div>
          <div style={{ fontSize: 96, color: COLORS.ink, fontWeight: 700, lineHeight: 1 }}>
            {spotifyPct}
            <span style={{ fontSize: 56, color: COLORS.muted }}>%</span>
          </div>
        </div>
        <div
          style={{
            alignSelf: "center",
            fontSize: 80,
            color: COLORS.muted,
            fontWeight: 400,
          }}
        >
          /
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, color: COLORS.muted, fontWeight: 400 }}>Discord</div>
          <div style={{ fontSize: 96, color: COLORS.ink, fontWeight: 700, lineHeight: 1 }}>
            {discordPct}
            <span style={{ fontSize: 56, color: COLORS.muted }}>%</span>
          </div>
        </div>
      </div>

      {/* Bottom subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <DrawnText start={20} exit={225} exitDuration={12} size={44} weight={400} color={COLORS.ink}>
          Te acercas a una app, sube. Te alejas, baja.
        </DrawnText>
      </div>
    </AbsoluteFill>
  );
};
