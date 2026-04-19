import { useState, useEffect, useRef } from 'react';
import { useHeadTracker } from './useHeadTracker';
import { Box3D } from './Box3D';
import './App.css';

type NavState = 'room' | 'left' | 'right' | 'back' | 'front' | 'floor' | 'ceiling';

const NAV_ROTATION: Record<NavState, { x: number; y: number }> = {
  room:    { x:   0, y:    0 },
  left:    { x:   0, y:  -90 },  // inside of left wall
  right:   { x:   0, y:   90 },  // inside of right wall
  back:    { x:   0, y:    0 },  // inside of back wall already faces camera
  front:   { x:   0, y:  180 },  // inside of front wall (inner normal -z) → +z
  floor:   { x: -90, y:    0 },  // inside of floor      (inner normal -y) → +z
  ceiling: { x:  90, y:    0 },  // inside of ceiling    (inner normal +y) → +z
};

const NEIGHBOUR: Record<'scrollRight' | 'scrollLeft' | 'scrollDown' | 'scrollUp', NavState> = {
  scrollRight: 'right',   // swipe right → see right wall inside
  scrollLeft:  'left',    // swipe left  → see left wall inside
  scrollDown:  'floor',   // swipe down  → see floor inside
  scrollUp:    'ceiling', // swipe up    → see ceiling inside
};

// ── Icons ─────────────────────────────────────────────────────────────────────
function CameraOnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M23 7L16 12l7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  );
}
function CameraOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M23 7L16 12l7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const { position, status } = useHeadTracker(trackingEnabled);

  const [navState, setNavState] = useState<NavState>('room');
  const [expanded, setExpanded] = useState(false);
  const lockedRef = useRef(false);
  const expandedRef = useRef(false);
  const navStateRef = useRef<NavState>('room');
  useEffect(() => { expandedRef.current = expanded; }, [expanded]);
  useEffect(() => { navStateRef.current = navState; }, [navState]);

  // ── Scroll → navigate between walls ──────────────────────────────────────
  useEffect(() => {
    const THRESHOLD = 20; // px minimum scroll to register

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (expandedRef.current) {
        const el = document.getElementById(`scroll-${navStateRef.current}`);
        if (el) el.scrollTop += e.deltaY;
        return;
      }
      if (lockedRef.current) return;

      const { deltaX, deltaY } = e;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      if (absX < THRESHOLD && absY < THRESHOLD) return;

      lockedRef.current = true;
      setTimeout(() => { lockedRef.current = false; }, 850); // match transition

      setNavState(prev => {
        // Any scroll while on a wall → return to room
        if (prev !== 'room') return 'room';

        // From room, pick direction
        if (absX > absY) {
          return deltaX > 0 ? NEIGHBOUR.scrollRight : NEIGHBOUR.scrollLeft;
        } else {
          return deltaY > 0 ? NEIGHBOUR.scrollDown : NEIGHBOUR.scrollUp;
        }
      });
    };

    const handleKey = (e: KeyboardEvent) => {
      const dir: Record<string, keyof typeof NEIGHBOUR | 'room'> = {
        ArrowRight: 'scrollRight', ArrowLeft: 'scrollLeft',
        ArrowDown:  'scrollDown',  ArrowUp:   'scrollUp',
        Escape: 'room',
      };
      if (!(e.key in dir)) return;
      e.preventDefault();
      if (expandedRef.current) {
        if (e.key === 'Escape') setExpanded(false);
        else {
          const el = document.getElementById(`scroll-${navStateRef.current}`);
          if (el) el.scrollTop += e.key === 'ArrowDown' ? 120 : e.key === 'ArrowUp' ? -120 : 0;
        }
        return;
      }
      if (lockedRef.current) return;
      lockedRef.current = true;
      setTimeout(() => { lockedRef.current = false; }, 850);
      setNavState(prev => {
        if (e.key === 'Escape' || prev !== 'room') return 'room';
        return NEIGHBOUR[dir[e.key] as keyof typeof NEIGHBOUR];
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const { x: navX, y: navY } = NAV_ROTATION[navState];
  const isOn = trackingEnabled && status === 'tracking';

  return (
    <div className="app">
      <Box3D position={position}
        navX={navX} navY={navY}
        navState={navState}
        expanded={expanded}
        onNav={target => !expanded && setNavState(prev => prev === target ? 'room' : target as NavState)} />

      {/* Expand toggle */}
      <button
        className={`expand-toggle${expanded ? ' is-expanded' : ''}`}
        onClick={() => setExpanded(v => !v)}
        title={expanded ? 'Back to room' : 'Expand wall 1'}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          {expanded
            ? <><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/></>
            : <><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></>
          }
        </svg>
        <span>{expanded ? 'Room view' : 'Focus wall'}</span>
      </button>

      {/* Navigation hint */}
      <div className="nav-hint">Scroll ← → ↑ ↓ to explore</div>

      {/* Camera toggle */}
      <button
        className={`cam-toggle ${isOn ? 'cam-on' : 'cam-off'}`}
        onClick={() => setTrackingEnabled(v => !v)}
        title={trackingEnabled ? 'Disable head tracking' : 'Enable head tracking'}
      >
        {trackingEnabled ? <CameraOnIcon /> : <CameraOffIcon />}
        <span>{trackingEnabled ? 'Tracking on' : 'Tracking off'}</span>
      </button>

      {/* Status — only during loading or error */}
      {(status === 'loading-model' || status === 'requesting-camera' || status === 'error') && (
        <div className="status">
          {status === 'loading-model'     && <span>⏳ Loading model…</span>}
          {status === 'requesting-camera' && <span>📷 Requesting camera…</span>}
          {status === 'error'             && (
            <span className="error-msg">
              ✕ Camera unavailable<br />
              <small>Safari: Settings → Websites → Camera → Allow</small>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
