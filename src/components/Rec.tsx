type Rec = { title:string; year?:number; poster?:string; genres?:string[]; score:number; average?:number; votes?:number; because?:string; };

export function RecCard({ r, onSeen }: { r: Rec; onSeen?: () => void }) {
  return (
    <div className="rounded-2xl shadow p-3 w-40">
      <img src={r.poster || "/placeholder.png"} alt="" className="w-full aspect-2/3 object-cover rounded-xl mb-2" loading="lazy" />
      <div className="text-sm font-medium line-clamp-2">{r.title}{r.year ? ` (${r.year})` : ""}</div>
      <div className="text-xs opacity-70">{r.genres?.slice(0,2).join(" • ")}</div>
      {r.because && <div className="text-[11px] mt-1 italic opacity-70">Because you liked {r.because}</div>}
      <div className="text-xs mt-1">Avg {(r.average ?? 0).toFixed(1)} · {(r.votes ?? 0).toLocaleString()} votes</div>
      <button className="mt-2 w-full text-xs py-1 rounded bg-gray-900 text-white" onClick={onSeen}>Seen it</button>
    </div>
  );
}