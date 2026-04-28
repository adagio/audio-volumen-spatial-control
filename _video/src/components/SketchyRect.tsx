import { useMemo } from "react";
import { COLORS, STROKE_WIDTH } from "../constants";
import { sketchyRectPath } from "../utils/paths";

type Props = {
  x: number;
  y: number;
  w: number;
  h: number;
  radius?: number;
  seed?: number;
  jitter?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  drawProgress?: number; // 0..1
};

export const SketchyRect: React.FC<Props> = ({
  x,
  y,
  w,
  h,
  radius = 18,
  seed = 1,
  jitter = 1.6,
  stroke = COLORS.ink,
  strokeWidth = STROKE_WIDTH,
  fill = "none",
  drawProgress = 1,
}) => {
  const d = useMemo(
    () => sketchyRectPath(x, y, w, h, radius, seed, jitter),
    [x, y, w, h, radius, seed, jitter],
  );

  return (
    <path
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - drawProgress}
    />
  );
};
