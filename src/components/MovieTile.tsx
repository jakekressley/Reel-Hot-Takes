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
      {/* Poster */}
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
        {/* Hotness ring over poster (bottom-right) */}
        <div className="absolute right-3 bottom-3 z-20">
          <HotRing value={hot} size={40} />
        </div>
      </a>

      {/* Footer: title fixed at top; ratings + genres pinned to bottom */}
      <div className="px-3 py-3 text-white">
        <div className="grid grid-rows-[auto,1fr,auto,auto] min-h-[132px]">
          {/* Row 1: Title (L) / Year (R) */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base sm:text-lg font-semibold leading-tight line-clamp-3">
              {title}
            </h3>
            {year ? (
              <time className="text-xs sm:text-sm text-white/80 shrink-0">{year}</time>
            ) : null}
          </div>

          {/* Row 2: Flexible spacer */}
          <div />

          {/* Row 3: User vs Average (fixed position from bottom) */}
          <div className="text-sm">
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

          {/* Row 4: Genres (pills) — single line, fixed height */}
          {Array.isArray(genres) && genres.length > 0 ? (
            <div className="mt-2 h-6 flex flex-nowrap gap-1.5 overflow-hidden">
              {genres.slice(0, 3).map((g) => (
                <span
                  key={g}
                  title={g}
                  className="
                    inline-flex items-center justify-center
                    h-6 px-2.5 rounded-full
                    bg-[#2C343F]/90 border border-[#556678]/50
                    text-white/90 text-[11px] font-medium tracking-tight leading-none
                    max-w-[7rem] truncate whitespace-nowrap
                  "
                >
                  {g}
                </span>
              ))}
            </div>
          ) : (
            // keep the same vertical footprint even if no genres
            <div className="mt-2 h-6" />
          )}
        </div>
      </div>
    </article>
  );
}
