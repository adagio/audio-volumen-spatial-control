import { useCurrentFrame, useVideoConfig } from "remotion";
import { CAVEAT } from "../font";
import { COLORS } from "../constants";
import { appear, fadeOut } from "../utils/animations";

type Props = {
  children: React.ReactNode;
  start: number;
  exit?: number; // frame at which to fade out (optional)
  exitDuration?: number;
  size?: number;
  weight?: 400 | 700;
  color?: string;
  align?: "left" | "center" | "right";
  style?: React.CSSProperties;
};

export const DrawnText: React.FC<Props> = ({
  children,
  start,
  exit,
  exitDuration = 12,
  size = 56,
  weight = 700,
  color = COLORS.ink,
  align = "center",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = appear(frame, start, fps);
  const exitOp = exit !== undefined ? fadeOut(frame, exit, exitDuration) : 1;

  return (
    <div
      style={{
        fontFamily: CAVEAT,
        fontWeight: weight,
        fontSize: size,
        color,
        textAlign: align,
        lineHeight: 1.05,
        opacity: a.opacity * exitOp,
        transform: a.transform,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
