import React from 'react';

interface StickFigureProps {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  armLeftAngle?: number;   // Grad von vertikal (0=hängend, -90=waagrecht links)
  armRightAngle?: number;  // Grad von vertikal (0=hängend, +90=waagrecht rechts)
  legLeftAngle?: number;
  legRightAngle?: number;
  bodyLean?: number;
  isRobot?: boolean;
  opacity?: number;
}

function polar(angleDeg: number, len: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [Math.sin(rad) * len, Math.cos(rad) * len];
}

export const StickFigure: React.FC<StickFigureProps> = ({
  x, y,
  scale = 1,
  color = '#ffffff',
  armLeftAngle  = -30,
  armRightAngle = 30,
  legLeftAngle  = -20,
  legRightAngle = 20,
  bodyLean = 0,
  isRobot = false,
  opacity = 1,
}) => {
  const s = scale;
  const sw = 3 * s;            // strokeWidth
  const headR = 12 * s;
  const bodyLen = 40 * s;
  const armLen = 28 * s;
  const legLen = 32 * s;
  const neckLen = 4 * s;

  // Körper-Ankerpunkte (relativ zu x,y = Fußpunkt)
  const hipY   = -legLen;
  const bodyTopY = hipY - bodyLen;
  const headY  = bodyTopY - neckLen - headR;
  const shoulderY = bodyTopY + 8 * s;

  // Arme vom Schulter-Punkt
  const [alx, aly] = polar(armLeftAngle,  armLen);
  const [arx, ary] = polar(armRightAngle, armLen);

  // Beine vom Hüftpunkt
  const [llx, lly] = polar(legLeftAngle,  legLen);
  const [lrx, lry] = polar(legRightAngle, legLen);

  const leanRad = (bodyLean * Math.PI) / 180;

  return (
    <g transform={`translate(${x},${y}) rotate(${bodyLean})`} opacity={opacity}>
      {/* Kopf */}
      <circle
        cx={0} cy={headY}
        r={headR}
        stroke={color} strokeWidth={sw} fill="none"
      />
      {/* Roboter-Antenne */}
      {isRobot && (
        <>
          <line x1={0} y1={headY - headR} x2={0} y2={headY - headR - 14 * s}
                stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <circle cx={0} cy={headY - headR - 16 * s} r={4 * s}
                  fill={color} />
        </>
      )}
      {/* Körper */}
      <line x1={0} y1={headY + headR} x2={0} y2={hipY}
            stroke={color} strokeWidth={sw} strokeLinecap="round" />
      {/* Arme */}
      <line
        x1={0} y1={shoulderY}
        x2={-alx} y2={shoulderY + aly}
        stroke={color} strokeWidth={sw} strokeLinecap="round"
      />
      <line
        x1={0} y1={shoulderY}
        x2={arx} y2={shoulderY + ary}
        stroke={color} strokeWidth={sw} strokeLinecap="round"
      />
      {/* Beine */}
      <line x1={0} y1={hipY} x2={-llx} y2={hipY + lly}
            stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={0} y1={hipY} x2={lrx}  y2={hipY + lry}
            stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </g>
  );
};
