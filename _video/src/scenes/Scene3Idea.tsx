import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, HEIGHT, WIDTH } from "../constants";
import { fadeIn, fadeOut, progressIn } from "../utils/animations";
import { Field, Bubble } from "../components/Field";
import { Head } from "../components/Head";
import { DrawnText } from "../components/DrawnText";

const FIELD = { cx: WIDTH / 2, cy: HEIGHT / 2 + 40, w: 880, h: 240 };

export const Scene3Idea: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = fadeIn(frame, 0, 14);
  const sceneOut = fadeOut(frame, 165, 15);

  const fieldProgress = progressIn(frame, 12, 35);

  // bubbles pop-in
  const bubbleLeft = spring({
    frame: frame - 38,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 140 },
  });
  const bubbleRight = spring({
    frame: frame - 46,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 140 },
  });
  const headPop = spring({
    frame: frame - 65,
    fps,
    config: { damping: 11, mass: 0.6, stiffness: 150 },
  });

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <Field
          cx={FIELD.cx}
          cy={FIELD.cy}
          width={FIELD.w}
          height={FIELD.h}
          drawProgress={fieldProgress}
          axisProgress={progressIn(frame, 50, 25)}
        />
        <Bubble
          cx={FIELD.cx - FIELD.w / 2 + 100}
          cy={FIELD.cy}
          r={62}
          label="Spotify"
          glyph="spotify"
          scale={bubbleLeft}
        />
        <Bubble
          cx={FIELD.cx + FIELD.w / 2 - 100}
          cy={FIELD.cy}
          r={62}
          label="Discord"
          glyph="discord"
          scale={bubbleRight}
        />
        <Head cx={FIELD.cx} cy={FIELD.cy} r={44} scale={headPop} />
      </svg>

      {/* Big text up top */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <DrawnText start={85} exit={155} exitDuration={20} size={120} weight={700} color={COLORS.ink}>
          ¿Y si fuera espacial?
        </DrawnText>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 140,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <DrawnText start={120} exit={170} exitDuration={10} size={44} weight={400} color={COLORS.muted}>
          Una sola posición. Dos volúmenes.
        </DrawnText>
      </div>
    </AbsoluteFill>
  );
};
