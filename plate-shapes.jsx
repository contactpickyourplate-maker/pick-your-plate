// Plate shape variants. Visual only — items drop anywhere on the plate
// regardless of type, per the drag mechanics in child-app.jsx.
// Types: basic, divided, rainbow, one-new-thing, snack.

const PLATE_TYPES = [
  { id: 'basic',         label: 'Basic',         caption: 'Round plate'           },
  { id: 'divided',       label: 'Divided',       caption: 'Three sections'        },
  { id: 'rainbow',       label: 'Rainbow',       caption: 'Color by color'        },
  { id: 'one-new-thing', label: '1 New Thing',   caption: 'Spotlight one food'    },
  { id: 'snack',         label: 'Snack',         caption: 'Smaller tray'          },
];

// Renders the decoration under the plate (sections, arcs, spotlight, etc).
// Placed as absolute-inset so items stay on top. All types use the same
// ceramic cream base so they read as a set.
function PlateShape({ type = 'basic', plateColor = '#f4ede0', rimColor = '#e2d6bc' }) {
  if (type === 'divided') {
    // Three wedges, muted lines.
    return (
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 18, pointerEvents: 'none' }}>
        <defs>
          <clipPath id="pp-clip-div"><circle cx="50" cy="50" r="50" /></clipPath>
        </defs>
        <g clipPath="url(#pp-clip-div)" stroke={rimColor} strokeWidth="0.7" strokeLinecap="round">
          <line x1="50" y1="50" x2="50" y2="0" />
          <line x1="50" y1="50" x2="6.7"  y2="75" />
          <line x1="50" y1="50" x2="93.3" y2="75" />
        </g>
      </svg>
    );
  }
  if (type === 'rainbow') {
    // Pie-wedge rainbow: six muted color zones. Kids place food of each color
    // onto the matching wedge. Colors are kept low-chroma so the plate still
    // reads as ceramic, not a toy.
    const wedges = [
      'oklch(0.85 0.08 25)',   // red
      'oklch(0.87 0.09 55)',   // orange
      'oklch(0.90 0.09 95)',   // yellow
      'oklch(0.85 0.07 145)',  // green
      'oklch(0.84 0.06 230)',  // blue
      'oklch(0.82 0.06 310)',  // purple
    ];
    const cx = 50, cy = 50, r = 50;
    // Build 6 wedge paths, each 60°, starting at -90°.
    const toXY = (deg) => [cx + r * Math.cos((deg - 90) * Math.PI / 180), cy + r * Math.sin((deg - 90) * Math.PI / 180)];
    return (
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 18, pointerEvents: 'none' }}>
        <defs>
          <clipPath id="pp-clip-rain"><circle cx="50" cy="50" r="50" /></clipPath>
        </defs>
        <g clipPath="url(#pp-clip-rain)">
          {wedges.map((color, i) => {
            const a0 = i * 60;
            const a1 = (i + 1) * 60;
            const [x0, y0] = toXY(a0);
            const [x1, y1] = toXY(a1);
            return (
              <path key={i} fill={color} opacity={0.55}
                d={`M${cx},${cy} L${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1} Z`} />
            );
          })}
          {/* hairline radial dividers */}
          {[0, 60, 120, 180, 240, 300].map((a, i) => {
            const [x, y] = toXY(a);
            return <line key={i} x1="50" y1="50" x2={x} y2={y} stroke={rimColor} strokeWidth="0.35" opacity=".6" />;
          })}
        </g>
      </svg>
    );
  }
  if (type === 'one-new-thing') {
    // Small spotlight circle in the upper-right quadrant.
    return (
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 18, pointerEvents: 'none' }}>
        <circle cx="70" cy="32" r="15" fill="none" stroke={rimColor} strokeWidth="0.7" strokeDasharray="1.5 1.8" />
        <text x="70" y="18" textAnchor="middle" fontSize="3.2"
          fontFamily="Fraunces, serif" fill="#8a7c66" letterSpacing="0.2"
          style={{ textTransform: 'uppercase' }}>try this</text>
      </svg>
    );
  }
  // basic + snack have no extra decoration
  return null;
}

// Returns display dimensions for a given plate type.
function plateSizeFor(type, base = 420) {
  if (type === 'snack') return base * 0.72;
  return base;
}

// Plate picker — a small pill button that opens a dropdown card with the
// five plate types as visual chips. Not a native <select> on purpose:
// kid-friendly, tappable, shows the plate shape so choice is pre-linguistic.
function PlatePicker({ value, onChange, displayFont = 'Fraunces, serif', accent = '#2a241c' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', h);
    return () => document.removeEventListener('pointerdown', h);
  }, [open]);

  const current = PLATE_TYPES.find(p => p.id === value) || PLATE_TYPES[0];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          border: '1.5px solid #e4dcc8',
          background: '#fbf6ea',
          padding: '8px 14px 8px 10px',
          borderRadius: 999,
          cursor: 'pointer',
          fontFamily: 'Nunito, system-ui',
          fontSize: 14, fontWeight: 600, color: '#2a241c',
          boxShadow: '0 1px 2px rgba(60,40,20,.04)',
        }}>
        <PlateChip type={current.id} size={28} />
        <span>Choose a plate</span>
        <span style={{ color: '#8a7c66', fontWeight: 500 }}>· {current.label}</span>
        <svg width="11" height="7" viewBox="0 0 11 7" style={{ marginLeft: 2, transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}>
          <path d="M1 1l4.5 4.5L10 1" fill="none" stroke="#8a7c66" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 40,
          background: '#fbf6ea',
          border: '1px solid #e4dcc8',
          borderRadius: 18,
          padding: 10,
          display: 'grid', gridTemplateColumns: 'repeat(5, 110px)', gap: 6,
          boxShadow: '0 12px 40px rgba(60,40,20,.12), 0 2px 8px rgba(60,40,20,.06)',
        }}>
          {PLATE_TYPES.map(pt => {
            const selected = pt.id === value;
            return (
              <button key={pt.id}
                onClick={() => { onChange(pt.id); setOpen(false); }}
                style={{
                  border: selected ? `1.5px solid ${accent}` : '1.5px solid transparent',
                  background: selected ? '#fff' : 'transparent',
                  borderRadius: 14,
                  padding: '12px 8px 10px',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  transition: 'background .15s, border-color .15s',
                }}
                onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,.5)'; }}
                onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = 'transparent'; }}>
                <PlateChip type={pt.id} size={56} />
                <div style={{ fontFamily: displayFont, fontSize: 15, fontWeight: 500, color: '#2a241c', letterSpacing: -.1 }}>{pt.label}</div>
                <div style={{ fontFamily: 'Nunito, system-ui', fontSize: 11, color: '#8a7c66', lineHeight: 1.2, textAlign: 'center' }}>{pt.caption}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Tiny plate preview — used inside the picker chips and the trigger button.
function PlateChip({ type, size = 40 }) {
  const scale = type === 'snack' ? 0.78 : 1;
  const px = size * scale;
  return (
    <div style={{
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <div style={{
        width: px, height: px, borderRadius: '50%', position: 'relative',
        background: 'radial-gradient(circle at 35% 30%, #fff 0%, #f4ede0 55%, #e2d6bc 100%)',
        boxShadow: '0 1px 3px rgba(60,40,20,.12), inset 0 1px 0 rgba(255,255,255,.6)',
      }}>
        <div style={{
          position: 'absolute', inset: Math.max(2, px * 0.09), borderRadius: '50%',
          boxShadow: 'inset 0 0 0 0.8px #e2d6bc',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'absolute', inset: Math.max(2, px * 0.09) }}>
          <PlateShape type={type} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PLATE_TYPES, PlateShape, PlatePicker, PlateChip, plateSizeFor });
