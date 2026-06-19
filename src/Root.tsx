import React from 'react';
import { Composition } from 'remotion';
import { BSCVideo } from './BSCVideo';
import { Poster } from './Poster';
import { FPS, INTRO_FRAMES, SCENE_FRAMES, OUTRO_FRAMES } from './constants';

const TOTAL_FRAMES = INTRO_FRAMES + 4 * SCENE_FRAMES + OUTRO_FRAMES;
// 120 + 4×210 + 150 = 1110 Frames = 37 Sekunden

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="BSCVideo"
      component={BSCVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Poster"
      component={Poster}
      durationInFrames={1}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);
