type Rec = {
  title: string;
  year?: number;
  poster?: string;
  genres?: string[];
  score?: number;     // raw cosine (0..1) or % (0..100)
  average?: number;
  votes?: number;
  because?: string;   // a title
  link?: string;      // optional Letterboxd link
};

function slugify(title: string) {
  return encodeURIComponent(
    title.toLowerCase().replace(/:\s/g, "-").replace(/[^a-z0-9]/g, "-")
  );
}
function fmtAvg(avg?: number) {
  return typeof avg === "number" ? avg.toFixed(1) : "—";
}
function fmtVotes(v?: number) {
  return typeof v === "number" ? v.toLocaleString() : "—";
}

// ---- The card ----
export function RecCard({ r, onSeen }: { r: Rec; onSeen?: () => void }) {
  const href = r.link || (r.title ? `https://letterboxd.com/film/${slugify(r.title)}/` : "#");

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))]">
      <a href={href} target="_blank" rel="noopener noreferrer" className="block relative">
        <img
          src={r.poster || "/placeholder-poster.png"}
          alt={`${r.title} poster`}
          loading="lazy"
          className="w-full aspect-[2/3] object-cover"
          onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/placeholder-poster.png")}
        />

        {r.because && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/70 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            <div className="pointer-events-none absolute left-0 top-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <p className="text-white/90 text-[12px]">
                Because you liked <span className="font-semibold">{r.because}</span>
              </p>
            </div>
          </>
        )}
      </a>

      {/* Footer: fixed height, flex column, genres pinned to bottom, average/votes above genres */}
      <div className="px-3 pb-4 pt-4 text-white flex flex-col justify-between text-left" style={{ minHeight: '140px', height: '140px', position: 'relative' }}>
        {/* Title (3 lines, clamped) and year */}
        <div className="relative" style={{ minHeight: '3.6em' }}>
          <h3
            className="text-base sm:text-lg font-semibold leading-tight overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]"
            title={r.title}
            style={{ minHeight: '3.6em' }}
          >
            {r.title}
          </h3>
          {r.year ? (
            <time className="absolute top-0 right-0 text-xs sm:text-sm text-white/80">{r.year}</time>
          ) : null}
        </div>
        {/* Average/Votes row above genres, not pinned to bottom */}
        <div className="text-sm leading-[1.25rem] flex items-center justify-between mb-7">
          <div>
            <span className="opacity-80">Average</span>
            <span className="mx-1">:</span>
            <span className="font-semibold">{fmtAvg(r.average)}</span>
            <span className="mx-2 text-white/40">·</span>
            <span className="opacity-80">Votes</span>
            <span className="mx-1">:</span>
            <span className="font-semibold">{fmtVotes(r.votes)}</span>
          </div>
          {onSeen ? (
            <button
              onClick={onSeen}
              className="h-6 px-2 rounded-md text-[11px] bg-white/10 border border-white/15 text-white hover:bg-white/15 transition"
              title="Mark as seen"
            >
              Seen
            </button>
          ) : (
            <span className="h-6" />
          )}
        </div>
        {/* Genres row pinned to bottom */}
        <div style={{ position: 'absolute', left: 12, right: 12, bottom: 4 }}>
          {Array.isArray(r.genres) && r.genres.length > 0 ? (
            <div className="h-6 flex flex-nowrap items-center gap-1.5 overflow-hidden mb-2">
              {r.genres.slice(0, 3).map((g) => (
                <span
                  key={g}
                  title={g}
                  className="inline-flex items-center justify-center h-6 px-2.5 rounded-full bg-[#2C343F]/90 border border-[#556678]/50 text-white/90 text-[11px] font-medium tracking-tight leading-none max-w-[7rem] truncate whitespace-nowrap"
                >
                  {g}
                </span>
              ))}
            </div>
          ) : (
            <div className="h-6" />
          )}
        </div>
      </div>
    </article>
  );
}
