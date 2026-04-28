import { COLORS, STROKE_WIDTH } from "../constants";

type Props = {
  cx: number;
  cy: number;
  r?: number;
  scale?: number;
};

export const Head: React.FC<Props> = ({ cx, cy, r = 46, scale = 1 }) => {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <circle
        cx={0}
        cy={0}
        r={r}
        fill={COLORS.cyan}
        opacity={0.45}
        stroke={COLORS.ink}
        strokeWidth={STROKE_WIDTH}
      />
      {/* eyes */}
      <circle cx={-r * 0.32} cy={-r * 0.1} r={r * 0.09} fill={COLORS.ink} />
      <circle cx={r * 0.32} cy={-r * 0.1} r={r * 0.09} fill={COLORS.ink} />
      {/* mouth */}
      <path
        d={`M ${-r * 0.3} ${r * 0.25} Q 0 ${r * 0.5} ${r * 0.3} ${r * 0.25}`}
        fill="none"
        stroke={COLORS.ink}
        strokeWidth={STROKE_WIDTH * 0.7}
        strokeLinecap="round"
      />
      {/* tiny indicator dot above */}
      <circle cx={0} cy={-r - 18} r={4} fill={COLORS.ink} opacity={0.5} />
    </g>
  );
};
