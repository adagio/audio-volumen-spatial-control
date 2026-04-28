import { AbsoluteFill } from "remotion";
import { useMemo } from "react";
import { COLORS, STROKE_WIDTH } from "../constants";
import { CAVEAT } from "../font";
import { Paper } from "../components/Paper";
import { Head } from "../components/Head";
import { Bubble } from "../components/Field";
import { sketchyLine, sketchyRectPath } from "../utils/paths";

const W = 1920;
const H = 1080;

export const EndScreen: React.FC = () => {
  // Big sketchy CTA button geometry
  const btnW = 880;
  const btnH = 200;
  const btnX = (W - btnW) / 2;
  const btnY = 540;

  const btnPath = useMemo(
    () => sketchyRectPath(btnX, btnY, btnW, btnH, 32, 71, 2.4),
    [],
  );
  // Drop-shadow under the button (inked offset, classic neo-brutalist sketch)
  const btnShadowPath = useMemo(
    () => sketchyRectPath(btnX + 14, btnY + 16, btnW, btnH, 32, 73, 2.4),
    [],
  );

  const titleUnderline = useMemo(
    () => sketchyLine(W / 2 - 380, 270, W / 2 + 380, 270, 53, 4),
    [],
  );

  // Two arrows pointing toward the button
  const arrowLeft = useMemo(
    () => sketchyLine(btnX - 180, btnY + btnH / 2, btnX - 30, btnY + btnH / 2, 7, 2.5),
    [],
  );
  const arrowRight = useMemo(
    () => sketchyLine(btnX + btnW + 30, btnY + btnH / 2, btnX + btnW + 180, btnY + btnH / 2, 9, 2.5),
    [],
  );

  return (
    <Paper>
      <AbsoluteFill>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {/* Decorative bubbles + head trio at top, like a tiny app preview */}
          <g transform={`translate(${W / 2 - 280} 160)`}>
            <Bubble cx={0} cy={0} r={56} label="Spotify" glyph="spotify" />
          </g>
          <g transform={`translate(${W / 2} 160)`}>
            <Head cx={0} cy={0} r={42} />
          </g>
          <g transform={`translate(${W / 2 + 280} 160)`}>
            <Bubble cx={0} cy={0} r={56} label="Discord" glyph="discord" />
          </g>
          {/* dashed connector line behind the trio */}
          <line
            x1={W / 2 - 220}
            y1={160}
            x2={W / 2 + 220}
            y2={160}
            stroke={COLORS.muted}
            strokeWidth={2.5}
            strokeDasharray="6 8"
            strokeLinecap="round"
          />

          {/* Wordmark */}
          <text
            x={W / 2}
            y={350}
            textAnchor="middle"
            fontFamily={CAVEAT}
            fontWeight={700}
            fontSize={104}
            fill={COLORS.ink}
            style={{ letterSpacing: -1 }}
          >
            Spatial Audio Volume
          </text>
          {/* underline */}
          <path
            d={titleUnderline}
            fill="none"
            stroke={COLORS.cyan}
            strokeWidth={8}
            strokeLinecap="round"
            transform="translate(0 75)"
          />

          {/* tagline */}
          <text
            x={W / 2}
            y={490}
            textAnchor="middle"
            fontFamily={CAVEAT}
            fontWeight={400}
            fontSize={46}
            fill={COLORS.muted}
          >
            Te acercas a una app, sube. Te alejas, baja.
          </text>

          {/* Sketchy shadow under button */}
          <path
            d={btnShadowPath}
            fill={COLORS.ink}
            stroke={COLORS.ink}
            strokeWidth={1}
            opacity={1}
          />
          {/* CTA button body */}
          <path
            d={btnPath}
            fill={COLORS.cyan}
            stroke={COLORS.ink}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* CTA text */}
          <text
            x={W / 2}
            y={btnY + btnH / 2 + 38}
            textAnchor="middle"
            fontFamily={CAVEAT}
            fontWeight={700}
            fontSize={108}
            fill={COLORS.ink}
          >
            ↓ ¡Descarga la app!
          </text>

          {/* Arrows */}
          <path d={arrowLeft} fill="none" stroke={COLORS.ink} strokeWidth={4} strokeLinecap="round" />
          <path d={arrowRight} fill="none" stroke={COLORS.ink} strokeWidth={4} strokeLinecap="round" />
          {/* tiny arrowheads */}
          <path
            d={`M ${btnX - 30} ${btnY + btnH / 2} l -22 -12 m 22 12 l -22 12`}
            stroke={COLORS.ink}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`rotate(180 ${btnX - 30} ${btnY + btnH / 2})`}
          />
          <path
            d={`M ${btnX + btnW + 30} ${btnY + btnH / 2} l -22 -12 m 22 12 l -22 12`}
            stroke={COLORS.ink}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Meta line under button */}
          <text
            x={W / 2}
            y={btnY + btnH + 80}
            textAnchor="middle"
            fontFamily={CAVEAT}
            fontWeight={400}
            fontSize={40}
            fill={COLORS.muted}
          >
            Windows 10/11 · ~1.9 MB · Gratis
          </text>

          {/* Bottom URL */}
          <text
            x={W / 2}
            y={H - 60}
            textAnchor="middle"
            fontFamily={CAVEAT}
            fontWeight={700}
            fontSize={42}
            fill={COLORS.ink}
          >
            github.com/adagio/audio-volumen-spatial-control
          </text>
        </svg>
      </AbsoluteFill>
    </Paper>
  );
};
