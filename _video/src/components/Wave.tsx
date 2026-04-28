import { useMemo } from "react";
import { COLORS } from "../constants";
import { sinusoidPath } from "../utils/paths";

type Props = {
  cx: number;
  cy: number;
  width: number;
  amplitude: number;
  frequency?: number;
  phase?: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
};

export const Wave: React.FC<Props> = ({
  cx,
  cy,
  width,
  amplitude,
  frequency = 2,
  phase = 0,
  color = COLORS.ink,
  strokeWidth = 3,
  opacity = 1,
}) => {
  const d = useMemo(
    () => sinusoidPath(cx, cy, width, amplitude, frequency, phase),
    [cx, cy, width, amplitude, frequency, phase],
  );
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
    />
  );
};
