import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, FONTS, SCENE_FRAMES } from '../constants';
import { StickFigure } from '../StickFigure';

const W = 1920, H = 1080;
const GROUND = H * 0.68;
const BOARD_X = W * 0.28;
const BOARD_TOP = GROUND - 340;
const BOARD_W = 360;
const BOARD_H = 260;

const studentPositions = [W * 0.56, W * 0.67, W * 0.78];
const studentStarts    = [30, 42, 54];

const Checkmark: React.FC<{ x: number; y: number; opacity: number }> = ({ x, y, opacity }) => (
  <g opacity={opacity}>
    <circle cx={x} cy={y} r={22} fill={COLORS.primary + '33'} stroke={COLORS.primary} strokeWidth={2.5} />
    <path d={`M ${x - 10} ${y} L ${x - 2} ${y + 9} L ${x + 12} ${y - 10}`}
          fill="none" stroke={COLORS.primary} strokeWidth={3.5}
          strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

export const SceneWorkshop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Board erscheint
  const boardO = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const boardScale = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });

  // Lehrer kommt von links
  const teacherX = interpolate(frame, [0, 25], [-80, BOARD_X + BOARD_W * 0.5 + 90], { extrapolateRight: 'clamp' });

  // Board-Inhalt erscheint schrittweise
  const item1O = interpolate(frame, [60, 78], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const item2O = interpolate(frame, [78, 96], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const item3O = interpolate(frame, [96, 114], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Lehrer zeigt auf Board: Arm-Winkel
  const teacherArm = interpolate(frame, [58, 75], [30, 110], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Schüler erscheinen von unten gestaffelt
  const studentO = studentStarts.map(s =>
    interpolate(frame, [s, s + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
  const studentY = studentStarts.map(s =>
    interpolate(frame, [s, s + 18], [GROUND + 60, GROUND], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );

  // Schüler heben Hand
  const handStarts = [100, 118, 136];
  const handAngle = handStarts.map(s =>
    interpolate(frame, [s, s + 18], [-25, -110], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );

  // Checkmarks
  const checkStarts = [150, 160, 170];
  const checkO = checkStarts.map(s =>
    interpolate(frame, [s, s + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );

  // Label
  const labelO = interpolate(frame, [SCENE_FRAMES - 60, SCENE_FRAMES - 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: COLORS.dark }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>

        {/* Boden */}
        <line x1={100} y1={GROUND + 2} x2={W - 100} y2={GROUND + 2}
              stroke={COLORS.darkSoft} strokeWidth={3} />

        {/* Whiteboard */}
        <g opacity={boardO} transform={`scale(${boardScale}) translate(${BOARD_X * (1 - 1 / boardScale)}, ${BOARD_TOP * (1 - 1 / boardScale)})`}>
          <rect x={BOARD_X} y={BOARD_TOP} width={BOARD_W} height={BOARD_H} rx={12}
                fill={COLORS.darkSoft} stroke={COLORS.primary + '77'} strokeWidth={2.5} />
          {/* Board-Header */}
          <rect x={BOARD_X} y={BOARD_TOP} width={BOARD_W} height={22} rx={6}
                fill={COLORS.primary + '55'} />
          {/* Board-Stiel */}
          <line x1={BOARD_X + BOARD_W / 2} y1={BOARD_TOP + BOARD_H}
                x2={BOARD_X + BOARD_W / 2} y2={GROUND}
                stroke={COLORS.darkSoft} strokeWidth={10} strokeLinecap="round" />
        </g>

        {/* Board-Inhalte */}
        {/* Item 1: Roboter-Icon */}
        <g opacity={item1O}>
          <rect x={BOARD_X + 30} y={BOARD_TOP + 40} width={90} height={65} rx={8}
                fill="none" stroke={COLORS.primary} strokeWidth={2} />
          <text x={BOARD_X + 75} y={BOARD_TOP + 83} textAnchor="middle"
                fill={COLORS.primary} fontSize={28}>🤖</text>
        </g>
        {/* Item 2: Glühbirne */}
        <g opacity={item2O}>
          <rect x={BOARD_X + 140} y={BOARD_TOP + 40} width={90} height={65} rx={8}
                fill="none" stroke={COLORS.primary} strokeWidth={2} />
          <text x={BOARD_X + 185} y={BOARD_TOP + 83} textAnchor="middle"
                fill={COLORS.primary} fontSize={28}>💡</text>
        </g>
        {/* Item 3: Checkmark */}
        <g opacity={item3O}>
          <rect x={BOARD_X + 250} y={BOARD_TOP + 40} width={90} height={65} rx={8}
                fill="none" stroke={COLORS.primary} strokeWidth={2} />
          <text x={BOARD_X + 295} y={BOARD_TOP + 83} textAnchor="middle"
                fill={COLORS.primary} fontSize={28}>✅</text>
        </g>
        {/* Verbindungslinie / Pfeil auf Board */}
        <line x1={BOARD_X + 75} y1={BOARD_TOP + 105} x2={BOARD_X + 295} y2={BOARD_TOP + 105}
              stroke={COLORS.primary + '55'} strokeWidth={1.5} strokeDasharray="6 4"
              opacity={item3O} />

        {/* Notiz-Linien auf Board */}
        {[140, 155, 170, 185].map((ly, i) => (
          <line key={i}
                x1={BOARD_X + 24} y1={BOARD_TOP + ly}
                x2={BOARD_X + BOARD_W - 24} y2={BOARD_TOP + ly}
                stroke={COLORS.white + '18'} strokeWidth={1.5} />
        ))}

        {/* Lehrer */}
        <StickFigure
          x={teacherX} y={GROUND}
          scale={1.6} color={COLORS.primaryLight}
          armLeftAngle={-35}
          armRightAngle={-teacherArm}
          legLeftAngle={-18} legRightAngle={18}
        />

        {/* Zeiger-Stab des Lehrers */}
        {frame > 58 && (
          <line
            x1={teacherX - 30} y1={GROUND - 100}
            x2={BOARD_X + BOARD_W - 30} y2={BOARD_TOP + BOARD_H * 0.45}
            stroke={COLORS.white + '88'} strokeWidth={2}
            opacity={interpolate(frame, [58, 75], [0, 0.7], { extrapolateRight: 'clamp' })}
          />
        )}

        {/* Schüler */}
        {studentPositions.map((sx, i) => (
          <g key={i}>
            {/* Stuhl */}
            <rect x={sx - 32} y={GROUND - 60} width={64} height={10} rx={4}
                  fill={COLORS.darkSoft} stroke={COLORS.white + '33'} strokeWidth={1.5}
                  opacity={studentO[i]} />
            <StickFigure
              x={sx} y={studentY[i]}
              scale={1.3} color={COLORS.white}
              armLeftAngle={handAngle[i]}
              armRightAngle={25}
              legLeftAngle={-10} legRightAngle={10}
              opacity={studentO[i]}
            />
            <Checkmark x={sx} y={GROUND - 230} opacity={checkO[i]} />
          </g>
        ))}

        {/* Label */}
        <g opacity={labelO}>
          <text x={W / 2} y={H - 130} textAnchor="middle"
                fill={COLORS.primary} fontSize={22} fontFamily={FONTS.body}
                fontWeight={600} letterSpacing={4}>
            04 / SERVICES
          </text>
          <text x={W / 2} y={H - 80} textAnchor="middle"
                fill={COLORS.white} fontSize={44} fontFamily={FONTS.heading} fontWeight={700}>
            Schulungen &amp; Workshops
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
