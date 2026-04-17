import { useEffect, useState, CSSProperties } from 'react';
import type { HeadPosition } from './useHeadTracker';

// ── Viewport hook ─────────────────────────────────────────────────────────────
interface Dims { w: number; h: number }
function useViewport(): Dims {
  const [dims, setDims] = useState<Dims>(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const up = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', up);
    return () => window.removeEventListener('resize', up);
  }, []);
  return dims;
}

// ── Corner dots ───────────────────────────────────────────────────────────────
const dot: CSSProperties = {
  position: 'absolute', width: 8, height: 8, borderRadius: '50%',
  background: 'rgba(140, 230, 255, 0.95)',
  boxShadow: '0 0 12px rgba(100, 210, 255, 0.9)',
  zIndex: 1,
};
function Corners() {
  return <>
    <div style={{ ...dot, top: -4, left: -4 }} />
    <div style={{ ...dot, top: -4, right: -4 }} />
    <div style={{ ...dot, bottom: -4, left: -4 }} />
    <div style={{ ...dot, bottom: -4, right: -4 }} />
  </>;
}

// ── Single face ───────────────────────────────────────────────────────────────
interface FaceProps {
  fw: number; fh: number;
  transform: string;
  wallNum?: number;
  transparent?: boolean;
  contentTransform?: string;
  backfaceHidden?: boolean;
  hidden?: boolean;
  onClick?: () => void;
}
function Face({ fw, fh, transform, wallNum, transparent, contentTransform = 'scaleX(-1)', backfaceHidden, hidden, onClick }: FaceProps) {
  const [hovered, setHovered] = useState(false);
  const clickable = !!onClick && !hidden;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => clickable && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: '50%', left: '50%',
        marginTop: -fh / 2, marginLeft: -fw / 2,
        width: fw, height: fh,
        transform,
        backfaceVisibility: backfaceHidden ? 'hidden' : 'visible',
        WebkitBackfaceVisibility: backfaceHidden ? 'hidden' : 'visible',
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'auto',
        transition: 'opacity 0.5s, border-color 0.2s, background 0.2s',
        border: hovered
          ? '1.5px solid rgba(80,200,255,0.95)'
          : transparent
            ? '1.5px solid rgba(80,200,255,0.4)'
            : '1.5px solid rgba(80,200,255,0.65)',
        background: hovered
          ? 'rgba(80, 200, 255, 0.07)'
          : transparent
            ? 'transparent'
            : 'rgba(4, 15, 30, 0.5)',
        boxSizing: 'border-box',
        cursor: clickable ? 'pointer' : 'default',
        pointerEvents: (hidden || !clickable) ? 'none' : 'auto',
      }}
    >
      <Corners />
      {wallNum !== undefined && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 'clamp(80px, 18vmin, 180px)',
          fontWeight: 800,
          fontFamily: 'system-ui, sans-serif',
          color: hovered ? 'rgba(80, 200, 255, 0.35)' : 'rgba(80, 200, 255, 0.18)',
          textShadow: '0 0 60px rgba(80,200,255,0.25)',
          letterSpacing: '-0.05em',
          userSelect: 'none',
          pointerEvents: 'none',
          transform: contentTransform,
          transition: 'color 0.2s',
        }}>
          {wallNum}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const PARALLAX = 40;

export interface Box3DProps {
  position: HeadPosition;
  navX: number;
  navY: number;
  navState: string;
  expanded: boolean;
  onNav: (target: string) => void;
}

// Which wall is "behind the viewer" (needs hiding) for each nav state
const BEHIND: Record<string, number> = {
  left: 3, right: 2, floor: 5, ceiling: 4,
};

// Which wall is the current focus for each nav state
const FOCUS_WALL: Record<string, number> = {
  room: 1, back: 1, front: 6, left: 2, right: 3, floor: 4, ceiling: 5,
};

export function Box3D({ position, navX, navY, navState, expanded, onNav }: Box3DProps) {
  const behind = BEHIND[navState];
  const focusWall = FOCUS_WALL[navState] ?? 1;
  const { w, h } = useViewport();
  // depth = w so each face is approximately viewport-sized (w×h)
  const d  = w;
  const hw = w / 2, hh = h / 2, hd = d / 2; // hd === hw since d === w

  // translateZ that brings the focused wall to z=0 (fills viewport)
  const expandedZ = (navState === 'floor' || navState === 'ceiling') ? -hh
                  : navState === 'front' ? -hd
                  : hd;

  const originX = 50 + position.x * PARALLAX;
  const originY = 50 + position.y * PARALLAX;

  return (
    <div style={{
      width: '100vw', height: '100vh',
      // perspective = d: focal length equals box depth → feels like standing inside
      perspective: `${d}px`,
      perspectiveOrigin: `${originX}% ${originY}%`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: w, height: h,
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `translateZ(${expanded ? expandedZ : -hd * 0.25}px) rotateX(${navX}deg) rotateY(${navY}deg)`,
        transition: 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>

        {/* Outer front frame — transparent, purely for the corner dots in room view */}
        <Face fw={w} fh={h} transform={`translateZ(${hd}px)`} transparent />

        {/* Front wall — wall 6 (inner face, hidden in room view via backface-visibility) */}
        {/* rotateY(180°) flips so inner side faces room; translateZ(-hd) = world z +hd */}
        <Face fw={w} fh={h}
          transform={`rotateY(180deg) translateZ(${-hd}px)`}
          wallNum={6} contentTransform="none"
          backfaceHidden />

        {/* Back wall — wall 1 */}
        <Face fw={w} fh={h}
          transform={`rotateY(180deg) translateZ(${hd}px)`}
          wallNum={1} hidden={expanded && focusWall !== 1} onClick={() => onNav('back')} />

        {/* Left wall — wall 2 */}
        <Face fw={d} fh={h}
          transform={`rotateY(-90deg) translateZ(${hw}px)`}
          wallNum={2} hidden={behind === 2 || (expanded && focusWall !== 2)} onClick={() => onNav('left')} />

        {/* Right wall — wall 3 */}
        <Face fw={d} fh={h}
          transform={`rotateY(90deg) translateZ(${hw}px)`}
          wallNum={3} hidden={behind === 3 || (expanded && focusWall !== 3)} onClick={() => onNav('right')} />

        {/* Floor — wall 4 */}
        <Face fw={w} fh={d}
          transform={`rotateX(-90deg) translateZ(${hh}px)`}
          wallNum={4} contentTransform="scaleY(-1)"
          hidden={behind === 4 || (expanded && focusWall !== 4)} onClick={() => onNav('floor')} />

        {/* Ceiling — wall 5 */}
        <Face fw={w} fh={d}
          transform={`rotateX(90deg) translateZ(${hh}px)`}
          wallNum={5} contentTransform="rotate(180deg) scaleX(-1)"
          hidden={behind === 5 || (expanded && focusWall !== 5)} onClick={() => onNav('ceiling')} />

      </div>
    </div>
  );
}
