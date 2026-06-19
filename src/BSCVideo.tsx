import React from 'react';
import { AbsoluteFill, Series, interpolate, useCurrentFrame, Audio, staticFile } from 'remotion';
import { COLORS, INTRO_FRAMES, SCENE_FRAMES, OUTRO_FRAMES, FADE_FRAMES } from './constants';
import { SlideIntro } from './SlideIntro';
import { SlideOutro } from './SlideOutro';
import { SceneAutomation }   from './scenes/SceneAutomation';
import { SceneConsulting }   from './scenes/SceneConsulting';
import { SceneIntroduction } from './scenes/SceneIntroduction';
import { SceneWorkshop }     from './scenes/SceneWorkshop';

const FadeSlide: React.FC<{ children: React.ReactNode; duration: number }> = ({ children, duration }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, FADE_FRAMES, duration - FADE_FRAMES, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const BSCVideo: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.dark }}>
    <Audio src={staticFile('background.wav')} volume={0.55} />
    <Series>
      <Series.Sequence durationInFrames={INTRO_FRAMES}>
        <FadeSlide duration={INTRO_FRAMES}><SlideIntro /></FadeSlide>
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_FRAMES}>
        <FadeSlide duration={SCENE_FRAMES}><SceneAutomation /></FadeSlide>
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_FRAMES}>
        <FadeSlide duration={SCENE_FRAMES}><SceneConsulting /></FadeSlide>
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_FRAMES}>
        <FadeSlide duration={SCENE_FRAMES}><SceneIntroduction /></FadeSlide>
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_FRAMES}>
        <FadeSlide duration={SCENE_FRAMES}><SceneWorkshop /></FadeSlide>
      </Series.Sequence>

      <Series.Sequence durationInFrames={OUTRO_FRAMES}>
        <FadeSlide duration={OUTRO_FRAMES}><SlideOutro /></FadeSlide>
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
