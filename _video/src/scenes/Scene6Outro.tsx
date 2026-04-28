import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, HEIGHT, WIDTH } from "../constants";
import { fadeIn, progressIn } from "../utils/animations";
import { CAVEAT } from "../font";
import { sketchyLine } from "../utils/paths";
import { useMemo } from "react";

export const Scene6Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneIn = fadeIn(frame, 0, 10);

  const wordmarkOp = fadeIn(frame, 0, 14);
  const underlineProgress = progressIn(frame, 12, 22);
  const subtitleOp = fadeIn(frame, 28, 14);

  const underlinePath = useMemo(
    () => sketchyLine(WIDTH / 2 - 320, HEIGHT / 2 + 50, WIDTH / 2 + 320, HEIGHT / 2 + 50, 73, 3),
    [],
  );

  return (
    <AbsoluteFill
      style={{
        opacity: sceneIn,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
      }}
    >
      <div
        style={{
          fontFamily: CAVEAT,
          fontWeight: 700,
          fontSize: 130,
          color: COLORS.ink,
          opacity: wordmarkOp,
          lineHeight: 1,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        Spatial Audio Volume
      </div>

      <svg
        width={WIDTH}
        height={120}
        style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: HEIGHT, pointerEvents: "none" }}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      >
        <path
          d={underlinePath}
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth={6}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - underlineProgress}
        />
      </svg>

      <div
        style={{
          fontFamily: CAVEAT,
          fontWeight: 700,
          fontSize: 60,
          color: COLORS.ink,
          opacity: subtitleOp,
          textAlign: "center",
          marginTop: 60,
          background: COLORS.cyan,
          padding: "10px 36px",
          borderRadius: 18,
          border: `3px solid ${COLORS.ink}`,
          boxShadow: `5px 6px 0 ${COLORS.ink}`,
        }}
      >
        ↓ ¡Descarga la app!
      </div>
    </AbsoluteFill>
  );
};
