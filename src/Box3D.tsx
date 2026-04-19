import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
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
  position: 'absolute', width: 7, height: 7, borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.85)',
  boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
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
  children?: React.ReactNode;
}
function Face({ fw, fh, transform, wallNum, transparent, contentTransform = 'scaleX(-1)', backfaceHidden, hidden, onClick, children }: FaceProps) {
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
        pointerEvents: (hidden || !clickable) ? 'none' : 'auto',
        transition: 'opacity 0.5s, border-color 0.2s, background 0.2s',
        border: hovered
          ? '1.5px solid rgba(255,255,255,0.7)'
          : transparent
            ? '1.5px solid rgba(255,255,255,0.4)'
            : '1.5px solid rgba(255,255,255,0.38)',
        background: transparent ? 'transparent' : hovered
          ? 'rgba(255,255,255,0.02)'
          : '#0e0e0e',
        backgroundImage: transparent ? 'none' : hovered ? 'none' : `
          linear-gradient(#0e0e0e, #0e0e0e),
          repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.025) 60px),
          repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,255,255,0.025) 60px)
        `,
        boxSizing: 'border-box',
        cursor: clickable ? 'pointer' : 'default',
        overflow: 'hidden',
      }}
    >
      <Corners />

      {/* Placeholder watermark number */}
      {wallNum !== undefined && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 'clamp(60px, 12vmin, 120px)',
          fontWeight: 700,
          fontFamily: 'system-ui, sans-serif',
          color: 'rgba(255, 255, 255, 0.06)',
          letterSpacing: '-0.05em',
          userSelect: 'none',
          pointerEvents: 'none',
          transform: contentTransform,
        }}>
          {wallNum}
        </div>
      )}

      {/* Wall content slot */}
      {children && (
        <div style={{
          position: 'absolute', inset: 0,
          transform: contentTransform,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          {children}
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
          contentTransform="none"
          backfaceHidden />

        {/* Back wall — wall 1 */}
        <Face fw={w} fh={h}
          transform={`rotateY(180deg) translateZ(${hd}px)`}
          hidden={expanded && focusWall !== 1} onClick={() => onNav('back')}>
          <div style={{
            position: 'absolute', inset: 0,
            background: '#0e0e0e',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 9%',
            userSelect: 'none',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(9px, 0.9vw, 12px)', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '1.8em' }}>
              Portfolio
            </div>
            <div style={{ color: '#ffffff', fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(36px, 7.5vw, 100px)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.03em' }}>
              Kartik<br />Krishnan
            </div>
            <div style={{ width: 48, height: 1, background: 'rgba(255,255,255,0.2)', margin: '2em 0' }} />
            <div style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(11px, 1.3vw, 17px)', fontWeight: 400, lineHeight: 1.7, letterSpacing: '0.02em' }}>
              Computer Science · TU München<br />Working Student at IABG
            </div>
          </div>
        </Face>

        {/* Left wall — wall 2 — Projects */}
        <Face fw={d} fh={h}
          transform={`rotateY(-90deg) translateZ(${hw}px)`}
          hidden={behind === 2 || (expanded && focusWall !== 2)} onClick={() => onNav('left')}>
          <div id="scroll-left" className="wall-scroll" style={{
            position: 'absolute', inset: 0,
            background: '#0e0e0e',
            overflowY: 'auto',
            padding: '10% 0 18%',
            userSelect: 'none',
          }}>
            {([
              { title: 'iPraktikum (with Quartett Mobile)', desc: 'Implementation of a full-stack Swift navigation app using Prompt Engineering on Apple Intelligence On-Device to create personalized stops based on contact data.', align: 'left' },
              { title: 'CPU Cache Simulation', desc: 'Simulation and analysis of the CPU cache in systemC to understand memory efficiency.', align: 'right' },
              { title: 'Chrome Password Extension', desc: 'Development and publication of a Chrome extension for analyzing password security, improving memorability and secure persistent storage.', align: 'left' },
              { title: 'Web-Development Projects', desc: 'Creation and deployment of responsive websites (HTML, CSS, JavaScript, TypeScript), including a fitness platform and an information portal for a school.', align: 'right' },
              { title: 'Image Detection ML Model', desc: 'Development of an AI model for classifying cats and dogs to learn fundamental concepts of image recognition and machine learning.', align: 'left' },
            ] as { title: string; desc: string; align: 'left' | 'right' }[]).map(({ title, desc, align }) => (
              <div key={title} style={{
                textAlign: align,
                padding: align === 'left' ? '0 20% 0 8%' : '0 8% 0 20%',
                marginBottom: '14%',
              }}>
                <div style={{ color: '#ffffff', fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(20px, 4vw, 52px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '0.5em' }}>{title}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(11px, 1.5vw, 18px)', fontWeight: 400, lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </Face>

        {/* Right wall — wall 3 — Robotik */}
        <Face fw={d} fh={h}
          transform={`rotateY(90deg) translateZ(${hw}px)`}
          hidden={behind === 3 || (expanded && focusWall !== 3)} onClick={() => onNav('right')}>
          <div id="scroll-right" className="wall-scroll" style={{
            position: 'absolute', inset: 0,
            background: '#0e0e0e',
            overflowY: 'auto',
            padding: '10% 0 18%',
            userSelect: 'none',
          }}>
            {([
              {
                title: 'RC 1:10 Crawler', align: 'left' as const,
                bullets: [
                  'Developed a Gazebo simulation of an Ackermann rover in an office environment with SLAM and Nav2 integration',
                  'Implemented low-level control for a 1:10 rover on Nvidia AGX Orin (X230D Carrier Board) with PCA9685 and ESC interfaces',
                  'Designed and 3D-printed a custom hardware mount for chassis integration',
                ],
              },
              {
                title: 'Drone Data Capture', align: 'right' as const,
                bullets: [
                  'Developed a Python-based control system using the DJI Tello SDK for autonomous flight and real-time low-latency video streaming',
                  'Integrated OpenCV for automated image capture and computer vision processing to support autonomous navigation via ArUco tags',
                ],
              },
              {
                title: 'Simulated Self-Parking Vehicle', align: 'left' as const,
                bullets: [
                  'Designed an autonomous parking system in ROS 2 focused on Ackermann path planning with Nav2',
                  'Developed a standalone lightweight navigation pipeline (Nav2 alternative) with A* path planning, obstacle avoidance and PID controller',
                ],
              },
              {
                title: 'Autonomous Model Car', align: 'right' as const,
                bullets: [
                  'Built an autonomous Jetracer model vehicle on ROS Noetic and Jetson Nano with end-to-end control via Reinforcement Learning (PyTorch, Torchvision)',
                  'Developed a full pipeline including data collection scripts, automated labeling, model training and real-time on-device inference',
                ],
              },
              {
                title: 'FLL Robotics Team', align: 'left' as const,
                bullets: [
                  'World Final — Detroit (2018/19)',
                  'European Final — Bregenz (2019/20)',
                ],
              },
            ]).map(({ title, align, bullets }) => (
              <div key={title} style={{
                textAlign: align,
                padding: align === 'left' ? '0 20% 0 8%' : '0 8% 0 20%',
                marginBottom: '14%',
              }}>
                <div style={{ color: '#ffffff', fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(20px, 4vw, 52px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '0.6em' }}>{title}</div>
                {bullets.map((b, i) => (
                  <div key={i} style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(11px, 1.5vw, 18px)', fontWeight: 400, lineHeight: 1.7, marginBottom: '0.4em' }}>· {b}</div>
                ))}
              </div>
            ))}
          </div>
        </Face>

        {/* Floor — wall 4 — Socials */}
        <Face fw={w} fh={d}
          transform={`rotateX(-90deg) translateZ(${hh}px)`}
          contentTransform="scaleY(-1)"
          hidden={behind === 4 || (expanded && focusWall !== 4)} onClick={() => onNav('floor')}>
          <div style={{
            position: 'absolute', inset: 0,
            background: '#0e0e0e',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '2.5rem',
            userSelect: 'none',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(9px, 0.9vw, 12px)', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              Connect
            </div>
            <div style={{ display: 'flex', gap: 'clamp(2rem, 6vw, 6rem)', alignItems: 'center' }}>
              {([
                {
                  label: 'GitHub',
                  href: 'https://github.com/KartikKrishnan05',
                  path: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
                },
                {
                  label: 'LinkedIn',
                  href: 'https://linkedin.com/in/kartikkrishnan05/',
                  path: 'M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zM5 8H0v16h5V8zm7.982 0H8.014v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0V24H24V13.869c0-7.88-8.922-7.593-11.018-3.714V8z',
                },
                {
                  label: 'Email',
                  href: 'mailto:kartik.krishnan@tum.de',
                  path: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
                },
              ] as { label: string; href: string; path: string }[]).map(({ label, href, path }) => (
                <div
                  key={label}
                  onClick={(e) => { e.stopPropagation(); window.open(href, '_blank'); }}
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
                >
                  <svg viewBox="0 0 24 24" width="clamp(36px, 5vw, 60px)" height="clamp(36px, 5vw, 60px)" fill="#ffffff" style={{ opacity: 0.85, transition: 'opacity 0.2s' }}>
                    <path d={path} />
                  </svg>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(9px, 0.9vw, 12px)', letterSpacing: '0.1em' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Face>

        {/* Ceiling — wall 5 */}
        <Face fw={w} fh={d}
          transform={`rotateX(90deg) translateZ(${hh}px)`}
          contentTransform="rotate(180deg) scaleX(-1)"
          hidden={behind === 5 || (expanded && focusWall !== 5)} onClick={() => onNav('ceiling')}>
          <div style={{ position: 'absolute', inset: 0, background: '#0e0e0e' }} />
        </Face>

      </div>
    </div>
  );
}
