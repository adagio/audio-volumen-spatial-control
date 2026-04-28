import { Series } from "remotion";
import { Paper } from "./components/Paper";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Idea } from "./scenes/Scene3Idea";
import { Scene4Demo } from "./scenes/Scene4Demo";
import { Scene5UnderHood } from "./scenes/Scene5UnderHood";
import { Scene6Outro } from "./scenes/Scene6Outro";
import { SCENE_DURATIONS } from "./constants";

export const MyComposition: React.FC = () => {
  return (
    <Paper>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.s1} premountFor={30}>
          <Scene1Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.s2} premountFor={30}>
          <Scene2Problem />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.s3} premountFor={30}>
          <Scene3Idea />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.s4} premountFor={30}>
          <Scene4Demo />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.s5} premountFor={30}>
          <Scene5UnderHood />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.s6} premountFor={30}>
          <Scene6Outro />
        </Series.Sequence>
      </Series>
    </Paper>
  );
};
