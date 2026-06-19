import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS } from './constants';

const ICONS: Record<string, React.ReactNode> = {
  bot: (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="10" x="3" y="11" rx="2"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4M8 16v1M16 16v1"/>
    </svg>
  ),
  lightbulb: (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.8 10.1 19 8.6 19 7a7 7 0 1 0-14 0c0 1.6 1.2 3.1 2.5 4.5.8.8 1.3 1.5 1.5 2.5"/>
      <path d="M9 18h6M10 22h4"/>
    </svg>
  ),
  rocket: (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z"/>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z"/>
    </svg>
  ),
  graduation: (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
};

interface Props {
  number: string;
  title: string;
  desc: string;
  icon: string;
}

export const SlideService: React.FC<Props> = ({ number, title, desc, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const contentOpacity = interpolate(frame, [8, 25], [0, 1], { extrapolateRight: 'clamp' });
  const contentY = interpolate(frame, [8, 25], [24, 0], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: '100%', height: '100%',
      background: COLORS.dark,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: FONTS.body,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtiler Hintergrund-Glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${COLORS.darkSoft}, ${COLORS.dark})`,
      }} />

      {/* Icon */}
      <div style={{ transform: `scale(${iconScale})`, marginBottom: 28, position: 'relative' }}>
        <div style={{
          width: 96, height: 96, borderRadius: 24,
          background: `${COLORS.primary}1a`,
          border: `1.5px solid ${COLORS.primary}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: COLORS.primary,
        }}>
          {ICONS[icon]}
        </div>
      </div>

      {/* Text */}
      <div style={{
        opacity: contentOpacity, transform: `translateY(${contentY}px)`,
        textAlign: 'center', maxWidth: 680, padding: '0 40px', position: 'relative',
      }}>
        <p style={{
          color: COLORS.primary, fontSize: 13, fontWeight: 600,
          letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16,
        }}>
          {number} / Services
        </p>
        <h2 style={{
          color: COLORS.white, fontFamily: FONTS.heading,
          fontSize: 44, fontWeight: 700, lineHeight: 1.2,
          margin: '0 0 20px', whiteSpace: 'pre-line',
        }}>
          {title}
        </h2>
        <p style={{
          color: `${COLORS.white}bb`, fontSize: 20, lineHeight: 1.6, margin: 0,
        }}>
          {desc}
        </p>
      </div>
    </div>
  );
};
