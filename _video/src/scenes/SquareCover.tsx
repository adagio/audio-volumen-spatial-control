import { AbsoluteFill, Img, staticFile } from "remotion";
import { useMemo } from "react";
import { COLORS } from "../constants";
import { CAVEAT } from "../font";
import { Field, Bubble } from "../components/Field";
import { Head } from "../components/Head";
import { Wave } from "../components/Wave";
import { Paper } from "../components/Paper";
import { sketchyLine } from "../utils/paths";

const W = 1080;
const H = 1080;

// Square cover (1:1) embedded inside the mp4. Same visual language as the
// YouTube thumbnail, reflowed for the video's native aspect ratio.
export const SquareCover: React.FC = () => {
  const fieldCx = W / 2;
  const fieldCy = H / 2 + 70;
  const fieldW = 920;
  const fieldH = 320;

  const leftBubble = { cx: fieldCx - fieldW * 0.4, cy: fieldCy };
  const rightBubble = { cx: fieldCx + fieldW * 0.4, cy: fieldCy };

  // Head pulled left → Spotify louder, makes the wave imbalance readable
  const headT = -0.55;
  const headCx = fieldCx + headT * (fieldW * 0.36);
  const leftAmp = 24 * (1 - headT * 0.5);
  const rightAmp = 24 * (1 + headT * 0.5);

  const titleUnderline = useMemo(
    () => sketchyLine(W / 2 - 360, 230, W / 2 + 360, 230, 91, 4),
    [],
  );

  const cursorX = headCx + 28;
  const cursorY = fieldCy + 12;

  return (
    <Paper>
      {/* Logo top-right */}
      <Img
        src={staticFile("logo.png")}
        style={{
          position: "absolute",
          top: 56,
          right: 56,
          width: 110,
          height: 110,
          filter: "drop-shadow(3px 4px 0 rgba(26,26,26,0.85))",
        }}
      />

      <AbsoluteFill>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {/* Title */}
          <text
            x={W / 2}
            y={200}
            textAnchor="middle"
            fontFamily={CAVEAT}
            fontWeight={700}
            fontSize={108}
            fill={COLORS.ink}
            style={{ letterSpacing: -1 }}
          >
            Spatial Audio Volume
          </text>
          <path
            d={titleUnderline}
            fill="none"
            stroke={COLORS.cyan}
            strokeWidth={8}
            strokeLinecap="round"
          />

          {/* Field */}
          <Field
            cx={fieldCx}
            cy={fieldCy}
            width={fieldW}
            height={fieldH}
            seed={42}
            drawProgress={1}
            axisProgress={1}
          />

          {/* Waves on each side reflect head position */}
          <Wave
            cx={leftBubble.cx + 170}
            cy={fieldCy - fieldH / 2 - 40}
            width={300}
            amplitude={leftAmp}
            frequency={2.2}
            phase={0}
            color={COLORS.cyan}
            strokeWidth={4}
            opacity={0.95}
          />
          <Wave
            cx={rightBubble.cx - 170}
            cy={fieldCy - fieldH / 2 - 40}
            width={300}
            amplitude={rightAmp}
            frequency={2.4}
            phase={1.1}
            color={COLORS.muted}
            strokeWidth={3.5}
            opacity={0.6}
          />

          {/* Bubbles */}
          <Bubble
            cx={leftBubble.cx}
            cy={leftBubble.cy}
            r={68}
            label="Spotify"
            glyph="spotify"
          />
          <Bubble
            cx={rightBubble.cx}
            cy={rightBubble.cy}
            r={68}
            label="Discord"
            glyph="discord"
          />

          {/* Motion ghost trail to the right of the head */}
          <g opacity={0.18}>
            <Head cx={headCx + 90} cy={fieldCy} r={48} />
          </g>
          <g opacity={0.32}>
            <Head cx={headCx + 46} cy={fieldCy} r={51} />
          </g>

          {/* Head */}
          <Head cx={headCx} cy={fieldCy} r={54} />

          {/* Bidirectional drag arrows flanking the head */}
          <g stroke={COLORS.ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none">
            <line x1={headCx - 64} y1={fieldCy} x2={headCx - 110} y2={fieldCy} />
            <polyline
              points={`${headCx - 110},${fieldCy} ${headCx - 96},${fieldCy - 11} ${headCx - 96},${fieldCy + 11} ${headCx - 110},${fieldCy}`}
              fill={COLORS.ink}
            />
            <line x1={headCx + 64} y1={fieldCy} x2={headCx + 110} y2={fieldCy} />
            <polyline
              points={`${headCx + 110},${fieldCy} ${headCx + 96},${fieldCy - 11} ${headCx + 96},${fieldCy + 11} ${headCx + 110},${fieldCy}`}
              fill={COLORS.ink}
            />
          </g>

          {/* Cursor anchored to the head */}
          <g transform={`translate(${cursorX} ${cursorY}) scale(2.4)`}>
            <path
              d="M 0 0 L 0 19 L 5.2 14.5 L 9.2 22.5 L 12.4 21 L 8.4 13 L 15 13 Z"
              fill="#ffffff"
              stroke={COLORS.ink}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          </g>
          {/* Drag flicks next to the cursor */}
          <g stroke={COLORS.ink} strokeWidth={3} strokeLinecap="round" opacity={0.85}>
            <line x1={cursorX + 44} y1={cursorY + 22} x2={cursorX + 66} y2={cursorY + 22} />
            <line x1={cursorX + 48} y1={cursorY + 36} x2={cursorX + 64} y2={cursorY + 36} />
          </g>

          {/* Volume readout */}
          <text
            x={headCx}
            y={fieldCy - 110}
            textAnchor="middle"
            fontFamily={CAVEAT}
            fontWeight={700}
            fontSize={44}
            fill={COLORS.muted}
          >
            <tspan fill={COLORS.ink}>87%</tspan>
            <tspan dx={16}>/</tspan>
            <tspan dx={16} fill={COLORS.ink}>13%</tspan>
          </text>
        </svg>

        {/* Tagline */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 90,
            textAlign: "center",
            fontFamily: CAVEAT,
            fontWeight: 700,
            fontSize: 52,
            color: COLORS.ink,
            lineHeight: 1.05,
            pointerEvents: "none",
          }}
        >
          Mezcla dos apps moviendo{" "}
          <span
            style={{
              color: COLORS.ink,
              background: COLORS.cyan,
              padding: "0 14px",
              borderRadius: 8,
            }}
          >
            tu cabeza.
          </span>
        </div>
      </AbsoluteFill>
    </Paper>
  );
};
