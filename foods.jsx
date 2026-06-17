// Food catalog — styled food "photo" tiles drawn as CSS.
// Each food is a colored disc with a subtle ring + simple abstract shape.
// Deliberately not photorealistic — we're mocking. A production build would
// swap these for real photography on white.

const FOOD_CATALOG = {
  // breakfast + lunch staples
  banana:     { name: 'Banana',        color: '#f6d668', accent: '#c89a1a', shape: 'crescent' },
  toast:      { name: 'Toast',         color: '#e8c892', accent: '#9a6a32', shape: 'square' },
  egg:        { name: 'Boiled egg',    color: '#fafafa', accent: '#f6cc54', shape: 'egg' },
  berries:    { name: 'Blueberries',   color: '#4a5496', accent: '#2c336b', shape: 'berries' },
  yogurt:     { name: 'Yoghurt',       color: '#f4efe4', accent: '#d8c8a4', shape: 'bowl' },
  cereal:     { name: 'Cereal',        color: '#e8b06a', accent: '#a46624', shape: 'loops' },

  // proteins
  chicken:    { name: 'Chicken',       color: '#e6c28a', accent: '#a06c2a', shape: 'nugget' },
  cheese:     { name: 'Cheese',        color: '#f8d76a', accent: '#c48a1c', shape: 'triangle' },
  beans:      { name: 'Beans',         color: '#a66a3a', accent: '#5c3418', shape: 'ovals' },
  ham:        { name: 'Ham',           color: '#e8a99a', accent: '#a85b4c', shape: 'folded' },
  tofu:       { name: 'Tofu',          color: '#f4ecd8', accent: '#b8a270', shape: 'cube' },
  fishstick:  { name: 'Fish stick',    color: '#d4a868', accent: '#7a4a1c', shape: 'bar' },

  // vegetables
  carrot:     { name: 'Carrot',        color: '#e8904a', accent: '#9a4e18', shape: 'baton' },
  cucumber:   { name: 'Cucumber',      color: '#8ab572', accent: '#3a6a2c', shape: 'coin' },
  broccoli:   { name: 'Broccoli',      color: '#6d9a4c', accent: '#2e4e1a', shape: 'tree' },
  corn:       { name: 'Sweetcorn',     color: '#f0cc4a', accent: '#a47818', shape: 'dots' },
  peas:       { name: 'Peas',          color: '#a4c472', accent: '#4e7028', shape: 'triple' },
  tomato:     { name: 'Tomato',        color: '#d44a3a', accent: '#7a1e14', shape: 'round' },

  // fruit
  apple:      { name: 'Apple slice',   color: '#f4e8d0', accent: '#c66a4a', shape: 'wedge' },
  grapes:     { name: 'Grapes',        color: '#8a5aa8', accent: '#3c2052', shape: 'cluster' },
  strawberry: { name: 'Strawberry',    color: '#dc4a5a', accent: '#7a1828', shape: 'heart' },
  orange:     { name: 'Orange',        color: '#e8803a', accent: '#9a4418', shape: 'segments' },

  // grains/starch
  pasta:      { name: 'Pasta',         color: '#f0d890', accent: '#9a7028', shape: 'spiral' },
  rice:       { name: 'Rice',          color: '#f6f0e0', accent: '#c4b488', shape: 'grains' },
  crackers:   { name: 'Crackers',      color: '#e8c890', accent: '#9a6a28', shape: 'round' },
  potato:     { name: 'Potato',        color: '#e4c898', accent: '#9a6c30', shape: 'oval' },

  // dairy / treats
  milk:       { name: 'Milk',          color: '#f8f4ec', accent: '#d0c4a8', shape: 'glass' },
  raisins:    { name: 'Raisins',       color: '#5a3418', accent: '#2c1608', shape: 'ovals' },
};

// Draw a food on a plain white disc. Uses CSS shapes layered to give a
// "photograph on white backdrop" feel without SVG illustration.
function FoodImage({ id, size = 80 }) {
  const f = FOOD_CATALOG[id];
  if (!f) return null;
  const s = size;
  const inner = (() => {
    const base = { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
    const { color, accent, shape } = f;
    switch (shape) {
      case 'crescent': return <div style={{ ...base, width: s * 0.7, height: s * 0.32, background: color, borderRadius: '50%', transform: 'translate(-50%, -50%) rotate(-22deg)', boxShadow: `inset 0 -3px 0 ${accent}40, inset 0 3px 0 #fff6` }} />;
      case 'square': return <div style={{ ...base, width: s * 0.58, height: s * 0.58, background: color, borderRadius: 4, boxShadow: `inset 0 0 0 2px ${accent}50, 0 1px 0 ${accent}30` }} />;
      case 'egg': return <><div style={{ ...base, width: s * 0.55, height: s * 0.62, background: color, borderRadius: '50%', boxShadow: `inset -3px -3px 6px ${accent}20` }} /><div style={{ ...base, width: s * 0.22, height: s * 0.22, background: accent, borderRadius: '50%' }} /></>;
      case 'berries': return <>{[0,1,2,3,4].map(i => <div key={i} style={{ position: 'absolute', left: `${30 + (i%3)*20}%`, top: `${30 + Math.floor(i/3)*25}%`, width: s*0.22, height: s*0.22, background: color, borderRadius: '50%', boxShadow: `inset 1px 1px 0 #fff4` }} />)}</>;
      case 'bowl': return <><div style={{ ...base, width: s * 0.64, height: s * 0.64, background: color, borderRadius: '50%', boxShadow: `inset 0 4px 0 #fff8, inset 0 -4px 8px ${accent}30` }} /></>;
      case 'loops': return <>{[0,1,2,3].map(i => <div key={i} style={{ position: 'absolute', left: `${26 + (i%2)*28}%`, top: `${26 + Math.floor(i/2)*28}%`, width: s*0.22, height: s*0.22, border: `${s*0.06}px solid ${color}`, borderRadius: '50%' }} />)}</>;
      case 'nugget': return <div style={{ ...base, width: s * 0.62, height: s * 0.48, background: color, borderRadius: '45% 55% 50% 50% / 55% 50% 50% 45%', boxShadow: `inset 2px 3px 0 #fff6, inset -2px -2px 6px ${accent}40` }} />;
      case 'triangle': return <div style={{ ...base, width: 0, height: 0, borderLeft: `${s*0.26}px solid transparent`, borderRight: `${s*0.26}px solid transparent`, borderBottom: `${s*0.44}px solid ${color}`, filter: `drop-shadow(0 1px 0 ${accent}40)` }} />;
      case 'ovals': return <>{[0,1,2].map(i => <div key={i} style={{ position: 'absolute', left: `${26 + i*18}%`, top: `${38 + (i%2)*14}%`, width: s*0.22, height: s*0.16, background: color, borderRadius: '50%', boxShadow: `inset 1px 1px 0 #fff4` }} />)}</>;
      case 'folded': return <div style={{ ...base, width: s * 0.64, height: s * 0.38, background: color, borderRadius: 6, boxShadow: `inset 0 -6px 0 ${accent}30, inset 0 4px 0 #fff5` }} />;
      case 'cube': return <div style={{ ...base, width: s * 0.52, height: s * 0.52, background: color, boxShadow: `inset -4px -4px 8px ${accent}30, inset 3px 3px 0 #fff6` }} />;
      case 'bar': return <div style={{ ...base, width: s * 0.72, height: s * 0.3, background: color, borderRadius: 4, boxShadow: `inset 0 0 0 2px ${accent}40` }} />;
      case 'baton': return <div style={{ ...base, width: s * 0.22, height: s * 0.68, background: color, borderRadius: s * 0.11, boxShadow: `inset 2px 0 0 #fff6, inset -2px 0 0 ${accent}30` }} />;
      case 'coin': return <><div style={{ ...base, width: s * 0.54, height: s * 0.54, background: color, borderRadius: '50%' }} /><div style={{ ...base, width: s * 0.18, height: s * 0.18, background: `${accent}40`, borderRadius: '50%' }} /></>;
      case 'tree': return <><div style={{ ...base, width: s * 0.5, height: s * 0.5, background: color, borderRadius: '50% 50% 46% 46% / 60% 60% 40% 40%', transform: 'translate(-50%, -55%)' }} /><div style={{ ...base, width: s * 0.16, height: s * 0.22, background: '#f0ead2', transform: 'translate(-50%, -10%)' }} /></>;
      case 'dots': return <>{[...Array(9)].map((_,i) => <div key={i} style={{ position: 'absolute', left: `${28 + (i%3)*18}%`, top: `${28 + Math.floor(i/3)*18}%`, width: s*0.12, height: s*0.12, background: color, borderRadius: '50%' }} />)}</>;
      case 'triple': return <>{[0,1,2].map(i => <div key={i} style={{ position: 'absolute', left: `${30 + i*18}%`, top: '44%', width: s*0.22, height: s*0.22, background: color, borderRadius: '50%', boxShadow: `inset 1px 1px 0 #fff5` }} />)}</>;
      case 'round': return <div style={{ ...base, width: s * 0.6, height: s * 0.6, background: color, borderRadius: '50%', boxShadow: `inset 2px 2px 0 #fff7, inset -3px -3px 8px ${accent}25` }} />;
      case 'wedge': return <div style={{ ...base, width: s * 0.56, height: s * 0.44, background: color, borderRadius: '80% 80% 12% 12% / 100% 100% 20% 20%', boxShadow: `inset 0 -6px 0 ${accent}30` }} />;
      case 'cluster': return <>{[[30,28],[48,28],[38,44],[56,44],[46,60]].map(([l,t],i) => <div key={i} style={{ position: 'absolute', left: `${l}%`, top: `${t}%`, width: s*0.2, height: s*0.2, background: color, borderRadius: '50%', boxShadow: `inset 1px 1px 0 #fff5` }} />)}</>;
      case 'heart': return <div style={{ ...base, width: s * 0.52, height: s * 0.46, background: color, clipPath: 'path("M 20 40 Q 0 20 20 10 Q 40 0 40 20 Q 40 0 60 10 Q 80 20 60 40 L 40 55 Z")', transform: 'translate(-50%, -55%)' }} />;
      case 'segments': return <>{[0,1,2,3,4,5].map(i => <div key={i} style={{ position: 'absolute', left: '50%', top: '50%', width: s * 0.14, height: s * 0.42, background: color, transformOrigin: 'bottom center', transform: `translate(-50%, -100%) rotate(${i * 60}deg)`, borderRadius: s * 0.07, boxShadow: `inset 1px 0 0 #fff4` }} />)}</>;
      case 'spiral': return <div style={{ ...base, width: s * 0.5, height: s * 0.5, border: `${s*0.08}px solid ${color}`, borderRadius: '50%', borderRightColor: 'transparent', transform: 'translate(-50%, -50%) rotate(45deg)' }} />;
      case 'grains': return <>{[...Array(14)].map((_,i) => <div key={i} style={{ position: 'absolute', left: `${20 + (i%5)*14}%`, top: `${25 + Math.floor(i/5)*18}%`, width: s*0.1, height: s*0.05, background: color, borderRadius: s*0.025, boxShadow: `inset 0 0.5px 0 #fff` }} />)}</>;
      case 'oval': return <div style={{ ...base, width: s * 0.66, height: s * 0.48, background: color, borderRadius: '50%', boxShadow: `inset 3px 3px 0 #fff6, inset -3px -3px 8px ${accent}30` }} />;
      case 'glass': return <><div style={{ ...base, width: s * 0.48, height: s * 0.58, background: color, borderRadius: '4px 4px 10% 10%', boxShadow: `inset 4px 0 0 #fff8, inset -2px 0 0 ${accent}20` }} /></>;
      default: return null;
    }
  })();

  return (
    <div style={{
      width: s, height: s, borderRadius: '50%', background: '#ffffff',
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 1px 2px rgba(0,0,0,.08), inset 0 0 0 1px rgba(0,0,0,.03)',
    }}>
      {inner}
    </div>
  );
}

Object.assign(window, { FOOD_CATALOG, FoodImage });
