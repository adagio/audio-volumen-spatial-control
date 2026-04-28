import { AbsoluteFill, Img, staticFile } from "remotion";
import { useMemo } from "react";
import { COLORS, STROKE_WIDTH } from "../constants";
import { CAVEAT } from "../font";
import { Field, Bubble } from "../components/Field";
import { Head } from "../components/Head";
import { Wave } from "../components/Wave";
import { Paper } from "../components/Paper";
import { sketchyLine } from "../utils/paths";

const W = 1920;
const H = 1080;

// YouTube embed overlays the thumbnail with:
// - top-left: channel info banner (~640×140)
// - center: red play button (~200×140)
// - bottom-right: "Watch on YouTube" pill (~360×80)
// So we keep the head, cursor, logo, and tagline OUT of those zones.
export const Thumbnail: React.FC = () => {
  // Field geometry — slightly lifted so head is above center
  const fieldCx = W / 2;
  const fieldCy = H / 2 + 80;
  const fieldW = 1500;
  const fieldH = 480;

  const leftBubble = { cx: fieldCx - fieldW * 0.42, cy: fieldCy };
  const rightBubble = { cx: fieldCx + fieldW * 0.42, cy: fieldCy };

  // Head pushed hard to the LEFT — sits well clear of YouTube's center play button.
  const headT = -0.7; // [-1, 1]
  const headCx = fieldCx + headT * (fieldW * 0.38);
  const leftAmp = 30 * (1 - headT * 0.5); // closer → louder
  const rightAmp = 30 * (1 + headT * 0.5);

  const titleUnderline = useMemo(
    () => sketchyLine(W / 2 - 600, 200, W / 2 + 600, 200, 91, 4),
    [],
  );

  // Mouse cursor pinned to the head — the "you can drag this" hint.
  const cursorX = headCx + 38;
  const cursorY = fieldCy + 12;

  return (
    <Paper>
      {/* Logo top-RIGHT — top-left is taken by YouTube's channel banner in embeds */}
      <Img
        src={staticFile("logo.png")}
        style={{
          position: "absolute",
          top: 56,
          right: 70,
          width: 150,
          height: 150,
          filter: "drop-shadow(3px 4px 0 rgba(26,26,26,0.85))",
        }}
      />

      <AbsoluteFill>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {/* Title */}
          <text
            x={W / 2}
            y={170}
            textAnchor="middle"
            fontFamily={CAVEAT}
            fontWeight={700}
            fontSize={148}
            fill={COLORS.ink}
            style={{ letterSpacing: -2 }}
          >
            Spatial Audio Volume
          </text>
          {/* Title underline */}
          <path
            d={titleUnderline}
            fill="none"
            stroke={COLORS.cyan}
            strokeWidth={10}
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

          {/* Sound waves on each side, amplitude reflects head proximity */}
          <Wave
            cx={leftBubble.cx + 280}
            cy={fieldCy - fieldH / 2 - 50}
            width={500}
            amplitude={leftAmp}
            frequency={2.2}
            phase={0}
            color={COLORS.cyan}
            strokeWidth={5}
            opacity={0.95}
          />
          <Wave
            cx={rightBubble.cx - 280}
            cy={fieldCy - fieldH / 2 - 50}
            width={500}
            amplitude={rightAmp}
            frequency={2.4}
            phase={1.1}
            color={COLORS.muted}
            strokeWidth={4}
            opacity={0.6}
          />

          {/* Bubbles */}
          <Bubble
            cx={leftBubble.cx}
            cy={leftBubble.cy}
            r={86}
            label="Spotify"
            glyph="spotify"
          />
          <Bubble
            cx={rightBubble.cx}
            cy={rightBubble.cy}
            r={86}
            label="Discord"
            glyph="discord"
          />

          {/* Motion trail — a faint ghost of the head to the right, suggesting horizontal motion */}
          <g opacity={0.18}>
            <Head cx={headCx + 120} cy={fieldCy} r={64} />
          </g>
          <g opacity={0.32}>
            <Head cx={headCx + 60} cy={fieldCy} r={67} />
          </g>

          {/* Head between them */}
          <Head cx={headCx} cy={fieldCy} r={70} />

          {/* Bidirectional drag arrows flanking the head — clear "this slides L↔R" affordance */}
          <g stroke={COLORS.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Left arrow ← */}
            <line x1={headCx - 84} y1={fieldCy} x2={headCx - 138} y2={fieldCy} />
            <polyline points={`${headCx - 138},${fieldCy} ${headCx - 122},${fieldCy - 14} ${headCx - 122},${fieldCy + 14} ${headCx - 138},${fieldCy}`} fill={COLORS.ink} />
            {/* Right arrow → */}
            <line x1={headCx + 84} y1={fieldCy} x2={headCx + 138} y2={fieldCy} />
            <polyline points={`${headCx + 138},${fieldCy} ${headCx + 122},${fieldCy - 14} ${headCx + 122},${fieldCy + 14} ${headCx + 138},${fieldCy}`} fill={COLORS.ink} />
          </g>

          {/* Mouse cursor — Windows-style arrow, pointing at the head, with motion ticks */}
          <g transform={`translate(${cursorX} ${cursorY}) scale(3)`}>
            <path
              d="M 0 0 L 0 19 L 5.2 14.5 L 9.2 22.5 L 12.4 21 L 8.4 13 L 15 13 Z"
              fill="#ffffff"
              stroke={COLORS.ink}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          </g>
          {/* Motion lines next to the cursor — like comic-book "drag" flicks */}
          <g stroke={COLORS.ink} strokeWidth={4} strokeLinecap="round" opacity={0.85}>
            <line x1={cursorX + 56} y1={cursorY + 28} x2={cursorX + 84} y2={cursorY + 28} />
            <line x1={cursorX + 60} y1={cursorY + 46} x2={cursorX + 80} y2={cursorY + 46} />
          </g>

          {/* Volume readout next to head — pulled left to stay visible under the play button */}
          <g>
            <text
              x={headCx}
              y={fieldCy - 130}
              textAnchor="middle"
              fontFamily={CAVEAT}
              fontWeight={700}
              fontSize={56}
              fill={COLORS.muted}
            >
              <tspan fill={COLORS.ink}>92%</tspan>
              <tspan dx={20}>/</tspan>
              <tspan dx={20} fill={COLORS.ink}>8%</tspan>
            </text>
          </g>
        </svg>

        {/* Bottom-LEFT tagline — bottom-right is covered by "Watch on YouTube" */}
        <div
          style={{
            position: "absolute",
            left: 80,
            bottom: 60,
            fontFamily: CAVEAT,
            fontWeight: 700,
            fontSize: 60,
            color: COLORS.ink,
            lineHeight: 1.05,
            maxWidth: 1000,
            pointerEvents: "none",
          }}
        >
          Mezcla dos apps moviendo
          <br />
          <span
            style={{
              color: COLORS.ink,
              background: COLORS.cyan,
              padding: "0 16px",
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
