import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, FONTS, FADE_FRAMES, SCENE_FRAMES } from '../constants';
import { StickFigure } from '../StickFigure';

const W = 1920, H = 1080;
const GROUND = H * 0.68;

const TaskBox: React.FC<{ x: number; y: number; opacity: number; label: string }> = ({ x, y, opacity, label }) => (
  <g opacity={opacity}>
    <rect x={x - 36} y={y - 22} width={72} height={44} rx={8}
          fill="none" stroke={COLORS.primary} strokeWidth={2.5} />
    <text x={x} y={y + 6} textAnchor="middle" fill={COLORS.primary}
          fontSize={18} fontFamily={FONTS.body} fontWeight={600}>{label}</text>
  </g>
);

export const SceneAutomation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mensch kommt von links rein
  const humanX = interpolate(frame, [0, 30], [-120, W * 0.28], { extrapolateRight: 'clamp' });
  const humanOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  // Tippt: Arm schwingt rauf/runter
  const typing = frame > 30 && frame < 130;
  const armAnim = Math.sin((frame - 30) * 0.35) * 25;
  const armRight = typing ? -10 + armAnim : -10;
  const armLeft  = typing ? -20 - armAnim * 0.6 : -20;

  // Roboter erscheinen gestaffelt
  const robotPositions = [W * 0.57, W * 0.68, W * 0.79];
  const robotStarts    = [60, 80, 100];

  // Task-Boxen fliegen von Mensch zu Robotern
  const taskData = [
    { label: 'Mail', startF: 120, endF: 160, toX: robotPositions[0] },
    { label: 'PDF',  startF: 130, endF: 165, toX: robotPositions[1] },
    { label: 'Data', startF: 140, endF: 170, toX: robotPositions[2] },
  ];

  // Mensch lehnt zurück ab Frame 150
  const relaxLean = interpolate(frame, [148, 168], [0, -12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const relaxArmR = interpolate(frame, [148, 168], [-10, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const relaxArmL = interpolate(frame, [148, 168], [-20, -60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Label
  const labelOpacity = interpolate(frame, [SCENE_FRAMES - 60, SCENE_FRAMES - 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Roboter-Blinken
  const robotGlow = (i: number) => {
    const phase = (frame - robotStarts[i]) * 0.12;
    return Math.abs(Math.sin(phase)) * 0.5 + 0.5;
  };

  return (
    <AbsoluteFill style={{ background: COLORS.dark }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>

        {/* Boden-Linie */}
        <line x1={100} y1={GROUND + 2} x2={W - 100} y2={GROUND + 2}
              stroke={COLORS.darkSoft} strokeWidth={3} />

        {/* Schreibtisch */}
        <rect x={W * 0.15} y={GROUND - 60} width={220} height={18} rx={6}
              fill={COLORS.darkSoft} stroke={COLORS.primary + '44'} strokeWidth={1.5} />
        <rect x={W * 0.17} y={GROUND - 42} width={12} height={42} rx={4} fill={COLORS.darkSoft} />
        <rect x={W * 0.34} y={GROUND - 42} width={12} height={42} rx={4} fill={COLORS.darkSoft} />

        {/* Monitor */}
        <rect x={W * 0.22} y={GROUND - 140} width={110} height={78} rx={8}
              fill={COLORS.darkSoft} stroke={COLORS.primary + '66'} strokeWidth={2} />
        {/* Monitor-Inhalt pulsiert beim Tippen */}
        {typing && [0,1,2].map(i => (
          <rect key={i}
                x={W * 0.225 + 8} y={GROUND - 132 + i * 20}
                width={interpolate(frame % 15, [0, 7, 15], [60, 90, 60])}
                height={10} rx={3}
                fill={COLORS.primary + '55'} />
        ))}
        <rect x={W * 0.245} y={GROUND - 62} width={60} height={6} rx={3}
              fill={COLORS.darkSoft} stroke={COLORS.primary + '33'} strokeWidth={1} />

        {/* Mensch */}
        <StickFigure
          x={humanX} y={GROUND}
          scale={1.6}
          color={COLORS.white}
          armLeftAngle={frame > 148 ? relaxArmL : armLeft}
          armRightAngle={frame > 148 ? relaxArmR : armRight}
          legLeftAngle={-15} legRightAngle={15}
          bodyLean={relaxLean}
          opacity={humanOpacity}
        />

        {/* Task-Boxen fliegen */}
        {taskData.map((t, i) => {
          const bx = interpolate(frame, [t.startF, t.endF], [humanX + 20, t.toX], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const by = interpolate(frame, [t.startF, t.endF], [GROUND - 200, GROUND - 180], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const bo = interpolate(frame, [t.startF - 5, t.startF + 5, t.endF - 5, t.endF + 5], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return <TaskBox key={i} x={bx} y={by} opacity={bo} label={t.label} />;
        })}

        {/* Roboter */}
        {robotPositions.map((rx, i) => {
          const rs = robotStarts[i];
          const ro = interpolate(frame, [rs, rs + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const ry2 = interpolate(frame, [rs, rs + 18], [GROUND + 60, GROUND], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const glowO = frame > rs + 40 ? robotGlow(i) * 0.4 : 0;
          return (
            <g key={i}>
              <circle cx={rx} cy={ry2 - 120} r={55} fill={COLORS.primary + '00'}
                      stroke={COLORS.primary} strokeWidth={1.5} opacity={glowO} />
              <StickFigure
                x={rx} y={ry2}
                scale={1.4}
                color={COLORS.primary}
                isRobot
                armLeftAngle={-40 + Math.sin((frame - rs) * 0.2 + i) * 20}
                armRightAngle={40 - Math.sin((frame - rs) * 0.2 + i) * 20}
                legLeftAngle={-18} legRightAngle={18}
                opacity={ro}
              />
            </g>
          );
        })}

        {/* Pfeile zwischen Mensch und erstem Roboter */}
        {frame > 115 && (
          <path
            d={`M ${humanX + 80} ${GROUND - 170} Q ${(humanX + robotPositions[0]) / 2} ${GROUND - 240} ${robotPositions[0] - 50} ${GROUND - 170}`}
            fill="none" stroke={COLORS.primary} strokeWidth={2}
            strokeDasharray="10 6"
            opacity={interpolate(frame, [115, 130], [0, 0.7], { extrapolateRight: 'clamp' })}
          />
        )}

        {/* Label */}
        <g opacity={labelOpacity}>
          <text x={W / 2} y={H - 130} textAnchor="middle"
                fill={COLORS.primary} fontSize={22} fontFamily={FONTS.body}
                fontWeight={600} letterSpacing={4}>
            01 / SERVICES
          </text>
          <text x={W / 2} y={H - 80} textAnchor="middle"
                fill={COLORS.white} fontSize={44} fontFamily={FONTS.heading} fontWeight={700}>
            KI-Agenten &amp; Automatisierungen
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
