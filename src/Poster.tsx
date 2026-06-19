import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS, FONTS } from './constants';
import { StickFigure } from './StickFigure';

const W = 1920, H = 1080;
const GROUND = H * 0.72;

export const Poster: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.dark, overflow: 'hidden' }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>

      {/* Hintergrund-Glows */}
      <defs>
        <radialGradient id="g1" cx="50%" cy="45%" r="55%">
          <stop offset="0%"   stopColor={COLORS.primaryDark} stopOpacity="0.30" />
          <stop offset="100%" stopColor={COLORS.dark}        stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g2" cx="20%" cy="80%" r="40%">
          <stop offset="0%"   stopColor={COLORS.primary} stopOpacity="0.12" />
          <stop offset="100%" stopColor={COLORS.dark}    stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g3" cx="82%" cy="75%" r="35%">
          <stop offset="0%"   stopColor={COLORS.primary} stopOpacity="0.10" />
          <stop offset="100%" stopColor={COLORS.dark}    stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#g1)" />
      <rect width={W} height={H} fill="url(#g2)" />
      <rect width={W} height={H} fill="url(#g3)" />

      {/* Boden-Linie */}
      <line x1={80} y1={GROUND} x2={W - 80} y2={GROUND}
            stroke={COLORS.darkSoft} strokeWidth={3} />

      {/* ── SZENE LINKS: Mensch → Roboter (Automation) ── */}
      {/* Schreibtisch */}
      <rect x={155} y={GROUND - 58} width={195} height={16} rx={6}
            fill={COLORS.darkSoft} stroke={COLORS.primary + '44'} strokeWidth={1.5} />
      <rect x={172} y={GROUND - 42} width={10} height={42} rx={4} fill={COLORS.darkSoft} />
      <rect x={328} y={GROUND - 42} width={10} height={42} rx={4} fill={COLORS.darkSoft} />
      {/* Monitor */}
      <rect x={215} y={GROUND - 148} width={100} height={72} rx={8}
            fill={COLORS.darkSoft} stroke={COLORS.primary + '66'} strokeWidth={2} />
      {[0,1,2].map(i => (
        <rect key={i} x={224} y={GROUND - 138 + i * 18} width={70} height={9} rx={3}
              fill={COLORS.primary + '44'} />
      ))}
      {/* Mensch tippt */}
      <StickFigure x={255} y={GROUND} scale={1.5} color={COLORS.white}
                   armLeftAngle={-25} armRightAngle={-15}
                   legLeftAngle={-14} legRightAngle={14} />
      {/* Roboter */}
      <StickFigure x={430} y={GROUND} scale={1.3} color={COLORS.primary}
                   isRobot armLeftAngle={-45} armRightAngle={45}
                   legLeftAngle={-18} legRightAngle={18} />
      {/* Pfeil Mensch→Roboter */}
      <path d="M 320 590 Q 375 545 415 590"
            fill="none" stroke={COLORS.primary} strokeWidth={2.5}
            strokeDasharray="8 5" markerEnd="url(#arrow)" opacity={0.7} />
      {/* Task-Box fliegt */}
      <rect x={336} y={548} width={58} height={36} rx={7}
            fill="none" stroke={COLORS.primary} strokeWidth={2} opacity={0.9} />
      <text x={365} y={572} textAnchor="middle" fill={COLORS.primary}
            fontSize={14} fontFamily={FONTS.body} fontWeight={600}>Task</text>

      {/* ── SZENE MITTE: Team + KI-Hub (Einführung) ── */}
      {/* Zahnrad */}
      {(() => {
        const cx = W / 2, cy = GROUND - 200, r = 52;
        const teeth = 8, innerR = r * 0.65, toothH = r * 0.32;
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
          <>
            <polygon points={pts.join(' ')} fill="none"
                     stroke={COLORS.primary} strokeWidth={2.5} strokeLinejoin="round" />
            <circle cx={cx} cy={cy} r={innerR * 0.4} fill="none"
                    stroke={COLORS.primary} strokeWidth={2.5} />
            <text x={cx} y={cy + 8} textAnchor="middle"
                  fill={COLORS.primary} fontSize={20} fontWeight={700} fontFamily={FONTS.heading}>KI</text>
          </>
        );
      })()}
      {/* 3 Team-Figuren um das Zahnrad */}
      {[
        { x: W/2 - 200, angle: -50 },
        { x: W/2,       angle: 0   },
        { x: W/2 + 200, angle: 50  },
      ].map((f, i) => (
        <g key={i}>
          <line x1={f.x} y1={GROUND - 120} x2={W/2} y2={GROUND - 200}
                stroke={COLORS.primary} strokeWidth={1.8} strokeDasharray="8 5" opacity={0.6} />
          <StickFigure x={f.x} y={GROUND} scale={1.3} color={COLORS.white}
                       armLeftAngle={f.angle - 10} armRightAngle={f.angle + 10}
                       legLeftAngle={-16} legRightAngle={16} />
        </g>
      ))}

      {/* ── SZENE RECHTS: Workshop (Lehrer + Schüler) ── */}
      {/* Whiteboard */}
      <rect x={W - 500} y={GROUND - 310} width={300} height={220} rx={10}
            fill={COLORS.darkSoft} stroke={COLORS.primary + '77'} strokeWidth={2.5} />
      <rect x={W - 500} y={GROUND - 310} width={300} height={20} rx={6}
            fill={COLORS.primary + '55'} />
      {/* Board-Inhalte */}
      {['🤖','💡','✅'].map((icon, i) => (
        <text key={i} x={W - 455 + i * 90} y={GROUND - 230}
              textAnchor="middle" fontSize={36}>{icon}</text>
      ))}
      <line x1={W - 496} y1={GROUND - 148} x2={W - 204} y2={GROUND - 148}
            stroke={COLORS.white + '20'} strokeWidth={1.5} />
      {/* Board-Stiel */}
      <line x1={W - 350} y1={GROUND - 90} x2={W - 350} y2={GROUND}
            stroke={COLORS.darkSoft} strokeWidth={8} strokeLinecap="round" />
      {/* Lehrer */}
      <StickFigure x={W - 530} y={GROUND} scale={1.4} color={COLORS.primaryLight}
                   armLeftAngle={-30} armRightAngle={-110}
                   legLeftAngle={-16} legRightAngle={16} />
      {/* 2 Schüler */}
      {[W - 160, W - 90].map((sx, i) => (
        <g key={i}>
          <rect x={sx - 28} y={GROUND - 55} width={56} height={8} rx={3}
                fill={COLORS.darkSoft} stroke={COLORS.white + '25'} strokeWidth={1} />
          <StickFigure x={sx} y={GROUND} scale={1.15} color={COLORS.white}
                       armLeftAngle={i === 0 ? -100 : -25}
                       armRightAngle={25}
                       legLeftAngle={-10} legRightAngle={10} />
        </g>
      ))}

      {/* Arrow-Marker */}
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={COLORS.primary} />
        </marker>
      </defs>

      {/* ── OVERLAY: Titel & Play-Button ── */}
      {/* Dunkler Gradient unten für Text-Lesbarkeit */}
      <defs>
        <linearGradient id="textbg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={COLORS.dark} stopOpacity="0" />
          <stop offset="100%" stopColor={COLORS.dark} stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <rect x={0} y={H * 0.55} width={W} height={H * 0.45} fill="url(#textbg)" />

      {/* Titel-Text */}
      <text x={W / 2} y={H - 130} textAnchor="middle"
            fill={COLORS.primary} fontSize={24} fontFamily={FONTS.body}
            fontWeight={600} letterSpacing={4}>
        BSC DIGITAL · KI-BERATUNG &amp; AUTOMATISIERUNG
      </text>
      <text x={W / 2} y={H - 68} textAnchor="middle"
            fill={COLORS.white} fontSize={52} fontFamily={FONTS.heading} fontWeight={700}>
        KI, die wirklich funktioniert – in 37 Sekunden erklärt
      </text>

      {/* Play-Button in der Mitte */}
      <circle cx={W / 2} cy={H / 2 - 30} r={52}
              fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.5)" strokeWidth={2.5} />
      <circle cx={W / 2} cy={H / 2 - 30} r={40}
              fill="rgba(255,255,255,0.90)" />
      <polygon points={`${W/2 - 13},${H/2 - 48} ${W/2 + 22},${H/2 - 30} ${W/2 - 13},${H/2 - 12}`}
               fill={COLORS.dark} />

    </svg>
  </AbsoluteFill>
);
