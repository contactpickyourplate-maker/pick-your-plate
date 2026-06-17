// Caretaker-facing iPhone app.
// Visual tone: calmer, more utilitarian sibling of the child app. Same cream
// palette, tighter spacing, Inter for UI, Fraunces for greetings only.

const CARE_COLORS = {
  bg: '#f6efe2',
  card: '#ffffff',
  surface: '#fbf6ea',
  ink: '#2a241c',
  muted: '#8a7c66',
  mutedStrong: '#5a4e3c',
  line: '#e4dcc8',
  lineSoft: '#efe8d6',
  sage: 'oklch(0.72 0.06 145)',
  sageDeep: 'oklch(0.52 0.07 145)',
  sageSoft: 'oklch(0.92 0.03 145)',
};

const careFont = 'Inter, -apple-system, system-ui, sans-serif';
const serifFont = 'Fraunces, ui-serif, Georgia, serif';

function CareStatusBar() {
  return (
    <div style={{
      height: 54, padding: '20px 32px 0', display: 'flex',
      justifyContent: 'space-between', alignItems: 'flex-start',
      fontFamily: careFont, fontSize: 15, fontWeight: 600, color: CARE_COLORS.ink,
      position: 'relative', zIndex: 5,
    }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill={CARE_COLORS.ink}><rect x="0" y="7" width="3" height="4" rx="0.5"/><rect x="4.5" y="5" width="3" height="6" rx="0.5"/><rect x="9" y="2.5" width="3" height="8.5" rx="0.5"/><rect x="13.5" y="0" width="3" height="11" rx="0.5"/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="21" height="10" rx="2.5" fill="none" stroke={CARE_COLORS.ink} strokeOpacity=".35"/><rect x="2" y="2" width="16" height="7" rx="1.5" fill={CARE_COLORS.ink}/></svg>
      </div>
    </div>
  );
}

function CareFrame({ children, width = 402, height = 874 }) {
  return (
    <div style={{
      width, height, borderRadius: 52,
      background: '#1a1612',
      padding: 8, boxSizing: 'border-box',
      boxShadow: '0 30px 70px rgba(40,30,20,.25), 0 0 0 1px rgba(0,0,0,.15)',
      position: 'relative',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 44,
        background: CARE_COLORS.bg, overflow: 'hidden', position: 'relative',
      }}>
        {/* dynamic island */}
        <div style={{
          position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
          width: 120, height: 34, borderRadius: 20, background: '#000', zIndex: 50,
        }} />
        {children}
        {/* home indicator */}
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          width: 134, height: 5, borderRadius: 3, background: 'rgba(0,0,0,.3)', zIndex: 50,
        }} />
      </div>
    </div>
  );
}

// TAB BAR — custom, no iOS defaults. Matches visual tone.
function CareTabBar({ active = 'today' }) {
  const tabs = [
    { id: 'today', label: 'Today', icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><circle cx="11" cy="11" r="3"/></svg>
    ) },
    { id: 'library', label: 'Library', icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="12" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="12" width="7" height="7" rx="1.5"/><rect x="12" y="12" width="7" height="7" rx="1.5"/></svg>
    ) },
    { id: 'profiles', label: 'Profile', icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="8" r="3.5"/><path d="M4 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/></svg>
    ) },
    { id: 'settings', label: 'Settings', icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="11" r="3"/><path d="M11 2v2M11 18v2M2 11h2M18 11h2M4.5 4.5l1.5 1.5M16 16l1.5 1.5M4.5 17.5L6 16M16 6l1.5-1.5"/></svg>
    ) },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingTop: 12, paddingBottom: 30,
      background: 'rgba(251,246,234,.92)',
      backdropFilter: 'blur(16px)',
      borderTop: `1px solid ${CARE_COLORS.lineSoft}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 20,
    }}>
      {tabs.map(t => (
        <div key={t.id} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          color: active === t.id ? CARE_COLORS.sageDeep : CARE_COLORS.muted,
          fontFamily: careFont, fontSize: 10.5, fontWeight: 600, letterSpacing: .3,
          textTransform: 'uppercase',
        }}>
          {t.icon}
          <span>{t.label}</span>
        </div>
      ))}
    </div>
  );
}

// Food chip — used in menu lists.
function FoodChip({ id, onRemove, compact }) {
  const f = FOOD_CATALOG[id];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: compact ? '6px 10px 6px 6px' : '8px 12px 8px 8px',
      background: '#fff', borderRadius: 999,
      border: `1px solid ${CARE_COLORS.lineSoft}`,
      fontFamily: careFont, fontSize: 14, fontWeight: 500, color: CARE_COLORS.ink,
    }}>
      <FoodImage id={id} size={compact ? 28 : 34} />
      <span>{f.name}</span>
      {onRemove && (
        <button onClick={onRemove} style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          color: CARE_COLORS.muted, width: 22, height: 22, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 2,
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 2l6 6M8 2l-6 6"/></svg>
        </button>
      )}
    </div>
  );
}

// ───── Screen: Today (setting up the menu) ─────
function CareToday({ childName = 'Mira' }) {
  const [meal, setMeal] = React.useState('lunch');
  const [menu, setMenu] = React.useState(['apple', 'crackers', 'cheese', 'cucumber', 'ham', 'grapes', 'carrot', 'yogurt']);
  const [adding, setAdding] = React.useState(false);

  const meals = [
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'snack', label: 'Snack' },
  ];

  const removeItem = (id) => setMenu((xs) => xs.filter(x => x !== id));

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <CareStatusBar />
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 20px 120px', fontFamily: careFont }}>
        {/* greeting */}
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, color: CARE_COLORS.muted, fontWeight: 600, letterSpacing: .6, textTransform: 'uppercase' }}>
            Tuesday · 22 April
          </div>
          <div style={{
            fontFamily: serifFont, fontSize: 32, fontWeight: 500, letterSpacing: -.5,
            marginTop: 4, color: CARE_COLORS.ink, lineHeight: 1.1,
          }}>{childName}'s Menu</div>
        </div>

        {/* meal selector */}
        <div style={{
          display: 'flex', gap: 6, marginTop: 20, background: '#fff',
          borderRadius: 12, padding: 4, border: `1px solid ${CARE_COLORS.lineSoft}`,
        }}>
          {meals.map(m => (
            <button key={m.id} onClick={() => setMeal(m.id)}
              style={{
                flex: 1, border: 'none', padding: '10px 4px', borderRadius: 9,
                fontFamily: careFont, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: meal === m.id ? CARE_COLORS.sageSoft : 'transparent',
                color: meal === m.id ? CARE_COLORS.sageDeep : CARE_COLORS.muted,
                transition: 'all .15s',
              }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* plate type chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginTop: 16,
          padding: '12px 14px', background: '#fff', borderRadius: 12,
          border: `1px solid ${CARE_COLORS.lineSoft}`,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: `radial-gradient(circle at 35% 30%, #fff, ${CARE_COLORS.sageSoft})`,
            boxShadow: `inset 0 0 0 1px ${CARE_COLORS.line}`,
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: CARE_COLORS.muted, fontWeight: 500 }}>Plate</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: CARE_COLORS.ink, marginTop: 1 }}>Basic round</div>
          </div>
          <span style={{ fontSize: 13, color: CARE_COLORS.sageDeep, fontWeight: 600 }}>Change</span>
        </div>

        {/* menu section */}
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginTop: 28, marginBottom: 12,
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: CARE_COLORS.ink, letterSpacing: -.2 }}>
            On the menu
          </div>
          <div style={{ fontSize: 13, color: CARE_COLORS.muted, fontWeight: 500 }}>
            {menu.length} {menu.length === 1 ? 'item' : 'items'}
          </div>
        </div>

        <div style={{
          background: '#fff', borderRadius: 16, padding: 12,
          border: `1px solid ${CARE_COLORS.lineSoft}`,
          display: 'flex', flexWrap: 'wrap', gap: 8,
        }}>
          {menu.map(id => (
            <FoodChip key={id} id={id} onRemove={() => removeItem(id)} />
          ))}
          <button onClick={() => setAdding(true)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', background: CARE_COLORS.sageSoft, border: 'none',
            borderRadius: 999, cursor: 'pointer',
            fontFamily: careFont, fontSize: 14, fontWeight: 600, color: CARE_COLORS.sageDeep,
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2v8M2 6h8"/></svg>
            Add food
          </button>
        </div>

        {/* quick shortcuts */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, color: CARE_COLORS.muted, fontWeight: 600, letterSpacing: .6, textTransform: 'uppercase', marginBottom: 8 }}>
            Shortcuts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { t: 'Copy yesterday\u2019s lunch', s: '8 items' },
              { t: 'Tuesday pasta template', s: '6 items · used weekly' },
            ].map((x, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '13px 14px', background: '#fff', borderRadius: 12,
                border: `1px solid ${CARE_COLORS.lineSoft}`,
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: CARE_COLORS.ink }}>{x.t}</div>
                  <div style={{ fontSize: 12, color: CARE_COLORS.muted, marginTop: 2 }}>{x.s}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={CARE_COLORS.muted} strokeWidth="2" strokeLinecap="round"><path d="M5 3l4 4-4 4"/></svg>
              </div>
            ))}
          </div>
        </div>

        {/* save */}
        <button style={{
          width: '100%', marginTop: 24,
          border: 'none', padding: '16px', borderRadius: 14,
          background: CARE_COLORS.sageDeep, color: '#fbf6ea',
          fontFamily: careFont, fontSize: 16, fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(40,80,40,.15)',
        }}>Send menu</button>
      </div>
      <CareTabBar active="today" />

      {/* add-food sheet */}
      {adding && (
        <div onClick={() => setAdding(false)} style={{
          position: 'absolute', inset: 0, zIndex: 40,
          background: 'rgba(40,30,20,.25)',
          display: 'flex', alignItems: 'flex-end',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', background: CARE_COLORS.bg,
            borderRadius: '20px 20px 0 0', padding: '14px 20px 40px',
            animation: 'sheetUp .25s cubic-bezier(.2,.8,.3,1)',
          }}>
            <style>{`@keyframes sheetUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: CARE_COLORS.line, margin: '0 auto 14px' }} />
            <div style={{ fontFamily: serifFont, fontSize: 22, fontWeight: 500, color: CARE_COLORS.ink, marginBottom: 14 }}>Add a food</div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '11px 14px', background: '#fff', borderRadius: 12,
              border: `1px solid ${CARE_COLORS.line}`, marginBottom: 14,
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={CARE_COLORS.muted} strokeWidth="1.8" strokeLinecap="round"><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3"/></svg>
              <span style={{ fontSize: 15, color: CARE_COLORS.muted, fontFamily: careFont }}>Search library…</span>
            </div>
            <div style={{ fontSize: 12, color: CARE_COLORS.muted, fontWeight: 600, letterSpacing: .6, textTransform: 'uppercase', marginBottom: 10 }}>
              Mira's safe foods
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['toast', 'pasta', 'banana', 'milk', 'strawberry', 'peas'].map(id => (
                <FoodChip key={id} id={id} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ───── Screen: Notification (plate received) ─────
function CareNotification({ childName = 'Mira', tweaks = {} }) {
  const choices = ['crackers', 'cheese', 'cucumber', 'grapes'];
  const accent = tweaks.accent || CARE_COLORS.sageDeep;
  const accentSoft = tweaks.accentSoft || CARE_COLORS.sage;
  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <CareStatusBar />
      <div style={{ flex: 1, overflow: 'auto', padding: '6px 20px 120px', fontFamily: careFont }}>
        {/* push banner at top */}
        <div style={{
          marginTop: 4, padding: '12px 14px', background: '#fff',
          borderRadius: 18, border: `1px solid ${CARE_COLORS.lineSoft}`,
          boxShadow: '0 4px 16px rgba(40,30,20,.06)',
          animation: 'notifSlide .45s cubic-bezier(.2,.9,.3,1)',
        }}>
          <style>{`@keyframes notifSlide { from { transform: translateY(-20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}</style>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 7,
              background: `radial-gradient(circle at 30% 30%, ${CARE_COLORS.sageSoft}, ${accentSoft})`,
              flexShrink: 0,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: CARE_COLORS.ink }}>{tweaks.brandName || 'Pick Your Plate'}</span>
                <span style={{ fontSize: 11, color: CARE_COLORS.muted }}>now</span>
              </div>
              <div style={{ fontSize: 14, color: CARE_COLORS.ink, fontWeight: 600 }}>{childName} made her lunch choices</div>
              <div style={{ fontSize: 13, color: CARE_COLORS.mutedStrong, marginTop: 1, lineHeight: 1.35 }}>
                Crackers, cheese, cucumber, grapes.
              </div>
            </div>
          </div>
        </div>

        {/* in-app summary */}
        <div style={{
          fontFamily: serifFont, fontSize: 28, fontWeight: 500, letterSpacing: -.4,
          marginTop: 28, color: CARE_COLORS.ink, lineHeight: 1.15,
        }}>{childName} picked her plate.</div>
        <div style={{ fontSize: 14, color: CARE_COLORS.muted, marginTop: 4 }}>
          Tuesday lunch · just now
        </div>

        {/* plate visualization */}
        <div style={{
          marginTop: 22, padding: 24,
          background: '#fff', borderRadius: 20,
          border: `1px solid ${CARE_COLORS.lineSoft}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={{
            width: 220, height: 220, borderRadius: '50%', position: 'relative',
            background: `radial-gradient(circle at 35% 30%, #fff, #f4ede0 55%, #e2d6bc 100%)`,
            boxShadow: '0 6px 22px rgba(60,40,20,.1), inset 0 2px 0 rgba(255,255,255,.6)',
          }}>
            {[[42, 42], [60, 46], [50, 62], [38, 58]].map(([x, y], i) => (
              <div key={i} style={{
                position: 'absolute', left: `${x}%`, top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}>
                <FoodImage id={choices[i]} size={56} />
              </div>
            ))}
          </div>
          <div style={{
            fontSize: 12, color: CARE_COLORS.muted, fontWeight: 600, letterSpacing: .6,
            textTransform: 'uppercase', marginTop: 18,
          }}>Basic round plate</div>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 10,
          }}>
            {choices.map(id => (
              <span key={id} style={{
                fontSize: 13, fontWeight: 600, color: CARE_COLORS.ink,
                padding: '4px 10px', borderRadius: 999, background: CARE_COLORS.surface,
              }}>{FOOD_CATALOG[id].name}</span>
            ))}
          </div>
        </div>

        <button style={{
          width: '100%', marginTop: 16,
          border: 'none', padding: '14px', borderRadius: 14,
          background: CARE_COLORS.sageDeep, color: '#fbf6ea',
          fontFamily: careFont, fontSize: 15, fontWeight: 600,
          cursor: 'pointer',
        }}>Got it</button>
        <button style={{
          width: '100%', marginTop: 8,
          border: `1px solid ${CARE_COLORS.line}`, padding: '13px', borderRadius: 14,
          background: 'transparent', color: CARE_COLORS.ink,
          fontFamily: careFont, fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>View history</button>
      </div>
      <CareTabBar active="today" />
    </div>
  );
}

Object.assign(window, { CareToday, CareNotification, CareFrame, CareTabBar, FoodChip, CARE_COLORS });
