import { hotColor } from "./HotColor";

export function HotThermo({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const color = hotColor(v);
  return (
    <div className="relative w-1.5 h-16 rounded-full bg-white/10 overflow-hidden" aria-hidden>
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: `${v}%`, background: color }}
      />
    </div>
  );
}
