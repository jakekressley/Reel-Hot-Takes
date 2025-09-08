// HotRing.tsx
function hotColor(h: number) {
  const v = Math.max(0, Math.min(100, Math.round(h)));
  if (v >= 80) return "#e73737ff"; // deep red
  if (v >= 60) return "#cc6565ff"; // light red
  if (v >= 40) return "#F27405"; // orange
  if (v >= 20) return "#f59e0b"; // amber
  return "#00B021";             // green
}

export default function HotRing({ value, size = 40 }: { value: number; size?: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const color = hotColor(v);
  const thickness = Math.max(3, Math.round(size * 0.12)); // ring thickness

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Hotness ${v}`}
      title={`Hotness ${v}`}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${color} ${v * 3.6}deg, rgba(255,255,255,0.15) 0)`,
        }}
      />
      <div
        className="absolute rounded-full bg-black/75 flex items-center justify-center"
        style={{ inset: thickness }}
      >
        <span className="text-white text-xs font-bold leading-none">{v}</span>
      </div>
    </div>
  );
}
