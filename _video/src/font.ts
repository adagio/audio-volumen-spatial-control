import { loadFont } from "@remotion/google-fonts/Caveat";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const CAVEAT = fontFamily;
