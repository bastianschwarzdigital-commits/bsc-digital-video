import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS } from './constants';

export const SlideOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const btnScale = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 12, stiffness: 100 } });
  const textOpacity = interpolate(frame, [5, 22], [0, 1], { extrapolateRight: 'clamp' });
  const textY = interpolate(frame, [5, 22], [20, 0], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: '100%', height: '100%',
      background: COLORS.dark,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: FONTS.heading,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Glows */}
      <div style={{
        position: 'absolute', width: 600, height: 600,
        borderRadius: '50%', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${COLORS.primaryDark}2a, transparent 70%)`,
      }} />

      <div style={{
        opacity: textOpacity, transform: `translateY(${textY}px)`,
        textAlign: 'center', maxWidth: 680, padding: '0 40px',
      }}>
        <p style={{
          color: COLORS.primary, fontSize: 13, fontWeight: 600,
          letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20,
        }}>
          bsc-digital.de
        </p>
        <h2 style={{
          color: COLORS.white, fontSize: 44, fontWeight: 700,
          lineHeight: 1.2, margin: '0 0 40px',
        }}>
          Jetzt kostenloses<br />Erstgespräch vereinbaren.
        </h2>

        {/* CTA-Button */}
        <div style={{ transform: `scale(${btnScale})` }}>
          <div style={{
            display: 'inline-block',
            background: COLORS.primary,
            color: COLORS.white,
            fontFamily: FONTS.heading,
            fontSize: 18, fontWeight: 700,
            padding: '16px 40px',
            borderRadius: 9999,
            boxShadow: `0 0 40px ${COLORS.primary}55`,
          }}>
            Gespräch vereinbaren
          </div>
        </div>
      </div>
    </div>
  );
};
