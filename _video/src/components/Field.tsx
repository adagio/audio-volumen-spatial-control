import { COLORS, STROKE_WIDTH } from "../constants";
import { SketchyRect } from "./SketchyRect";
import { CAVEAT } from "../font";

type BubbleProps = {
  cx: number;
  cy: number;
  r: number;
  label: string;
  scale?: number;
  color?: string;
  glyph?: "spotify" | "discord";
};

export const Bubble: React.FC<BubbleProps> = ({
  cx,
  cy,
  r,
  label,
  scale = 1,
  color = COLORS.ink,
  glyph,
}) => {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <circle
        cx={0}
        cy={0}
        r={r}
        fill={COLORS.paper}
        stroke={color}
        strokeWidth={STROKE_WIDTH}
      />
      {glyph === "spotify" && (
        <g stroke={color} strokeWidth={3.5} fill="none" strokeLinecap="round">
          <path d={`M ${-r * 0.45} ${-r * 0.05} Q 0 ${-r * 0.35} ${r * 0.45} ${-r * 0.05}`} />
          <path d={`M ${-r * 0.4} ${r * 0.15} Q 0 ${-r * 0.1} ${r * 0.4} ${r * 0.15}`} />
          <path d={`M ${-r * 0.32} ${r * 0.32} Q 0 ${r * 0.12} ${r * 0.32} ${r * 0.32}`} />
        </g>
      )}
      {glyph === "discord" && (
        <g stroke={color} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d={`M ${-r * 0.5} ${-r * 0.2}
                Q ${-r * 0.5} ${-r * 0.5} ${-r * 0.15} ${-r * 0.5}
                L ${r * 0.15} ${-r * 0.5}
                Q ${r * 0.5} ${-r * 0.5} ${r * 0.5} ${-r * 0.2}
                L ${r * 0.5} ${r * 0.1}
                Q ${r * 0.5} ${r * 0.35} ${r * 0.15} ${r * 0.35}
                L ${-r * 0.05} ${r * 0.35}
                L ${-r * 0.3} ${r * 0.55}
                L ${-r * 0.25} ${r * 0.35}
                Q ${-r * 0.5} ${r * 0.35} ${-r * 0.5} ${r * 0.1} Z`}
          />
          <circle cx={-r * 0.18} cy={-r * 0.1} r={3.5} fill={color} />
          <circle cx={r * 0.18} cy={-r * 0.1} r={3.5} fill={color} />
        </g>
      )}
      <text
        x={0}
        y={r + 38}
        textAnchor="middle"
        fontFamily={CAVEAT}
        fontWeight={700}
        fontSize={36}
        fill={color}
      >
        {label}
      </text>
    </g>
  );
};

type FieldProps = {
  cx: number;
  cy: number;
  width: number;
  height: number;
  drawProgress?: number;
  seed?: number;
  axisProgress?: number; // 0..1 to draw the centerline / ticks
  showTicks?: boolean;
};

export const Field: React.FC<FieldProps> = ({
  cx,
  cy,
  width,
  height,
  drawProgress = 1,
  seed = 11,
  axisProgress = 0,
  showTicks = false,
}) => {
  const x = cx - width / 2;
  const y = cy - height / 2;

  return (
    <g>
      <SketchyRect
        x={x}
        y={y}
        w={width}
        h={height}
        radius={28}
        seed={seed}
        jitter={2}
        drawProgress={drawProgress}
      />
      {/* axis line */}
      <line
        x1={x + 30}
        y1={cy}
        x2={x + 30 + (width - 60) * axisProgress}
        y2={cy}
        stroke={COLORS.muted}
        strokeWidth={2}
        strokeDasharray="6 8"
        strokeLinecap="round"
      />
      {showTicks && (
        <g>
          {[
            { lx: x + width * 0.12, label: "−1" },
            { lx: cx, label: "0" },
            { lx: x + width * 0.88, label: "+1" },
          ].map((t) => (
            <g key={t.label} opacity={axisProgress}>
              <line
                x1={t.lx}
                y1={cy + height / 2 - 8}
                x2={t.lx}
                y2={cy + height / 2 + 18}
                stroke={COLORS.ink}
                strokeWidth={3}
                strokeLinecap="round"
              />
              <text
                x={t.lx}
                y={cy + height / 2 + 56}
                textAnchor="middle"
                fontFamily={CAVEAT}
                fontWeight={700}
                fontSize={36}
                fill={COLORS.ink}
              >
                {t.label}
              </text>
            </g>
          ))}
        </g>
      )}
    </g>
  );
};
