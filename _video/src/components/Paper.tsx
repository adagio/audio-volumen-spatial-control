import { AbsoluteFill } from "remotion";
import { COLORS } from "../constants";

export const Paper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, opacity: 0.06, mixBlendMode: "multiply" }}
      >
        <defs>
          <filter id="paperGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" />
            <feColorMatrix
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#paperGrain)" />
      </svg>
      {children}
    </AbsoluteFill>
  );
};
