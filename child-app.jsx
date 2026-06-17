// Child-facing iPad app. Landscape, 1180x820.
// Core screens: home (greeting + menu tray + empty plate), building (drag in
// progress), review (plate populated), confirmation (sent).
// Deliberately simple: single surface, no nav, no login. Plate lives on the
// left, menu tray scrolls on the right.

const CHILD_COLORS = {
  cream: '#f6efe2',
  paper: '#fbf6ea',
  ink: '#2a241c',
  muted: '#8a7c66',
  line: '#e4dcc8',
  sage: 'oklch(0.72 0.06 145)',
  sageDeep: 'oklch(0.52 0.07 145)',
  plate: '#f4ede0',
  plateRim: '#e2d6bc',
  plateShadow: 'rgba(60,40,20,.12)',
};

// Basic round plate. Ceramic-feeling disc with a soft rim.
// Plated items are draggable — reposition within the plate, or drag off to remove.
// A quick tap (no movement) also removes.
// `plateType` chooses a shape variant (basic/divided/rainbow/one-new-thing/snack);
// pulled from window globals so the component file stays standalone.
function Plate({ size = 420, items, onRemove, onMove, active, plateType = 'basic' }) {
  const plateRef = React.useRef(null);
  // `snack` renders at 72% but keeps drop math on the same 0–100 coordinate
  // space the tray uses, so items placed before a shape switch stay valid.
  const visualSize = plateType === 'snack' ? size * 0.72 : size;

  const onItemPointerDown = (e, item) => {
    e.stopPropagation();
    const el = e.currentTarget;
    const plate = plateRef.current;
    if (!plate) return;
    el.setPointerCapture(e.pointerId);
    const r0 = plate.getBoundingClientRect();
    const grabX = (e.clientX - r0.left) / r0.width * 100 - item.x;
    const grabY = (e.clientY - r0.top) / r0.height * 100 - item.y;
    const start = { x: e.clientX, y: e.clientY };
    let moved = false;

    const move = (ev) => {
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      if (!moved && Math.hypot(dx, dy) > 4) moved = true;
      if (!moved) return;
      const r = plate.getBoundingClientRect();
      const nx_raw = (ev.clientX - r.left) / r.width * 100 - grabX;
      const ny_raw = (ev.clientY - r.top) / r.height * 100 - grabY;
      const ddx = nx_raw - 50, ddy = ny_raw - 50;
      const dist = Math.hypot(ddx, ddy);
      let nx = nx_raw, ny = ny_raw;
      if (dist > 47) {
        el.dataset.willRemove = '1';
        nx = 50 + Math.cos(Math.atan2(ddy, ddx)) * 47;
        ny = 50 + Math.sin(Math.atan2(ddy, ddx)) * 47;
      } else {
        delete el.dataset.willRemove;
      }
      onMove && onMove(item.uid, nx, ny);
    };
    const up = (ev) => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      if (!moved) { onRemove && onRemove(item.uid); return; }
      if (el.dataset.willRemove) { delete el.dataset.willRemove; onRemove && onRemove(item.uid); }
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };

  return (
    <div ref={plateRef} style={{
      position: 'relative', width: visualSize, height: visualSize,
      borderRadius: '50%',
      background: `radial-gradient(circle at 35% 30%, #fff 0%, ${CHILD_COLORS.plate} 55%, ${CHILD_COLORS.plateRim} 100%)`,
      boxShadow: active
        ? `0 12px 48px ${CHILD_COLORS.plateShadow}, 0 0 0 4px ${CHILD_COLORS.sage}33, inset 0 2px 0 rgba(255,255,255,.6), inset 0 -6px 0 rgba(60,40,20,.05)`
        : `0 10px 40px ${CHILD_COLORS.plateShadow}, inset 0 2px 0 rgba(255,255,255,.6), inset 0 -6px 0 rgba(60,40,20,.05)`,
      transition: 'box-shadow .25s, width .25s, height .25s',
    }}>
      <div style={{
        position: 'absolute', inset: 18, borderRadius: '50%',
        boxShadow: `inset 0 0 0 1px ${CHILD_COLORS.plateRim}, inset 0 0 0 2px rgba(255,255,255,.4)`,
        pointerEvents: 'none',
      }} />
      {/* shape decoration — sections, arcs, spotlight */}
      {window.PlateShape && <window.PlateShape type={plateType} plateColor={CHILD_COLORS.plate} rimColor={CHILD_COLORS.plateRim} />}
      {items.map((it) => (
        <div key={it.uid}
          onPointerDown={(e) => onItemPointerDown(e, it)}
          style={{
            position: 'absolute', left: `${it.x}%`, top: `${it.y}%`,
            transform: 'translate(-50%, -50%)',
            cursor: 'grab', touchAction: 'none', userSelect: 'none',
            animation: 'ppPlacedIn .32s cubic-bezier(.2,.8,.3,1.1)',
          }}>
          <FoodImage id={it.id} size={86} />
        </div>
      ))}
    </div>
  );
}

// Food card in the tray. Draggable.
function TrayCard({ food, onDragStart, isSelected }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div
      draggable
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onDragStart={(e) => onDragStart(e, food.id)}
      style={{
        background: isSelected ? 'oklch(0.94 0.05 145)' : '#fff',
        borderRadius: 20,
        padding: 14,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        cursor: 'grab',
        boxShadow: pressed
          ? '0 10px 28px rgba(60,40,20,.18)'
          : '0 2px 8px rgba(60,40,20,.06), 0 1px 2px rgba(60,40,20,.08)',
        transform: pressed ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform .15s, box-shadow .15s, background .15s',
        userSelect: 'none',
        position: 'relative',
        opacity: 1,
      }}>
      <FoodImage id={food.id} size={92} />
      <div style={{
        fontFamily: 'Nunito, system-ui', fontSize: 15, fontWeight: 600,
        color: CHILD_COLORS.ink, textAlign: 'center',
      }}>{FOOD_CATALOG[food.id].name}</div>
      {isSelected && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          width: 22, height: 22, borderRadius: '50%',
          background: CHILD_COLORS.sage, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,.15)',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.2l2.5 2.5L9.8 3.5"/></svg>
        </div>
      )}
    </div>
  );
}

// iPad frame — landscape, silver-ish.
function IPadFrame({ children, width = 1180, height = 820, bg = CHILD_COLORS.cream }) {
  return (
    <div style={{
      width, height, borderRadius: 44,
      background: '#d8d4cc',
      padding: 14,
      boxSizing: 'border-box',
      boxShadow: '0 32px 80px rgba(40,30,20,.25), 0 0 0 1px rgba(0,0,0,.08)',
      position: 'relative',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 30,
        background: bg,
        overflow: 'hidden', position: 'relative',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)',
      }}>
        {children}
      </div>
      {/* camera */}
      <div style={{
        position: 'absolute', top: 26, left: '50%', transform: 'translateX(-50%)',
        width: 8, height: 8, borderRadius: '50%', background: '#333', opacity: .7,
      }} />
    </div>
  );
}

// Main child app — stateful prototype covering all four states.
function PlateSelectScreen({ childName, onSelect, T }) {
  const [hovered, setHovered] = React.useState(null);
  const [chosen, setChosen] = React.useState(null);
  const pick = (id) => { setChosen(id); setTimeout(() => onSelect(id), 380); };
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '40px 60px', animation: 'ppSelectIn .3s ease-out' }}>
      <img src="./bg_food_pattern.png" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.1, mixBlendMode: 'multiply', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: 36 }}>
        <div style={{ fontFamily: T.displayFont, fontSize: 42, fontWeight: 500, letterSpacing: -.5, color: CHILD_COLORS.ink }}>Hi {childName}!</div>
        <div style={{ fontFamily: T.displayFont, fontSize: 24, color: CHILD_COLORS.muted, marginTop: 8 }}>Which plate today?</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 18 }}>
        {PLATE_TYPES.map(pt => {
          const active = hovered === pt.id || chosen === pt.id;
          return (
            <button key={pt.id} onClick={() => pick(pt.id)} onPointerEnter={() => setHovered(pt.id)} onPointerLeave={() => setHovered(null)}
              style={{ border: active ? `2.5px solid ${T.accent}` : '2.5px solid transparent', background: active ? '#fff' : 'rgba(255,255,255,.55)', borderRadius: 28, padding: '22px 18px 18px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, minWidth: 168, transform: chosen === pt.id ? 'scale(1.09)' : active ? 'scale(1.04)' : 'scale(1)', transition: 'transform .2s, border-color .15s, background .15s, box-shadow .15s', boxShadow: active ? '0 12px 32px rgba(60,40,20,.13)' : '0 2px 8px rgba(60,40,20,.06)' }}>
              <PlateChip type={pt.id} size={96} />
              <div style={{ fontFamily: T.displayFont, fontSize: 19, fontWeight: 500, color: CHILD_COLORS.ink, letterSpacing: -.2 }}>{pt.label}</div>
              <div style={{ fontFamily: 'Nunito, system-ui', fontSize: 12, color: CHILD_COLORS.muted, textAlign: 'center', lineHeight: 1.3 }}>{pt.caption}</div>
            </button>
          );
        })}
      </div>
      <img src="./platey_home_transparent.png" width={110} style={{ position: 'absolute', bottom: 36, right: 56, display: 'block', transformOrigin: '50% 75%', animation: 'ppWelcomeWave 2.4s ease-in-out infinite', pointerEvents: 'none', zIndex: 1 }} />
    </div>
  );
}

function PlateyReaction({ count }) {
  const prev = React.useRef(count);
  const [celebrate, setCelebrate] = React.useState(false);
  React.useEffect(() => {
    if (count >= 3 && prev.current < 3) { setCelebrate(true); setTimeout(() => setCelebrate(false), 1400); }
    prev.current = count;
  }, [count]);
  const state = celebrate ? 'happy' : count === 0 ? 'welcome' : count <= 2 ? 'watching' : 'settled';
  return (
    <>
      <div style={{ position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: state === 'welcome' ? 1 : 0, transition: 'opacity .4s ease', zIndex: 2 }}>
        <img src="./platey_home_transparent.png" width={160} style={{ display: 'block', transformOrigin: '50% 75%', animation: 'ppWelcomeWave 2.4s ease-in-out infinite' }} />
      </div>
      <div style={{ position: 'absolute', bottom: -8, left: -8, pointerEvents: 'none', opacity: state === 'watching' ? 1 : 0, transform: state === 'watching' ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(10px)', transition: 'opacity .4s ease, transform .4s ease', zIndex: 2 }}>
        <img src="./platey_spoon_transparent.png" width={88} style={{ display: 'block', animation: 'ppPlateyWatch 2.2s ease-in-out infinite' }} />
      </div>
      <div style={{ position: 'absolute', bottom: -8, left: -8, pointerEvents: 'none', opacity: state === 'happy' ? 1 : 0, transition: 'opacity .25s ease', zIndex: 2 }}>
        <img src="./platey_celebration_transparent.png" width={88} style={{ display: 'block', animation: 'ppPlateyBounce .6s cubic-bezier(.2,.8,.3,1.2) both' }} />
      </div>
    </>
  );
}

function ChildApp({ width = 1180, height = 820, childName = 'Mira', tweaks = {}, onSubmit, sentMenu }) {
  const T = {
    cream: tweaks.bg || CHILD_COLORS.cream,
    paper: tweaks.paper || CHILD_COLORS.paper,
    accent: tweaks.accent || CHILD_COLORS.sageDeep,
    accentSoft: tweaks.accentSoft || CHILD_COLORS.sage,
    displayFont: tweaks.displayFont || 'Fraunces, serif',
    uiFont: tweaks.uiFont || 'Nunito, system-ui',
    greeting: tweaks.greeting || `Hello, ${childName}`,
    sendLabel: tweaks.sendLabel || 'Send my plate',
    emptyLabel: tweaks.emptyLabel || 'Pick your plate',
  };
  const [menuItems, setMenuItems] = React.useState(sentMenu?.items?.length ? sentMenu.items : []);
  const [items, setItems] = React.useState([]);
  const [confirming, setConfirming] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [draggingId, setDraggingId] = React.useState(null);
  const [plateType, setPlateType] = React.useState('basic');
  const [step, setStep] = React.useState('pick-plate');
  const [tappedId, setTappedId] = React.useState(null);
  const plateRef = React.useRef(null);
  const uidRef = React.useRef(10);

  const onDragStart = (e, id) => {
    setDraggingId(id);
    setDragActive(true);
    e.dataTransfer.setData('text/food', id);
    // custom drag image
    const ghost = document.createElement('div');
    ghost.style.cssText = 'width:90px;height:90px;border-radius:50%;background:#fff;opacity:.9;box-shadow:0 8px 24px rgba(0,0,0,.2);position:absolute;top:-1000px;';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 45, 45);
    setTimeout(() => ghost.remove(), 0);
  };
  const onDragOver = (e) => { e.preventDefault(); };
  const onDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/food') || draggingId;
    if (!id || !plateRef.current) return;
    const r = plateRef.current.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width * 100;
    const cy = (e.clientY - r.top) / r.height * 100;
    // clamp within ~circle — up to the rim
    const dx = cx - 50, dy = cy - 50;
    const dist = Math.hypot(dx, dy);
    if (dist > 47) {
      const a = Math.atan2(dy, dx);
      const x = 50 + Math.cos(a) * 47;
      const y = 50 + Math.sin(a) * 47;
      setItems((xs) => [...xs, { uid: uidRef.current++, id, x, y }]);
    } else {
      setItems((xs) => [...xs, { uid: uidRef.current++, id, x: cx, y: cy }]);
    }
    setDragActive(false);
    setDraggingId(null);
  };
  const onDragEnd = () => { setDragActive(false); setDraggingId(null); };

  // tap-to-add fallback
  const onTapAdd = (id) => {
    if (items.some(it => it.id === id)) {
      setItems((xs) => xs.filter(it => it.id !== id));
      return;
    }
    const positions = [[45, 40], [55, 50], [50, 60], [40, 55], [60, 40]];
    const [x, y] = positions[items.length % positions.length];
    setItems((xs) => [...xs, { uid: uidRef.current++, id, x, y }]);
  };

  const removeItem = (uid) => setItems((xs) => xs.filter(x => x.uid !== uid));
  const moveItem = (uid, x, y) => setItems((xs) => xs.map(it => it.uid === uid ? { ...it, x, y } : it));
  const selectedIds = new Set(items.map(it => it.id));

  React.useEffect(() => {
    if (sentMenu?.plateType) setPlateType(sentMenu.plateType);
    if (sentMenu?.items?.length) setMenuItems(sentMenu.items);
  }, [sentMenu]);

  return (
    <IPadFrame width={width} height={height} bg={T.cream}>
      <style>{`
        @keyframes ppPlacedIn { 0%{transform:translate(-50%,-50%) scale(1.3);opacity:0} 60%{transform:translate(-50%,-50%) scale(.96);opacity:1} 100%{transform:translate(-50%,-50%) scale(1);opacity:1} }
        @keyframes ppFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes ppConfetti { 0%{transform:translate(0,0) rotate(0deg) scale(1);opacity:1} 100%{transform:translate(var(--cx),var(--cy)) rotate(var(--cr)) scale(.4);opacity:0} }
        @keyframes ppFall { 0%{transform:translate(0,-12px) rotate(0deg);opacity:0} 10%{opacity:1} 88%{opacity:.9} 100%{transform:translate(var(--fdx),870px) rotate(var(--fr));opacity:0} }
        @keyframes ppSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ppTap { 0%{transform:scale(1)} 40%{transform:scale(1.15)} 100%{transform:scale(1)} }
        @keyframes ppJiggle { 0%{transform:translate(-50%,-50%) rotate(-3deg)} 100%{transform:translate(-50%,-50%) rotate(3deg)} }
        @keyframes ppPlateyBounce { 0%{transform:scale(.75) translateY(14px);opacity:0} 60%{transform:scale(1.06) translateY(-5px);opacity:1} 80%{transform:scale(.97) translateY(2px)} 100%{transform:scale(1) translateY(0)} }
        @keyframes ppWelcomeWave { 0%,100%{transform:rotate(0deg)} 15%{transform:rotate(-7deg)} 30%{transform:rotate(7deg)} 45%{transform:rotate(-7deg)} 60%{transform:rotate(5deg)} 75%{transform:rotate(-2deg)} 88%{transform:rotate(1deg)} }
        @keyframes ppPlateyWatch { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-7px) rotate(4deg)} }
        @keyframes ppSelectIn { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
      `}</style>
      {step === 'pick-plate'
        ? <PlateSelectScreen childName={childName} onSelect={(id) => { setPlateType(id); setStep('build'); }} T={T} />
        : (
      <div style={{ width: '100%', height: '100%', display: 'flex', fontFamily: 'Nunito, system-ui', color: CHILD_COLORS.ink }}>
        {/* LEFT — plate panel */}
        <div
          ref={plateRef}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDragEnd={onDragEnd}
          style={{
            width: '56%', height: '100%',
            display: 'flex', flexDirection: 'column',
            padding: '32px 40px',
            position: 'relative',
          }}>
          <img src="./bg_food_pattern.png" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12, mixBlendMode: 'multiply', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 10 }}>
            <div style={{ fontFamily: T.displayFont, fontSize: 28, fontWeight: 500, letterSpacing: -.3 }}>Hi {childName}!</div>
            <div style={{ flex: 1 }} />
            <button onClick={() => setStep('pick-plate')} style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1.5px solid #e4dcc8', background: '#fbf6ea', padding: '6px 12px 6px 8px', borderRadius: 999, cursor: 'pointer', boxShadow: '0 1px 2px rgba(60,40,20,.04)' }}>
              <PlateChip type={plateType} size={28} />
              <span style={{ fontFamily: 'Nunito, system-ui', fontSize: 14, fontWeight: 600, color: CHILD_COLORS.muted }}>Change plate</span>
            </button>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, marginTop: -20 }}>
            <Plate size={504} items={items} onRemove={removeItem} onMove={moveItem} active={dragActive} plateType={plateType} />
            <PlateyReaction count={items.length} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 8, minHeight: 68, position: 'relative', zIndex: 1 }}>
            {items.length === 0 && (
              <div style={{ fontFamily: T.displayFont, fontSize: 28, color: CHILD_COLORS.ink, fontWeight: 500, letterSpacing: -.3 }}>Drag food to plate</div>
            )}
            {items.length > 0 && (
              <button onClick={() => { setSending(true); setTimeout(() => setConfirming(true), 700); onSubmit && onSubmit({ items, plateType }); }} style={{ border: 'none', padding: '18px 40px', borderRadius: 999, fontFamily: T.displayFont, fontSize: 22, fontWeight: 500, letterSpacing: -.2, background: T.accent, color: '#fbf6ea', cursor: 'pointer', boxShadow: '0 4px 14px rgba(40,80,40,.18)', animation: 'ppFadeIn .25s ease' }}>
                {T.sendLabel}
              </button>
            )}
          </div>
        </div>
        {/* food tray */}
        <div style={{ width: '44%', height: '100%', background: T.paper, borderLeft: `1px solid ${CHILD_COLORS.line}`, padding: '32px 28px', display: 'flex', flexDirection: 'column', boxShadow: 'inset 4px 0 12px rgba(60,40,20,.03)' }}>
          <div style={{ fontFamily: T.displayFont, fontSize: 22, fontWeight: 500, letterSpacing: -.2, marginBottom: 18 }}>{childName}'s Menu</div>
          <div style={{ flex: 1, overflow: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, alignContent: 'start' }}>
            {menuItems.length === 0
              ? <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, opacity: .45, pointerEvents: 'none' }}>
                  <div style={{ fontFamily: T.displayFont, fontSize: 16, color: CHILD_COLORS.muted, textAlign: 'center', lineHeight: 1.4 }}>Waiting for today's menu…</div>
                </div>
              : menuItems.map(id => (
                  <div key={id} onClick={() => { setTappedId(id); setTimeout(() => setTappedId(null), 250); onTapAdd(id); }}>
                    <TrayCard food={{ id }} onDragStart={onDragStart} isSelected={selectedIds.has(id)} />
                  </div>
                ))
            }
          </div>
        </div>
        {sending && !confirming && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: `${T.cream}f2`, backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, animation: 'ppFadeIn .2s ease-out' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', border: `3.5px solid ${CHILD_COLORS.line}`, borderTopColor: T.accent, animation: 'ppSpin .75s linear infinite' }} />
          </div>
        )}
        {confirming && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: `${T.cream}f2`, backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <img src="./platey_celebration_transparent.png" style={{ width: 150, display: 'block', margin: '0 auto', animation: 'ppPlateyBounce .6s cubic-bezier(.2,.8,.3,1.2) both' }} />
            <div style={{ fontFamily: T.displayFont, fontSize: 34, fontWeight: 500, letterSpacing: -.4, color: CHILD_COLORS.ink, lineHeight: 1.15, textAlign: 'center' }}>Your plate is on the way!</div>
            <Plate size={430} items={items} onRemove={() => {}} plateType={plateType} />
            <button onClick={() => { setItems([]); setMenuItems([]); setConfirming(false); setSending(false); setStep('pick-plate'); }} style={{ border: 'none', padding: '14px 42px', borderRadius: 999, fontFamily: T.displayFont, fontSize: 18, fontWeight: 500, letterSpacing: -.2, background: T.accent, color: '#fbf6ea', cursor: 'pointer', boxShadow: '0 6px 20px rgba(40,80,40,.25)', marginTop: 16 }}>
              Done
            </button>
          </div>
        )}
      </div>
        )
      }
    </IPadFrame>
  );
}

Object.assign(window, { ChildApp, Plate, TrayCard, IPadFrame, CHILD_COLORS, PlateSelectScreen, PlateyReaction });
