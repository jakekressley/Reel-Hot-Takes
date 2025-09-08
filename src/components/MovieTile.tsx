import MovieItemProps from "../types/Types";
import HotRing from "./HotRing";

function fmtAvg(avg?: number) {
  return typeof avg === "number" ? avg.toFixed(1) : "—";
}
function slugify(title: string) {
  return encodeURIComponent(
    title.toLowerCase().replace(/:\s/g, "-").replace(/[^a-z0-9]/g, "-")
  );
}

export default function MovieTile({
  title,
  userRating,
  average,
  hotness,
  poster,
  year,
  genres = [],
  link,
}: MovieItemProps & { link?: string }) {
  const href = link || (title ? `https://letterboxd.com/film/${slugify(title)}/` : "#");
  const hot = Math.round(hotness ?? 0);

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))]">
      <a href={href} target="_blank" rel="noopener noreferrer" className="block relative">
        <img
          src={poster || "/placeholder-poster.png"}
          alt={`${title} poster`}
          loading="lazy"
          className="w-full aspect-[2/3] object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/placeholder-poster.png";
          }}
        />
        <div className="absolute right-3 bottom-3 z-20">
          <HotRing value={hot} size={40} />
        </div>
      </a>

  <div className="px-3 pb-7 pt-5 text-white flex flex-col justify-between" style={{ minHeight: '155px', height: '155px', position: 'relative' }}>
        <div className="relative" style={{ minHeight: '3.6em' }}>
          <h3
            className="text-base sm:text-lg font-semibold leading-tight overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] w-4/5"
            title={title}
            style={{ minHeight: '3.6em' }}
          >
            {title}
          </h3>
          {year ? (
            <time className="absolute top-0 right-0 text-xs sm:text-sm text-white/80">
              {year}
            </time>
          ) : null}
        </div>
        <div style={{ position: 'absolute', left: 12, right: 12, bottom: 4 }}>
          <div className="text-sm leading-[1.25rem] mb-3">
            <span className="opacity-80">User</span>
            <span className="mx-1">:</span>
            <span className="font-semibold">
              {typeof userRating === "number" ? userRating : "—"}
            </span>
            <span className="mx-2 text-white/40">·</span>
            <span className="opacity-80">Average</span>
            <span className="mx-1">:</span>
            <span className="font-semibold">{fmtAvg(average)}</span>
          </div>
          {Array.isArray(genres) && genres.length > 0 ? (
            <div className="h-6 flex flex-nowrap items-center gap-1.5 overflow-hidden pb-3">
              {genres.slice(0, 3).map((g) => (
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
