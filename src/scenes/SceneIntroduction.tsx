import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, FONTS, SCENE_FRAMES } from '../constants';
import { StickFigure } from '../StickFigure';

const W = 1920, H = 1080;
const GROUND = H * 0.68;
const CENTER_X = W / 2;
const CENTER_Y = H * 0.38;

const teamPositions = [W * 0.22, W * 0.38, W * 0.62, W * 0.78];
const staggerStarts = [0, 10, 20, 30];

// Zahnrad-SVG
const Gear: React.FC<{ cx: number; cy: number; r: number; rot: number; opacity: number }> = ({ cx, cy, r, rot, opacity }) => {
  const teeth = 8;
  const innerR = r * 0.65;
  const toothH = r * 0.32;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * Math.PI * 2 - Math.PI / (teeth * 1.4);
    const a2 = (i / teeth) * Math.PI * 2 + Math.PI / (teeth * 1.4);
    pts.push(`${cx + innerR * Math.cos(a1)},${cy + innerR * Math.sin(a1)}`);
    pts.push(`${cx + (innerR + toothH) * Math.cos(a1)},${cy + (innerR + toothH) * Math.sin(a1)}`);
    pts.push(`${cx + (innerR + toothH) * Math.cos(a2)},${cy + (innerR + toothH) * Math.sin(a2)}`);
    pts.push(`${cx + innerR * Math.cos(a2)},${cy + innerR * Math.sin(a2)}`);
  }
  return (
    <g opacity={opacity} transform={`rotate(${rot}, ${cx}, ${cy})`}>
      <polygon points={pts.join(' ')} fill="none" stroke={COLORS.primary} strokeWidth={2.5}
               strokeLinejoin="round" />
      <circle cx={cx} cy={cy} r={innerR * 0.4} fill="none" stroke={COLORS.primary} strokeWidth={2.5} />
    </g>
  );
};

export const SceneIntroduction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Figuren erscheinen gestaffelt
  const figOpacities = staggerStarts.map(s =>
    interpolate(frame, [s, s + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
  const figY = staggerStarts.map(s =>
    interpolate(frame, [s, s + 18], [GROUND + 60, GROUND], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );

  // Zahnrad
  const gearO   = interpolate(frame, [45, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const gearScale = spring({ frame: Math.max(0, frame - 45), fps, config: { damping: 12, stiffness: 90 } });
  const gearRot = frame * 0.8;

  // Verbindungslinien (dashoffset Trick)
  const lineProgress = interpolate(frame, [65, 135], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Glow auf Figuren
  const glowStarts = [130, 145, 155, 165];
  const glowO = glowStarts.map(s =>
    interpolate(frame, [s, s + 18], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );

  // Rakete
  const rocketO = interpolate(frame, [155, 170], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rocketY = interpolate(frame, [155, 210], [CENTER_Y - 80, CENTER_Y - 240], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Label
  const labelO = interpolate(frame, [SCENE_FRAMES - 60, SCENE_FRAMES - 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const lineLen = 200;

  return (
    <AbsoluteFill style={{ background: COLORS.dark }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>

        {/* Boden */}
        <line x1={100} y1={GROUND + 2} x2={W - 100} y2={GROUND + 2}
              stroke={COLORS.darkSoft} strokeWidth={3} />

        {/* Verbindungslinien Figuren → Mitte */}
        {teamPositions.map((tx, i) => {
          const dx = CENTER_X - tx;
          const dy = CENTER_Y - (GROUND - 110);
          const dist = Math.sqrt(dx * dx + dy * dy);
          const visLen = lineProgress * dist;
          const frac  = Math.min(visLen / dist, 1);
          return (
            <line key={i}
                  x1={tx} y1={GROUND - 110}
                  x2={tx + dx * frac} y2={(GROUND - 110) + dy * frac}
                  stroke={COLORS.primary} strokeWidth={2}
                  strokeDasharray="10 6"
                  opacity={figOpacities[i] * 0.8}
            />
          );
        })}

        {/* Glow hinter Figuren */}
        {teamPositions.map((tx, i) => (
          <circle key={i} cx={tx} cy={GROUND - 100} r={70}
                  fill={COLORS.primary} opacity={glowO[i]} />
        ))}

        {/* Strichmännchen */}
        {teamPositions.map((tx, i) => (
          <StickFigure key={i}
            x={tx} y={figY[i]}
            scale={1.5} color={COLORS.white}
            armLeftAngle={-25 + Math.sin(frame * 0.06 + i) * 10}
            armRightAngle={25 - Math.sin(frame * 0.06 + i) * 10}
            legLeftAngle={-18} legRightAngle={18}
            opacity={figOpacities[i]}
          />
        ))}

        {/* Zahnrad in der Mitte */}
        <g transform={`scale(${gearScale}) translate(${CENTER_X * (1 - 1/gearScale)}, ${CENTER_Y * (1 - 1/gearScale)})`}>
          <Gear cx={CENTER_X} cy={CENTER_Y} r={55} rot={gearRot} opacity={gearO} />
        </g>

        {/* KI-Label im Zahnrad */}
        <text x={CENTER_X} y={CENTER_Y + 10} textAnchor="middle"
              fill={COLORS.primary} fontSize={22} fontWeight={700} fontFamily={FONTS.heading}
              opacity={gearO}>
          KI
        </text>

        {/* Rakete */}
        <g opacity={rocketO} transform={`translate(${CENTER_X}, ${rocketY})`}>
          <line x1={0} y1={0} x2={0} y2={50} stroke={COLORS.primary} strokeWidth={3} />
          <polygon points="-14,50 14,50 0,0" fill="none" stroke={COLORS.primary} strokeWidth={2.5}
                   strokeLinejoin="round" />
          <polygon points="-14,50 -24,72 0,62" fill={COLORS.primary + '66'} />
          <polygon points="14,50 24,72 0,62" fill={COLORS.primary + '66'} />
          {/* Flamme */}
          <ellipse cx={0} cy={68} rx={8} ry={12}
                   fill={COLORS.primaryLight} opacity={0.7 + Math.sin(frame * 0.5) * 0.3} />
        </g>

        {/* Label */}
        <g opacity={labelO}>
          <text x={W / 2} y={H - 130} textAnchor="middle"
                fill={COLORS.primary} fontSize={22} fontFamily={FONTS.body}
                fontWeight={600} letterSpacing={4}>
            03 / SERVICES
          </text>
          <text x={W / 2} y={H - 80} textAnchor="middle"
                fill={COLORS.white} fontSize={44} fontFamily={FONTS.heading} fontWeight={700}>
            KI-Einführung im Unternehmen
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
