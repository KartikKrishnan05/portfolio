/* ─────────────────────────────────────────────
   Overlay.tsx  –  portfolio content layer
   Replace the placeholder text / URLs with your own.
   ───────────────────────────────────────────── */

// ── Social icons (inline SVG) ────────────────
function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.57.1.78-.25.78-.55v-1.93C5.73 21 5.04 18.97 5.04 18.97c-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.27-5.23-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.97 10.97 0 0 1 2.87-.39c.97.01 1.95.13 2.87.39 2.18-1.48 3.14-1.17 3.14-1.17.63 1.58.24 2.75.12 3.04.74.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.06.78 2.13v3.16c0 .31.2.66.79.55C20.22 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM3.56 20.45h3.56V9H3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.265.069 1.645.069 4.849s-.011 3.584-.069 4.849c-.062 1.366-.334 2.634-1.308 3.608-.975.974-2.242 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.011-4.849-.069c-1.366-.062-2.634-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.849c.062-1.366.334-2.634 1.308-3.608.974-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

// ── Data — replace with your own ────────────────────────────────
const MY_NAME = 'Your Name';
const MY_TAGLINE = 'Developer · Roboticist · Builder';

const apps = [
  {
    name: 'App One',
    description: 'A short sentence about what this app does and who it is for.',
    link: '#',
  },
  {
    name: 'App Two',
    description: 'Another app you built — its purpose and key feature.',
    link: '#',
  },
  {
    name: 'App Three',
    description: 'Third project, what problem it solves.',
    link: '#',
  },
];

const robotics = [
  {
    name: 'Robot Project One',
    description: 'A brief description of the robot, its mechanism or goal.',
    link: '#',
  },
  {
    name: 'Robot Project Two',
    description: 'What this robot does and what tech stack or hardware it uses.',
    link: '#',
  },
  {
    name: 'Robot Project Three',
    description: 'Competition entry, research project, or personal build.',
    link: '#',
  },
];

const socials = [
  { label: 'GitHub',    url: 'https://github.com/username',          Icon: GithubIcon },
  { label: 'LinkedIn',  url: 'https://linkedin.com/in/username',      Icon: LinkedInIcon },
  { label: 'X / Twitter', url: 'https://x.com/username',             Icon: TwitterIcon },
  { label: 'Instagram', url: 'https://instagram.com/username',        Icon: InstagramIcon },
];

// ── Shared panel style ───────────────────────────────────────────
const panel: React.CSSProperties = {
  background: 'rgba(4, 12, 24, 0.65)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border: '1px solid rgba(80, 200, 255, 0.18)',
  borderRadius: 12,
  padding: '20px 22px',
  color: 'rgba(220, 240, 255, 0.9)',
  fontFamily: 'system-ui, sans-serif',
  maxWidth: 240,
};

const sectionTitle: React.CSSProperties = {
  fontSize: '0.65rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'rgba(80, 200, 255, 0.7)',
  marginBottom: 14,
  fontWeight: 600,
};

function ProjectCard({ name, description, link }: { name: string; description: string; link?: string }) {
  return (
    <a
      href={link ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        marginBottom: 14,
        textDecoration: 'none',
        color: 'inherit',
        borderLeft: '2px solid rgba(80, 200, 255, 0.3)',
        paddingLeft: 10,
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderLeftColor = 'rgba(80,200,255,0.9)')}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderLeftColor = 'rgba(80,200,255,0.3)')}
    >
      <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 3 }}>{name}</div>
      <div style={{ fontSize: '0.74rem', color: 'rgba(160, 210, 255, 0.65)', lineHeight: 1.45 }}>
        {description}
      </div>
    </a>
  );
}

// ── Main export ──────────────────────────────────────────────────
export function Overlay() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        pointerEvents: 'none', // pass clicks through to nothing; re-enable on children
        display: 'grid',
        gridTemplate: `
          "left  center  right"  1fr
          "bot   bot     bot"    auto
        `,
        gridTemplateColumns: '1fr auto 1fr',
        padding: '52px 40px 40px',
        gap: 24,
        alignItems: 'start',
      }}
    >
      {/* ── Left: Apps ───────────────────────────────── */}
      <div style={{ gridArea: 'left', display: 'flex', justifyContent: 'flex-start', pointerEvents: 'auto' }}>
        <div style={panel}>
          <div style={sectionTitle}>Apps</div>
          {apps.map(a => (
            <ProjectCard key={a.name} {...a} />
          ))}
        </div>
      </div>

      {/* ── Centre: Welcome ──────────────────────────── */}
      <div
        style={{
          gridArea: 'center',
          textAlign: 'center',
          color: 'rgba(220, 240, 255, 0.9)',
          fontFamily: 'system-ui, sans-serif',
          userSelect: 'none',
          paddingTop: 12,
        }}
      >
        <div
          style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: 6,
            textShadow: '0 0 40px rgba(80,200,255,0.4)',
          }}
        >
          {MY_NAME}
        </div>
        <div
          style={{
            fontSize: 'clamp(0.75rem, 1.5vw, 0.95rem)',
            color: 'rgba(120, 200, 255, 0.65)',
            letterSpacing: '0.06em',
          }}
        >
          {MY_TAGLINE}
        </div>
      </div>

      {/* ── Right: Robotics ──────────────────────────── */}
      <div style={{ gridArea: 'right', display: 'flex', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
        <div style={panel}>
          <div style={sectionTitle}>Robotics</div>
          {robotics.map(r => (
            <ProjectCard key={r.name} {...r} />
          ))}
        </div>
      </div>

      {/* ── Bottom: Socials ──────────────────────────── */}
      <div
        style={{
          gridArea: 'bot',
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          pointerEvents: 'auto',
        }}
      >
        {socials.map(({ label, url, Icon }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(4, 12, 24, 0.65)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(80, 200, 255, 0.18)',
              color: 'rgba(120, 200, 255, 0.75)',
              transition: 'color 0.2s, border-color 0.2s, box-shadow 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = 'rgba(140, 230, 255, 1)';
              el.style.borderColor = 'rgba(80, 200, 255, 0.7)';
              el.style.boxShadow = '0 0 16px rgba(80, 200, 255, 0.3)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = 'rgba(120, 200, 255, 0.75)';
              el.style.borderColor = 'rgba(80, 200, 255, 0.18)';
              el.style.boxShadow = 'none';
            }}
          >
            <Icon />
          </a>
        ))}
      </div>
    </div>
  );
}
