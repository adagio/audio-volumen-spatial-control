import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, HEIGHT, WIDTH } from "../constants";
import { fadeIn, fadeOut, progressIn } from "../utils/animations";
import { SketchyRect } from "../components/SketchyRect";
import { Wave } from "../components/Wave";
import { DrawnText } from "../components/DrawnText";
import { CAVEAT } from "../font";

const WIN1 = { x: 130, y: 220, w: 620, h: 400 }; // Spotify
const WIN2 = { x: 380, y: 460, w: 620, h: 400 }; // Discord

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneFade = fadeOut(frame, 105, 15);
  const sceneIn = fadeIn(frame, 0, 8);

  const win1Progress = progressIn(frame, 0, 35);
  const win2Progress = progressIn(frame, 20, 35);

  const waveAmp1 = 18 + Math.sin(frame * 0.32) * 10;
  const waveAmp2 = 22 + Math.sin(frame * 0.21 + 1.4) * 12;
  const waveAmp3 = 14 + Math.sin(frame * 0.41 + 2.1) * 8;
  const wavesOpacity = fadeIn(frame, 30, 20) * sceneFade;

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneFade }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <defs>
          <clipPath id="win1clip">
            <rect x={WIN1.x + 20} y={WIN1.y + 80} width={WIN1.w - 40} height={WIN1.h - 100} />
          </clipPath>
          <clipPath id="win2clip">
            <rect x={WIN2.x + 20} y={WIN2.y + 80} width={WIN2.w - 40} height={WIN2.h - 100} />
          </clipPath>
        </defs>

        {/* Window 1 — Spotify */}
        <g>
          <SketchyRect
            x={WIN1.x}
            y={WIN1.y}
            w={WIN1.w}
            h={WIN1.h}
            radius={20}
            seed={7}
            drawProgress={win1Progress}
            fill={COLORS.paper}
          />
          <line
            x1={WIN1.x + 20}
            y1={WIN1.y + 56}
            x2={WIN1.x + WIN1.w - 20}
            y2={WIN1.y + 56}
            stroke={COLORS.ink}
            strokeWidth={2}
            opacity={win1Progress}
          />
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={WIN1.x + 28 + i * 22}
              cy={WIN1.y + 28}
              r={6}
              fill="none"
              stroke={COLORS.ink}
              strokeWidth={2}
              opacity={win1Progress}
            />
          ))}
          <text
            x={WIN1.x + WIN1.w / 2}
            y={WIN1.y + 38}
            textAnchor="middle"
            fontFamily={CAVEAT}
            fontWeight={700}
            fontSize={30}
            fill={COLORS.ink}
            opacity={fadeIn(frame, 30, 12)}
          >
            Spotify
          </text>
          <g opacity={wavesOpacity} clipPath="url(#win1clip)">
            <Wave
              cx={WIN1.x + WIN1.w / 2}
              cy={WIN1.y + WIN1.h / 2 + 20}
              width={WIN1.w - 80}
              amplitude={waveAmp1}
              frequency={3}
              phase={frame * 0.18}
              color={COLORS.ink}
              strokeWidth={3}
            />
            <Wave
              cx={WIN1.x + WIN1.w / 2}
              cy={WIN1.y + WIN1.h / 2 + 20}
              width={WIN1.w - 80}
              amplitude={waveAmp2 * 0.6}
              frequency={5}
              phase={frame * 0.27 + 1.1}
              color={COLORS.ink}
              strokeWidth={2}
              opacity={0.5}
            />
          </g>
        </g>

        {/* Window 2 — Discord */}
        <g>
          <SketchyRect
            x={WIN2.x}
            y={WIN2.y}
            w={WIN2.w}
            h={WIN2.h}
            radius={20}
            seed={19}
            drawProgress={win2Progress}
            fill={COLORS.paper}
          />
          <line
            x1={WIN2.x + 20}
            y1={WIN2.y + 56}
            x2={WIN2.x + WIN2.w - 20}
            y2={WIN2.y + 56}
            stroke={COLORS.ink}
            strokeWidth={2}
            opacity={win2Progress}
          />
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={WIN2.x + 28 + i * 22}
              cy={WIN2.y + 28}
              r={6}
              fill="none"
              stroke={COLORS.ink}
              strokeWidth={2}
              opacity={win2Progress}
            />
          ))}
          <text
            x={WIN2.x + WIN2.w / 2}
            y={WIN2.y + 38}
            textAnchor="middle"
            fontFamily={CAVEAT}
            fontWeight={700}
            fontSize={30}
            fill={COLORS.ink}
            opacity={fadeIn(frame, 50, 12)}
          >
            Discord
          </text>
          <g opacity={wavesOpacity} clipPath="url(#win2clip)">
            <Wave
              cx={WIN2.x + WIN2.w / 2}
              cy={WIN2.y + WIN2.h / 2 + 20}
              width={WIN2.w - 80}
              amplitude={waveAmp3}
              frequency={4}
              phase={frame * 0.31 + 0.7}
              color={COLORS.ink}
              strokeWidth={3}
            />
            <Wave
              cx={WIN2.x + WIN2.w / 2}
              cy={WIN2.y + WIN2.h / 2 + 20}
              width={WIN2.w - 80}
              amplitude={waveAmp1 * 0.7}
              frequency={6}
              phase={frame * 0.42 + 2.3}
              color={COLORS.ink}
              strokeWidth={2}
              opacity={0.5}
            />
          </g>
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 70,
          display: "flex",
          justifyContent: "center",
          padding: "0 60px",
        }}
      >
        <DrawnText start={70} size={68} weight={700} color={COLORS.ink}>
          Dos apps. Un solo volumen maestro.
        </DrawnText>
      </div>
    </AbsoluteFill>
  );
};
