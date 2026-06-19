import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { COLORS, FONTS, SCENE_FRAMES } from '../constants';
import { StickFigure } from '../StickFigure';

const W = 1920, H = 1080;
const GROUND = H * 0.68;

const SpeechBubble: React.FC<{ x: number; y: number; opacity: number; children: React.ReactNode; flip?: boolean }> = ({ x, y, opacity, children, flip }) => (
  <g opacity={opacity}>
    <rect x={x - 44} y={y - 38} width={88} height={64} rx={14}
          fill={COLORS.darkSoft} stroke={COLORS.primary} strokeWidth={2} />
    {/* Schweif */}
    <polygon
      points={flip
        ? `${x + 20},${y + 26} ${x + 10},${y + 44} ${x - 10},${y + 26}`
        : `${x - 20},${y + 26} ${x - 10},${y + 44} ${x + 10},${y + 26}`}
      fill={COLORS.darkSoft} stroke={COLORS.primary} strokeWidth={2}
    />
    <g transform={`translate(${x},${y - 4})`}>{children}</g>
  </g>
);

export const SceneConsulting: React.FC = () => {
  const frame = useCurrentFrame();

  // Figuren kommen aufeinander zu
  const figAX = interpolate(frame, [0, 30], [-100, W * 0.32], { extrapolateRight: 'clamp' });
  const figBX = interpolate(frame, [0, 30], [W + 100, W * 0.62], { extrapolateRight: 'clamp' });

  // Whiteboard erscheint
  const boardO  = interpolate(frame, [75, 95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const boardX  = W * 0.76;

  // Chart-Linie zeichnet sich
  const chartProgress = interpolate(frame, [100, 160], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Sprechblasen
  const bubble1O = interpolate(frame, [32, 48], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bubble2O = interpolate(frame, [55, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Figur B zeigt auf Board: Arm-Winkel ändert sich
  const armBRight = interpolate(frame, [80, 100], [30, 80], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Nicken (Auf-Ab)
  const nod = frame > 158 ? Math.sin((frame - 158) * 0.4) * 8 : 0;

  // Label
  const labelO = interpolate(frame, [SCENE_FRAMES - 60, SCENE_FRAMES - 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Einfacher Chart-Path
  const chartPoints = [
    [0, 80], [30, 60], [60, 70], [90, 40], [120, 20], [150, 30], [180, 5],
  ];
  const totalDist = 180;
  const visibleDist = chartProgress * totalDist;
  const visiblePoints = chartPoints.filter(([x]) => x <= visibleDist);
  const chartPath = visiblePoints.length > 1
    ? 'M ' + visiblePoints.map(([x, y]) => `${x},${y}`).join(' L ')
    : '';

  return (
    <AbsoluteFill style={{ background: COLORS.dark }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>

        {/* Boden */}
        <line x1={100} y1={GROUND + 2} x2={W - 100} y2={GROUND + 2}
              stroke={COLORS.darkSoft} strokeWidth={3} />

        {/* Whiteboard */}
        <g opacity={boardO}>
          <rect x={boardX - 120} y={GROUND - 300} width={240} height={200} rx={10}
                fill={COLORS.darkSoft} stroke={COLORS.primary + '88'} strokeWidth={2.5} />
          {/* Chart */}
          <g transform={`translate(${boardX - 100}, ${GROUND - 280})`}>
            {chartPath && (
              <path d={chartPath} fill="none" stroke={COLORS.primary} strokeWidth={3}
                    strokeLinecap="round" strokeLinejoin="round" />
            )}
            {/* Achsen */}
            <line x1={0} y1={0} x2={0} y2={90} stroke={COLORS.white + '55'} strokeWidth={1.5} />
            <line x1={0} y1={90} x2={190} y2={90} stroke={COLORS.white + '55'} strokeWidth={1.5} />
          </g>
          {/* Board-Rahmen oben */}
          <rect x={boardX - 120} y={GROUND - 300} width={240} height={16} rx={5}
                fill={COLORS.primary + '44'} />
          {/* Stiel */}
          <line x1={boardX} y1={GROUND - 100} x2={boardX} y2={GROUND}
                stroke={COLORS.darkSoft} strokeWidth={10} strokeLinecap="round" />
        </g>

        {/* Figur A – Berater/Kunde links */}
        <StickFigure
          x={figAX} y={GROUND + nod}
          scale={1.6} color={COLORS.white}
          armLeftAngle={-30} armRightAngle={40}
          legLeftAngle={-18} legRightAngle={18}
        />

        {/* Sprechblase Figur A: Fragezeichen */}
        <SpeechBubble x={figAX + 20} y={GROUND - 240} opacity={bubble1O}>
          <text textAnchor="middle" fill={COLORS.primary} fontSize={30} fontWeight={700}>?</text>
        </SpeechBubble>

        {/* Figur B – BSC-Berater rechts */}
        <StickFigure
          x={figBX} y={GROUND + nod * 0.7}
          scale={1.6} color={COLORS.primaryLight}
          armLeftAngle={-35}
          armRightAngle={armBRight}
          legLeftAngle={-18} legRightAngle={18}
        />

        {/* Sprechblase Figur B: Glühbirne-Checkmark */}
        <SpeechBubble x={figBX - 20} y={GROUND - 240} opacity={bubble2O} flip>
          <text textAnchor="middle" fill={COLORS.primary} fontSize={26} fontWeight={700}>✓</text>
        </SpeechBubble>

        {/* Verbindungslinie zwischen Figuren */}
        {frame > 155 && (
          <line x1={figAX + 70} y1={GROUND - 55} x2={figBX - 70} y2={GROUND - 55}
                stroke={COLORS.primary} strokeWidth={2.5} strokeDasharray="8 5"
                opacity={interpolate(frame, [155, 172], [0, 0.8], { extrapolateRight: 'clamp' })} />
        )}

        {/* Label */}
        <g opacity={labelO}>
          <text x={W / 2} y={H - 130} textAnchor="middle"
                fill={COLORS.primary} fontSize={22} fontFamily={FONTS.body}
                fontWeight={600} letterSpacing={4}>
            02 / SERVICES
          </text>
          <text x={W / 2} y={H - 80} textAnchor="middle"
                fill={COLORS.white} fontSize={44} fontFamily={FONTS.heading} fontWeight={700}>
            Beratung &amp; Support
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
