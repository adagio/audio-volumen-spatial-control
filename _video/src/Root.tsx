import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { Thumbnail } from "./scenes/Thumbnail";
import { EndScreen } from "./scenes/EndScreen";
import { SquareCover } from "./scenes/SquareCover";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SpatialAudioVolume"
        component={MyComposition}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Thumbnail"
        component={Thumbnail}
        durationInFrames={1}
        fps={1}
        width={1920}
        height={1080}
      />
      <Composition
        id="EndScreen"
        component={EndScreen}
        durationInFrames={1}
        fps={1}
        width={1920}
        height={1080}
      />
      <Composition
        id="SquareCover"
        component={SquareCover}
        durationInFrames={1}
        fps={1}
        width={1080}
        height={1080}
      />
    </>
  );
};
