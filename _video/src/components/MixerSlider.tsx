import { COLORS, STROKE_WIDTH } from "../constants";
import { CAVEAT } from "../font";

type Props = {
  cx: number;
  topY: number;
  height: number;
  value: number; // 0..1, 1 = top (loud), 0 = bottom (silent)
  label: string;
  drawProgress?: number;
  highlight?: boolean;
};

export const MixerSlider: React.FC<Props> = ({
  cx,
  topY,
  height,
  value,
  label,
  drawProgress = 1,
  highlight = false,
}) => {
  const railX = cx;
  const thumbY = topY + height * (1 - value);
  const accent = highlight ? COLORS.cyan : COLORS.muted;

  return (
    <g>
      {/* rail */}
      <line
        x1={railX}
        y1={topY}
        x2={railX}
        y2={topY + height}
        stroke={COLORS.muted}
        strokeWidth={3}
        strokeLinecap="round"
        strokeOpacity={drawProgress}
      />
      {/* filled portion */}
      <line
        x1={railX}
        y1={thumbY}
        x2={railX}
        y2={topY + height}
        stroke={highlight ? COLORS.cyan : COLORS.ink}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={drawProgress}
      />
      {/* thumb */}
      <circle
        cx={railX}
        cy={thumbY}
        r={14}
        fill={COLORS.paper}
        stroke={COLORS.ink}
        strokeWidth={STROKE_WIDTH}
        opacity={drawProgress}
      />
      {/* label */}
      <text
        x={railX}
        y={topY + height + 38}
        textAnchor="middle"
        fontFamily={CAVEAT}
        fontWeight={700}
        fontSize={28}
        fill={accent}
        opacity={drawProgress}
      >
        {label}
      </text>
    </g>
  );
};
