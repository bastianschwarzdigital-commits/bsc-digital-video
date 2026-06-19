import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS } from './constants';

export const SlideIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const textOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp' });
  const textY = interpolate(frame, [10, 30], [20, 0], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: '100%', height: '100%',
      background: COLORS.dark,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: FONTS.heading,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Blob-Hintergründe */}
      <div style={{
        position: 'absolute', width: 500, height: 500,
        borderRadius: '50%', top: -100, right: -100,
        background: `radial-gradient(circle, ${COLORS.primaryDark}33, transparent 70%)`,
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', bottom: -80, left: -80,
        background: `radial-gradient(circle, ${COLORS.primaryDark}22, transparent 70%)`,
      }} />

      {/* Logo */}
      <div style={{ transform: `scale(${logoScale})`, marginBottom: 32 }}>
        <div style={{
          width: 100, height: 100,
          background: COLORS.primary,
          borderRadius: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 52, fontWeight: 700, color: COLORS.white,
          fontFamily: FONTS.heading,
          boxShadow: `0 0 40px ${COLORS.primary}66`,
        }}>
          bsc
        </div>
      </div>

      {/* Text */}
      <div style={{ opacity: textOpacity, transform: `translateY(${textY}px)`, textAlign: 'center' }}>
        <p style={{
          color: COLORS.primary, fontFamily: FONTS.body,
          fontSize: 14, fontWeight: 500, letterSpacing: 3,
          textTransform: 'uppercase', marginBottom: 12,
        }}>
          BSC Digital
        </p>
        <h1 style={{
          color: COLORS.white, fontSize: 48, fontWeight: 700,
          lineHeight: 1.2, margin: 0,
        }}>
          KI, die wirklich<br />funktioniert.
        </h1>
      </div>
    </div>
  );
};
